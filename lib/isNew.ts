import type { CssExample } from "./types";

/** The most recent crawledDate across a set of examples, or null if empty. */
export function getLatestCrawledDate(examples: CssExample[]): string | null {
  return examples.reduce<string | null>(
    (latest, example) => (!latest || example.crawledDate > latest ? example.crawledDate : latest),
    null,
  );
}

/**
 * "New" means added in the same batch as the most recently crawled example —
 * i.e. crawledDate matches the latest crawledDate in the whole dataset. Adding
 * examples on a later day automatically retires the previous day's NEW tags,
 * since they're no longer the latest date; no manual bookkeeping needed.
 */
export function isNewExample(crawledDate: string, latestCrawledDate: string | null): boolean {
  return latestCrawledDate !== null && crawledDate === latestCrawledDate;
}
