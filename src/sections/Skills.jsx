import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  SiPython, SiGo, SiTypescript, SiJavascript, SiCplusplus,
  SiPostgresql, SiGnubash,
  SiPytorch, SiTensorflow, SiHuggingface, SiScikitlearn,
  SiFastapi, SiDjango, SiSpringboot, SiNodedotjs, SiReact, SiNextdotjs,
  SiMongodb, SiRedis, SiDocker, SiAmazonwebservices,
  SiLinux, SiGit, SiFigma,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { FiCloud } from 'react-icons/fi';
import {
  Section,
  Container,
  SectionHeader,
  SpotlightPanel,
  trackSpotlight,
  revealVariants,
} from '../components/ui/Section';

const iconMap = {
  SiPython, SiGo, SiTypescript, SiJavascript, SiCplusplus,
  SiPostgresql, SiGnubash, FaJava,
  SiPytorch, SiTensorflow, SiHuggingface, SiScikitlearn,
  SiFastapi, SiDjango, SiSpringboot, SiNodedotjs, SiReact, SiNextdotjs,
  SiMongodb, SiRedis, SiDocker, SiAmazonwebservices,
  SiLinux, SiGit, SiFigma, FiCloud,
};

const contextColor = {
  daily: '#5B8DEF',
  production: '#98A2B8',
  research: '#14A89A',
  systems: '#7B68B6',
  design: '#C9A0DC',
};

const PanelsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 3rem;

  @media (max-width: ${p => p.theme.breakpoints.tabletL}) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(SpotlightPanel)`
  padding: 1.6rem 1.6rem 1.4rem;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    padding: 1.4rem;
  }
`;

const PanelHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 1.2rem;

  span.key {
    font-family: ${p => p.theme.fonts.display};
    font-size: 1.5rem;
    font-weight: 220;
    color: ${p => p.theme.colors.primaryMuted};
    line-height: 1;
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.48rem 0.5rem;
  border-radius: ${p => p.theme.radius.md};
  transition: background 0.18s ease;

  &:hover {
    background: rgba(91, 141, 239, 0.06);

    .icon { color: ${p => p.theme.colors.primary}; }
    .name { color: ${p => p.theme.colors.light}; }
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    color: ${p => p.theme.colors.subtle};
    font-size: 1rem;
    flex-shrink: 0;
    transition: color 0.18s ease;
  }

  .name {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${p => p.theme.colors.muted};
    transition: color 0.18s ease;
  }

  .context {
    margin-left: auto;
    font-family: ${p => p.theme.fonts.code};
    font-size: 0.56rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${p => contextColor[p.$context] || p.theme.colors.subtle};
    opacity: 0.85;
  }
`;

const Legend = styled(motion.p)`
  margin-top: 1.4rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.faint};

  b {
    font-weight: 400;
    color: ${p => p.theme.colors.subtle};
  }
`;

const Skills = ({ skillCategories = [] }) => (
  <Section id="skills">
    <Container>
      <SectionHeader
        index="05"
        name="instrumentation"
        title={<>Working <em>Stack</em></>}
        intro="Tagged by where each tool actually lives in my practice, not a logo wall."
      />

      <PanelsGrid
        variants={revealVariants.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {skillCategories.map(category => (
          <Panel
            key={category.id}
            variants={revealVariants.item}
            onMouseMove={trackSpotlight}
          >
            <PanelHead>
              <span className="key" aria-hidden="true">{category.index}</span>
              <h3>{category.title}</h3>
            </PanelHead>
            <Rows>
              {category.skills.map(skill => {
                const Icon = iconMap[skill.icon];
                return (
                  <Row key={skill.name} $context={skill.context}>
                    <span className="icon">{Icon ? <Icon /> : null}</span>
                    <span className="name">{skill.name}</span>
                    <span className="context">{skill.context}</span>
                  </Row>
                );
              })}
            </Rows>
          </Panel>
        ))}
      </PanelsGrid>

      <Legend
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <b>daily</b> = every working day · <b>production</b> = shipped with it ·{' '}
        <b>research</b> = lab and papers · <b>systems</b> = infrastructure work
      </Legend>
    </Container>
  </Section>
);

export default Skills;
