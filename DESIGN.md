# Human Signal · Design system

## Direction

An immersive MedTech research story for Anay Sinhal. The visual metaphor is a research instrument finding human meaning in complex signals. This replaces the previous observatory design.

The source inspiration is methodological: privacy-preserving learning, physiological signals, foundation-model adaptation, and high-performance computation. Do not copy unpublished manuscripts, results, patient data, or private worklogs into the product.

## Narrative

1. The spark: human-centered intelligence and the researcher behind it.
2. The experiments: working software and explorable project studies.
3. The evidence: research themes, publication records, and inventions.
4. The evolution: selectable professional and academic milestones.
5. Expeditions: an interactive atlas and Exploration Log using the same chapter typography, cyan accents, panel surfaces, and controls.
6. What comes next: a direct invitation to collaborate.

A reader may scroll through the story or navigate directly. Never hijack wheel input, force an intro sequence, add audio without consent, or delay access to the CV.

## Visual language

- Clinical ink: #070c10.
- Instrument surface: #0b1319.
- Human signal: #53e3d5.
- Secondary signals: emerald and muted laser blue.
- Reading text: #e8eeef; secondary text: #91a2ad.
- Fine borders, restrained surface gradients, sparse glass telemetry.
- Display: locally served Bricolage Grotesque.
- Interface: locally served Space Grotesk.
- Coordinates and metadata: locally served Fira Code.

The brain sculpture and project diagrams are original procedural artwork. Their labels distinguish them from real clinical measurements. Medical signals are an aesthetic and conceptual thread, not a claim of clinical validation.

## Interaction

Canvas presents three distinct geometries: intelligence, physiological signals, and distributed systems. Dragging rotates the structure; playback and speed control simulation time. The sticky Research Story has its own visual vocabulary: a continuous signal surface, layered latent contours, and a volumetric compute lattice. These independent Canvas studies crossfade with natural scroll; they do not reuse the hero artwork. Rendering frequency and pixel ratio are bounded. Pause, offscreen detection, hidden-tab detection, stop ongoing rendering. All three artwork sections start playing by default and expose pause controls. Reduced-motion preferences continue to simplify layout transitions without disabling artifact playback. Framer Motion provides small, non-blocking entrances and milestone changes. Native HTML controls provide keyboard behavior.

Project studies use native dialogs with focus trapping, Escape dismissal, and focus restoration. Publication and patent disclosures use native details elements. Filters and research lenses expose pressed states.

## Layout

The hero combines a typographic introduction and neural artwork. Subsequent chapters vary between a short mission statement, project grid, research instrument, publication ledger, selectable timeline, unified exploration atlas, and conversation panel. The atlas and log share one bordered surface; selecting a place links its marker, entry, and coordinate readout. The globe fits the narrower viewport dimension and loads only near the section. On small screens, the neural artwork follows the headline and career nodes become a horizontally scrollable selection strip.

Maintain a single content source in personalInfo.js. Put presentation copy in story.js. Keep decorative measurement labels subordinate to actual career facts.
