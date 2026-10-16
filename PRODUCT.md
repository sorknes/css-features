# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Front-end developers and design engineers (designers who code). They come to see what's new in CSS. Some are judging whether a feature is ready for production: they check support and copy the code. Others are browsing for ideas. Both groups want to see the feature working, not just read about it.

## Product Purpose

CSS Edge is a gallery of new and emerging CSS features. Each entry has a live demo, a category, browser-support tags, a "new" badge, a caniuse.com link when one exists, and the date from its source article. The site works if a visitor can quickly tell what a feature does, see it running, and decide whether they can use it yet.

## Positioning

- **A live demo for every feature.** Each entry runs a real, self-contained demo instead of showing a static snippet.
- **Curated and deduplicated.** An editor narrows many sources (specs, browser blogs, expert writeups) to one good entry per feature. Good writeups about features that are no longer new go to the reading list instead of the gallery.
- **Tailwind mapping.** Entries name the Tailwind utility or variant for a feature when one really exists.

## Operating Context

- Two-stage pipeline. Automated discovery (`scripts/discover.mjs`, run weekly by GitHub Actions) queues candidates in `data/pending.json`. A manual, LLM-assisted editorial pass turns candidates into examples (`scripts/add-example.mjs`) or reading-list entries.
- Changes reach `main` only through reviewed PRs. Vercel deploys on merge.
- Surfaces: the gallery (`/`), the reading list (`/reading-list`) and the about page (`/about`).

## Capabilities and Constraints

- Next.js App Router, React, TypeScript, Tailwind CSS v4 and react-icons. Statically rendered from flat JSON (`data/examples.json`, `data/reading-list.json`), with no server-side state.
- Gallery cards can be filtered by category (11 categories in `lib/types.ts`) and by support level ("Production ready" / "Growing support"). Examples can show a code block and, for one-shot effects, a Replay button.
- Browser-support numbers come from `caniuse-lite`. When a feature isn't in its bundled dataset, the card says so ("not yet tracked") rather than guessing.
- Demos for features that no browser ships yet must fall back gracefully (for example with `@supports`) instead of rendering nothing.
- Demo text is written in the site's own words and never copied from the source article.

## Brand Commitments

- Name: **CSS Edge**.
- Demos use blue `#2563eb` as the primary accent.

## Evidence on Hand

- About 80 published examples in `data/examples.json` and a small reading list in `data/reading-list.json`, with sources listed in `data/sources.json`.
- No testimonials, usage metrics or press. Future work must not invent them.

## Product Principles

1. **Show, don't tell.** A working demo comes before any prose.
2. **Be honest about readiness.** Support data is real or plainly marked as missing, never inferred.
3. **Curate, don't aggregate.** One clear entry per feature beats many links.
4. **The feature is the star.** The site's interface should step back so each demo stands out.

## Accessibility & Inclusion

WCAG 2.2 AA is the floor for the site and its demos.
