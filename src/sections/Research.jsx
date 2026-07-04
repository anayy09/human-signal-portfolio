import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import {
  Section,
  Container,
  SectionHeader,
  SpotlightPanel,
  trackSpotlight,
  revealVariants,
} from '../components/ui/Section';

const domainAccent = {
  'Clinical AI': '#14A89A',
  Systems: '#5B8DEF',
  NLP: '#7B68B6',
};

const FilterRow = styled(motion.div)`
  display: flex;
  gap: 0.35rem;
  margin-top: 1.75rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.4rem 0.9rem;
  border-radius: ${p => p.theme.radius.pill};
  border: 1px solid ${p => (p.$active ? 'rgba(20, 168, 154, 0.45)' : 'rgba(91, 141, 239, 0.1)')};
  background: ${p => (p.$active ? 'rgba(20, 168, 154, 0.1)' : 'transparent')};
  color: ${p => (p.$active ? p.theme.colors.accentTeal : p.theme.colors.muted)};
  transition: all 0.18s ease;

  &:hover {
    border-color: rgba(20, 168, 154, 0.35);
    color: ${p => p.theme.colors.light};
  }
`;

const OrcidLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-left: auto;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.08em;
  color: ${p => p.theme.colors.muted};
  border: 1px solid rgba(91, 141, 239, 0.15);
  padding: 0.4rem 0.875rem;
  border-radius: ${p => p.theme.radius.pill};
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(91, 141, 239, 0.4);
    color: ${p => p.theme.colors.primary};
  }
`;

/* ── The featured plate: first-author, Nature portfolio ──────────── */

const Featured = styled(SpotlightPanel)`
  margin-top: 2.5rem;
  padding: 2rem 2.2rem 1.9rem;
  border-color: ${p => p.theme.colors.borderGold};
  background: linear-gradient(160deg, rgba(212, 165, 116, 0.05), rgba(14, 20, 32, 0.72) 45%);

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    padding: 1.4rem;
  }
`;

const FeaturedChips = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const Chip = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.56rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.22rem 0.6rem;
  border-radius: ${p => p.theme.radius.pill};
  color: ${p => p.$color || p.theme.colors.muted};
  border: 1px solid ${p => `${p.$color || '#98A2B8'}44`};
  background: ${p => `${p.$color || '#98A2B8'}0d`};
`;

const FeaturedTitle = styled.h3`
  font-family: ${p => p.theme.fonts.display};
  font-size: clamp(1.35rem, 2.6vw, 1.9rem);
  font-weight: 620;
  font-variation-settings: 'opsz' 32;
  line-height: 1.22;
  letter-spacing: -0.02em;
  max-width: 32ch;
`;

const FeaturedMeta = styled.p`
  margin-top: 0.7rem;
  font-size: ${p => p.theme.type.small};
  color: ${p => p.theme.colors.muted};

  i { color: ${p => p.theme.colors.light}; font-style: italic; }
  b { font-weight: 600; color: ${p => p.theme.colors.light}; }
`;

const FeaturedDesc = styled.p`
  margin-top: 0.8rem;
  font-size: ${p => p.theme.type.small};
  line-height: 1.72;
  color: ${p => p.theme.colors.muted};
  max-width: 82ch;
`;

const DoiLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 1rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.04em;
  color: ${p => p.theme.colors.accentWarm};

  &:hover { color: ${p => p.theme.colors.light}; }
`;

/* ── The ledger: everything else, numbered rows ──────────────────── */

const Ledger = styled(motion.div)`
  margin-top: 2rem;
`;

const LedgerRow = styled(motion.a)`
  display: grid;
  grid-template-columns: 2.4rem 1fr auto;
  gap: 1rem;
  align-items: baseline;
  padding: 0.95rem 0.4rem;
  border-top: 1px solid rgba(91, 141, 239, 0.08);
  color: inherit;
  cursor: ${p => (p.href ? 'pointer' : 'default')};
  transition: background 0.2s ease;

  &:last-child { border-bottom: 1px solid rgba(91, 141, 239, 0.08); }

  &:hover {
    background: rgba(91, 141, 239, 0.04);
    .title { color: ${p => p.theme.colors.primary}; }
    .doi { opacity: 1; }
  }

  .num {
    font-family: ${p => p.theme.fonts.display};
    font-size: 1.05rem;
    font-weight: 220;
    color: ${p => p.theme.colors.faint};
  }

  .title {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${p => p.theme.colors.light};
    line-height: 1.45;
    letter-spacing: -0.01em;
    transition: color 0.2s ease;
  }

  .venue {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.8rem;
    color: ${p => p.theme.colors.subtle};

    i { font-style: italic; }
  }

  .right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
    white-space: nowrap;
  }

  .year {
    font-family: ${p => p.theme.fonts.code};
    font-size: ${p => p.theme.type.tick};
    letter-spacing: 0.1em;
    color: ${p => p.theme.colors.subtle};
  }

  .domain {
    font-family: ${p => p.theme.fonts.code};
    font-size: 0.54rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${p => domainAccent[p.$domain] || p.theme.colors.subtle};
  }

  .doi {
    opacity: 0.25;
    transition: opacity 0.2s ease;
  }

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    grid-template-columns: 1.6rem 1fr auto;
    gap: 0.6rem;
  }
`;

/* ── Patents ─────────────────────────────────────────────────────── */

const SubHeading = styled(motion.h3)`
  margin-top: 3.25rem;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.subtle};
`;

const PatentGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.25rem;

  @media (max-width: ${p => p.theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const PatentCard = styled(SpotlightPanel)`
  padding: 1.3rem 1.4rem;
  ${p => (p.$granted ? `border-color: ${p.theme.colors.borderGold};` : '')}
