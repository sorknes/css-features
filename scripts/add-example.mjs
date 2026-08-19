#!/usr/bin/env node
// Appends one or more draft CSS examples to data/examples.json, filling in the
// fields that should be computed mechanically rather than hand-typed: crawledDate
// and browserSupport (looked up from caniuse-lite via caniuse-api, keyed by
// caniuseSlug). Also removes any matching entries from data/pending.json.
//
// Usage: node scripts/add-example.mjs path/to/draft.json
// draft.json may be a single draft object or an array of draft objects.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import * as caniuse from "caniuse-api";

const ROOT = path.resolve(import.meta.dirname, "..");
const EXAMPLES_PATH = path.join(ROOT, "data", "examples.json");
const PENDING_PATH = path.join(ROOT, "data", "pending.json");

// Must stay in sync with the Category union in lib/types.ts.
const VALID_CATEGORIES = [
  "layout",
  "color-background",
  "typography-text",
  "animation-transitions",
  "selectors-combinators",
  "functions-values",
  "responsive-container-queries",
  "forms-ui",
  "scroll-view-transitions",
  "cascade",
  "components-interactivity",
];

const REQUIRED_FIELDS = [
  "id",
  "title",
  "description",
  "category",
  "cssFeature",
  "demo",
  "sourceUrl",
  "sourceName",
  "publishedDate",
];

function readJson(filePath, fallback) {
  if (!existsSync(filePath)) return fallback;
  const raw = readFileSync(filePath, "utf8").trim();
  return raw ? JSON.parse(raw) : fallback;
}

function writeJson(filePath, value) {
  writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

function minVersion(entry) {
  if (!entry || entry.y == null) return false;
  return String(entry.y);
}

function lookupBrowserSupport(caniuseSlug) {
  if (!caniuseSlug) return null;
  let support;
  try {
    support = caniuse.getSupport(caniuseSlug);
  } catch {
    return null; // not tracked in the bundled caniuse-lite dataset
  }
  return {
    chrome: minVersion(support.chrome),
    firefox: minVersion(support.firefox),
    safari: minVersion(support.safari),
    edge: minVersion(support.edge),
  };
}

function validateDraft(draft) {
  const missing = REQUIRED_FIELDS.filter((field) => draft[field] == null || draft[field] === "");
  if (missing.length) {
    throw new Error(`Example "${draft.id ?? "(no id)"}" is missing required field(s): ${missing.join(", ")}`);
  }
  if (!VALID_CATEGORIES.includes(draft.category)) {
    throw new Error(`Example "${draft.id}" has invalid category "${draft.category}". Valid: ${VALID_CATEGORIES.join(", ")}`);
  }
  if (!draft.demo.html || !draft.demo.css) {
    throw new Error(`Example "${draft.id}" is missing demo.html or demo.css`);
  }
}

function main() {
  const draftPath = process.argv[2];
  if (!draftPath) {
    console.error("Usage: node scripts/add-example.mjs path/to/draft.json");
    process.exit(1);
  }

  const draftsInput = JSON.parse(readFileSync(path.resolve(draftPath), "utf8"));
  const drafts = Array.isArray(draftsInput) ? draftsInput : [draftsInput];

  const examples = readJson(EXAMPLES_PATH, []);
  const pending = readJson(PENDING_PATH, []);
  const existingIds = new Set(examples.map((e) => e.id));
  const now = new Date().toISOString().slice(0, 10);

  let addedCount = 0;
  let remainingPending = pending;

  for (const draft of drafts) {
    validateDraft(draft);
    if (existingIds.has(draft.id)) {
      console.warn(`Skipping "${draft.id}" — an example with this id already exists.`);
      continue;
    }

    const caniuseSlug = draft.caniuseSlug ?? null;
    const example = {
      id: draft.id,
      title: draft.title,
      description: draft.description,
      category: draft.category,
      cssFeature: draft.cssFeature,
      demo: {
        html: draft.demo.html,
        css: draft.demo.css,
        ...(draft.demo.js ? { js: draft.demo.js } : {}),
      },
      sourceUrl: draft.sourceUrl,
      sourceName: draft.sourceName,
      publishedDate: draft.publishedDate,
      crawledDate: draft.crawledDate ?? now,
      caniuseSlug,
      browserSupport: lookupBrowserSupport(caniuseSlug),
      tailwindEquivalent: draft.tailwindEquivalent ?? null,
      ...(draft.replayable ? { replayable: true } : {}),
    };

    examples.push(example);
    existingIds.add(example.id);
    remainingPending = remainingPending.filter((p) => p.url !== draft.sourceUrl);
    addedCount++;
    console.log(`Added "${example.id}" (browserSupport: ${example.browserSupport ? "found" : "not tracked by caniuse-lite"})`);
  }

  writeJson(EXAMPLES_PATH, examples);
  if (remainingPending.length !== pending.length) {
    writeJson(PENDING_PATH, remainingPending);
  }

  console.log(`Done. Added ${addedCount} example(s). examples.json now has ${examples.length} total.`);
}

main();
