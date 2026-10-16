---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/about/page.tsx","app/reading-list/page.tsx"]
---

# Surface brief: CSS Edge gallery (/, plus /about and /reading-list)

Mode: Experience — the live demos lead; the frame recedes into a ruled sheet.
Audience: front-end developers and design engineers checking what's new in CSS, whether it ships, and copying the code.
Scope: whole site (header, footer, gallery, reading list, about). No headline band: the page starts with filters and the grid.
Constraints: demos keep their own blue (#2563eb) accent; cards keep full description text; marquee stays; demo comes first on every card; WCAG 2.2 AA.

## Direction contract

THESIS: The gallery is a technical drawing sheet: a cream plate divided by hairline rules into cells, each cell one feature with its live demo as the drawing. Refuses the category default of rounded floating cards on a grey canvas with pill tags.

OWN-WORLD: Cream paper ground (#f1ece1), near-black ink, one forest green (#1f4a35) used as solid fields only: the wordmark disc, Production ready, selected filters, primary actions, marquee separators. Square corners everywhere, 1px warm rules (#d3cbb8) that collapse between cells, ink-outlined controls. Archivo heavy, slightly condensed, uppercase for wordmark, card titles and page headings; Geist Mono uppercase for every label, tag, control, count and the ticker. Buttons are outlined rectangles with a vertical divider before an arrow. Demo canvases stay white-ish panels set into the sheet.

STORY: A visitor scans a grid of working demos, reads each one's readiness at a glance (solid green = ship it, outlined = growing, dashed = experimental), filters by category or readiness, opens code, and copies it.

FIRST VIEWPORT: Ruled header band — green disc + CSS EDGE wordmark cell, nav as mono cells, GitHub cell; below it the mono ticker strip with green disc separators. Then the sheet: filter rail as the left column (w-72, right rule, sticky full height), results bar row (mono SHOWING N / 80, CLEAR ALL, SORT) ruled underneath, then the card cells starting immediately. In each cell: mono tag row, uppercase title, mono feature line, then the demo panel within the first ~260px of the cell.

FORM: Pinned by the user's reference screenshot (architectural drawing sheet with hairline panel grid, mono uppercase labels, heavy uppercase grotesque, outlined arrow buttons, one bold colour disc), recoloured to cream / black / forest green. Signature interaction: filter toggles and readiness tags share one shape language (solid / outlined / dashed), and the results bar count updates live. Motion (extended at the user's request via /impeccable animate): one authored moment — filter and sort changes glide each cell to its new place on the sheet (View Transitions), arriving cells drawn in top to bottom, leaving cells fade fast; supporting: code disclosure via ::details-content + interpolate-size, drawer slide 300ms in / 200ms out, the ticker, 150ms colour feedback. Reduced motion keeps only colour feedback and the paused-able ticker.
seed:90b56e03068c8324 (rolled for provenance; the user's pinned reference screenshot governs the direction)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
