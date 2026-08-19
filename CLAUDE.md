@AGENTS.md

# Publishing pending CSS examples

Full pipeline docs are in [README.md](README.md). The short version, for when the user asks to "process pending," "publish an item," or similar:

1. Read `data/pending.json` and `data/examples.json` first. Most pending candidates turn out to be duplicates of a feature the gallery already covers (check `cssFeature` and `title` across existing examples, not just an exact string match — e.g. a "Getting Started With The Popover API" article is a duplicate if `popover, popovertarget` is already an example). Skip duplicates rather than force-adding them; leave them queued in `pending.json` as backlog.
2. For a genuinely new candidate, fetch the actual article. For anything cutting-edge or unfamiliar, verify exact current syntax against MDN or the spec (WebFetch/WebSearch) before writing the demo — bleeding-edge CSS syntax shifts during standardization and is easy to get subtly wrong.
3. Write a draft object matching `CssExample` (see `lib/types.ts`) minus `crawledDate`/`browserSupport` (auto-filled), then run:
   ```bash
   node scripts/add-example.mjs path/to/draft.json
   ```
   This looks up real browser-support numbers from `caniuse-lite`, appends to `data/examples.json`, and removes the matching entry from `data/pending.json` by `sourceUrl`.
4. If the demo's effect only plays once on load (a one-shot animation, or a randomized result like `random()`), set `"replayable": true` on the draft so the card gets a Replay button.
5. Verify the live demo actually renders in the browser preview before considering it done — some very new CSS features aren't supported by any browser yet, so the demo should degrade gracefully (e.g. via `@supports`) rather than showing nothing.

A weekly GitHub Actions workflow (`.github/workflows/weekly-maintenance.yml`) runs discovery and `scripts/refresh-browser-support.mjs` automatically and opens a PR with the results — it never merges or touches `main` itself, and it doesn't turn pending candidates into examples (that's still the manual/LLM step above). If asked to look into that workflow's output, the PR it opens is the place to look, not a direct commit.
