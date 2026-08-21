import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BiLinkExternal } from "react-icons/bi";
import examplesData from "@/data/examples.json";
import type { CssExample } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { getLatestCrawledDate } from "@/lib/isNew";
import { SUPPORT_LEVELS, SUPPORT_LEVEL_STYLES } from "@/lib/supportLevel";
import { SOURCES } from "@/lib/sources";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const REPO_URL = "https://github.com/sorknes/css-features";

export const metadata: Metadata = {
  title: "About — CSS Edge",
};

const examples = examplesData as CssExample[];
const lastUpdated = getLatestCrawledDate(examples);

const TECH_STACK = [
  {
    name: "Next.js (App Router) + React + TypeScript",
    detail: "The site itself — statically rendered, no server-side state at request time.",
  },
  {
    name: "Tailwind CSS v4",
    detail: "Styling, using its CSS-first theme tokens for the color palette (including the status-tag colors below).",
  },
  {
    name: "react-icons (Box Icons)",
    detail: "The browser logos, code/search/copy icons, and external-link markers used throughout the UI.",
  },
  {
    name: "caniuse-lite + caniuse-api",
    detail: "The offline browser-support dataset behind every version number and the Production ready / Growing support split.",
  },
  {
    name: "rss-parser",
    detail: "Feed discovery and parsing for sources that publish RSS/Atom.",
  },
  {
    name: "cheerio",
    detail: "HTML link scraping for sources without a feed.",
  },
  {
    name: "GitHub Actions",
    detail: "Runs the discovery script on a daily schedule and commits the results straight to the repo.",
  },
  {
    name: "A flat JSON file",
    detail: "data/examples.json is the entire database — version-controlled, human-diffable, no server or database to run.",
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-3 text-sm text-foreground/90">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  const categoryCount = CATEGORIES.length;
  const sourceCount = SOURCES.length;

  return (
    <>
      <SiteHeader current="about" lastUpdated={lastUpdated} />
      <main id="main-content" className="flex-1 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          <Section title="What this is">
            <p>
              A gallery of new and emerging CSS features. Every card is a small, self-contained,
              real live demo &mdash; not just a code snippet &mdash; along with a category, a
              browser-support tag, a caniuse.com link when one exists, and the date the example
              was added.
            </p>
            <p>
              The site itself &mdash; not just the examples in it &mdash; is almost entirely built
              by Claude Code: the components, the styling, the pipeline scripts, this sentence. A
              human still picks the domain, reviews every pull request, and clicks merge &mdash;
              that&rsquo;s me, Knut Sorknes, a frontend developer in Oslo working at NoA Ignite
              Norway.
            </p>
          </Section>

          <Section title="How an example gets here">
            <p>
              Getting a feature onto this page is a two-stage pipeline, because discovering a
              candidate article doesn&rsquo;t need editorial judgment, but turning it into a good
              example does:
            </p>
            <ol className="flex list-decimal flex-col gap-2 pl-5">
              <li>
                <strong className="font-semibold text-foreground">Discover (automated, no LLM).</strong>{" "}
                A script checks each source below for its RSS/Atom feed (or scrapes links from the
                page if it has none), keeps items that mention a known new-CSS-feature keyword, and
                queues them for review. It never re-queues a URL it&rsquo;s already seen or already
                published. This runs on a daily schedule and commits its results straight to the
                repo &mdash; no server involved.
              </li>
              <li>
                <strong className="font-semibold text-foreground">Process (manual, LLM-in-the-loop).</strong>{" "}
                Periodically, the queued articles get reviewed by hand (with Claude Code): is this
                genuinely a new CSS feature worth showcasing? If so, it gets a title, description,
                category, caniuse slug, and a small original demo. A script then mechanically stamps
                the date it was added and looks up real per-browser support numbers &mdash; the
                parts that shouldn&rsquo;t be hand-typed.
              </li>
            </ol>
          </Section>

          <Section title="What the tags mean">
            <p>
              <strong className="font-semibold text-foreground">Category</strong> is one of{" "}
              {categoryCount} fixed groups (Layout, Color &amp; Backgrounds, Cascade Control, and so
              on) chosen by hand for each example &mdash; not auto-detected.
            </p>
            <div className="flex flex-col gap-2">
              <p>
                <strong className="font-semibold text-foreground">Browser support</strong> is derived
                automatically from real caniuse-lite data, not opinion:
              </p>
              <ul className="flex flex-col gap-1.5">
                {SUPPORT_LEVELS.map((level) => (
                  <li key={level.value} className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${SUPPORT_LEVEL_STYLES[level.value]}`}
                    >
                      {level.label}
                    </span>
                    <span className="text-foreground/90">
                      {level.value === "production-ready" && "all 4 major engines (Chrome, Firefox, Safari, Edge) support it"}
                      {level.value === "growing-support" && "some, but not all 4, support it yet"}
                      {level.value === "experimental" &&
                        "none support it yet, or it isn't tracked by caniuse-lite at all"}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-muted">
                caniuse-lite only bundles the ~580 most established features, so a brand-new
                property can show as Experimental even when caniuse.com itself already has a page
                for it &mdash; in that case the card still links out to caniuse.com, just without a
                version table.
              </p>
            </div>
            <p>
              <strong className="font-semibold text-foreground">The NEW badge</strong> is not a time
              window &mdash; it marks whichever examples share the single most recent &ldquo;added to
              this gallery&rdquo; date. Add one example today and only it is NEW; add five in one
              sitting and all five are NEW together; add more tomorrow and today&rsquo;s badges
              retire automatically, since they&rsquo;re no longer the latest date.
            </p>
          </Section>

          <Section title="By the numbers">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <li className="rounded-md border border-border p-3">
                <p className="text-2xl font-semibold tracking-tight">{examples.length}</p>
                <p className="text-xs text-muted">examples</p>
              </li>
              <li className="rounded-md border border-border p-3">
                <p className="text-2xl font-semibold tracking-tight">{categoryCount}</p>
                <p className="text-xs text-muted">categories</p>
              </li>
              <li className="rounded-md border border-border p-3">
                <p className="text-2xl font-semibold tracking-tight">{sourceCount}</p>
                <p className="text-xs text-muted">sources crawled</p>
              </li>
            </ul>
          </Section>

          <Section title="Built with">
            <ul className="flex flex-col gap-3">
              {TECH_STACK.map((item) => (
                <li key={item.name} className="rounded-md border border-border p-3">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-0.5 text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="License & feedback">
            <p>
              The code and every demo in this gallery are{" "}
              <a
                href={`${REPO_URL}/blob/main/LICENSE`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent underline-offset-2 hover:underline"
              >
                MIT licensed
                <BiLinkExternal aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              &mdash; copy, adapt, and ship them, including commercially.
            </p>
            <p>
              Found a bug, a broken demo, or a feature you think belongs here?{" "}
              <a
                href={`${REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent underline-offset-2 hover:underline"
              >
                Open an issue on GitHub
                <BiLinkExternal aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          </Section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
