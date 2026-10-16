"use client";

import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  BiCode,
  BiCodeCurly,
  BiChevronDown,
  BiLinkExternal,
  BiLogoChrome,
  BiLogoFirefox,
  BiLogoApple,
  BiLogoEdge,
  BiRefresh,
} from "react-icons/bi";
import type { Browser, CssExample } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { isNewExample } from "@/lib/isNew";
import { formatDate } from "@/lib/formatDate";
import { isManualSource } from "@/lib/sources";
import { getSupportLevel, SUPPORT_LEVEL_LABELS, SUPPORT_LEVEL_STYLES } from "@/lib/supportLevel";
import { NEW_TAG_ICON, SUPPORT_LEVEL_ICONS } from "@/lib/tagIcons";
import CodeBlock from "@/components/CodeBlock";

const BROWSER_LABELS: {
  key: Browser;
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
  const SupportIcon = SUPPORT_LEVEL_ICONS[getSupportLevel(example)];
  const supportLevel = getSupportLevel(example);
  const usage = example.globalUsage === null ? null : Math.round(example.globalUsage);
  const hasPartialSupport = Object.keys(example.browserSupport?.partial ?? {}).length > 0;
  // The figure counts full support only, so "0%" next to partial-support chips reads as broken data.
  const showUsage = usage !== null && !(usage === 0 && hasPartialSupport);
  const [replayKey, setReplayKey] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Only offer "More" when the 3-line clamp actually hides text. A ResizeObserver
  // (rather than a one-off measure) also covers cards that content-visibility
  // hasn't laid out yet, and column-width changes.
  useEffect(() => {
    const el = descriptionRef.current;
    if (!el || expanded) return;
    const observer = new ResizeObserver(() => setOverflowing(el.scrollHeight > el.clientHeight + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded]);

  return (
    <article
      id={example.id}
      className="flex scroll-mt-4 flex-col border-b border-border sm:border-r [contain-intrinsic-size:auto_960px] [content-visibility:auto]"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 px-5 pt-5">
        {isNew && (
          <span
            className="label inline-flex items-center gap-1.5 bg-foreground px-2 py-1 text-background"
            aria-label="New addition to the gallery"
          >
            <NEW_TAG_ICON aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            New
          </span>
        )}
        <span className={`label inline-flex items-center gap-1.5 px-2 py-1 ${SUPPORT_LEVEL_STYLES[supportLevel]}`}>
          <SupportIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {SUPPORT_LEVEL_LABELS[supportLevel]}
          {showUsage ? (
            <>
              <span aria-hidden="true"> · {usage}%</span>
              <span className="sr-only">, full support for {usage}% of global users</span>
            </>
          ) : (
            usage === null &&
            example.browserSupport && (
              <>
                <span aria-hidden="true"> · usage n/a</span>
                <span className="sr-only">, global usage not tracked</span>
              </>
            )
          )}
        </span>
        <span className="label border border-border px-2 py-1 text-muted">{categoryLabel}</span>
      </div>

      <div className="px-5 pt-4">
        <h2 className="font-display text-[1.375rem] leading-[1.05] text-balance">
          <a href={`#${example.id}`} className="underline-offset-4 hover:underline">
            {example.title}
          </a>
        </h2>
        <p className="mt-2.5 flex items-center gap-1.5 font-mono text-xs text-muted">
          <BiCodeCurly aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          {example.cssFeature}
        </p>
      </div>

      <div className="relative mx-5 mt-4 max-w-full min-w-[140px] resize-x overflow-auto border border-border bg-paper">
        <iframe
          key={replayKey}
          srcDoc={buildSrcDoc(example.demo)}
          title={`Live demo: ${example.title}`}
          sandbox={example.demo.js ? "allow-scripts" : ""}
          loading="lazy"
          className="block h-[300px] w-full bg-paper"
        />
        {example.replayable && (
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="label absolute top-2 right-2 inline-flex items-center gap-1.5 border border-foreground bg-background px-2 py-1 transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-forest hover:text-forest-foreground"
          >
            <BiRefresh aria-hidden="true" className="h-3.5 w-3.5" />
            Replay
          </button>
        )}
      </div>

      <div className="px-5 pt-4">
        {/* Clamped visually only; the full text stays in the DOM for search engines and screen readers. */}
        <p
          ref={descriptionRef}
          id={`${example.id}-description`}
          className={`text-[0.9375rem] leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
        >
          {example.description}
        </p>
        {(overflowing || expanded) && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-controls={`${example.id}-description`}
            className="label relative mt-1.5 text-forest underline-offset-4 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:underline"
          >
            {expanded ? "Less" : "More"}
            <span className="sr-only"> of the description</span>
          </button>
        )}
        {example.tailwindEquivalent && (
          <p className="mt-3 text-sm text-muted">
            <span className="label mr-1.5 text-foreground">Tailwind</span>
            {example.tailwindEquivalent}
          </p>
        )}
      </div>

      {/* Pinned to the bottom, with View code last, so the code bars line up across a grid row. */}
      <div className="mt-auto pt-4">

        <div className="flex flex-col gap-3 px-5 pb-4">
          <div className="-mx-5 border-t border-border" />
          {example.browserSupport ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="sr-only">Browser support:</span>
              {BROWSER_LABELS.map(({ key, label, Icon }) => {
                const version = example.browserSupport![key];
                const partialVersion = example.browserSupport!.partial?.[key];
                return (
                  <span
                    key={key}
                    className={`label inline-flex items-center gap-1 border px-1.5 py-0.5 ${
                      partialVersion ? "border-dashed border-muted" : "border-border"
                    }`}
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    {label}{" "}
                    {version ? (
                      `${version}+`
                    ) : partialVersion ? (
                      <>
                        <span aria-hidden="true">
                          {partialVersion}+ <span className="text-muted">partial</span>
                        </span>
                        <span className="sr-only">partial support from version {partialVersion}</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">not supported</span>
                      </>
                    )}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted">Browser support not yet tracked on caniuse</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            {isManualSource(example.sourceUrl) ? (
              <p className="text-xs text-muted">Added manually</p>
            ) : (
              <p className="text-xs text-muted">
                From{" "}
                <a
                  href={example.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative font-medium text-foreground underline-offset-2 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:underline"
                >
                  {example.sourceName}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {" · "}
                <time dateTime={example.publishedDate}>{formatDate(example.publishedDate)}</time>
              </p>
            )}

            {example.caniuseSlug && (
              <a
                href={`https://caniuse.com/${example.caniuseSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="label relative inline-flex items-center gap-1 text-forest underline-offset-4 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:underline"
              >
                caniuse.com
                <BiLinkExternal aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <details className="group mx-5 mb-5 border border-foreground">
          {/* The summary keeps its native display so it's still exposed as a disclosure button; the row layout lives on the inner div. */}
          <summary className="block cursor-pointer list-none transition-colors select-none [&::-webkit-details-marker]:hidden hover:bg-foreground hover:text-background group-open:bg-foreground group-open:text-background focus-visible:outline-offset-[-4px]">
            <div className="flex min-h-11 items-stretch">
              <span className="label flex flex-1 items-center gap-2 px-3">
                <BiCode aria-hidden="true" className="h-4 w-4 shrink-0" />
                View code
              </span>
              <span aria-hidden="true" className="flex w-11 items-center justify-center border-l border-current">
                <BiChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </span>
            </div>
          </summary>
          <div className="flex flex-col gap-4 border-t border-foreground p-3">
            <CodeBlock label="HTML" code={example.demo.html} />
            <CodeBlock label="CSS" code={example.demo.css} />
            {example.demo.js && <CodeBlock label="JS" code={example.demo.js} />}
          </div>
        </details>
      </div>
    </article>
  );
}
