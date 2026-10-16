// Shared browser-support lookup for add-example.mjs and refresh-browser-support.mjs.
//
// Full support comes from caniuse-api's `y` (the earliest fully-supporting version).
// Partial support is read straight from caniuse-lite's per-version stats, because
// caniuse-api keeps the *latest* version for every status other than `y` — so its
// `a` would claim e.g. Chrome 157 for a feature that's been partial since 125.

import * as caniuse from "caniuse-api";
import * as lite from "caniuse-lite";

const BROWSERS = ["chrome", "firefox", "safari", "edge"];

function minFullVersion(entry) {
  if (!entry || entry.y == null) return false;
  return String(entry.y);
}

/** Earliest version whose status is partial ("a"), ignoring flag-only ("d") and polyfill ("p") states. */
function minPartialVersion(stats) {
  let min = null;
  let minLabel = null;
  for (const [version, status] of Object.entries(stats ?? {})) {
    const letters = status.replace(/#\d+/g, "").trim().split(" ");
    if (!letters.includes("a")) continue;
    const value = parseFloat(version.split("-")[0]);
    if (isNaN(value)) continue;
    if (min === null || value < min) {
      min = value;
      minLabel = String(value);
    }
  }
  return minLabel;
}

/**
 * Returns a BrowserSupportEntry (see lib/types.ts), or null when the slug isn't
 * in the bundled caniuse-lite dataset.
 */
export function lookupBrowserSupport(caniuseSlug) {
  if (!caniuseSlug) return null;
  let support;
  try {
    support = caniuse.getSupport(caniuseSlug);
  } catch {
    return null; // not tracked in the bundled caniuse-lite dataset
  }

  const entry = {};
  for (const browser of BROWSERS) entry[browser] = minFullVersion(support[browser]);

  const packed = lite.features[caniuseSlug];
  if (packed) {
    const { stats } = lite.feature(packed);
    const partial = {};
    for (const browser of BROWSERS) {
      if (entry[browser]) continue; // full support wins; partial only fills the gaps
      const version = minPartialVersion(stats[browser]);
      if (version) partial[browser] = version;
    }
    if (Object.keys(partial).length) entry.partial = partial;
  }

  return entry;
}
