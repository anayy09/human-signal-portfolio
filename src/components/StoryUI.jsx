import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function Arrow({ diagonal = false, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      {...props}
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}
export function Pulse({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 20h27l6-5 7 10 8-7h13l7-16 9 32 8-20 7 6h14l7-6 7 6h40"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
export function Reveal({ children, className = '', delay = 0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: reducedMotion ? 0 : 0.65,
        delay: reducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeading({ number, label, title, children }) {
  return (
    <Reveal className="section-heading">
      <div>
        <span className="eyebrow">
          <span className="chapter-number">{number}</span> {label}
        </span>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </Reveal>
  );
}
export const chapters = [
  { id: 'overview', label: 'The spark', nav: 'Overview' },
  { id: 'work', label: 'The experiments', nav: 'Selected work' },
  { id: 'research', label: 'The evidence', nav: 'Research' },
  { id: 'journey', label: 'The evolution', nav: 'Journey' },
  { id: 'journeys', label: 'Exploration Log', nav: 'Expeditions' },
  { id: 'contact', label: 'What comes next', nav: 'Contact' },
];
