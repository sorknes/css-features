import sourcesData from "@/data/sources.json";

export interface Source {
  name: string;
  url: string;
  /**
   * "rss"       - has a discoverable feed, discover.mjs will find & parse it
   * "html"      - no feed; discover.mjs falls back to scraping links from the page
   * "reference" - a living reference doc (e.g. MDN), not a dated post stream;
   *               skipped by automated discovery, still a valid manual source
   */
  kind: "rss" | "html" | "reference";
}

export const SOURCES = sourcesData as Source[];

/**
 * Placeholder source URLs used for examples that were added by hand rather than
 * from a dated article (see CLAUDE.md): the site's own earlier gallery, and posts
 * on platforms with no public deep link. Their publishedDate is not a real
 * publication date, so cards show "Added manually" instead of a source and date.
 */
const MANUAL_SOURCE_URLS = new Set([
  "https://sorknes.github.io/modern-css-features/",
  "https://www.linkedin.com/",
]);

export function isManualSource(sourceUrl: string): boolean {
  return MANUAL_SOURCE_URLS.has(sourceUrl);
}
