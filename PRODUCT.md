# PRODUCT.md — Cosmic Portfolio (anay.codes)

register: brand

## Product purpose

Personal portfolio of **Anay Sinhal**: clinical AI researcher and software engineer (MS CS, University of Florida; Graduate Student Assistant at UF Intelligent Clinical Care Center / PRISMAp Lab). The site's job is to make a recruiter, PI, or hiring manager think "this person does serious research *and* ships serious software" within one scroll, and to be memorable enough to revisit.

## Users

- Recruiters and hiring managers (full-time roles from Dec 2026): skim in 60 seconds, need credibility signals fast (Scientific Reports first-author paper, granted patent, IC3 lab work).
- Research PIs and collaborators: check publications, methods vocabulary, ORCID.
- Peers and the curious: the site itself is the proof of frontend craft.

## Brand voice

Three words: **engraved, nocturnal, exacting.**

The site is "The Observatory Console": a research instrument observing a career. One continuous WebGL night sky; each section is a different instrument panel of the same observatory (telemetry, star chart, specimen grid, publication ledger, navigation map). Cinematic pacing, research-lab information density. Metrics are data, not prose.

## Anti-references (what this must NOT look like)

- Generic SaaS landing page: cream whitespace, icon-title-text card grids, gradient text.
- Template developer portfolio: skill progress bars, logo walls, "passionate developer" copy.
- Editorial-magazine affectation: italic display serif + drop caps + broadsheet rules (the 2026 default).
- Neon cyberpunk / synthwave space: the sky here is a quiet, precise instrument reading, not a rave.

## Strategic principles

1. The cosmic canvas is CORE identity, never removed; it must *react to scroll* rather than idle.
2. All content flows from `src/config/personalInfo.js`; components never hardcode facts.
3. Research credibility leads: the Scientific Reports paper and granted German utility model get featured treatment.
4. Purposeful motion only; honors `prefers-reduced-motion` end to end (Framer + canvas).
5. Fast: three.js code-split, maps lazy-loaded, LCP < 2s.
