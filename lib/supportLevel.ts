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

/**
 * Not tracked by caniuse-lite (browserSupport is null) means bleeding-edge
 * enough that no browser support data exists yet — treat as experimental.
 * Otherwise, the level reflects how many of the 4 major engines support it.
 */
export function getSupportLevel(browserSupport: BrowserSupportEntry | null): SupportLevel {
  if (!browserSupport) return "experimental";

  const supportedCount = [
    browserSupport.chrome,
    browserSupport.firefox,
    browserSupport.safari,
    browserSupport.edge,
  ].filter(Boolean).length;

  if (supportedCount === 0) return "experimental";
  if (supportedCount === 4) return "production-ready";
  return "growing-support";
}
