---
name: CSS Edge
description: A gallery of new and emerging CSS features, each with a live demo and real browser-support data.
colors:
  bench-grey: "#f8f8f8"
  graphite-ink: "#1f1f1f"
  bench-black: "#171717"
  paper-white: "#ffffff"
  pencil-grey: "#6b6b6b"
  hairline: "#e0e0e0"
  tray-grey: "#eeeeee"
  ready-green-wash: "#ecfdf3"
  ready-green: "#15803d"
  growing-amber-wash: "#fff7ed"
  growing-amber: "#c2410c"
  experimental-red-wash: "#fef2f2"
  experimental-red: "#b91c1c"
  demo-blue: "#2563eb"
typography:
  title:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.375
  section:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.43
  tag:
    fontFamily: "Inter Tight, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  chip: "4px"
  inset: "6px"
  card: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
components:
  card:
    backgroundColor: "{colors.bench-grey}"
    rounded: "{rounded.card}"
    padding: "16px"
  tag-category:
    backgroundColor: "{colors.tray-grey}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  tag-new:
    backgroundColor: "{colors.bench-black}"
    textColor: "{colors.paper-white}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  tag-production-ready:
    backgroundColor: "{colors.ready-green-wash}"
    textColor: "{colors.ready-green}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  tag-growing-support:
    backgroundColor: "{colors.growing-amber-wash}"
    textColor: "{colors.growing-amber}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  tag-experimental:
    backgroundColor: "{colors.experimental-red-wash}"
    textColor: "{colors.experimental-red}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip-browser-version:
    textColor: "{colors.graphite-ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  button-pill:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.graphite-ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  button-pill-hover:
    backgroundColor: "{colors.tray-grey}"
  filter-option-selected:
    backgroundColor: "{colors.bench-black}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  disclosure-code-open:
    backgroundColor: "{colors.bench-black}"
    textColor: "{colors.paper-white}"
    padding: "10px 16px"
  input-search:
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.inset}"
    padding: "8px 12px 8px 36px"
  demo-frame:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.inset}"
    height: "240px"
  code-block:
    backgroundColor: "{colors.tray-grey}"
    typography: "{typography.code}"
    rounded: "{rounded.inset}"
    padding: "10px"
---

# Design System: CSS Edge

## Overview

**Creative North Star: "The Lab Bench"**

CSS Edge is a working surface laid out with instruments. Each card is a station on the bench: a labelled demo under glass (the white iframe), a row of readings (browser version chips), a drawer of source (the code disclosure) and a tag that grades readiness. The bench is uniform pale grey and graphite, so the only real color comes from the experiments running on it.

The system is quiet and precise. Hairline borders (1px `hairline`) do the structural work, pill-shaped tags carry the metadata, and nothing is raised by shadows at rest. Near-black ink (`bench-black`) marks active state: a selected filter, an open code drawer, the NEW tag, the marquee strip. Density is practical rather than airy. A card packs tags, a title, the feature name, an optional Tailwind note, a description, the demo, the code and support data into one column without decoration.

Color in the interface has a meaning. Green, amber and red appear only as support-level signals, always as a pale wash with a darker border and text in the same hue, never as decoration.

**Key Characteristics:**
- A monochrome frame (graphite on pale grey) so the live demos supply the color.
- Hairline borders instead of shadows; flat at rest.
- Pill tags for metadata; small square-cornered chips for data readings.
- Near-black ink as the single active-state signal.
- Mono type is used only for code and CSS feature names.

## Colors

A near-monochrome bench of greys and graphite, with three semantic signal hues and one blue kept for the demos.

### Primary
- **Bench Black** (`bench-black`): the interface's active-state ink. Used for the selected filter pill, the open "View code" drawer and its hover state, the NEW tag, the marquee strip, the back-to-top button, the focus ring and text links. In the interface it is the only "accent".

### Tertiary
- **Demo Blue** (`demo-blue`): the main accent *inside* live demos only. New example demos use it instead of black. The interface itself does not use it today.

### Neutral
- **Bench Grey** (`bench-grey`): page background and card background. Cards share the page color and are separated by their hairline border, not by fill.
- **Graphite Ink** (`graphite-ink`): body text and headings. Secondary copy is softened with opacity (90% for descriptions, 80% for chips), not with a separate color.
- **Pencil Grey** (`pencil-grey`): muted text such as feature names, counts, inactive nav links, the search icon and footer links.
- **Hairline** (`hairline`): every border and divider.
- **Tray Grey** (`tray-grey`): recessed surfaces such as code blocks, the category tag fill and hover backgrounds on filter rows and pill buttons.
- **Paper White** (`paper-white`, CSS `--paper`): the demo canvas (iframe background), the mobile filter drawer, pill buttons and text on Bench Black.

