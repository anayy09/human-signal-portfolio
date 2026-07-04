import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiFileText } from 'react-icons/fi';
import useCountUp from '../hooks/useCountUp';
import personalInfo from '../config/personalInfo';

const scanLine = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  8% { opacity: 0.45; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(91, 141, 239, 0.32), transparent);
    animation: ${scanLine} 3.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    pointer-events: none;
    z-index: 2;
  }
`;

const Container = styled.div`
  max-width: 1160px;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(1.25rem, 4vw, 2rem) clamp(3rem, 8vh, 5rem);
`;

/* ── Telemetry line: the observatory is live ─────────────────────── */

const TelemetryRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.subtle};
  margin-bottom: 1.4rem;

  span.live {
    color: ${p => p.theme.colors.primary};
  }

  span.dim {
    color: ${p => p.theme.colors.faint};
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    gap: 0.6rem;
    font-size: 0.56rem;
  }
`;

const StatusChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: auto;
  padding: 0.32rem 0.7rem;
  border: 1px solid rgba(72, 187, 120, 0.28);
  border-radius: ${p => p.theme.radius.pill};
  color: ${p => p.theme.colors.success};
  letter-spacing: 0.14em;

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${p => p.theme.colors.success};
    box-shadow: 0 0 8px rgba(72, 187, 120, 0.7);
    animation: ${pulse} 2.4s ease-in-out infinite;
  }

  @media (max-width: ${p => p.theme.breakpoints.tabletL}) {
    margin-left: 0;
  }
`;

/* ── Meta row: role, typewriter, instrument readouts ─────────────── */

const MetaRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
  min-height: 1.5rem;
`;

const TitleText = styled.span`
  font-size: clamp(0.8rem, 1.5vw, 0.9375rem);
  font-weight: 400;
  color: ${p => p.theme.colors.muted};
`;

const MiddleDot = styled.span`
  color: rgba(91, 141, 239, 0.3);
  font-size: 0.75rem;
`;

const TypedRole = styled.span`
  font-size: clamp(0.8rem, 1.5vw, 0.9375rem);
  font-weight: 500;
  color: rgba(201, 160, 220, 0.8);
`;

const Cursor = styled.span`
  animation: ${blink} 1s step-end infinite;
  color: rgba(201, 160, 220, 0.4);
  margin-left: 1px;
`;

const StatsInline = styled.div`
  display: flex;
  align-items: center;
  gap: 1.4rem;
  margin-left: auto;

  @media (max-width: ${p => p.theme.breakpoints.tabletL}) {
    display: none;
  }
`;

const StatUnit = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.subtle};
  text-transform: uppercase;

  b {
    font-size: 0.95rem;
    font-weight: 500;
    color: ${p => p.theme.colors.light};
    letter-spacing: -0.02em;
  }
`;

/* ── The engraved name ───────────────────────────────────────────── */

const NameWrapper = styled.div`
  overflow: hidden;
`;

const HeroName = styled(motion.h1)`
  font-family: ${p => p.theme.fonts.display};
  font-size: ${p => p.theme.type.hero};
  font-weight: 720;
  font-variation-settings: 'opsz' 40;
  color: ${p => p.theme.colors.light};
  line-height: 0.94;
  letter-spacing: -0.035em;
  text-wrap: balance;

  em {
    font-style: normal;
    font-weight: 260;
    letter-spacing: -0.02em;
  }
`;

const HeroRule = styled(motion.div)`
  height: 1px;
  background: linear-gradient(90deg, rgba(91, 141, 239, 0.26), rgba(91, 141, 239, 0.05) 55%, transparent);
  margin: 1.6rem 0 1.75rem;
  transform-origin: left;
`;

const MobileStats = styled(motion.div)`
  display: none;

  @media (max-width: ${p => p.theme.breakpoints.tabletL}) {
    display: flex;
    gap: 1.75rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }
`;

const MobileStatUnit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  b {
    font-family: ${p => p.theme.fonts.code};
    font-size: 1.15rem;
    font-weight: 500;
    color: ${p => p.theme.colors.light};

    sup {
      font-size: 0.68rem;
      color: ${p => p.theme.colors.primary};
    }
  }

  span {
    font-family: ${p => p.theme.fonts.code};
    font-size: 0.56rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${p => p.theme.colors.subtle};
  }
`;

const Description = styled(motion.p)`
  font-size: ${p => p.theme.type.body};
  line-height: 1.8;
  color: ${p => p.theme.colors.muted};
  max-width: 54ch;
  margin-bottom: 2rem;
`;

/* ── Actions ─────────────────────────────────────────────────────── */

const ActionRow = styled(motion.div)`
  display: flex;
  gap: 0.625rem;
  flex-wrap: wrap;
  align-items: center;
`;

const PrimaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.62rem 1.4rem;
  background: ${p => p.theme.colors.primary};
  color: #f4f7ff;
  font-size: 0.84rem;
  font-weight: 600;
  border-radius: ${p => p.theme.radius.md};
  transition: background 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background: #4a7fdf;
    color: #f4f7ff;
    box-shadow: 0 0 26px rgba(91, 141, 239, 0.32);
  }
