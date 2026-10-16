// Global usage: the share of all tracked web users whose browser version fully
// supports a feature, using caniuse-lite's per-version usage figures.
//
// For slugs in caniuse-lite, this is the same calculation caniuse.com shows as
// its global "supported" percentage. For caniuse's "mdn-*" pages (not bundled in
// caniuse-lite), support comes from @mdn/browser-compat-data, which is where
// caniuse.com sources those pages from.

import * as lite from "caniuse-lite";
import bcd from "@mdn/browser-compat-data" with { type: "json" };

// caniuse agent -> BCD browser. Agents without a BCD equivalent (op_mini, and_uc,
// and_qq, baidu, kaios, ie_mob...) count as unsupported, which keeps the figure
// conservative.
const AGENT_TO_BCD = {
  chrome: "chrome",
  and_chr: "chrome_android",
  edge: "edge",
  firefox: "firefox",
  and_ff: "firefox_android",
  safari: "safari",
  ios_saf: "safari_ios",
  samsung: "samsunginternet_android",
  opera: "opera",
  op_mob: "opera_android",
  android: "webview_android",
};

const lowerBound = (version) => parseFloat(String(version).split("-")[0]);
const round1 = (n) => Math.round(n * 10) / 10;

function fromCaniuseLite(slug) {
  const packed = lite.features[slug];
  if (!packed) return null;
  const { stats } = lite.feature(packed);
  let usage = 0;
  for (const agent in stats) {
    for (const version in stats[agent]) {
      if (stats[agent][version].startsWith("y")) usage += lite.agents[agent]?.usage_global?.[version] ?? 0;
    }
  }
  return round1(usage);
}

/** "mdn-css_at-rules_container_scroll-state_queries" -> BCD node; keys may themselves contain "_". */
function resolveBcdPath(tokens, node) {
  if (!tokens.length) return node?.__compat ? node : null;
  for (let i = tokens.length; i >= 1; i--) {
    const wanted = tokens.slice(0, i).join("_");
    // caniuse lowercases mdn slugs ("htmlbuttonelement"); BCD keys keep their case.
    const key = Object.keys(node ?? {}).find((k) => k.toLowerCase() === wanted);
    if (key) {
      const found = resolveBcdPath(tokens.slice(i), node[key]);
      if (found) return found;
    }
  }
  return null;
}

/** Earliest version with full, unflagged, unprefixed support, or null. */
function minFullVersion(statement) {
  const entries = Array.isArray(statement) ? statement : statement ? [statement] : [];
  let min = null;
  for (const entry of entries) {
    const added = entry.version_added;
    if (typeof added !== "string" || added === "preview") continue;
    if (entry.flags || entry.prefix || entry.alternative_name || entry.partial_implementation || entry.version_removed) continue;
    const version = parseFloat(added.replace("≤", ""));
    if (!isNaN(version) && (min === null || version < min)) min = version;
  }
  return min;
}

function fromBcd(slug) {
  if (!slug.startsWith("mdn-")) return null;
  const node = resolveBcdPath(slug.slice(4).split("_"), bcd);
  if (!node) return null;
  const support = node.__compat.support;
  let usage = 0;
  for (const [agent, browser] of Object.entries(AGENT_TO_BCD)) {
    const min = minFullVersion(support[browser]);
    if (min === null) continue;
    for (const [version, share] of Object.entries(lite.agents[agent]?.usage_global ?? {})) {
      if (lowerBound(version) >= min) usage += share ?? 0;
    }
  }
  return round1(usage);
}

/** Global usage percentage (one decimal), or null when the slug can't be resolved. */
export function lookupGlobalUsage(caniuseSlug) {
  if (!caniuseSlug) return null;
  return fromCaniuseLite(caniuseSlug) ?? fromBcd(caniuseSlug);
}
