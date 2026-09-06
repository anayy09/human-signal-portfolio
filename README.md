# Human Signal · Anay Sinhal’s MedTech portfolio

An original MedTech portfolio that turns a research career into six connected chapters: the spark, the experiments, the evidence, the evolution, expeditions, and what comes next.

Built with React, Tailwind CSS 4, Framer Motion, procedural Canvas scenes, and a lazy-loaded Three.js exploration globe. The interface is inspired by clinical signals, privacy-preserving learning, medical imaging, and high-performance computing. All diagrams are conceptual artwork, not patient data or live clinical readouts.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Vite serves the portfolio at http://localhost:5173. Build the static production output with `npm run build`; preview it with `npm run preview`. Vercel configuration preserves direct access to `/cv` and other client routes.

## Experience

- Three distinct, morphing simulations: a rotating neural sculpture, flowing physiological signals, and a distributed computing network. Playback and speed control the actual simulation clock.
- Chapter navigation that tracks the reader, with a compact mobile menu.
- Seven filterable project studies, custom diagrams, source links, and native modal dialogs with focus management.
- Three interactive research lenses, all eight publication records, and expandable patent details.
- Selectable experience and education milestones, a technical toolkit, and awards.
- A sticky research story with three dedicated motion studies: a flowing signal surface, scanning latent contours, and an isometric compute lattice. The artwork crossfades as the reader moves between chapters.
- The restored Exploration Log: career milestones and selected travel destinations, globe rotation, and animated route replay, using the shared clinical design system.
- EmailJS contact form with validation, loading, success, and recoverable failure states; direct email fallback when unconfigured.
- Dedicated CV preview, PDF download, and browser fallback.

The artwork stops scheduling frames when paused, outside the viewport, or in a hidden tab. The hero, Research Story, and globe start playing automatically, including when the device requests reduced motion. Each has an explicit pause control; layout transitions still respect reduced motion. Pixel density and drawing frequency are bounded. The globe, CV, study dialog, and email client load on demand. Fonts are served locally.

## Content and styling

- `src/config/personalInfo.js`: existing career facts, projects, publications, patents, links, and EmailJS configuration.
- `src/config/story.js`: original story copy, selected project order, and research lenses.
- `src/styles/story.css`: design tokens, component styles, responsive layouts, and Tailwind theme.
- `src/styles/immersive.css`: interactive hero, scrolling narrative, and integrated Exploration Log.
- `src/components/NeuralScene.jsx`: three procedural hero simulations.
- `src/components/ResearchArt.jsx`: independent signal-field, latent-atlas, and compute-fabric studies for the Research Story.
- `src/three/Globe.jsx`: responsive 3D atlas with place selection and route playback.
- `src/components/ProjectArt.jsx`: original project diagrams.
- `src/sections/`: the story chapters.

Research folders were consulted for thematic inspiration. Their private contents and unpublished results are not bundled into the site. The portfolio retains its existing public career content. The social-sharing image is preserved.

## Contact configuration

Copy `.env.example` to `.env.local` and populate:

```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

The EmailJS template must accept `name`, `email`, `subject`, and `message`. Configure its recipient in EmailJS. These are browser-facing integration identifiers; never put a private service credential in a Vite variable. If configuration is absent, the UI offers a direct email link instead of a broken form.

## Verification

```sh
npm test
npm run build
npm run format:check
```

Playwright uses installed Microsoft Edge on Windows and Chromium elsewhere. On non-Windows systems, run `npx playwright install chromium` first. Set `PLAYWRIGHT_CHANNEL` to override the browser channel.

Tests cover chapter tracking, project filtering, modal keyboard behavior, research and patent disclosure, career selection, contact validation and mocked delivery outcomes, CV routing, responsive overflow, normal playback, exact pause/resume, distinct scene geometry, route interactions, reduced motion, and automated WCAG A/AA checks. Email delivery tests intercept the network; they never send real email. Traces and screenshots go to `test-results/`.

Formatting: `npm run format`.

## Deployment

`npm run build` writes `dist/`. Deploy that directory through the existing Vercel project. For another static host, route unknown paths back to `index.html`. Supply EmailJS environment variables before building if the form is desired.

The development preview does not publish changes to the live website.
