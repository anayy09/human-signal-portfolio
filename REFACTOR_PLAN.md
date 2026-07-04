# Cosmic Portfolio — Full Refactor Plan

*Prepared July 2026. Source of truth for content: `profile/` (gitignored — never commit, never quote verbatim into public assets beyond what is already public record: publications, patents, roles).*

---

## Part 1 — Analysis: where the current codebase falls short

The May 2026 pass already gave the site a decent skeleton (dark cosmic palette, `// section.label` motif, bento projects, Framer Motion staggers). What remains is a mix of **factual drift, dead weight, platform decay, and a design that repeats one template eight times instead of telling a story**.

### 1.1 Content integrity (highest priority — a research portfolio must be citation-accurate)

| Item | On site today | Reality (per CVs / BibTeX) |
|---|---|---|
| Quantum/HPC paper | Wrong title ("…Cancer Drug Interaction Modeling Using Quantum-Classical Hybrid Algorithms"), wrong journal ("Int. J. of Advanced Science and Innovation"), no DOI | **"High-Performance and Quantum Computing in Cancer Modeling: A Review and Hybrid HPC-Quantum Approach"**, *Int. J. of Advances in Signal and Image Sciences (IJASIS)*, vol. 12, pp. 220–231, Feb 2026, DOI `10.29284/bfq8ev64` |
| Facial recognition paper | Venue given as "IEEE International Conference on Medical Conditions (MEDCOM 2025)" — wrong expansion, no DOI | *2025 Modern Electronics Devices and Intelligent Communication Systems (MEDCOM)*, pp. 715–720, DOI `10.1109/medcom67532.2025.11404934` |
| Stress monitoring paper | "Accepted", ICICV 2026, arXiv DOI | **Published**: *Lecture Notes in Networks and Systems* (Springer), pp. 165–178, DOI `10.1007/978-3-032-14757-8_12` |
| Bio-inspired offloading patent | Indian application, "Published", May 2026 | Also a **granted German utility model DE 20 2026 101 701 U1 (April 2026)** — plus Indian application 202611027418. "Granted" is a much stronger claim than "Published"; lead with it |
| Projects | 6 projects, none newer than Nov 2025 | **WardOps Digital Twin** (Jan 2026 — DES hospital ops twin, LLM copilot, Sankey/heatmap dashboards) is on the research CV and missing entirely |
| `authors` arrays | Empty strings and `"Sinhal, A." ×3` | Use real author lists; bold "Anay Sinhal"; the Scientific Reports paper is **first-author** — say so |
| IIIT Delhi experience | "Optimized algorithms for medical image enhancement" | CV: full-stack research infrastructure (Next.js/Node/PostgreSQL) for ECG & cancer diagnostic models + SHAP attribution tooling + CI/CD |
| Awards | Only Gold Medal appears | Best Innovator Award (MUJ 2025), Runner-Up National Startup Day (AIC-JKLU 2022), JKLU Honor's List — nowhere on site |
| `index.html` | Title/OG say "Software & ML Developer", `og:url` is `https://yourwebsite.com`, `og-image.png` and `logo192.png` referenced but **do not exist**, inline styles use the pre-redesign palette (`#050714`, `#FF1493`) | Full identity + meta rewrite needed |

### 1.2 Repo & dependency hygiene

- **`.env.production` is tracked in git** (EmailJS keys). They're client-exposed keys anyway, but the file should be `git rm --cached`-ed now that `.gitignore` covers `.env.*`.
- **`public/main.tex`** (CV LaTeX source) is tracked and served at `anay.codes/main.tex`. Remove.
- **Dead source (~1,400 lines)**: `sections/Publications.js` (superseded by `Research.js`), `components/TypedText.js`, `components/SocialLinks.js`, `hooks/useGitHubProjects.js`. `App.test.js` still mocks the pre-redesign component tree — it is broken.
- **Unused dependencies**: `@amcharts/amcharts5` + `-fonts` + `-geodata`, `lottie-react`, `axios` (only used by the dead hook), `d3-fetch`, `d3-scale`, `supercluster`, `use-supercluster`. That's 8 removable packages.
- **`src/sections/in.json` is 3.1 MB and statically imported** by `CosmicJourneys.js` → it is compiled into the main JS bundle. This alone dwarfs every other performance issue. Fix: quantize/simplify the India topojson (~100–200 KB is achievable) and `fetch` it from `public/` only when the section scrolls near.
- CRA scaffolding leftovers: `App.css`, `index.css` (dead rules), `logo.svg`, `App.test.js`, `reportWebVitals.js`.

