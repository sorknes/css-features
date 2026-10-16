import type { BrowserSupportEntry } from "./types";

export type SupportLevel = "production-ready" | "growing-support" | "experimental";

export const SUPPORT_LEVEL_LABELS: Record<SupportLevel, string> = {
  "production-ready": "Production ready",
  "growing-support": "Growing support",
  experimental: "Experimental",
};

export const SUPPORT_LEVELS: { value: SupportLevel; label: string }[] = [
  { value: "production-ready", label: SUPPORT_LEVEL_LABELS["production-ready"] },
  { value: "growing-support", label: SUPPORT_LEVEL_LABELS["growing-support"] },
  { value: "experimental", label: SUPPORT_LEVEL_LABELS.experimental },
];

/** Soft badge styling per level — shared by the card badge and the filter toggle. */
export const SUPPORT_LEVEL_STYLES: Record<SupportLevel, string> = {
  "production-ready": "border border-success-foreground bg-success text-success-foreground",
  "growing-support": "border border-warning-foreground bg-warning text-warning-foreground",
  experimental: "border border-danger-foreground bg-danger text-danger-foreground",
};

const BROWSERS = ["chrome", "firefox", "safari", "edge"] as const;

/**
 * Not tracked by caniuse-lite (browserSupport is null) means bleeding-edge
 * enough that no browser support data exists yet — treat as experimental.
 * Otherwise, the level reflects how many of the 4 major engines support it:
 * production-ready needs full support everywhere, while partial support counts
 * toward growing support but never toward production-ready.
 */
export function getSupportLevel(browserSupport: BrowserSupportEntry | null): SupportLevel {
  if (!browserSupport) return "experimental";

  const fullCount = BROWSERS.filter((b) => browserSupport[b]).length;
  const anyCount = BROWSERS.filter((b) => browserSupport[b] || browserSupport.partial?.[b]).length;

  if (anyCount === 0) return "experimental";
  if (fullCount === 4) return "production-ready";
  return "growing-support";
}