`;

const SecondaryButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.62rem 1.4rem;
  color: ${p => p.theme.colors.muted};
  font-size: 0.84rem;
  border-radius: ${p => p.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.15);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.38);
    background: rgba(91, 141, 239, 0.05);
    color: ${p => p.theme.colors.light};
  }
`;

const ActionSeparator = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(91, 141, 239, 0.12);
  margin: 0 0.125rem;
`;

const IconLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: ${p => p.theme.radius.md};
  border: 1px solid rgba(91, 141, 239, 0.1);
  color: ${p => p.theme.colors.subtle};
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.58rem;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.35);
    color: ${p => p.theme.colors.primary};
    background: rgba(91, 141, 239, 0.05);
  }
`;

const ScrollHint = styled(motion.div)`
  position: absolute;
  right: clamp(1.25rem, 4vw, 2.5rem);
  bottom: clamp(3rem, 8vh, 5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.56rem;
  letter-spacing: 0.3em;
  color: ${p => p.theme.colors.faint};
  writing-mode: vertical-rl;

  &::after {
    content: '';
    width: 1px;
    height: 44px;
    background: linear-gradient(180deg, rgba(91, 141, 239, 0.4), transparent);
  }

  @media (max-width: ${p => p.theme.breakpoints.laptop}) {
    display: none;
  }
`;

function useUtcClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const Hero = ({ name, title, description, github, linkedin, email, cv, orcid }) => {
  const { hero } = personalInfo;
  const words = hero.typewriter;
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const containerRef = useRef(null);
  const utc = useUtcClock();

  useEffect(() => {
    const word = words[wordIndex];
    const speed = isDeleting ? 38 : 78;
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === word) {
        setTimeout(() => setIsDeleting(true), 1900);
        return;
      }
      if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setWordIndex(i => (i + 1) % words.length);
        return;
      }
      setDisplayText(prev =>
        isDeleting ? prev.slice(0, -1) : word.slice(0, prev.length + 1)
      );
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayText, wordIndex, isDeleting, words]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const counts = [
    useCountUp(hero.stats[0].value, 1200, statsVisible),
    useCountUp(hero.stats[1].value, 1200, statsVisible),
    useCountUp(hero.stats[2].value, 1200, statsVisible),
    useCountUp(hero.stats[3].value, 1200, statsVisible),
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  };

  const nameVariants = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: 1.05, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const [firstName, ...rest] = name.split(' ');

  return (
    <HeroSection id="home">
      <Container>
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <TelemetryRow variants={itemVariants}>
            <span className="live">{utc || '00:00:00'} UTC</span>
            <span className="dim">·</span>
            <span>{hero.coordinates}</span>
            <span className="dim">·</span>
            <span>{hero.station}</span>
            <StatusChip>{hero.status}</StatusChip>
          </TelemetryRow>

          <MetaRow variants={itemVariants}>
            <TitleText>{title}</TitleText>
            <MiddleDot aria-hidden="true">·</MiddleDot>
            <TypedRole>
              {displayText}
              <Cursor aria-hidden="true">|</Cursor>
            </TypedRole>
            <StatsInline>
              {hero.stats.map((stat, i) => (
                <StatUnit key={stat.label}>
                  <b>
                    {counts[i]}
                    {stat.suffix || ''}
                  </b>{' '}
                  {stat.label}
                </StatUnit>
              ))}
            </StatsInline>
          </MetaRow>

          <NameWrapper>
            <HeroName variants={nameVariants}>
              {firstName} <em>{rest.join(' ')}</em>
            </HeroName>
          </NameWrapper>

          <HeroRule variants={itemVariants} />

          <MobileStats variants={itemVariants}>
            {hero.stats.map((stat, i) => (
              <MobileStatUnit key={stat.label}>
                <b>
                  {counts[i]}
                  {stat.suffix ? <sup>{stat.suffix}</sup> : null}
                </b>
                <span>{stat.label}</span>
              </MobileStatUnit>
            ))}
          </MobileStats>

          <Description variants={itemVariants}>{description}</Description>

          <ActionRow variants={itemVariants}>
            <PrimaryButton href={cv} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
              <FiFileText size={13} />
              View CV
            </PrimaryButton>
            <SecondaryButton
              href={`mailto:${email}`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiMail size={13} />
              Get in touch
            </SecondaryButton>
            <ActionSeparator aria-hidden="true" />
            <IconLink
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              aria-label="GitHub"
            >
              <FiGithub size={15} />
            </IconLink>
            <IconLink
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              aria-label="LinkedIn"
            >
              <FiLinkedin size={15} />
            </IconLink>
            <IconLink
              href={`https://orcid.org/${orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.92 }}
              aria-label="ORCID"
            >
              iD
            </IconLink>
          </ActionRow>
        </motion.div>
      </Container>

      <ScrollHint
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        aria-hidden="true"
      >
        SCROLL
      </ScrollHint>
    </HeroSection>
  );
};

export default Hero;
