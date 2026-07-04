import React, { useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const twinkle = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.8; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.08); opacity: 0.85; }
`;

/* Overlay only: the WebGL sky is already mounting underneath it */
const Veil = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0a0b0f 0%, #0e1520 60%, #130b20 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  z-index: 9999;
  overflow: hidden;
`;

const Star = styled.div`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: radial-gradient(circle, rgba(232, 236, 244, 0.9) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${twinkle} ${p => p.$duration}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
  left: ${p => p.$left}%;
  top: ${p => p.$top}%;
`;

const Orb = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 32% 32%,
    rgba(201, 160, 220, 0.5) 0%,
    rgba(123, 104, 182, 0.35) 40%,
    rgba(91, 141, 239, 0.2) 70%,
    transparent 100%
  );
  box-shadow:
    0 0 32px rgba(91, 141, 239, 0.25),
    0 0 70px rgba(123, 104, 182, 0.15),
    inset 0 0 24px rgba(201, 160, 220, 0.12);
  animation: ${pulse} 2.4s ease-in-out infinite;
`;

const Wordmark = styled(motion.p)`
  font-family: ${p => p.theme.fonts.display};
  font-size: 1.5rem;
  font-weight: 680;
  letter-spacing: -0.02em;
  color: ${p => p.theme.colors.light};

  em {
    font-style: normal;
    font-weight: 260;
  }
`;

const Caption = styled(motion.p)`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.6rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.subtle};
`;

const CosmicLoader = ({ onDone, duration = 1400 }) => {
  const stars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        size: 1 + Math.random() * 2.2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 1.6 + Math.random() * 2.4,
        delay: Math.random() * 2,
      })),
    []
  );

  useEffect(() => {
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  return (
    <Veil
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
      aria-hidden="true"
    >
      {stars.map(s => (
        <Star
          key={s.id}
          $size={s.size}
          $left={s.left}
          $top={s.top}
          $duration={s.duration}
          $delay={s.delay}
        />
      ))}
      <Orb />
      <div style={{ textAlign: 'center' }}>
        <Wordmark
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Anay <em>Sinhal</em>
        </Wordmark>
        <Caption
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          calibrating instruments
        </Caption>
      </div>
    </Veil>
  );
};

export default CosmicLoader;
