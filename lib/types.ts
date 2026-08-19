export type Category =
  | "layout"
  | "color-background"
  | "typography-text"
  | "animation-transitions"
  | "selectors-combinators"
  | "functions-values"
  | "responsive-container-queries"
  | "forms-ui"
  | "scroll-view-transitions"
  | "cascade"
  | "components-interactivity";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "layout", label: "Layout" },
  { value: "color-background", label: "Color & Backgrounds" },
  { value: "typography-text", label: "Typography & Text" },
  { value: "animation-transitions", label: "Animation & Transitions" },
  { value: "selectors-combinators", label: "Selectors & Combinators" },
  { value: "functions-values", label: "Functions & Values" },
  { value: "responsive-container-queries", label: "Responsive & Container Queries" },
  { value: "forms-ui", label: "Forms & UI" },
  { value: "scroll-view-transitions", label: "Scroll & View Transitions" },
  { value: "cascade", label: "Cascade Control" },
  { value: "components-interactivity", label: "Components & Interactivity" },
];

export interface BrowserSupportEntry {
  /** Minimum supporting version as a string, or false if unsupported/unknown. */
  chrome: string | false;
  firefox: string | false;
  safari: string | false;
  edge: string | false;
}

export interface CssExampleDemo {
  html: string;
  css: string;
  js?: string;
}

export interface CssExample {
  id: string;
  title: string;
  description: string;
  category: Category;
  cssFeature: string;
  demo: CssExampleDemo;
  sourceUrl: string;
  sourceName: string;
  /** ISO date the source article was published or last updated. */
  publishedDate: string;
  /** ISO date this example was added to the gallery. */
  crawledDate: string;
  caniuseSlug: string | null;
  browserSupport: BrowserSupportEntry | null;
  /** Short note on the Tailwind utility/variant that covers this feature, when one genuinely exists. */
  tailwindEquivalent: string | null;
  /** True when the demo's effect only plays once on load (or produces a one-time random result), so the card should offer a way to re-trigger it. */
  replayable?: boolean;
}

export interface PendingItem {
  url: string;
  title: string;
  sourceName: string;
  discoveredAt: string;
  publishedDate: string | null;
  excerpt: string | null;
}
