#!/usr/bin/env node
// Fully automated, LLM-free discovery pass: for each source, find its feed (or
// fall back to scraping links from the page), keep only items that look like
// they're about a new/emerging CSS feature, and queue them in data/pending.json
// for a later manual "process pending" pass (done by Claude, with judgment and
// an LLM) that turns real candidates into full examples via add-example.mjs.
//
// Run manually with `node scripts/discover.mjs`, or on a schedule via
// .github/workflows/discover.yml.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import Parser from "rss-parser";
import * as cheerio from "cheerio";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCES_PATH = path.join(ROOT, "data", "sources.json");
const PENDING_PATH = path.join(ROOT, "data", "pending.json");
const SEEN_PATH = path.join(ROOT, "data", "seen-urls.json");
const EXAMPLES_PATH = path.join(ROOT, "data", "examples.json");

const USER_AGENT = "css-features-crawler/1.0 (+manual research tool)";
const FETCH_TIMEOUT_MS = 15000;
const MAX_HTML_LINKS_PER_SOURCE = 40;

// Deliberately conservative first-pass filter — the goal is a short, relevant
// pending queue, not full recall. Final judgment happens when a human/Claude
// reads the actual article during the manual "process pending" step.
const KEYWORDS = [
  "@starting-style", "starting-style", ":has(", "has()", "container quer", "subgrid",
  "color-mix(", "view-transition", "view transitions", "anchor-position", "anchor positioning",
  "text-wrap", "css nesting", "@scope", "@property", "field-sizing", "light-dark(",
  "@layer", "cascade layer", "scroll-driven", "scroll-timeline", "popover", "trigonometric",
  "css trig", "lh unit", "container query units", "sibling-index", "sibling-count",
  "reading-flow", "interpolate-size", "new css feature", "baseline newly available",
];

const parser = new Parser({
  timeout: FETCH_TIMEOUT_MS,
  headers: { "User-Agent": USER_AGENT },
});

function readJson(filePath, fallback) {
  if (!existsSync(filePath)) return fallback;
  const raw = readFileSync(filePath, "utf8").trim();
  return raw ? JSON.parse(raw) : fallback;
}

function writeJson(filePath, value) {
  writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function toIsoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function matchesKeywords(title, excerpt) {
  const haystack = `${title} ${excerpt ?? ""}`.toLowerCase();
  return KEYWORDS.some((kw) => haystack.includes(kw.toLowerCase()));
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.text();
}

async function findFeedUrl(baseUrl) {
  try {
    const html = await fetchText(baseUrl);
    const $ = cheerio.load(html);
    const href = $('link[rel="alternate"][type*="rss"], link[rel="alternate"][type*="atom"]')
      .first()
      .attr("href");
    return href ? new URL(href, baseUrl).toString() : null;
  } catch {
    return null;
  }
}

function candidateFeedUrls(baseUrl) {
  const url = new URL(baseUrl);
  const dirPath = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  return [
    `${url.origin}${dirPath}feed/`,
    `${url.origin}${dirPath}feed`,
    `${url.origin}${dirPath}rss.xml`,
    `${url.origin}${dirPath}atom.xml`,
    `${url.origin}${dirPath}index.xml`,
    `${url.origin}/feed/`,
    `${url.origin}/feed.xml`,
    `${url.origin}/rss.xml`,
    `${url.origin}/rss/`,
  ];
}

async function getFeedItems(source) {
  const discovered = await findFeedUrl(source.url);
  const candidates = discovered
    ? [discovered, ...candidateFeedUrls(source.url)]
    : candidateFeedUrls(source.url);

  for (const feedUrl of candidates) {
    try {
      const feed = await parser.parseURL(feedUrl);
      if (feed.items?.length) {
        return feed.items.map((item) => ({
          url: item.link ?? "",
          title: item.title ?? "",
          publishedDate: toIsoDate(item.isoDate ?? item.pubDate),
          excerpt: (item.contentSnippet ?? item.summary ?? "").slice(0, 300),
        }));
      }
    } catch {
      // try the next candidate feed URL
    }
  }
  return [];
}

async function getHtmlLinks(source) {
  const html = await fetchText(source.url);
  const $ = cheerio.load(html);
  const base = new URL(source.url);
  const links = new Map();

  $("a[href]").each((_, el) => {
    if (links.size >= MAX_HTML_LINKS_PER_SOURCE) return;
    const href = $(el).attr("href");
    const title = $(el).text().trim();
    if (!href || !title) return;
    let abs;
    try {
      abs = new URL(href, base);
    } catch {
      return;
    }
    if (abs.origin !== base.origin || abs.hash) return;
    if (!links.has(abs.toString())) links.set(abs.toString(), title);
  });

  return Array.from(links, ([url, title]) => ({ url, title, publishedDate: null, excerpt: null }));
}

async function main() {
  const sources = readJson(SOURCES_PATH, []);
  const pending = readJson(PENDING_PATH, []);
  const examples = readJson(EXAMPLES_PATH, []);
  const seenUrls = new Set(readJson(SEEN_PATH, []));
  const pendingUrls = new Set(pending.map((p) => p.url));
  // Already-published examples should never be re-queued as pending candidates.
  for (const example of examples) seenUrls.add(example.sourceUrl);

  let addedCount = 0;

  for (const source of sources) {
    if (source.kind === "reference") continue;
    console.log(`Checking ${source.name} (${source.kind})...`);

    let items = [];
    try {
      items = source.kind === "rss" ? await getFeedItems(source) : await getHtmlLinks(source);
    } catch (err) {
      console.warn(`  Failed to fetch ${source.name}: ${err.message}`);
      continue;
    }

    if (!items.length) {
      console.log(`  No items found (feed/page unreachable or empty).`);
      continue;
    }

    const matches = items.filter((item) => matchesKeywords(item.title, item.excerpt));
    for (const item of matches) {
      if (!item.url || seenUrls.has(item.url) || pendingUrls.has(item.url)) continue;
      pending.push({
        url: item.url,
        title: item.title,
        sourceName: source.name,
        discoveredAt: new Date().toISOString().slice(0, 10),
        publishedDate: item.publishedDate,
        excerpt: item.excerpt || null,
      });
      seenUrls.add(item.url);
      pendingUrls.add(item.url);
      addedCount++;
      console.log(`  + ${item.title}`);
    }
  }

  writeJson(PENDING_PATH, pending);
  writeJson(SEEN_PATH, Array.from(seenUrls));
  console.log(`\nDiscovery complete. Added ${addedCount} new candidate(s) to pending.json (${pending.length} total pending).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
