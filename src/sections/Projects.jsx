import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiGithub, FiArrowUpRight } from 'react-icons/fi';
import {
  Section,
  Container,
  SectionHeader,
  SpotlightPanel,
  trackSpotlight,
  revealVariants,
} from '../components/ui/Section';

const langColor = lang => {
  switch (lang?.toLowerCase()) {
    case 'typescript': return '#3178C6';
    case 'python': return '#3776AB';
    case 'javascript': return '#F7DF1E';
    case 'go': return '#00ADD8';
    default: return '#6B7690';
  }
};

const Bento = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(150px, auto);
  gap: 1.1rem;
  margin-top: 3rem;

  > :nth-child(1) { grid-column: span 7; grid-row: span 2; }
  > :nth-child(2) { grid-column: span 5; }
  > :nth-child(3) { grid-column: span 5; }
  > :nth-child(4) { grid-column: span 6; }
  > :nth-child(5) { grid-column: span 6; }

  @media (max-width: ${p => p.theme.breakpoints.laptop}) {
    grid-auto-rows: auto;
    > :nth-child(1) { grid-column: span 12; grid-row: span 1; }
    > :nth-child(2), > :nth-child(3), > :nth-child(4), > :nth-child(5) {
      grid-column: span 6;
    }
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    gap: 0.875rem;
    > * { grid-column: span 12 !important; }
  }
`;

const Card = styled(SpotlightPanel)`
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ImageArea = styled.div`
  height: 230px;
  background: rgba(8, 12, 20, 0.6) url(${p => p.$img}) center/cover no-repeat;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 45%, rgba(14, 20, 32, 0.96));
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    height: 150px;
  }
`;

const FeaturedTag = styled.span`
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.56rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.24rem 0.65rem;
  border-radius: ${p => p.theme.radius.pill};
  background: rgba(10, 11, 15, 0.75);
  color: ${p => p.theme.colors.accentTeal};
  border: 1px solid ${p => p.theme.colors.borderTeal};
  z-index: 2;
`;

const CardContent = styled.div`
  padding: 1.15rem 1.4rem 1.3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.6rem;
`;

const Title = styled.h3`
  font-size: ${p => (p.$featured ? '1.15rem' : '0.98rem')};
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

const DateStamp = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.1em;
  color: ${p => p.theme.colors.subtle};
  white-space: nowrap;
`;

const Desc = styled.p`
  font-size: ${p => p.theme.type.small};
  line-height: 1.68;
  color: ${p => p.theme.colors.muted};
  margin: 0.55rem 0 0.9rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: ${p => (p.$featured ? 4 : 3)};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* Telemetry chips: the numbers are data, not prose */
const MetricRow = styled.div`
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
`;

const Metric = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.66rem;
  color: ${p => p.theme.colors.accentTeal};
  letter-spacing: 0.02em;

  &::before {
    content: '${p => p.$label} ';
    color: ${p => p.theme.colors.faint};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.56rem;
  }
`;

const CardLinks = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-left: auto;
`;

const CardLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: ${p => p.theme.radius.sm};
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${p => p.theme.colors.muted};
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${p => p.theme.colors.primary};
    border-color: ${p => p.theme.colors.primary};
    color: #fff;
  }
`;

/* Off-domain work logged as ledger lines, not more cards */
const Archive = styled(motion.div)`
  margin-top: 2.25rem;
`;

const ArchiveLabel = styled.p`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.faint};
  margin-bottom: 0.6rem;
`;

const ArchiveRow = styled(motion.a)`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.8rem 0.25rem;
  border-top: 1px solid rgba(91, 141, 239, 0.08);
  color: inherit;
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: 1px solid rgba(91, 141, 239, 0.08);
  }

  &:hover {
    background: rgba(91, 141, 239, 0.04);

    .name { color: ${p => p.theme.colors.primary}; }
    svg { opacity: 1; transform: translate(1px, -1px); }
  }

  .name {
    font-size: 0.92rem;
    font-weight: 600;
    color: ${p => p.theme.colors.light};
    transition: color 0.2s ease;
    white-space: nowrap;
  }

  .desc {
    font-size: ${p => p.theme.type.small};
    color: ${p => p.theme.colors.subtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;

    @media (max-width: ${p => p.theme.breakpoints.tablet}) {
      display: none;
    }
  }

  .lang {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.tick};
    color: ${p => p.theme.colors.subtle};
    white-space: nowrap;

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${p => langColor(p.$lang)};
    }
  }

  .year {
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.tick};
    color: ${p => p.theme.colors.faint};
    white-space: nowrap;
  }

  svg {
    opacity: 0.3;
    transition: all 0.2s ease;
    flex-shrink: 0;
    align-self: center;
  }
`;

const ViewAll = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.1rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.08em;
  color: ${p => p.theme.colors.muted};

  &:hover {
    color: ${p => p.theme.colors.primary};
  }
`;

const Projects = ({ projects = [], githubUsername = 'anayy09' }) => {
  const gridProjects = projects.filter(p => p.domain === 'health').slice(0, 5);
  const archiveProjects = projects.filter(p => !gridProjects.includes(p));

  return (
    <Section id="projects">
      <Container>
        <SectionHeader
          index="04"
          name="specimens"
          title={<>Built <em>Systems</em></>}
          intro="Clinical decision support, simulation, and data platforms; every one of them shipped end to end."
        />

        <Bento
          variants={revealVariants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {gridProjects.map((project, i) => {
            const featured = i === 0;
            return (
              <Card
                key={project.id}
                variants={revealVariants.item}
                onMouseMove={trackSpotlight}
                $spot="rgba(20, 168, 154, 0.09)"
                $spotBorder="rgba(20, 168, 154, 0.45)"
              >
                {featured && project.imageUrl ? (
                  <ImageArea $img={project.imageUrl}>
                    <FeaturedTag>Featured · {project.date}</FeaturedTag>
                  </ImageArea>
                ) : null}
                <CardContent>
                  <CardTop>
                    <Title $featured={featured}>{project.name}</Title>
                    {!featured && <DateStamp>{project.date}</DateStamp>}
                  </CardTop>
                  <Desc $featured={featured}>{project.description}</Desc>
                  <MetricRow>
                    {project.metrics?.map(m => (
                      <Metric key={m.label} $label={m.label}>
                        {m.value}
                      </Metric>
                    ))}
                    <CardLinks>
                      {project.url && (
                        <CardLink
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.name} on GitHub`}
                        >
                          <FiGithub />
                        </CardLink>
                      )}
                    </CardLinks>
                  </MetricRow>
                </CardContent>
              </Card>
            );
          })}
        </Bento>

        {archiveProjects.length > 0 && (
          <Archive
            variants={revealVariants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <ArchiveLabel>From the archive</ArchiveLabel>
            {archiveProjects.map(project => (
              <ArchiveRow
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={revealVariants.item}
                $lang={project.language}
              >
                <span className="name">{project.name}</span>
                <span className="desc">{project.description}</span>
                <span className="lang">{project.language}</span>
                <span className="year">{project.date}</span>
                <FiArrowUpRight size={14} />
              </ArchiveRow>
            ))}
            <ViewAll
              href={`https://github.com/${githubUsername}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
            >
              all repositories <FiArrowUpRight size={12} />
            </ViewAll>
          </Archive>
        )}
      </Container>
    </Section>
  );
};

export default Projects;
