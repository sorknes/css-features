import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BiLinkExternal } from "react-icons/bi";
import examplesData from "@/data/examples.json";
import type { CssExample } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { getLatestCrawledDate } from "@/lib/isNew";
import { PRODUCTION_READY_MIN_USAGE, SUPPORT_LEVELS, SUPPORT_LEVEL_STYLES } from "@/lib/supportLevel";
import { SOURCES } from "@/lib/sources";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SheetPage from "@/components/SheetPage";
import { SUPPORT_LEVEL_ICONS } from "@/lib/tagIcons";

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
    detail: "Styling, using its CSS-first theme tokens for the cream, ink and forest-green palette.",
  },
  {
    name: "react-icons (Box Icons)",
    detail: "The browser logos, the icons on each card's tags, the code/search/copy icons, and external-link markers.",
  },
  {
    name: "caniuse-lite + caniuse-api",
    detail: "The offline browser-support dataset behind every version number and the global usage figure on each tag.",
  },
  {
    name: "MDN browser-compat-data",
    detail: "Support data for features caniuse-lite doesn't bundle (caniuse's mdn-* pages), used for their global usage figure.",
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
    detail: "Runs discovery and refreshes browser-support numbers every week, then opens a pull request with the results for review. It never pushes to main.",
  },
  {
    name: "A flat JSON file",
    detail: "data/examples.json is the entire database — version-controlled, human-diffable, no server or database to run.",
  },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-10">
      <div className="flex max-w-2xl flex-col gap-4">
        <h2 className="font-display text-2xl leading-none">{title}</h2>
        <div className="flex flex-col gap-3 text-base leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const categoryCount = CATEGORIES.length;
  const sourceCount = SOURCES.length;

  return (
    <>
      <SiteHeader current="about" lastUpdated={lastUpdated} />
      <SheetPage title="About CSS Edge">
        <Section title="What this is">
          <p>
            A gallery of new and emerging CSS features. Every card is a small, self-contained,
            real live demo &mdash; not just a code snippet &mdash; along with a category, a
            browser-support tag, and a caniuse.com link when one exists.
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
          <ol className="flex list-decimal flex-col gap-3 pl-5 marker:font-mono marker:text-muted">
            <li>
              <strong className="font-semibold">Discover (automated, no LLM).</strong>{" "}
              A script checks each source below for its RSS/Atom feed (or scrapes links from the
              page if it has none), keeps items that mention a known new-CSS-feature keyword, and
              queues them for review. It never re-queues a URL it&rsquo;s already seen or already
              published. This runs on a weekly schedule and opens a pull request with its results
              for review &mdash; no server involved.
            </li>
            <li>
              <strong className="font-semibold">Process (manual, LLM-in-the-loop).</strong>{" "}
              Periodically, the queued articles get reviewed by hand (with Claude Code): is this
              genuinely a new CSS feature worth showcasing? If so, it gets a title, description,
              category, caniuse slug, and a small original demo. A script then mechanically stamps
              the date it was added (used for sorting and the NEW badge, not shown as a literal
              date on the card) and looks up real per-browser support numbers &mdash; the parts
              that shouldn&rsquo;t be hand-typed.
            </li>
          </ol>
        </Section>

        <Section title="What the tags mean">
          <p>
            <strong className="font-semibold">Category</strong> is one of{" "}
            {categoryCount} fixed groups (Layout, Color &amp; Backgrounds, Cascade Control, and so
            on) chosen by hand for each example &mdash; not auto-detected.
          </p>
          <div className="flex flex-col gap-2">
            <p>
              <strong className="font-semibold">Browser support</strong> is derived
              automatically from caniuse data (via caniuse-lite) and MDN&rsquo;s browser-compat-data,
              not opinion. The percentage on a tag is the share of global users whose browser
              fully supports the feature:
            </p>
            <ul className="flex flex-col gap-1.5">
              {SUPPORT_LEVELS.map((level) => {
                const Icon = SUPPORT_LEVEL_ICONS[level.value];
                return (
                  <li key={level.value} className="flex items-start gap-3">
                    <span
                      className={`label inline-flex shrink-0 items-center gap-1.5 px-2 py-1 ${SUPPORT_LEVEL_STYLES[level.value]}`}
                    >
                      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      {level.label}
                    </span>
                    <span>
                      {level.value === "production-ready" &&
                        `full support in all 4 major engines (Chrome, Firefox, Safari, Edge), on browsers used by at least ${PRODUCTION_READY_MIN_USAGE}% of people`}
                      {level.value === "growing-support" && "supported somewhere, fully or partially, but not production ready yet"}
                      {level.value === "experimental" &&
                        "none support it yet, or it isn't tracked by caniuse-lite at all"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-muted">
              caniuse-lite only bundles the ~580 most established features, so a brand-new
              property can show as Experimental even when caniuse.com itself already has a page
              for it &mdash; in that case the card still links out to caniuse.com, just without a
              version table.
            </p>
          </div>
          <p>
            <strong className="font-semibold">The NEW badge</strong> is not a time
            window &mdash; it marks whichever examples share the single most recent &ldquo;added to
            this gallery&rdquo; date. Add one example today and only it is NEW; add five in one
            sitting and all five are NEW together; add more tomorrow and today&rsquo;s badges
            retire automatically, since they&rsquo;re no longer the latest date.
          </p>
        </Section>

        <Section title="By the numbers">
          <ul className="grid grid-cols-3 border border-border">
            {[
              [examples.length, "Examples"],
              [categoryCount, "Categories"],
              [sourceCount, "Sources crawled"],
            ].map(([value, label]) => (
              <li key={label} className="border-r border-border p-4 last:border-r-0">
                <p className="font-display text-4xl leading-none sm:text-5xl">{value}</p>
                <p className="label mt-2 text-muted">{label}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Built with">
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {TECH_STACK.map((item) => (
              <li key={item.name} className="py-3">
                <p className="font-semibold">{item.name}</p>
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
              className="inline-flex items-center gap-1 font-semibold text-forest underline underline-offset-4"
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
              className="inline-flex items-center gap-1 font-semibold text-forest underline underline-offset-4"
            >
              Open an issue on GitHub
              <BiLinkExternal aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </Section>
      </SheetPage>
      <SiteFooter />
    </>
  );
}
