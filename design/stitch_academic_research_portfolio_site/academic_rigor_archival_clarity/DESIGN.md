---
name: Academic Rigor & Archival Clarity
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#43474d'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#74777d'
  outline-variant: '#c3c6cd'
  surface-tint: '#49607a'
  primary: '#0a253c'
  on-primary: '#ffffff'
  primary-container: '#233b53'
  on-primary-container: '#8da5c2'
  inverse-primary: '#b0c9e6'
  secondary: '#4f6072'
  on-secondary: '#ffffff'
  secondary-container: '#d2e4fa'
  on-secondary-container: '#556678'
  tertiary: '#19252f'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e3b45'
  on-tertiary-container: '#98a5b1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e4ff'
  primary-fixed-dim: '#b0c9e6'
  on-primary-fixed: '#011d34'
  on-primary-fixed-variant: '#314961'
  secondary-fixed: '#d2e4fa'
  secondary-fixed-dim: '#b7c8dd'
  on-secondary-fixed: '#0b1d2c'
  on-secondary-fixed-variant: '#374859'
  tertiary-fixed: '#d7e4f1'
  tertiary-fixed-dim: '#bbc8d5'
  on-tertiary-fixed: '#101d26'
  on-tertiary-fixed-variant: '#3c4853'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 2.75rem
    fontWeight: '400'
    lineHeight: 3.25rem
    letterSpacing: -0.015em
  headline-xl-mobile:
    fontFamily: EB Garamond
    fontSize: 2.125rem
    fontWeight: '400'
    lineHeight: 2.5rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 2rem
    fontWeight: '400'
    lineHeight: 2.5rem
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 1.625rem
    fontWeight: '400'
    lineHeight: 2.125rem
  headline-md:
    fontFamily: EB Garamond
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Source Sans 3
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style
This design system embodies the intellectual seriousness, poise, and longevity of distinguished faculty archives and classical scholarly journals. Built for academic researchers and AI research scientists, the visual language avoids Silicon Valley tropes, hyper-stylized micro-interactions, bright gradients, and performative motion. 

The aesthetic is grounded in archival restraint, humanist precision, and typographic gravity. Whitespace is structural and generous, creating an atmosphere of quiet focus suited for long-form papers, reading lists, peer-reviewed indices, and technical essays. The emotional tone evokes permanence, empirical rigor, and unpretentious expertise.

## Colors
The palette utilizes low-fatigue, warm-substrate tones drawn from fine book stock and traditional letterpress printing:

- **Canvas & Backgrounds:** The base canvas is warm off-white (`#FAFAF7`). Surface levels, such as paper cards or highlighted reading areas, utilize clean paper white (`#FFFFFF`) or a soft foundation tint (`#F5F5F0`).
- **Typography & Content:** The primary text tone is deep editorial charcoal (`#242424`), delivering superior legibility without the harshness of pure `#000000`. Secondary metadata, abstracts, and timestamps use muted slate-gray (`#666666`).
- **Accents:** The primary accent is a deep academic navy (`#233B53`), applied to primary actions, prominent affiliations, active pagination, and anchored titles. A secondary tint of slate-blue (`#EAEFF5`) serves as an understated highlight for badges, active navigation filters, and selected citation blocks.
- **Rules & Dividers:** Structure relies on hairline borders in warm stone gray (`#E5E5E0`).

## Typography
Typographic discipline underpins the entire interface, relying on a classical pairing:

- **Headlines (EB Garamond):** Used for site titling, section headers, paper titles, and essay headings. The proportions echo classical book typesets, featuring natural italics for journal names, book volumes, and honorary titles.
- **Body & Continuous Reading (Source Sans 3):** An open, highly legible grotesque sans-serif that ensures effortless scanning for abstracts, personal statements, bios, and bibliography metadata.
- **Data, Metadata & Code (JetBrains Mono):** Reserved for publication years, BibTeX citations, DOI strings, arXiv taxonomy identifiers, and source links.

