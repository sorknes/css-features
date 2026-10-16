---
name: CSS Edge
description: A gallery of new and emerging CSS features, each with a live demo and real browser-support data, laid out as a ruled drawing sheet.
colors:
  background: "#f1ece1"
  foreground: "#151612"
  muted: "#5f5a4e"
  border: "#d3cbb8"
  surface: "#e7e0d0"
  paper: "#fffdf8"
  forest: "#1f4a35"
  forest-foreground: "#f1ece1"
typography:
  display-rail:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 88"
  display-rail-wide:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 88"
  display-stat:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 88"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 88"
  headline-section:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 88"
  title-card:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 88"
  title-list:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 88"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  body-card:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  body-small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  caption:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.04em"
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  none: "0px"
  disc: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  cell: "20px"
  gutter: "24px"
  section: "40px"
  control: "44px"
  band: "56px"
  rail: "288px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.forest-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "{spacing.control}"
    padding: "0 16px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  button-outline-hover:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.forest-foreground}"
  disclosure-code:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: "{spacing.control}"
  disclosure-code-open:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
  tag-production-ready:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.forest-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  tag-growing-support:
    backgroundColor: "{colors.background}"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  tag-experimental:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  tag-new:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  tag-category:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  input-search:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px 8px 36px"
  nav-cell:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    height: "{spacing.control}"
    padding: "0 20px"
  nav-cell-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
  filter-option-row:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-small}"
    height: "{spacing.control}"
    padding: "0 16px"
  filter-option-row-hover:
    backgroundColor: "{colors.surface}"
  demo-panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
    height: "260px"
  code-block:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.code}"
    padding: "12px"
---

# Design System: CSS Edge

## Overview

**Creative North Star: "The Drawing Sheet"**

The site is a technical drawing sheet: a cream plate divided by hairline rules into cells, each cell holding one CSS feature with its live demo as the drawing. Nothing floats. Cards, filters, header, ticker, results bar and reading pages are all regions of the same ruled plate, separated by 1px warm rules that collapse between neighbours rather than by gaps and shadows.

The frame is deliberately quiet so the demos lead. One forest green carries every piece of state and action: the wordmark disc, the Production ready tag, selected filters, primary actions, links, the focus ring and the ticker separators. Everything else is ink on cream. Type splits into two voices: a heavy, slightly condensed, uppercase Archivo for names (wordmark, card titles, page headings) and Geist Mono uppercase for every label, tag, control, count and the ticker. Running prose stays in sentence-case Archivo at regular weight.

The world refuses the category default of rounded floating cards on a grey canvas with pill tags. Corners are square; the only curve in the system is the solid forest disc.

**Key Characteristics:**
- Cream sheet, near-black ink, one forest green; no other interface hue.
- 1px warm rules divide every region; cells share edges instead of sitting apart.
- Square corners on everything except the forest disc motif.
- Heavy condensed uppercase Archivo for names; mono uppercase for every label.
- Readiness is shape-coded: solid forest, outlined forest, dashed ink.
- Flat: no shadows for depth; the drawing paper panel is set into the sheet, not lifted.
- Motion is limited to the ticker, short colour transitions and the mobile filter drawer.

## Colors

Warm paper and ink with a single deep forest green that means "act here" or "this is selected/ready".

### Primary
- **Forest** (forest): The one interface colour. Solid fields for the wordmark disc, the Production ready tag, selected filter checkboxes, primary action buttons, the active-filter count badge, hover fill on outlined buttons and the ticker's disc separators. Also the outline and text colour of the Growing support tag, link-style actions (Clear, Clear all filters, caniuse.com, About links), the current-page nav underline, the focus ring, text caret, selection background and native accent colour.
- **Forest Foreground** (forest-foreground): Text and icons on forest fields. It is the cream sheet colour, so a forest field reads as a hole punched through to colour, not a new surface.

### Neutral
- **Cream Sheet** (background): The page ground and the fill of every cell, header band, rail and drawer.
- **Sheet Ink** (foreground): All primary text, the edges of operable controls (outlined buttons, search input, sort select, code disclosure), the dashed Experimental tag, the New tag fill, and the open code-disclosure bar.
- **Pencil** (muted): Secondary text: counts, inactive nav cells, category tags, source lines, helper copy, placeholder text, the "partial" note and the dashed partial-support chip edge. Holds 5.2:1 or better on cream, surface and paper.
- **Warm Rule** (border): Hairline dividers between cells and regions, and the edge of passive chips (category tag, browser chips) and the demo panel. Decorative at 1.37:1 against cream; never the only edge of a standalone control.
- **Tray** (surface): Hover fill for nav cells, option rows, reading-list rows and outlined secondary buttons; the code block background; the scrollbar track.
- **Drawing Paper** (paper): The demo canvas and the fill of text inputs and selects. The near-white panel where the "drawing" sits.

### Named Rules
**The One Green Rule.** Forest is the only interface hue. Anything that is selected, ready, primary or a link is forest; everything else is ink, pencil or a warm neutral. Do not introduce a second accent, a warning colour or a status red.

