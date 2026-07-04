import React, { useMemo, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  Section,
  Container,
  SectionHeader,
  SpotlightPanel,
  trackSpotlight,
} from '../components/ui/Section';

/*
 * The career rendered as a constellation chart: one vertical spine that
 * draws itself with scroll, each position a star docked to it.
 */

const SPINE_X = 96; // px from the left edge of the chart on desktop
const SPINE_X_MOBILE = 10;

const typeColor = {
  experience: '#5B8DEF',
  education: '#C9A0DC',
};

const FilterRow = styled.div`
  display: flex;
  gap: 0.35rem;
  margin-top: 1.75rem;
`;

const FilterButton = styled.button`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.4rem 0.9rem;
  border-radius: ${p => p.theme.radius.pill};
  border: 1px solid ${p => (p.$active ? 'rgba(91, 141, 239, 0.4)' : 'rgba(91, 141, 239, 0.1)')};
  background: ${p => (p.$active ? 'rgba(91, 141, 239, 0.12)' : 'transparent')};
  color: ${p => (p.$active ? p.theme.colors.primary : p.theme.colors.muted)};
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.3);
    color: ${p => p.theme.colors.light};
  }
`;

const Chart = styled.div`
  position: relative;
  margin-top: 3rem;
`;

/* The undrawn track plus the scroll-drawn line on top of it */
const SpineTrack = styled.div`
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: ${SPINE_X}px;
  width: 1px;
  background: rgba(91, 141, 239, 0.08);

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    left: ${SPINE_X_MOBILE}px;
  }
`;

const SpineDraw = styled(motion.div)`
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: ${SPINE_X}px;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(91, 141, 239, 0.75),
    rgba(123, 104, 182, 0.55) 60%,
    rgba(201, 160, 220, 0.4)
  );
  transform-origin: top;
  box-shadow: 0 0 12px rgba(91, 141, 239, 0.25);

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    left: ${SPINE_X_MOBILE}px;
  }
`;

const Entry = styled(motion.div)`
  position: relative;
  display: grid;
  grid-template-columns: ${SPINE_X + 34}px 1fr;
  margin-bottom: 1.4rem;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    grid-template-columns: ${SPINE_X_MOBILE + 26}px 1fr;
    margin-bottom: 1.1rem;
  }
`;

const YearTick = styled.div`
  position: relative;
  padding-top: 1.35rem;

  span.year {
    position: absolute;
    right: 52px;
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.tick};
    letter-spacing: 0.14em;
    color: ${p => p.theme.colors.subtle};

    @media (max-width: ${p => p.theme.breakpoints.tablet}) {
      display: none;
    }
  }
`;

const twinkleNow = keyframes`
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px rgba(91, 141, 239, 0.9)); }
  50% { opacity: 0.6; filter: drop-shadow(0 0 1px rgba(91, 141, 239, 0.4)); }
`;

const StarNode = styled(motion.svg)`
  position: absolute;
  top: 1.05rem;
  left: ${SPINE_X - 8}px;
  overflow: visible;

  path {
    fill: ${p => p.$color};
    opacity: ${p => (p.$now ? 1 : 0.9)};
  }

  ${p =>
    p.$now &&
    css`
      animation: ${twinkleNow} 2.8s ease-in-out infinite;
    `}

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    left: ${SPINE_X_MOBILE - 8}px;
  }
`;

const Card = styled(SpotlightPanel)`
  padding: 1.3rem 1.5rem 1.35rem;
`;

const CardHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Role = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
`;

const Org = styled.span`
  font-size: ${p => p.theme.type.small};
  color: ${p => p.theme.colors.muted};
`;

const DateRange = styled.span`
  margin-left: auto;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.subtle};
  white-space: nowrap;
`;

const TypeBadge = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.56rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.16rem 0.5rem;
  border-radius: ${p => p.theme.radius.pill};
  color: ${p => typeColor[p.$type]};
  border: 1px solid ${p => `${typeColor[p.$type]}44`};
`;

const AwardBadge = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.56rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.16rem 0.55rem;
  border-radius: ${p => p.theme.radius.pill};
  color: ${p => p.theme.colors.accentWarm};
  border: 1px solid ${p => p.theme.colors.borderGold};
  background: rgba(212, 165, 116, 0.07);
`;

const CardBody = styled.p`
  font-size: ${p => p.theme.type.small};
  line-height: 1.7;
  color: ${p => p.theme.colors.muted};
  margin-top: 0.6rem;
  max-width: 78ch;
