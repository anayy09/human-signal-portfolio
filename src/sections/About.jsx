import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Section,
  Container,
  SectionHeader,
  SpotlightPanel,
  trackSpotlight,
  revealVariants,
} from '../components/ui/Section';

const accents = {
  teal: {
    numeral: '#14A89A',
    spot: 'rgba(20, 168, 154, 0.10)',
    border: 'rgba(20, 168, 154, 0.4)',
  },
  blue: {
    numeral: '#5B8DEF',
    spot: 'rgba(91, 141, 239, 0.10)',
    border: 'rgba(91, 141, 239, 0.4)',
  },
  lavender: {
    numeral: '#C9A0DC',
    spot: 'rgba(123, 104, 182, 0.10)',
    border: 'rgba(123, 104, 182, 0.42)',
  },
};

const Lead = styled(motion.p)`
  font-size: ${p => p.theme.type.lead};
  line-height: 1.75;
  color: ${p => p.theme.colors.muted};
  max-width: 68ch;
  margin: 2.25rem 0 0;

  strong {
    color: ${p => p.theme.colors.light};
    font-weight: 500;
  }
`;

/* Deliberately unequal: 5 / 4 / 3 of a 12-column grid */
const PillarGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.25rem;
  margin-top: 3rem;

  > :nth-child(1) { grid-column: span 5; }
  > :nth-child(2) { grid-column: span 4; }
  > :nth-child(3) { grid-column: span 3; }

  @media (max-width: ${p => p.theme.breakpoints.laptop}) {
    > :nth-child(1) { grid-column: span 12; }
    > :nth-child(2) { grid-column: span 6; }
    > :nth-child(3) { grid-column: span 6; }
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    > * { grid-column: span 12 !important; }
    gap: 1rem;
  }
`;

const Pillar = styled(SpotlightPanel)`
  padding: 1.75rem 1.9rem 1.9rem;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const Numeral = styled.span`
  display: block;
  font-family: ${p => p.theme.fonts.display};
  font-size: 2rem;
  font-weight: 220;
  line-height: 1;
  color: ${p => p.$color};
  margin-bottom: 1rem;
`;

const PillarTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 0.7rem;
`;

const PillarDescription = styled.p`
  font-size: ${p => p.theme.type.small};
  line-height: 1.72;
  color: ${p => p.theme.colors.muted};
`;

const About = ({ about }) => {
  if (!about) return null;

  return (
    <Section id="about">
      <Container>
        <SectionHeader index="02" name="orientation" title={<>Research <em>Focus</em></>} />

        <motion.div
          variants={revealVariants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Lead variants={revealVariants.item}>{about.intro}</Lead>

          <PillarGrid variants={revealVariants.container}>
            {about.pillars.map(pillar => {
              const a = accents[pillar.accent] || accents.blue;
              return (
                <Pillar
                  key={pillar.id}
                  variants={revealVariants.item}
                  onMouseMove={trackSpotlight}
                  $spot={a.spot}
                  $spotBorder={a.border}
                >
                  <Numeral $color={a.numeral} aria-hidden="true">
                    {pillar.index}
                  </Numeral>
                  <PillarTitle>{pillar.title}</PillarTitle>
                  <PillarDescription>{pillar.description}</PillarDescription>
                </Pillar>
              );
            })}
          </PillarGrid>
        </motion.div>
      </Container>
    </Section>
  );
};

export default About;
