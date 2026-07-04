// The Observatory Console — design tokens.
// Voice: engraved, nocturnal, exacting. See DESIGN.md.

const theme = {
  colors: {
    // Instrument blue: hierarchy, links, active states
    primary: '#5B8DEF',
    primaryMuted: '#3A5A8F',
    // Semantic accents. Teal = clinical entities only. Lavender = personality
    // entities only. Gold = honors only (granted patent, medal, featured pub).
    secondary: '#7B68B6',
    accent: '#C9A0DC',
    accentWarm: '#D4A574',
    accentTeal: '#14A89A',

    // Surfaces
    dark: '#0A0B0F',
    darkBlue: '#0E1520',
    nebulaDark: '#130B20',
    surface: 'rgba(14, 20, 32, 0.72)',
    surfaceAlt: 'rgba(20, 28, 44, 0.65)',
    surfaceDeep: 'rgba(8, 12, 20, 0.92)',

    // Hairlines
    border: 'rgba(91, 141, 239, 0.10)',
    borderBright: 'rgba(91, 141, 239, 0.30)',
    borderTeal: 'rgba(20, 168, 154, 0.25)',
    borderGold: 'rgba(212, 165, 116, 0.30)',

    // Text (AA-checked on #0A0B0F)
    light: '#E8ECF4',
    muted: '#98A2B8',
    subtle: '#6B7690',
    faint: '#454E63', // decorative only, never running text

    nebula: 'rgba(91, 141, 239, 0.08)',
    success: '#48BB78',
    warning: '#E6B450',
    error: '#DC5A5A',
  },

  // Per-section accent, read by the WebGL nebula as you scroll
  sectionAccents: {
    home: '#5B8DEF',
    about: '#5B8DEF',
    timeline: '#7B68B6',
    projects: '#5B8DEF',
    skills: '#3A5A8F',
    research: '#14A89A',
    journeys: '#C9A0DC',
    contact: '#D4A574',
  },

  gradients: {
    cosmic: 'linear-gradient(135deg, #0A0B0F 0%, #0E1520 50%, #111B2E 100%)',
    deep: 'linear-gradient(135deg, #130B20 0%, #0E1520 100%)',
    nebulaSubtle:
      'linear-gradient(180deg, rgba(91, 141, 239, 0.06) 0%, rgba(123, 104, 182, 0.04) 50%, transparent 100%)',
  },

  fonts: {
    display: "'Bricolage Grotesque Variable', 'Bricolage Grotesque', 'Space Grotesk Variable', system-ui, sans-serif",
    main: "'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif",
    heading: "'Space Grotesk Variable', 'Space Grotesk', system-ui, sans-serif",
    code: "'Fira Code Variable', 'Fira Code', ui-monospace, monospace",
  },

  // Fluid modular scale, ratio ~1.3
  type: {
    hero: 'clamp(4rem, 11vw, 9rem)',
    display: 'clamp(2.2rem, 4.5vw, 3.4rem)',
    title: 'clamp(1.6rem, 3vw, 2.4rem)',
    lead: 'clamp(1.05rem, 1.8vw, 1.3rem)',
    body: '0.9375rem',
    small: '0.84rem',
    label: '0.7rem',
    tick: '0.62rem',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    tabletL: '900px',
    laptop: '1024px',
    desktop: '1200px',
    wide: '1440px',
  },

  transitions: {
    standard: '0.35s cubic-bezier(0.25, 1, 0.5, 1)',
    slow: '0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    fast: '0.2s ease-out',
  },

  easing: {
    outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },

  motion: {
    // Shared Framer variants vocabulary
    ease: [0.16, 1, 0.3, 1],
    duration: 0.65,
  },

  shadows: {
    small: '0 2px 8px rgba(0, 0, 0, 0.12)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.14)',
    large: '0 8px 32px rgba(0, 0, 0, 0.18)',
    card: '0 4px 24px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.15)',
    glow: '0 0 24px rgba(91, 141, 239, 0.18)',
    glowTeal: '0 0 24px rgba(20, 168, 154, 0.22)',
    focusRing: '0 0 0 2px #0A0B0F, 0 0 0 4px rgba(91, 141, 239, 0.65)',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    mdSm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    section: 'clamp(4.5rem, 12vh, 8rem)',
  },

  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '20px',
    pill: '9999px',
  },
};

export default theme;
