"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  BiCode,
  BiChevronDown,
  BiLinkExternal,
  BiLogoChrome,
  BiLogoFirefox,
  BiLogoApple,
  BiLogoEdge,
  BiRefresh,
} from "react-icons/bi";
import type { CssExample } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { isNewExample } from "@/lib/isNew";
import { getSupportLevel, SUPPORT_LEVEL_LABELS, SUPPORT_LEVEL_STYLES } from "@/lib/supportLevel";
import CodeBlock from "@/components/CodeBlock";

const BROWSER_LABELS: {
  key: keyof NonNullable<CssExample["browserSupport"]>;
  label: string;
  Icon: IconType;
}[] = [
  { key: "chrome", label: "Chrome", Icon: BiLogoChrome },
  { key: "firefox", label: "Firefox", Icon: BiLogoFirefox },
  { key: "safari", label: "Safari", Icon: BiLogoApple },
  { key: "edge", label: "Edge", Icon: BiLogoEdge },
];

function buildSrcDoc(demo: CssExample["demo"]): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<base href="about:srcdoc">
<style>${demo.css}</style>
</head>
<body>
${demo.html}
${demo.js ? `<script>${demo.js}</script>` : ""}
</body>
</html>`;
}

export default function ExampleCard({
  example,
  latestCrawledDate,
}: {
  example: CssExample;
  latestCrawledDate: string | null;
}) {
  const categoryLabel = CATEGORIES.find((c) => c.value === example.category)?.label ?? example.category;
  const isNew = isNewExample(example.crawledDate, latestCrawledDate);
  const supportLevel = getSupportLevel(example.browserSupport);
  const [replayKey, setReplayKey] = useState(0);

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 pt-4 pb-3">
        {isNew && (
          <span
            className="rounded-full border border-black bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground"
            aria-label="New addition to the gallery"
          >
            NEW
          </span>
        )}
        <span className="rounded-full border border-muted bg-surface px-2.5 py-1 text-xs font-medium text-foreground">
          {categoryLabel}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${SUPPORT_LEVEL_STYLES[supportLevel]}`}>
          {SUPPORT_LEVEL_LABELS[supportLevel]}
        </span>
      </div>

      <div className="px-4 pt-3">
        <h2 className="text-lg font-semibold leading-snug">{example.title}</h2>
        <p className="my-3 font-mono text-xs text-muted">{example.cssFeature}</p>
        {example.tailwindEquivalent && (
          <p className="mt-1 text-xs text-muted">
            <span className="font-medium text-foreground/80">Tailwind: </span>
            {example.tailwindEquivalent}
          </p>
        )}
        <p className="mt-2 text-base text-foreground/90">{example.description}</p>
      </div>

      <div className="relative mx-4 mt-3 max-w-full min-w-[140px] resize-x overflow-auto rounded-md border border-border">
        <iframe
          key={replayKey}
          srcDoc={buildSrcDoc(example.demo)}
          title={`Live demo: ${example.title}`}
          sandbox={example.demo.js ? "allow-scripts" : ""}
          loading="lazy"
          className="h-[240px] w-full bg-white"
        />
        {example.replayable && (
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full border border-border bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur hover:bg-white"
          >
            <BiRefresh aria-hidden="true" className="h-3.5 w-3.5" />
            Replay
          </button>
        )}
      </div>

      <details className="group mx-4 mt-3 overflow-hidden rounded-md border border-border">
        <summary className="flex w-full cursor-pointer select-none list-none items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden hover:bg-accent hover:text-accent-foreground group-open:bg-accent group-open:text-accent-foreground focus-visible:outline-offset-[-2px]">
          <BiCode aria-hidden="true" className="h-4 w-4 shrink-0" />
          View code
          <BiChevronDown aria-hidden="true" className="ml-auto h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-3 border-t border-border p-3">
          <CodeBlock label="HTML" code={example.demo.html} />
          <CodeBlock label="CSS" code={example.demo.css} />
          {example.demo.js && <CodeBlock label="JS" code={example.demo.js} />}
        </div>
      </details>

      {example.browserSupport && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 px-4">
          <span className="sr-only">Browser support:</span>
          {BROWSER_LABELS.map(({ key, label, Icon }) => {
            const version = example.browserSupport![key];
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs text-foreground/80"
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                {label} {version ? `${version}+` : "—"}
              </span>
            );
          })}
        </div>
      )}

      {example.caniuseSlug && (
        <div className="mt-3 border-t border-border px-4 py-3 text-sm">
          <a
            href={`https://caniuse.com/${example.caniuseSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-accent underline-offset-2 hover:underline"
          >
            View on caniuse.com
            <BiLinkExternal aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      )}
    </article>
  );
}
