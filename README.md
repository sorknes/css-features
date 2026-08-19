# Modern CSS Features v. 2

A gallery of new and emerging CSS features, crawled from a curated list of specs, browser blogs, and expert writeups. Every example gets a live demo, a category, browser-support tags, a "new" badge, a caniuse.com link (when one exists), and an "Updated" date from its source article.

## How it works

The pipeline is split into two stages, because turning an article into a good example takes editorial judgment and an LLM, but discovering candidate articles doesn't:

1. **Discover (automated, no LLM)** — [`scripts/discover.mjs`](scripts/discover.mjs) checks each source in [`data/sources.json`](data/sources.json) for its RSS/Atom feed (or scrapes links from the page if it has none), keeps items that mention a known new-CSS-feature keyword, and appends them to [`data/pending.json`](data/pending.json). It never re-queues a URL that's already in `data/seen-urls.json` or already published in `data/examples.json`. This runs on a daily schedule via [`.github/workflows/discover.yml`](.github/workflows/discover.yml), which commits the updated pending/seen files directly — no server or database needed.
2. **Process (manual, LLM-in-the-loop)** — periodically, ask Claude Code (in this repo) to "process the pending items." Claude reads `data/pending.json`, fetches each article, decides whether it's genuinely about a new CSS feature worth showcasing, and writes a title, description, category, caniuse slug, and a small original demo. It then hands that draft to [`scripts/add-example.mjs`](scripts/add-example.mjs), which mechanically stamps the crawl date, looks up real browser-support numbers from `caniuse-lite`, appends the finished record to `data/examples.json`, and removes the item from `pending.json`.

`developer.mozilla.org/.../Web/CSS` is a reference doc, not a dated post stream, so it's marked `"kind": "reference"` in `data/sources.json` and skipped by automated discovery — it's still a valid source to pull from during manual processing.

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

## Adding an example by hand

Write one or more draft objects (see `CssExample` minus `crawledDate`/`browserSupport` in [`lib/types.ts`](lib/types.ts)) to a JSON file, then:

```bash
node scripts/add-example.mjs path/to/draft.json
```

## Deployment

This app has no server-side state — `data/examples.json` is read at build time, so any static/Node host works. To use Vercel with the scheduled discovery workflow as designed:

1. Push this repo to GitHub.
2. Import the repo into [Vercel](https://vercel.com/new) — no extra configuration or Vercel Cron needed. Vercel redeploys automatically on every push to `main`, including the commits the discovery workflow makes.
3. GitHub Actions needs no extra secrets — it uses the default `GITHUB_TOKEN` to push back to the repo. Confirm the repo's Settings → Actions → General → Workflow permissions is set to "Read and write permissions" so the commit step can push.
