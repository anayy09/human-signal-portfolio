import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import personalInfo from '../config/personalInfo';
import Globe from '../three/Globe';
import {
  Section,
  Container,
  SectionHeader,
  revealVariants,
} from '../components/ui/Section';

const LAVENDER = '#C9A0DC';

const Deck = styled(motion.div)`
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 1.5rem;
  margin-top: 3rem;
  align-items: stretch;

  @media (max-width: ${p => p.theme.breakpoints.tabletL}) {
    grid-template-columns: 1fr;
  }
`;

/* ── The orbital viewport, framed like an instrument ─────────────── */

const Viewport = styled(motion.div)`
  position: relative;
  height: 560px;
  background: rgba(6, 9, 16, 0.9);
  border: 1px solid rgba(201, 160, 220, 0.12);
  border-radius: ${p => p.theme.radius.lg};
  overflow: hidden;

  /* corner ticks */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border-color: rgba(201, 160, 220, 0.45);
    border-style: solid;
    z-index: 5;
    pointer-events: none;
  }

  &::before {
    top: 10px;
    left: 10px;
    border-width: 1px 0 0 1px;
  }

  &::after {
    bottom: 10px;
    right: 10px;
    border-width: 0 1px 1px 0;
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    height: 420px;
  }
`;

const Hud = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.18em;
  text-transform: uppercase;

  .top {
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    color: rgba(201, 160, 220, 0.6);
  }

  .stats {
    position: absolute;
    bottom: 1rem;
    left: 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: rgba(201, 160, 220, 0.35);

    span {
      color: rgba(201, 160, 220, 0.75);
    }
  }

  .hint {
    position: absolute;
    bottom: 1rem;
    right: 1.4rem;
    color: ${p => p.theme.colors.faint};
  }
`;

/* ── Flight log ──────────────────────────────────────────────────── */

const Log = styled(motion.div)`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const LogHeading = styled.p`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.faint};
  margin-bottom: 0.6rem;

  &:not(:first-child) {
    margin-top: 1.6rem;
  }
`;

const LegRow = styled.button`
  display: grid;
  grid-template-columns: 2.6rem 1fr;
  gap: 0.8rem;
  align-items: baseline;
  width: 100%;
  text-align: left;
  padding: 0.55rem 0.5rem;
  background: ${p => (p.$active ? 'rgba(201, 160, 220, 0.07)' : 'transparent')};
  border: none;
  border-left: none;
  border-radius: ${p => p.theme.radius.sm};
  border-top: 1px solid rgba(201, 160, 220, 0.07);
  transition: background 0.18s ease;
  cursor: pointer;

  &:last-of-type {
    border-bottom: 1px solid rgba(201, 160, 220, 0.07);
  }

  &:hover {
    background: rgba(201, 160, 220, 0.07);
  }

  .year {
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.tick};
    letter-spacing: 0.1em;
    color: ${p => (p.$current ? p.theme.colors.primary : p.theme.colors.subtle)};
  }

  .city {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${p => (p.$active ? LAVENDER : p.theme.colors.light)};
    transition: color 0.18s ease;
  }

  .what {
    display: block;
    font-size: 0.76rem;
    color: ${p => p.theme.colors.subtle};
    margin-top: 0.1rem;
  }
`;

const ChipCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Chip = styled.button`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.64rem;
  letter-spacing: 0.04em;
  padding: 0.28rem 0.65rem;
  border-radius: ${p => p.theme.radius.pill};
  background: ${p => (p.$active ? 'rgba(201, 160, 220, 0.14)' : 'rgba(201, 160, 220, 0.04)')};
  color: ${p => (p.$active ? LAVENDER : p.theme.colors.subtle)};
  border: 1px solid ${p => (p.$active ? 'rgba(201, 160, 220, 0.4)' : 'rgba(201, 160, 220, 0.12)')};
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    color: ${LAVENDER};
    border-color: rgba(201, 160, 220, 0.4);
  }
`;

const CosmicJourneys = () => {
  const { visitedPlaces = [], itinerary = [] } = personalInfo;
  const [focusPlace, setFocusPlace] = useState(null);
  const [active, setActive] = useState(false);
  const sectionRef = useRef(null);

  // Only run the globe's render loop while the section is on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const byId = useMemo(
    () => Object.fromEntries(visitedPlaces.map(place => [place.id, place])),
    [visitedPlaces]
  );

  const careerLegs = useMemo(
    () =>
      itinerary
        .map(leg => ({ ...leg, place: byId[leg.placeId] }))
        .filter(leg => leg.place),
    [itinerary, byId]
  );

  const excursions = useMemo(() => {
    const careerIds = new Set(itinerary.map(leg => leg.placeId));
    return visitedPlaces.filter(place => !careerIds.has(place.id));
  }, [itinerary, visitedPlaces]);

  const countries = useMemo(
    () => new Set(visitedPlaces.map(place => place.name.split(',').pop().trim())).size,
    [visitedPlaces]
  );

  return (
    <Section id="journeys">
      <div ref={sectionRef}>
        <Container>
          <SectionHeader
            index="07"
            name="expeditions"
            title={<>Exploration <em>Log</em></>}
            accent={LAVENDER}
            intro="Every coordinate this observer has physically visited. The gold route replays the career trajectory; drag the globe or hover the log."
          />

          <Deck
            variants={revealVariants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <Viewport variants={revealVariants.item} onMouseLeave={() => setFocusPlace(null)}>
              <Hud aria-hidden="true">
                <p className="top">nav / orbital view</p>
                <div className="stats">
                  <p>
                    <span>{visitedPlaces.length}</span> waypoints
                  </p>
                  <p>
                    <span>{countries}</span> countries
                  </p>
                </div>
                <p className="hint">drag to rotate</p>
              </Hud>
              {active !== null && (
                <Globe
                  places={visitedPlaces}
                  itinerary={itinerary}
                  focusPlace={focusPlace}
                  onHover={() => {}}
                  active={active}
                />
              )}
            </Viewport>

            <Log variants={revealVariants.item}>
              <LogHeading>Career trajectory</LogHeading>
              <div>
                {careerLegs.map(leg => (
                  <LegRow
                    key={leg.placeId}
                    type="button"
                    $active={focusPlace?.id === leg.placeId}
                    $current={leg.current}
                    onMouseEnter={() => setFocusPlace(leg.place)}
                    onFocus={() => setFocusPlace(leg.place)}
                    onMouseLeave={() => setFocusPlace(null)}
                    onBlur={() => setFocusPlace(null)}
                  >
                    <span className="year">{leg.current ? 'NOW' : leg.year}</span>
                    <span>
                      <span className="city">{leg.place.name.split(',')[0]}</span>
                      <span className="what">{leg.label}</span>
                    </span>
                  </LegRow>
                ))}
              </div>

              <LogHeading>Field excursions</LogHeading>
              <ChipCloud>
                {excursions.map(place => (
                  <Chip
                    key={place.id}
                    type="button"
                    $active={focusPlace?.id === place.id}
                    onMouseEnter={() => setFocusPlace(place)}
                    onFocus={() => setFocusPlace(place)}
                    onMouseLeave={() => setFocusPlace(null)}
                    onBlur={() => setFocusPlace(null)}
                  >
                    {place.name.split(',')[0]}
                  </Chip>
                ))}
              </ChipCloud>
            </Log>
          </Deck>
        </Container>
      </div>
    </Section>
  );
};

export default CosmicJourneys;
