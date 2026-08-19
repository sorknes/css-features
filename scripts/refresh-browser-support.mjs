#!/usr/bin/env node
// Re-looks-up browser-support numbers from the currently installed caniuse-lite
// for every example that already has a caniuseSlug, and updates data/examples.json
// in place if the numbers changed. Run `npx update-browserslist-db@latest` first
// so caniuse-lite's bundled data is current — this script itself never fetches
// anything over the network, it only re-reads what's already installed.
//
// Run manually with `node scripts/refresh-browser-support.mjs`, or on a schedule
// via .github/workflows/weekly-maintenance.yml.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import * as caniuse from "caniuse-api";

const ROOT = path.resolve(import.meta.dirname, "..");
const EXAMPLES_PATH = path.join(ROOT, "data", "examples.json");

function minVersion(entry) {
  if (!entry || entry.y == null) return false;
  return String(entry.y);
}

function lookupBrowserSupport(caniuseSlug) {
  let support;
  try {
    support = caniuse.getSupport(caniuseSlug);
  } catch {
    return null; // no longer resolvable in the current caniuse-lite dataset
  }
  return {
    chrome: minVersion(support.chrome),
    firefox: minVersion(support.firefox),
    safari: minVersion(support.safari),
    edge: minVersion(support.edge),
  };
}

function main() {
  const examples = JSON.parse(readFileSync(EXAMPLES_PATH, "utf8"));
  let changedCount = 0;
  let unresolvedCount = 0;

  for (const example of examples) {
    if (!example.caniuseSlug) continue;
    const fresh = lookupBrowserSupport(example.caniuseSlug);

    // A failed lookup means this slug isn't in the currently-bundled caniuse-lite
    // dataset (some caniuseSlug values are real caniuse.com pages that live outside
    // caniuse-lite's slimmer ~580-feature subset) — NOT that support regressed.
    // Never overwrite existing data with null; that would destroy real numbers.
    if (fresh === null) {
      if (example.browserSupport !== null) {
        unresolvedCount++;
        console.warn(`Skipping "${example.id}": "${example.caniuseSlug}" isn't resolvable via the installed caniuse-lite; leaving its existing browserSupport untouched.`);
      }
      continue;
    }

    if (JSON.stringify(fresh) !== JSON.stringify(example.browserSupport)) {
      console.log(`Updated "${example.id}": ${JSON.stringify(example.browserSupport)} -> ${JSON.stringify(fresh)}`);
      example.browserSupport = fresh;
      changedCount++;
    }
  }

  if (changedCount > 0) {
    writeFileSync(EXAMPLES_PATH, JSON.stringify(examples, null, 2) + "\n");
  }

  console.log(`Done. ${changedCount} example(s) updated, ${unresolvedCount} left unchanged (not resolvable via caniuse-lite).`);
}

main();
