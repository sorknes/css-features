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