### 1.3 Platform & architecture

- **CRA (`react-scripts` 5) is deprecated and unmaintained.** Migrate to **Vite 6** — near-drop-in for this codebase (rename env vars `REACT_APP_*` → `VITE_*`, move `index.html`, add `@vitejs/plugin-react`). Keeps the React 18 + styled-components + R3F stack intact; buys fast HMR, modern chunking, and `manualChunks` control over the three.js payload.
- **Two competing font pipelines**: `index.html` loads Yatra One (unused), Atomic Age (used once, for the hero name), Space Grotesk, Fira Code; `GlobalStyles.js` *also* `@import`s DM Serif Display + Space Grotesk + Fira Code (render-blocking, late-applying). Consolidate to one self-hosted set (`@fontsource-variable`), preloaded.
- **Hardcoded content in `Hero.js`** (typewriter words, Gainesville coordinates, ORCID URL, stat values `6` and `30`) violates the project's own rule #1 (all content from `personalInfo.js`).
- **Section boilerplate duplicated 8×**: every section re-declares `Container`, `SectionLabel`, `SectionTitle` with identical CSS. Extract shared primitives.
- **4.5 s blocking loader** on every visit, including repeats. The Three canvas mounts only *after* the loader unmounts, so the most jank-prone moment is exactly the reveal.
- **`ShootingStars` leaks**: allocates a new `BufferGeometry` + `LineBasicMaterial` per star *per frame* and removes children without `dispose()` — GC churn and GPU memory growth on long sessions.
- **Reduced-motion is only half-honored**: the global CSS kills CSS animations, but Framer Motion ignores `prefers-reduced-motion` unless wrapped in `<MotionConfig reducedMotion="user">`, and the canvas keeps animating regardless.
- **A11y**: global `button { outline: none }` removes keyboard focus rings; `subtle` (#4A5568) small text fails WCAG AA on the dark background; the background canvas isn't `aria-hidden`.
- **SEO**: no JSON-LD (a `Person` + `ScholarlyArticle` graph is trivially available from `personalInfo.js`), no sitemap, broken OG image, stale title.

### 1.4 Design critique — the gap between "good" and "extraordinary"

1. **One template, eight times.** Every section: same 1140 px container, same mono label, same ~2.2 rem title, same card grid. There is no pacing — no wide moment, no quiet moment, no section that breaks the grid. Cinematic means *rhythm*.
2. **Scroll is inert.** No `useScroll` anywhere. The cosmic background never responds to where you are in the story. The single strongest upgrade available: make the cosmos *react to the journey* (camera drift, hue shifts, constellation reveals keyed to sections).
3. **Typographic identity is muddled.** Three display voices coexist: Atomic Age (hero, loaded but off-brand retro-futurism), DM Serif Display (tokenized, never used), Space Grotesk (everything else). Pick one display voice and commit.
4. **The crown jewel is buried.** A **first-author Scientific Reports (Nature portfolio) paper** renders identically to a regional conference paper — same row, same size. Research is the differentiator of this portfolio; it deserves a featured hierarchy.
5. **"Glassmorphism" is claimed, not practiced** — cards are flat `rgba` fills; no `backdrop-filter` outside the nav. Either do real glass (sparingly) or own the flat-panel "instrument console" look.
6. **Metrics live in prose.** AUROC 0.89, F1 0.81, 11.5 M records, 14.5 ms inference — these are *data* rendered as body text. An instrument-console aesthetic should surface them as telemetry chips.
7. **The timeline ignores its own metaphor.** A site full of constellations renders career history as a generic vertical list. The constellation *is* the timeline.
8. **Micro-interaction vocabulary is one word**: `whileHover={{ y: -2 }}` on everything.

---

## Part 2 — Design direction: "The Observatory Console"

One concept, committed fully: **the portfolio is a research instrument observing a career**. The seeds already exist (`// mission.brief`, coordinates, mono labels). The refactor makes every section a different *instrument panel* of the same observatory, over one continuous, scroll-reactive sky.

**Design tenets**

- **One sky, many instruments.** The Three.js canvas is the continuous element; each section reads as a different console mode (telemetry, star chart, specimen grid, publication ledger, navigation map).
- **Typography**: `DM Serif Display` for display moments only (hero name, section titles ≥ 2.5 rem) — the "engraved brass plate" voice; `Space Grotesk` for UI/body; `Fira Code` strictly for telemetry (labels, coordinates, metrics, dates). **Drop Atomic Age and Yatra One.**
- **Color**: keep the palette, but assign *meaning per section* — hero/systems = primary blue, research/clinical = teal, journeys/personality = lavender/gold. The canvas nebula tint follows.
- **Motion**: scroll-driven reveals (draw, unmask, count) over hover gimmicks; every animation states something ("this datum just arrived"). `MotionConfig reducedMotion="user"` global.
- **Density over decoration**: telemetry chips, index numbers (`01–08`), rules and ticks — the precision aesthetic of a lab, not SaaS whitespace.

**Section-by-section**

| # | Section | Move |
|---|---|---|
| 01 | **Hero** | Keep bottom-anchored giant name (switch to DM Serif Display). Add a top telemetry strip: UTC clock (live), `29.6516°N 82.3248°W`, status chip `● OPEN TO FULL-TIME · DEC 2026`. Stats become instrument readouts with count-up + unit ticks. Magnetic primary button. |
| 02 | **About / Research Focus** | Break the grid once: full-bleed intro line in display serif, then numbered pillars `01/02/03` in an asymmetric 5-4-3 column rhythm. |
| 03 | **Timeline → Constellation Chart** | Education + experience merged on one vertical spine rendered as an SVG constellation: nodes = stars (size by significance), connecting line draws with scroll (`pathLength`), year ticks in Fira Code. Cards dock left/right of the spine. |
| 04 | **Projects** | Keep bento, add: **metric chips** (AUROC 0.89 · 4 h earlier detection), cursor-tracking spotlight border on hover, image zoom on featured card, **add WardOps Digital Twin**, `health` cards tinted teal. |
| 05 | **Skills** | Keep 3 panels but add context per skill (`production` / `research` / `daily`) as right-aligned mono tags — information, not logo soup. |
| 06 | **Research** | **Featured card** for the Scientific Reports paper (first-author badge, "Nature Portfolio" chip, one-line contribution). Below: compact ledger rows. Patent cards: `GRANTED · DE 20 2026 101 701 U1` badge in gold for the utility model. Filter counts (`Clinical AI · 5`). |
| 07 | **Cosmic Journeys** | Keep as the personality valve. Lazy-load maps; tint lavender; add flight-log framing (`31 waypoints · 3 countries`). |
| 08 | **Contact** | Terminal-flavored form (`> initiate.contact`), availability status line, generous whitespace as the "quiet" ending. Footer: one line + `[[view-source]]` link to the repo. |
| — | **Navigation** | Scroll-spy with `01–08` index numbers; active section shows its index in the logo (`anay.codes /03`). |
| — | **Loader** | ≤ 1.4 s, skipped entirely on repeat visits (`sessionStorage`), orb visually hands off to the moon position so the reveal feels continuous. Canvas mounts *behind* the loader so WebGL is warm at reveal. |

---

## Part 3 — Roadmap

Each phase is shippable; order matters (hygiene → platform → system → content → design → polish).

### Phase 0 — Hygiene (½ day)
1. `git rm --cached .env.production public/main.tex`; rotate EmailJS template if desired.
2. Delete: `Publications.js`, `TypedText.js`, `SocialLinks.js`, `useGitHubProjects.js`, `App.css`, `index.css`, `logo.svg`, `App.test.js`, `reportWebVitals.js`, `setupTests.js`.
3. `npm rm @amcharts/amcharts5 @amcharts/amcharts5-fonts @amcharts/amcharts5-geodata lottie-react axios d3-fetch d3-scale supercluster use-supercluster web-vitals`.
4. Move `topo.json` → `public/maps/world.json`; simplify `in.json` (mapshaper, ~quantile 1e4, target < 200 KB) → `public/maps/india.json`; switch `CosmicJourneys` to lazy `fetch`.

### Phase 1 — Platform (1 day)
1. **CRA → Vite 6**: `index.html` to root, `@vitejs/plugin-react`, env rename `REACT_APP_*` → `VITE_*` (update `personalInfo.js` and Vercel/host settings), `manualChunks` splitting `three`/`@react-three/*` into an async chunk.
2. Self-host fonts (`@fontsource/dm-serif-display`, `@fontsource-variable/space-grotesk`, `@fontsource-variable/fira-code`); preload the two critical woff2; delete both old font pipelines.
3. `React.lazy` + `Suspense` for `CosmicJourneys` and `CVViewer`.

### Phase 2 — Design system (1 day)
1. Extend `theme.js`: fluid type scale (`--step--1 … --step-5` via clamp), per-section accent map, z-index scale, `focusRing` token.
2. Create `src/components/ui/Section.js` exporting `Section`, `Container`, `SectionLabel`, `SectionTitle`, `SectionIndex` — delete the 8 duplicates.
3. `<MotionConfig reducedMotion="user">` in `App.js`; restore focus-visible rings globally; `aria-hidden` on the canvas container; bump `subtle` usage to pass AA where text is < 14 px.

### Phase 3 — Content truth pass (½ day)
Apply every correction in §1.1 to `personalInfo.js` (single file): fix the three publication records + DOIs, patent grant status + DE number, real author lists with first-author flag, add WardOps, fix IIIT Delhi copy, add awards array, remove `apis.hashnode`, move hero telemetry/typewriter/stats into config. Rewrite `index.html` meta + JSON-LD + generate a real `og-image.png` (1200×630, hero-name-on-starfield).

### Phase 4 — Section redesigns (3–4 days, one commit per section)
Hero → About → Timeline (constellation spine) → Projects (spotlight + metrics + WardOps) → Skills → Research (featured pub) → Contact/Footer → Navigation/Loader. Patterns in Part 4.

### Phase 5 — Background engine (1–2 days)
1. Fix `ShootingStars` (pre-allocated buffers, §4.3).
2. Scroll bridge: section-in-view → canvas tint/camera drift (§4.2).
3. `frameloop="demand"`-style throttling when tab hidden (`document.visibilitychange`), static frame under `prefers-reduced-motion`.

### Phase 6 — Audit & ship (½ day)
Lighthouse pass (targets: LCP < 2.0 s, CLS < 0.02, main bundle < 250 KB gz with three.js async), keyboard walkthrough, screen-reader labels, 360 px / 768 px / 1440 px sweeps, cross-browser (`backdrop-filter` fallbacks). Sitemap + robots.

---

## Part 4 — Key implementation patterns

### 4.1 Shared section primitives (kills 8× duplication)

```jsx
// src/components/ui/Section.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Section = styled.section`
  padding: clamp(4rem, 10vh, 7rem) 0;
  position: relative;
`;

export const Container = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 2rem);
`;

export const SectionLabel = styled(motion.p)`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${p => p.theme.colors[p.$accent] ?? p.theme.colors.primary};
  margin-bottom: 0.875rem;

  &::before {
    content: '${p => p.$index} / ';   /* "03 / " observatory index */
    color: ${p => p.theme.colors.subtle};
  }
`;

export const SectionTitle = styled(motion.h2)`
  font-family: ${p => p.theme.fonts.display};
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 400;                    /* serif carries the weight */
  letter-spacing: -0.01em;
`;
```

### 4.2 Scroll-reactive cosmos (the headline upgrade)

A tiny bridge object mutated from React, read inside `useFrame` — no re-renders, no context churn:

```jsx
// src/three/scrollBridge.js
export const scrollBridge = { progress: 0, accent: '#5B8DEF' };

// App.js — one listener
const { scrollYProgress } = useScroll();
useMotionValueEvent(scrollYProgress, 'change', v => { scrollBridge.progress = v; });

// Each section registers its accent when it enters view (IntersectionObserver),
// e.g. Research sets scrollBridge.accent = theme.colors.accentTeal.
```

```jsx
// Inside the canvas — camera drift + nebula tint follow the journey
function ScrollRig() {
  const nebulaColor = useRef(new THREE.Color('#5B8DEF'));
  useFrame(({ camera, scene }) => {
    const p = scrollBridge.progress;
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -p * 6, 2, 1 / 60);
    camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, p * 0.04, 2, 1 / 60);
    nebulaColor.current.lerp(new THREE.Color(scrollBridge.accent), 0.02);
    // apply nebulaColor to a large soft sprite / fog for the section tint
  });
  return null;
}
```

### 4.3 Leak-free shooting stars (pre-allocated, no per-frame allocation)

```jsx
function ShootingStar({ trailLength = 14 }) {
  const line = useRef();
  const positions = useMemo(() => new Float32Array(trailLength * 3), [trailLength]);
  const state = useRef({ pos: new THREE.Vector3(), vel: new THREE.Vector3(), active: false, nextAt: 8 });

  useFrame(({ clock }) => {
    // ...activate / integrate state.current.pos as before...
    // shift the ring buffer instead of rebuilding geometry:
    positions.copyWithin(3, 0, (trailLength - 1) * 3);
    positions.set([state.current.pos.x, state.current.pos.y, state.current.pos.z], 0);
    line.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={line}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial transparent opacity={0.55} blending={THREE.AdditiveBlending} />
    </line>
  );
}
```

### 4.4 Constellation timeline spine (scroll-drawn)

```jsx
const { scrollYProgress } = useScroll({ target: spineRef, offset: ['start 0.8', 'end 0.4'] });
const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

<svg viewBox="0 0 2 1000" aria-hidden="true">
  <motion.path d="M1 0 V1000" stroke="url(#starGradient)" strokeWidth="1"
               style={{ pathLength }} />
</svg>
// Each entry node: a 4-point "star" that scales in when its card enters view,
// with a Fira Code year tick — the career literally draws itself as a constellation.
```

### 4.5 Spotlight card hover (cursor-tracked border glow — replaces the universal `y: -2`)

```jsx
const Card = styled(motion.div)`
  position: relative;
  background: rgba(14, 20, 32, 0.72);
  border: 1px solid rgba(91, 141, 239, 0.1);
  &::before {
    content: '';
    position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(320px circle at var(--mx) var(--my),
                rgba(91, 141, 239, 0.14), transparent 65%);
    opacity: 0; transition: opacity 0.3s;
    pointer-events: none;
  }
  &:hover::before { opacity: 1; }
`;
// onMouseMove: e.currentTarget.style.setProperty('--mx', `${e.nativeEvent.offsetX}px`) etc.
```

### 4.6 Telemetry metric chips (surface the numbers as data)

```jsx
// personalInfo: metrics: [{ label: 'AUROC', value: '0.89' }, { label: 'detection lead', value: '4h' }]
const Metric = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.68rem;
  color: ${p => p.theme.colors.accentTeal};
  &::before { content: '${p => p.$label} '; color: ${p => p.theme.colors.subtle};
              text-transform: uppercase; letter-spacing: 0.08em; }
`;
```

### 4.7 Session-aware loader

```jsx
const [loading, setLoading] = useState(() => !sessionStorage.getItem('visited'));
useEffect(() => {
  if (!loading) return;
  const t = setTimeout(() => { sessionStorage.setItem('visited', '1'); setLoading(false); }, 1400);
  return () => clearTimeout(t);
}, [loading]);
// Render <CosmicBackground /> *underneath* the loader so WebGL compiles during it.
```

### 4.8 JSON-LD (generated from personalInfo, injected in index.html)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Anay Sinhal",
  "url": "https://www.anay.codes",
  "jobTitle": "Clinical AI Researcher & Software Engineer",
  "affiliation": { "@type": "Organization", "name": "University of Florida — Intelligent Clinical Care Center (IC3)" },
  "alumniOf": ["University of Florida", "JK Lakshmipat University"],
  "identifier": { "@type": "PropertyValue", "propertyID": "ORCID", "value": "0009-0008-8328-2336" },
  "sameAs": ["https://github.com/anayy09", "https://linkedin.com/in/anaysinhal", "https://orcid.org/0009-0008-8328-2336"]
}
```

### 4.9 Vite chunking (three.js out of the critical path)

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          maps: ['react-simple-maps'],
        },
      },
    },
  },
});
```

---

## Part 5 — How "Fable 5" fits

Fable 5 is the model doing this work, not a runtime library — there is nothing to `npm install`. Leveraging it means the *workflow*: full-codebase analysis like this document, design-system-grade section rewrites executed one commit at a time, live browser iteration on each section (Claude-in-Chrome), and `/code-review` + `/impeccable` passes before shipping. The stack stays React 18 + styled-components + R3F + Framer Motion, upgraded to Vite.

## Decisions needed from Anay

1. **Vite migration** — recommended, but it supersedes the old "CRA" note in the project docs. (Next.js remains explicitly out of scope.)
2. **Hero display face** — recommendation: retire Atomic Age in favor of DM Serif Display for the name; say the word if you're attached to Atomic Age.
3. Loader duration ≤ 1.4 s + skip-on-repeat — confirm you're okay losing the 4.5 s intro.