`;

const PatentTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.01em;
`;

const GrantRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-top: 0.7rem;
  flex-wrap: wrap;

  .label {
    font-size: 0.76rem;
    color: ${p => p.theme.colors.subtle};
  }

  .number {
    font-family: ${p => p.theme.fonts.code};
    font-size: 0.68rem;
    letter-spacing: 0.04em;
    color: ${p => p.theme.colors.muted};
  }
`;

const StatusChip = styled.span`
  font-family: ${p => p.theme.fonts.code};
  font-size: 0.54rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.16rem 0.5rem;
  border-radius: ${p => p.theme.radius.pill};
  color: ${p => (p.$granted ? p.theme.colors.accentWarm : p.theme.colors.success)};
  border: 1px solid ${p => (p.$granted ? p.theme.colors.borderGold : 'rgba(72, 187, 120, 0.25)')};
  background: ${p => (p.$granted ? 'rgba(212, 165, 116, 0.08)' : 'rgba(72, 187, 120, 0.06)')};
`;

const highlightAuthor = authors =>
  authors.map((a, i) => (
    <React.Fragment key={a + i}>
      {i > 0 && ', '}
      {a === 'Anay Sinhal' ? <b>{a}</b> : a}
    </React.Fragment>
  ));

const Research = ({ publications = [], patents = [], orcid }) => {
  const [filter, setFilter] = useState('All');

  const featured = publications.find(p => p.featured);
  const rest = publications.filter(p => !p.featured);

  const domains = ['All', 'Clinical AI', 'Systems', 'NLP'];
  const countFor = d =>
    d === 'All' ? publications.length : publications.filter(p => p.domain === d).length;

  const visible = filter === 'All' ? rest : rest.filter(p => p.domain === filter);
  const showFeatured = featured && (filter === 'All' || featured.domain === filter);

  return (
    <Section id="research">
      <Container>
        <SectionHeader
          index="06"
          name="findings"
          title={<>Publications <em>&</em> Patents</>}
          accent="#14A89A"
          intro={`${publications.length} peer-reviewed papers across Scientific Reports, IEEE, and Springer. ${patents.length} patents, one granted.`}
        />

        <FilterRow
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {domains.map(d => (
            <FilterButton key={d} $active={filter === d} onClick={() => setFilter(d)}>
              {d} · {countFor(d)}
            </FilterButton>
          ))}
          {orcid && (
            <OrcidLink
              href={`https://orcid.org/${orcid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>iD</b> ORCID <FiExternalLink size={10} />
            </OrcidLink>
          )}
        </FilterRow>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={filter}
            variants={revealVariants.container}
            initial="hidden"
            animate="visible"
          >
            {showFeatured && (
              <Featured
                variants={revealVariants.item}
                onMouseMove={trackSpotlight}
                $spot="rgba(212, 165, 116, 0.08)"
                $spotBorder="rgba(212, 165, 116, 0.5)"
              >
                <FeaturedChips>
                  <Chip $color="#D4A574">First Author</Chip>
                  <Chip $color="#D4A574">{featured.venueNote}</Chip>
                  <Chip $color={domainAccent[featured.domain]}>{featured.domain}</Chip>
                  <Chip>{featured.year}</Chip>
                </FeaturedChips>
                <FeaturedTitle>{featured.title}</FeaturedTitle>
                <FeaturedMeta>
                  {highlightAuthor(featured.authors)} · <i>{featured.venue}</i>
                </FeaturedMeta>
                <FeaturedDesc>{featured.description}</FeaturedDesc>
                <DoiLink href={featured.url} target="_blank" rel="noopener noreferrer">
                  doi:{featured.doi} <FiExternalLink size={11} />
                </DoiLink>
              </Featured>
            )}

            <Ledger>
              {visible.map((pub, i) => (
                <LedgerRow
                  key={pub.id}
                  href={pub.url || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={revealVariants.item}
                  $domain={pub.domain}
                >
                  <span className="num" aria-hidden="true">
                    {String(i + (showFeatured ? 2 : 1)).padStart(2, '0')}
                  </span>
                  <span>
                    <span className="title">{pub.title}</span>
                    <span className="venue">
                      <i>{pub.venue}</i>
                    </span>
                  </span>
                  <span className="right">
                    <span className="year">{pub.year}</span>
                    <span className="domain">{pub.domain}</span>
                  </span>
                </LedgerRow>
              ))}
            </Ledger>

            <SubHeading variants={revealVariants.item}>Patents</SubHeading>
            <PatentGrid variants={revealVariants.container}>
              {(filter === 'All' ? patents : patents.filter(p => p.domain === filter)).map(
                patent => (
                  <PatentCard
                    key={patent.id}
                    variants={revealVariants.item}
                    onMouseMove={trackSpotlight}
                    $granted={patent.granted}
                    $spot={patent.granted ? 'rgba(212, 165, 116, 0.08)' : undefined}
                    $spotBorder={patent.granted ? 'rgba(212, 165, 116, 0.5)' : undefined}
                  >
                    <PatentTitle>{patent.title}</PatentTitle>
                    {patent.grants.map(grant => (
                      <GrantRow key={grant.number}>
                        <StatusChip $granted={grant.status === 'Granted'}>
                          {grant.status}
                        </StatusChip>
                        <span className="label">{grant.label}</span>
                        <span className="number">
                          {grant.number} · {grant.date}
                        </span>
                      </GrantRow>
                    ))}
                  </PatentCard>
                )
              )}
            </PatentGrid>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default Research;