**The Demo Blue Rule.** Demos keep their own blue accent (#2563eb), and the interface never uses it. Blue inside a demo panel is the feature; blue in the frame would compete with it.

**The Ink Edge Rule.** A standalone control (button, input, select, disclosure) has a sheet-ink edge or a forest fill. Warm rules divide cells and frame passive chips; they never carry an interactive edge alone.

## Typography

**Display Font:** Archivo (variable, with the wdth axis; ui-sans-serif, system-ui fallback)
**Body Font:** Archivo
**Label/Mono Font:** Geist Mono (ui-monospace fallback)

**Character:** A heavy, slightly condensed grotesque set uppercase and tight, like lettering on a drawing's title block, against a small mono that reads as dimension callouts. The same Archivo family relaxes to regular weight and sentence case for prose.

### Hierarchy
- **Display, rail** (800, 3rem below 1024px and 2.75rem at 1024px and up, 0.92): The page title in the reading pages' left rail, under the large forest disc.
- **Display, stat** (800, 2.25rem rising to 3rem from 640px, 1): The About page's figure cells.
- **Headline** (800, 1.875rem, 1.05): The empty-results message.
- **Headline, section** (800, 1.5rem, 1): About page section headings.
- **Title, card** (800, 1.375rem, 1.05, balanced): Feature names on gallery cells.
- **Title, list** (800, 1.25rem): The CSS EDGE wordmark (line-height 1) and reading-list entry titles (1.25).
- **Body** (400, 1rem, 1.625, max about 42rem): About and reading-list prose, the search field text.
- **Body, card** (400, 0.9375rem, 1.625): Feature descriptions on cards, always shown in full.
- **Body, small** (400, 0.875rem): Filter option rows, the Tailwind line, footer source links, reading-list notes.
- **Caption** (400, 0.75rem): Source and date lines, the "not yet tracked" note, the readiness help text.
- **Label** (Geist Mono 400, 0.75rem, 1rem line, 0.04em, uppercase): Every tag, control label, count, nav cell, group legend, ticker item and the skip link.
- **Code** (Geist Mono 400, 0.75rem, 1.625, wrapping): Code blocks and the feature line under card titles (sentence case, not uppercase).

All display, headline and title roles share one treatment: weight 800, width 88%, uppercase, -0.02em tracking. Emphasis inside prose uses weight 600.

### Named Rules
**The Two Voices Rule.** Names are heavy condensed uppercase Archivo; labels are mono uppercase. Prose is the only sentence-case text. A new element picks one of the three; it never mixes a third style in.

**The Ramp Is Closed Rule.** The sizes above are the full ramp. A new surface reuses one of them rather than adding an in-between size.

## Layout

The page is one sheet. The header is a ruled band: a 56px wordmark cell, nav as mono cells (44px tall, full-width equal cells on a second row below 640px, inline from 640px), and a GitHub cell pushed right; under it, a full-width mono ticker strip. Below the header, the gallery runs as a row: the filter rail (288px, right rule, sticky at full viewport height from 1024px; an off-canvas drawer below 1024px) beside a results column.

The results column starts with a ruled results bar (live count, Clear all filters, Sort select) and then the card grid immediately: one column, two from 640px, three from 1280px, four from 1536px. Cells have no gap; each cell draws its own bottom and right rule so rules collapse into a single hairline grid. Inside a cell, content sits on a 20px inset: tag row, title, feature line, then the 260px demo panel, description, the code disclosure, and a bottom zone separated by a full-bleed rule.

Reading pages (About, Reading list) reuse the sheet: a 288px left rail holding a large forest disc and the page title, and a body column of ruled cells divided by hairlines, each padded 40px vertically and 16/24/40px horizontally by breakpoint, with prose capped near 42rem.

Spacing steps by 4px (4, 8, 12, 16), with 20px cell insets, 24px band gutters from 640px and 40px section padding. Every touch target is at least 44px.

## Elevation & Depth

The system is flat. Depth comes from rules and from the paper panel set into the cream sheet, never from shadows. The one blurred shadow in the build is a cream fade on the ticker's pause button, which masks scrolling text behind it; it is a fade, not elevation. The mobile filter drawer is a full-height cream panel with a right rule over a 40% ink scrim.

### Named Rules
**The Set-In Rule.** Panels are set into the sheet with a 1px rule, never lifted off it. No drop shadows, no hover lift, no glow.

## Shapes

Square corners everywhere: cells, tags, chips, buttons, inputs, the demo panel, the code block, the drawer. The single curved form is the solid forest disc, used at three scales as the system's mark: 16px beside the wordmark, 8px between ticker items, and 80 to 144px at the top of reading-page rails. Edges are 1px: warm rule for dividers and passive chips, ink for operable controls, dashed ink for Experimental and dashed pencil for partial browser support. Compound buttons split into rectangles with a vertical rule between label and arrow or chevron.

### Named Rules
**The Only Curve Rule.** Nothing is rounded except the forest disc. A disc is always solid forest and decorative; it is never a button, avatar or badge.

**The Dashed Means Partial Rule.** A dashed edge means "not fully there": Experimental readiness and partial browser support. Do not use dashes decoratively.

## Components

### Buttons
Rectangular, ruled and quiet until touched.
- **Shape:** Square corners (0px), 1px edge.
- **Primary:** Solid forest field with cream mono label, 44px tall, label cell padded 12 to 16px, then a 40px arrow cell divided by a 1px cream rule at 40% opacity. Used for the drawer's "Show N examples" and the empty state's clear action.
- **Outline:** 1px ink edge on cream, mono label, padded 4px 8px (Copy, Replay, back-to-top as a 44px square). Hover fills forest with cream text; 150ms colour transition.
- **Secondary outline:** 44px tall ink-edged rectangle that hovers to tray (Clear search; the mobile Filters trigger, which appends a forest count cell when filters are active).
- **Link action:** Forest mono label, no edge, underline on hover (Clear, Clear all filters, caniuse.com).
- **Focus:** 2px forest outline at 2px offset everywhere; inset where the control fills its cell.

### Chips (tags)
- **Readiness:** Mono label padded 4px 8px. Production ready is solid forest with cream text; Growing support is a 1px forest outline with forest text; Experimental is a 1px dashed ink outline with ink text. The same three shapes appear on cards, in the About legend and inside the readiness filter rows.
- **New:** Solid ink field with cream text.
- **Category:** 1px warm rule edge, pencil text.
- **Browser chips:** 1px warm rule edge with brand icon, name and version; a dashed pencil edge marks partial support.

### Cards / Containers
- **Corner Style:** Square (0px).
- **Background:** Cream sheet; the demo sits in a drawing-paper panel with a warm rule edge, 260px tall and horizontally resizable.
- **Shadow Strategy:** None (see Elevation & Depth).
- **Border:** Bottom and right warm rules only, so adjacent cells share one hairline.
- **Internal Padding:** 20px inset; the footer zone's top rule bleeds to the cell edges.

### Code disclosure
A full-width ink-edged bar reading "View code" with a 44px chevron cell behind a vertical rule. Hover and open states invert to an ink field with cream text; the chevron rotates 180deg when open. Inside, HTML/CSS/JS blocks on tray with a pencil mono label and an outline Copy button each.

### Inputs / Fields
- **Style:** Drawing-paper fill, 1px ink edge, square corners. Search carries a pencil magnifier inset at 12px and 16px text; Sort is a mono select with a custom ink chevron.
- **Focus:** The global 2px forest outline; caret is forest.

### Navigation
- **Header nav:** Mono cells divided by warm rules. Inactive cells are pencil and hover to tray with ink text; the current page is ink with a 2px forest bar along the cell bottom.
- **Filter rail:** Fieldsets divided by rules, each with a mono legend and an optional forest Clear pinned right. Option rows are 44px: a 14px square box (ink edge, or solid forest when selected), the label (semibold when selected) and a pencil mono count. Options that would yield nothing are disabled in pencil; readiness rows render their label as the matching readiness tag.
- **Mobile:** The rail becomes a left drawer (288px, max 85vw) that slides in over 200ms with a focus-trapped close cell and a sticky footer holding Clear all and the primary "Show N examples" button.

### Ticker
A full-width mono strip under the header band: ink uppercase items separated by 8px forest discs, scrolling linearly over 80s. It pauses on hover, on focus within, and from a 44px pause/play cell pinned right behind a warm rule. Reduced motion stops it.

### Sheet rail
On About and Reading list, the left rail holds a forest disc (80px, 96px from 640px, 144px from 1024px) above the rail-size display title, sticky from 1024px.

## Do's and Don'ts

### Do:
- **Do** divide regions with 1px warm rules (border) and let neighbouring cells share one rule.
- **Do** keep every corner square; reserve the circle for the solid forest disc.
- **Do** use forest for every selected, ready, primary or link state, and nothing else.
- **Do** code readiness by shape as well as colour: solid forest, outlined forest, dashed ink.
- **Do** set names in heavy condensed uppercase Archivo (800, wdth 88, -0.02em) and every label in Geist Mono uppercase at 0.75rem with 0.04em tracking.
- **Do** give every standalone control an ink edge or a forest fill and a 44px minimum target.
- **Do** put demos on drawing paper (paper) inside a ruled panel, and let them keep their own blue.

### Don't:
- **Don't** use rounded cards, pill tags or floating cards on a grey canvas.
- **Don't** add drop shadows, hover lift or glow; panels are set in, not raised.
- **Don't** use the demo blue (#2563eb) anywhere in the interface frame.
- **Don't** introduce a second interface hue, including green/amber/red status colours.
- **Don't** use dashed edges except for Experimental readiness and partial browser support.
- **Don't** add type sizes outside the documented ramp.
- **Don't** animate anything beyond the ticker, 150ms colour transitions and the drawer slide.