### Signal (support level)
- **Ready Green** (`ready-green` on `ready-green-wash`): "Production ready", full support in all four tracked engines on browsers used by at least 90% of global users.
- **Growing Amber** (`growing-amber` on `growing-amber-wash`): "Growing support", supported (fully or partially) somewhere but not yet production ready.
- **Experimental Red** (`experimental-red` on `experimental-red-wash`): "Experimental", supported nowhere or not tracked by caniuse-lite.

### Named Rules
**The Demos Bring the Color Rule.** The interface stays graphite and grey. Saturated color belongs to the live demos and the three support-level signals. Any other hue in the interface needs a reason.

**The Signal Pair Rule.** A support-level color always appears as a set: a pale wash fill, plus a border and text in the darker shade of the same hue. Never use the dark hue as a solid fill.

**The Accent Split (current, open to change).** Today the interface accent is Bench Black and the demo accent is Demo Blue. This is the documented current state, not a permanent rule. If the interface moves to blue later, update this section and the tokens together.

## Typography

**Display/Body Font:** Inter Tight (with ui-sans-serif, system-ui)
**Mono Font:** Geist Mono (with ui-monospace)

**Character:** a tight, slightly condensed grotesque for everything readable, paired with a clean mono that marks anything you could paste into a stylesheet. The pairing reads like a technical manual: no display face and no flourish.

### Hierarchy
- **Title** (600, 1.25rem, 1.375): example card titles. This is the largest type on the gallery; the wordmark is deliberately small.
- **Section** (600, 1.25rem, tight tracking): section headings on the About and Reading List pages.
- **Body** (400, 1rem, 1.5): card descriptions and page prose. Long-form pages are capped at `max-w-2xl` (42rem).
- **Label** (700, 0.875rem): filter group headings and form labels. The site wordmark "CSS Edge" uses the same bold weight at 1rem with tight tracking.
- **Tag** (500–600, 0.75rem): pills, browser chips, counts, Replay/Copy buttons. Code block labels (HTML/CSS/JS) use this size in uppercase with wide tracking.
- **Code** (Geist Mono, 0.75rem, 1.625): code blocks and the `cssFeature` line under each title.

### Named Rules
**The Mono Means CSS Rule.** Geist Mono is reserved for literal code: demo source and CSS feature names. Never use mono for decoration or labels.

**The Small Wordmark Rule.** The brand name is 1rem bold, not a hero headline. The cards are the content and should carry the visual weight.

## Layout

- **Gallery:** on desktop (`lg`, 1024px and up), a fixed 18rem (`w-72`) filter sidebar on the left with a hairline right border, sticky beneath the header. The content column holds a card grid: 1 column on mobile, 2 from `sm` (640px), 3 from `xl` (1280px), 4 from `2xl` (1536px), with a 20px gap. Below `lg`, filters move into an off-canvas drawer (18rem, max 85vw) behind a "Filters" pill that shows a count of active filters.
- **Header:** sticky on desktop with a 95%-opaque blurred background. It has two bands: a thin black marquee strip, then a three-column grid (wordmark | centered nav | GitHub link).
- **Reading pages** (About, Reading List): one centered column, `max-w-2xl`, with 40px between sections.
- **Rhythm:** a 4px base. 16px is the standard inset (card padding, page gutter on mobile), 24px the page gutter from `sm`, 12px the vertical gap inside cards, and 32px between filter groups.
- **Touch targets:** filter rows, the Filters trigger and the sort control are at least 44px tall (`min-h-11`). Small pills and text links keep their visual size but extend their hit area with an invisible `::after` inset.
- **Header on phones:** below `sm` the wordmark and GitHub link share the first row and the nav moves to a second row, so the wordmark never wraps.

## Elevation & Depth

The bench is flat. Depth comes from hairline borders and tonal steps: Tray Grey for recessed areas (code), Paper White for the demo canvas and drawer, Bench Grey for everything else. Shadows appear only on elements that float over content.

