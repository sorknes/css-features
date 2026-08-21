# CSS Edge

A gallery of new and emerging CSS features, crawled from a curated list of specs, browser blogs, and expert writeups. Every example gets a live demo, a category, browser-support tags, a "new" badge, a caniuse.com link (when one exists), and an "Updated" date from its source article.

## How it works

The pipeline is split into two stages, because turning an article into a good example takes editorial judgment and an LLM, but discovering candidate articles doesn't:

1. **Discover (automated, no LLM)** — [`scripts/discover.mjs`](scripts/discover.mjs) checks each source in [`data/sources.json`](data/sources.json) for its RSS/Atom feed (or scrapes links from the page if it has none), keeps items that mention a known new-CSS-feature keyword, and appends them to [`data/pending.json`](data/pending.json). It never re-queues a URL that's already in `data/seen-urls.json` or already published in `data/examples.json`.
2. **Process (manual, LLM-in-the-loop)** — periodically, ask Claude Code (in this repo) to "process the pending items." Claude reads `data/pending.json`, fetches each article, decides whether it's genuinely about a new CSS feature worth showcasing (and not a duplicate of something already covered), and writes a title, description, category, caniuse slug, and a small original demo. It then hands that draft to [`scripts/add-example.mjs`](scripts/add-example.mjs), which mechanically stamps the crawl date, looks up real browser-support numbers from `caniuse-lite`, appends the finished record to `data/examples.json`, and removes the item from `pending.json`.

`developer.mozilla.org/.../Web/CSS` is a reference doc, not a dated post stream, so it's marked `"kind": "reference"` in `data/sources.json` and skipped by automated discovery — it's still a valid source to pull from during manual processing.

### Weekly maintenance workflow

[`.github/workflows/weekly-maintenance.yml`](.github/workflows/weekly-maintenance.yml) runs every Monday at 08:00 Europe/Oslo time (and on-demand via `workflow_dispatch`). GitHub Actions cron is UTC-only with no timezone/DST support, so this is two cron schedules that switch with daylight saving (06:00 UTC across CEST months, 07:00 UTC across CET months) — accurate to within an hour of the actual DST transition dates, which isn't worth the added complexity to close for a weekly, non-time-critical job. It does three things, all mechanical — no LLM involved, and it never merges anything itself:

1. Runs `scripts/discover.mjs` to queue new candidates into `data/pending.json`.
2. Runs `scripts/refresh-browser-support.mjs` (after `npx update-browserslist-db@latest`) to re-check every existing example's `browserSupport` against the latest `caniuse-lite` data, updating numbers that changed. It only ever updates an entry when the lookup succeeds with different data — a failed lookup (a `caniuseSlug` not bundled in `caniuse-lite`) never overwrites existing numbers with `null`. Some legacy examples use `caniuseSlug` values that are valid caniuse.com pages but aren't part of `caniuse-lite`'s slimmer bundled dataset; those are intentionally left alone rather than "refreshed" into nothing.
3. Runs `npm run lint` and `npm run build` as a basic health check.

It then opens (or updates, if one's still open) a single PR on the `automated/weekly-maintenance` branch with whatever changed, noting the lint/build outcome in the PR body. Nothing reaches `main` — or your live Vercel deployment — until you review and merge it yourself. New pending candidates still need a manual "process the pending items" pass (step 2 above) to become gallery examples; this workflow only queues and refreshes data.

### Why browser support is sometimes "not tracked"

Browser-support tags come from the `caniuse-lite` package (via `caniuse-api`), which only bundles ~580 well-established features — not the full caniuse.com dataset. Bleeding-edge features (e.g. `@property`, `field-sizing`) often don't have local data yet even though caniuse.com has a page for them. In that case the card still links out to caniuse.com but shows "Browser support not yet tracked on caniuse" instead of guessing.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running the crawler manually

```bash
node scripts/discover.mjs
```

This is safe to re-run any time — it only appends genuinely new candidates.

## Refreshing browser-support numbers manually

```bash
npx update-browserslist-db@latest
node scripts/refresh-browser-support.mjs
```

Safe to re-run any time — it only overwrites an example's `browserSupport` when a lookup succeeds with different data, never on a failed lookup.

## Adding an example by hand

Write one or more draft objects (see `CssExample` minus `crawledDate`/`browserSupport` in [`lib/types.ts`](lib/types.ts)) to a JSON file, then:

```bash
node scripts/add-example.mjs path/to/draft.json
```

## Deployment

This app has no server-side state — `data/examples.json` is read at build time, so any static/Node host works. To use Vercel with the scheduled discovery workflow as designed:

1. Push this repo to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new) — no extra configuration or Vercel Cron needed. Vercel redeploys automatically on every push to `main`, including whenever you merge the weekly maintenance PR.
3. GitHub Actions needs no extra secrets — it uses the default `GITHUB_TOKEN` to open the PR. Confirm the repo's Settings → Actions → General → Workflow permissions is set to "Read and write permissions", and that "Allow GitHub Actions to create and approve pull requests" is enabled (same settings page) so `weekly-maintenance.yml` can open its PR.