`;

const TagRow = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
`;

const Tag = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.62rem;
  padding: 0.16rem 0.5rem;
  border-radius: ${p => p.theme.radius.pill};
  background: rgba(91, 141, 239, 0.06);
  color: ${p => p.theme.colors.subtle};
  border: 1px solid rgba(91, 141, 239, 0.1);
`;

const STAR_PATH = 'M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z';

const parseEnd = d => {
  if (!d || d === 'Present') return Number.MAX_SAFE_INTEGER;
  const parts = d.split(' ');
  return parts.length === 2 ? new Date(`${parts[0]} 1, ${parts[1]}`).getTime() : new Date(d).getTime();
};

const endYear = d => (!d || d === 'Present' ? 'NOW' : d.split(' ').pop());

const Timeline = ({ education = [], experience = [] }) => {
  const [filter, setFilter] = useState('all');
  const chartRef = useRef(null);

  const items = useMemo(() => {
    let list = [];
    if (filter === 'all' || filter === 'experience') {
      list = list.concat(experience.map(item => ({ ...item, type: 'experience' })));
    }
    if (filter === 'all' || filter === 'education') {
      list = list.concat(education.map(item => ({ ...item, type: 'education' })));
    }
    return list.sort((a, b) => parseEnd(b.endDate) - parseEnd(a.endDate));
  }, [filter, education, experience]);

  const { scrollYProgress } = useScroll({
    target: chartRef,
    offset: ['start 0.78', 'end 0.5'],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 55, damping: 18 });

  const filters = [
    { id: 'all', label: `All · ${education.length + experience.length}` },
    { id: 'experience', label: `Work · ${experience.length}` },
    { id: 'education', label: `Study · ${education.length}` },
  ];

  return (
    <Section id="timeline">
      <Container>
        <SectionHeader
          index="03"
          name="trajectory"
          title={<>The <em>Path</em> So Far</>}
          accent="#7B68B6"
          intro="Six institutions and six internships, charted as one line."
        />

        <FilterRow role="tablist" aria-label="Filter timeline">
          {filters.map(f => (
            <FilterButton
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              $active={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </FilterButton>
          ))}
        </FilterRow>

        <Chart ref={chartRef}>
          <SpineTrack aria-hidden="true" />
          <SpineDraw style={{ scaleY: drawn }} aria-hidden="true" />

          <AnimatePresence mode="popLayout">
            {items.map((item, i) => {
              const isNow = item.endDate === 'Present';
              const color = typeColor[item.type];
              return (
                <Entry
                  key={`${item.type}-${item.organization}-${item.startDate}`}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: (i % 4) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <YearTick aria-hidden="true">
                    <span className="year">{endYear(item.endDate)}</span>
                    <StarNode
                      width="16"
                      height="16"
                      viewBox="-8 -8 16 16"
                      $color={color}
                      $now={isNow}
                      initial={{ scale: 0, rotate: -90 }}
                      whileInView={{ scale: isNow ? 1.25 : 1, rotate: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={isNow ? undefined : { filter: `drop-shadow(0 0 2px ${color}66)` }}
                    >
                      <path d={STAR_PATH} />
                    </StarNode>
                  </YearTick>

                  <Card
                    onMouseMove={trackSpotlight}
                    $spot={`${color}14`}
                    $spotBorder={`${color}55`}
                  >
                    <CardHead>
                      <Role>{item.title}</Role>
                      <Org>{item.organization}</Org>
                      <DateRange>
                        {item.startDate} — {item.endDate}
                      </DateRange>
                    </CardHead>
                    <TagRow style={{ marginTop: '0.55rem' }}>
                      <TypeBadge $type={item.type}>
                        {item.type === 'experience' ? 'Work' : 'Study'}
                      </TypeBadge>
                      {item.award ? <AwardBadge>★ {item.award}</AwardBadge> : null}
                    </TagRow>
                    <CardBody>{item.description}</CardBody>
                    {item.skills?.length ? (
                      <TagRow>
                        {item.skills.map(skill => (
                          <Tag key={skill}>{skill}</Tag>
                        ))}
                      </TagRow>
                    ) : null}
                  </Card>
                </Entry>
              );
            })}
          </AnimatePresence>
        </Chart>
      </Container>
    </Section>
  );
};

export default Timeline;