### Shadow Vocabulary
- **Float small** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`): the Replay button, which sits inside a demo frame over live content with a translucent white, blurred background.
- **Float large** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): the fixed back-to-top button.

### Named Rules
**The Flat Bench Rule.** Cards, tags, inputs and panels have no shadow. A shadow is reserved for something floating above live content or the page (Replay, back-to-top).

## Shapes

Corners scale with an element's role. **Pills** (full radius) are used for everything you tag or tap: metadata tags, filter selections, Copy, Replay, Filters, the close button and back-to-top. **Gently rounded rectangles** hold content: cards (8px), and demo frames, code blocks, the code drawer and inputs (6px). **Small chips** (4px) are used for data readings, the browser version tags. All borders are 1px. The demo frame has a native horizontal resize handle, so visitors can test responsive demos by dragging.

## Components

### Example Card (signature)
The station on the bench, quiet and complete.
- **Corner Style:** 8px; the card clips its children.
- **Background:** Bench Grey (the same as the page), with a 1px Hairline border.
- **Structure, top to bottom:** a tag row (NEW, category, support level) separated by a hairline; title; the CSS feature in mono with a curly-brace icon; an optional "Tailwind:" note; the description; the live demo frame; the "View code" drawer; a footer with browser version chips and a "View on caniuse.com" link, set off by a hairline.
- **Internal Padding:** 16px on the sides, with 12px vertical steps between parts.

### Demo Frame
- A sandboxed iframe on Paper White, 240px tall, with a 6px radius, a hairline border and horizontal resizing (minimum 140px).
- **Replay** (only for one-shot demos): a pill in the top-right corner with a translucent white, blurred fill and the small float shadow.

### Tags
- **Category:** a Tray Grey pill with a Pencil Grey border and Graphite text.
- **NEW:** a Bench Black pill with white text, semibold and uppercase.
- **Support level:** a signal pair (wash fill with a border and text in the same hue), followed by the global usage figure when known ("Production ready · 94%"). The same styling is reused for the selected state of the sidebar filter.
- **Browser version chip:** a 4px-radius chip with a hairline border, the browser logo and "Chrome 125+" (or an em dash when unsupported). Partial support (caniuse "a") uses a dashed Pencil Grey border and reads "Chrome 125+ partial", with "partial" in Pencil Grey. Partial support counts toward Growing support, never Production ready. When an example has no support data, the chip row is replaced by "Browser support not yet tracked on caniuse".

### Buttons
- **Pill button** (Copy, Replay, Filters): Paper White fill, hairline border, 0.75rem medium text with a leading 14px icon. On hover the fill changes to Tray Grey.
- **Back to top:** a 44px round Bench Black button with white icon and the large float shadow. It fades in after 400px of scrolling.
- **Text link action** (Clear categories, caniuse link): Bench Black, medium weight, underlined on hover with a 2px offset.

### Code Drawer
- A native `<details>` element with a 6px radius and hairline border. The summary row (code icon, "View code", chevron) turns Bench Black with white text on hover and when open, and the chevron rotates 180°.
- Inside: labelled code blocks (an uppercase tracked label plus a Copy pill) on a Tray Grey `pre` in Geist Mono at 0.75rem.

### Filter Sidebar
- Group headings in Label type. Options are full-width rows at least 44px tall, separated by hairline dividers, with a Tray Grey hover. The option text sits in a pill that fills with Bench Black when selected (or with the signal pair for support levels). Counts are right-aligned in Pencil Grey.
- **Search input:** a hairline border, 6px radius and a leading search icon in Pencil Grey.

### Navigation
- The header nav uses 1rem medium text. Inactive links are Pencil Grey and turn Graphite on hover, with an underline offset by 2px. The current page is Graphite and has `aria-current`.
- **Marquee strip:** a Bench Black band with 0.75rem white text scrolling continuously (80s linear loop), with items separated by 50%-white bullets. It pauses on hover and focus, and a pause/play toggle is pinned to its right end (WCAG 2.2.2).

### Focus
- Every element gets the same focus ring: a 2px solid Bench Black outline offset by 2px. The code drawer summary uses a negative offset so the ring stays inside its clipped corners.

## Do's and Don'ts

### Do:
- **Do** separate surfaces with 1px Hairline borders and tonal steps (Tray Grey, Paper White), not shadows.
- **Do** use pills (full radius) for tags and small actions, 6–8px radius for content containers and 4px for data chips.
- **Do** show support level only through the three signal pairs, and keep them consistent between card badges and filter selections.
- **Do** use Demo Blue as the main accent inside new demos.
- **Do** keep every interactive row at least 44px tall and keep the global 2px Bench Black focus ring.
- **Do** make motion respect `prefers-reduced-motion`; the global rule already reduces animation and transition durations to near zero.

### Don't:
- **Don't** add saturated color to the interface beyond the signal hues; the demos bring the color.
- **Don't** put shadows on cards, tags or panels at rest.
- **Don't** use Geist Mono for anything that isn't literal code or a CSS feature name.
- **Don't** fill a surface with a solid signal hue (dark green, amber or red); use the wash fill with a darker border and text.
- **Don't** enlarge the wordmark into a hero; the cards carry the page.
