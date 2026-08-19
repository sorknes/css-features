export function formatDate(isoDate: string): string {
  // Explicit locale avoids server/client hydration mismatches from differing runtime locales.
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}
