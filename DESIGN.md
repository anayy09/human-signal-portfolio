# DESIGN.md — The Observatory Console

## Theme

Dark, always. Scene sentence: *a researcher reading instrument panels in a dark observatory dome at 2am, starlight the only ambient source.* Dark is not an aesthetic default here; the product IS a night sky.

## Color

Strategy: **Committed dark drench** — deep space-navy is the surface; one blue accent carries hierarchy; teal and lavender are semantic, not decorative.

- Surface: `#0A0B0F` (near-black, blue-tinted) → `#0E1520` panels
- Primary / instrument blue: `#5B8DEF` (links, active states, hero accents)
- Clinical teal: `#0D9488` — used ONLY for health/clinical-AI entities
- Lavender: `#C9A0DC` / `#7B68B6` — used ONLY for personality/journey entities
- Gold: `#D4A574` — used ONLY for honors (granted patent, gold medal, featured pub)
- Text: `#E8ECF4` high, `#98A2B8` mid, mono labels may sit lower-contrast when ≥ AA
- Never pure #000/#fff. Section accent tints the WebGL nebula as you scroll.

## Typography

Three deliberate voices (a named system, not a default pairing):

1. **Display — Bricolage Grotesque** (variable: opsz/wght): characterful display grotesk for the hero name and section titles ≥ 2rem. Emphasis inside titles is COLOR or extreme weight contrast (720 vs 260), never italic (the family has none; no synthetic oblique).
2. **UI/body — Space Grotesk** (existing committed identity): instrument-panel UI. Weights 300–700.
3. **Telemetry — Fira Code**: readouts, coordinates, dates, metrics, section indices. Literal register reason: the site is an instrument console.

Chosen with the user after rejecting Bodoni Moda (read as fashion-editorial, not instrument).

Fluid modular scale (ratio ≥ 1.28), `clamp()` on all display sizes. Body max 70ch. Line-height +0.05 on dark.

## Section grammar (named system: "instrument index")

Every section opens with a Fira Code index line: `01 / ORIENTATION` style — index number, tick rule, label. This is deliberate observatory-console grammar, applied consistently, while section *layouts* vary widely (asymmetric intro, spine timeline, bento specimens, ledger rows, full-bleed map).

## Surfaces

Flat instrument panels: `rgba(14,20,32,0.72)` fills, 1px hairline borders `rgba(91,141,239,0.10)`, no drop-shadow soup, no default glassmorphism (backdrop-blur reserved for the fixed nav only). Hover: cursor-tracked radial spotlight on the border/panel, not y-translation.

Bans honored: no side-stripe accent borders, no gradient text, no icon-heading-text card grids, no progress bars for skills, no em dashes in copy.

## Motion

- Ease: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo family). No bounce.
- Scroll is the narrative driver: canvas camera drift + nebula tint keyed to section in view; timeline constellation draws with scroll (`pathLength`); counters count on entry.
- Entrance: one orchestrated stagger per section, 0.5–0.7s, y ≤ 20px.
- `<MotionConfig reducedMotion="user">` global; canvas renders a static frame under reduced motion.

## Iconography & imagery

- react-icons (Fi/Si) at small sizes only; never decorative icon tiles.
- Project screenshots from `public/projects/`; the WebGL sky is the hero imagery.
- OG image: 1200×630 dark starfield with engraved name.
