import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import theme from '../../config/theme';
import { setSectionAccent } from '../../three/scrollBridge';

/*
 * Observatory section grammar ("instrument index"):
 *
 *   02 / ORIENTATION ─────────────
 *   Research Focus          <- Bodoni Moda display
 *
 * One deliberate, consistent opening line per panel; layouts below it vary.
 */

export const Container = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 2rem);
`;

const SectionRoot = styled.section`
  padding: ${p => p.theme.spacing.section} 0;
  position: relative;
`;

/* Registers the section's accent with the WebGL nebula as it enters view */
export const Section = ({ id, accent, children, ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const color = accent || theme.sectionAccents[id] || theme.colors.primary;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSectionAccent(color);
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id, accent]);

  return (
    <SectionRoot id={id} ref={ref} {...rest}>
      {children}
    </SectionRoot>
  );
};

const IndexLine = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.1rem;

  span.idx {
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.label};
    letter-spacing: 0.22em;
    color: ${p => p.$accent || p.theme.colors.primary};
  }

  span.name {
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.label};
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${p => p.theme.colors.subtle};
  }

  &::after {
    content: '';
    flex: 0 1 180px;
    height: 1px;
    background: linear-gradient(90deg, ${p => p.$accent || p.theme.colors.primary}33, transparent);
  }
`;

export const SectionTitle = styled(motion.h2)`
  font-family: ${p => p.theme.fonts.display};
  font-size: ${p => p.theme.type.display};
  font-weight: 640;
  font-variation-settings: 'opsz' 40;
  letter-spacing: -0.025em;
  line-height: 1.06;
  color: ${p => p.theme.colors.light};

  em {
    font-style: normal;
    color: ${p => p.$accent || p.theme.colors.primary};
  }
`;

export const SectionIntro = styled(motion.p)`
  font-size: ${p => p.theme.type.small};
  color: ${p => p.theme.colors.muted};
  max-width: 56ch;
  margin-top: 0.875rem;
`;

export const revealVariants = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: theme.motion.ease },
    },
  },
};

export const SectionHeader = ({ index, name, title, accent, intro }) => (
  <motion.header
    variants={revealVariants.container}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
  >
    <IndexLine variants={revealVariants.item} $accent={accent}>
      <span className="idx">{index}</span>
      <span className="name">/ {name}</span>
    </IndexLine>
    <SectionTitle variants={revealVariants.item} $accent={accent}>
      {title}
    </SectionTitle>
    {intro ? (
      <SectionIntro variants={revealVariants.item}>{intro}</SectionIntro>
    ) : null}
  </motion.header>
);

/* Cursor-tracking spotlight panel: the hover vocabulary of the console */
export const SpotlightPanel = styled(motion.div)`
  position: relative;
  background: ${p => p.theme.colors.surface};
  border: 1px solid ${p => p.theme.colors.border};
  border-radius: ${p => p.theme.radius.lg};
  transition: border-color 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(
      340px circle at var(--mx, 50%) var(--my, 50%),
      ${p => p.$spot || 'rgba(91, 141, 239, 0.10)'},
      transparent 62%
    );
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: ${p => p.$spotBorder || p.theme.colors.borderBright};
  }

  &:hover::before {
    opacity: 1;
  }
`;

export const trackSpotlight = e => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};