## Layout & Spacing
The layout adheres to a fixed-width, single-column reading column with a maximum width of `1000px`, centered on the screen with substantial horizontal and vertical margins.

- **Breakpoints:** Mobile (`< 768px`), Tablet (`768px - 1024px`), and Desktop (`> 1024px`).
- **Desktop Architecture:** The content shifts between a dedicated editorial header (researcher identity, appointment, affiliations, navigation) and an asynchronous 2-column distribution for specific sections (e.g., left column for publication date / category badge, right column for paper abstract, co-authors, and resource anchors).
- **Mobile Reflow:** Metadata columns collapse cleanly above titles, preserving vertical flow and natural reading rhythm.
- **Vertical Rhythm:** Main content sections are divided by generous `space-xl` gaps and punctuated by delicate 1px rules.

## Elevation & Depth
Depth is strictly flat and editorial. Visual layer separation is achieved through tonal contrast and rule lines rather than simulated physical light or drop shadows.

- **Elevation Philosophy:** Zero elevated box-shadows. No blurred drop shadows, ambient glow, or translucent frosted surfaces.
- **Layering & Borders:** Content containers and bibtex callouts use subtle `#FFFFFF` or `#F5F5F0` background planes bounded by `1px solid #E5E5E0`.
- **Section Demarcation:** Horizontal rules (`<hr>`) are rendered as `border: 0; border-top: 1px solid #E5E5E0;` with vertical margins of `2.5rem`.
- **Interactive Planes:** Menus and dropdowns (such as citation formats) use an opaque `#FFFFFF` background with an assertive `1px solid #233B53` or `#E5E5E0` outline.

## Shapes
To preserve an academic, document-centric aesthetic, geometry remains crisp, architectural, and restrained:

- Standard controls, citation boxes, and code wrappers utilize slight corner softing (`0.25rem` / `4px`), preventing harsh pixel artifacts without appearing playful or consumer-oriented.
- Badges and taxonomy chips use minimal rounding (`0.25rem`), explicitly avoiding rounded pill forms.
- Buttons, input controls, and interactive anchors preserve this square-soft profile throughout.

## Components

### Buttons & Anchor Links
- **Primary Links:** Inline links within text use `#233B53` with a standard `1px solid #233B53` underline offset by `3px`. On hover, the underline thickens or deepens in contrast.
- **Action Buttons (e.g., "Download CV", "Contact"):** Styled as refined, low-profile elements with a transparent background, `1px solid #233B53` border, text in `#233B53`, and `space-sm` vertical by `space-md` horizontal padding. On hover, invert subtly to `#233B53` background with `#FAFAF7` text.
- **Secondary Action Anchors (e.g., "[PDF]", "[Code]", "[BibTeX]"):** Rendered using `label-md` in JetBrains Mono. Set in brackets or boxed minimal tags with `#EAEFF5` background and `#233B53` text.

### Publication & Research Cards
- Unbordered list rows or lightly bordered paper cards (`1px solid #E5E5E0` on `#FFFFFF`).
- **Structure:** Title in `EB Garamond` (`headline-sm`), author list below with the portfolio owner bolded (`#242424`), journal/conference venue set in *italics* (`#666666`), and citation buttons aligned at the bottom.

### Chips & Taxonomies
- Micro-badges for research areas (e.g., `ML Interpretability`, `NLP`, `Representation Theory`).
- Set in `label-sm` font, `#233B53` foreground, and `#EAEFF5` background, with `2px 6px` padding and a `2px` radius.

### Citation & BibTeX Blocks
- Enclosed inside collapsible `<details>` modules.
- Preformatted code areas use `#F5F5F0` background, `1px solid #E5E5E0`, padding of `space-md`, and `JetBrains Mono` font at `0.8125rem` with a subtle copy button anchored top-right.

### Form Inputs & Search Filters
- Simple, unadorned borders (`1px solid #E5E5E0`). Focus state transitions the border to `#233B53` with no outer glow.
- Background remains crisp `#FFFFFF` against the `#FAFAF7` base.