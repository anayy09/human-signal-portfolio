import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import personalInfo from '../config/personalInfo';
import { SectionHeading, Arrow } from '../components/StoryUI';

export default function Timeline() {
  const [view, setView] = useState('experience');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const entries = personalInfo[view];
  const selected = entries[selectedIndex];

  return (
    <section
      id="journey"
      data-chapter
      className="chapter-section journey-section"
    >
      <div className="container">
        <SectionHeading
          number="04"
          label="THE EVOLUTION"
          title={
            <>
              A curious mind.
              <br />
              <span className="cyan">An unfolding journey.</span>
            </>
          }
        >
          Different places. Different problems. The same drive to connect ideas
          and build something that matters.
        </SectionHeading>
        <div
          className="journey-tabs"
          role="group"
          aria-label="Career timeline type"
        >
          {['experience', 'education'].map((tab) => (
            <button
              key={tab}
              aria-pressed={view === tab}
              onClick={() => {
                setView(tab);
                setSelectedIndex(0);
              }}
            >
              {tab === 'experience' ? 'Research & experience' : 'Education'}
            </button>
          ))}
        </div>
        <div className="journey-grid">
          <div
            className="timeline-nodes"
            role="group"
            aria-label={
              view === 'experience' ? 'Select experience' : 'Select education'
            }
          >
            {entries.map((entry, index) => (
              <button
                className={
                  'timeline-node ' + (index === selectedIndex ? 'selected' : '')
                }
                key={entry.organization + entry.title}
                aria-pressed={index === selectedIndex}
                onClick={() => setSelectedIndex(index)}
              >
                <span className="timeline-dot" />
                <span className="timeline-date">
                  {entry.startDate} — {entry.endDate}
                </span>
                <strong>{entry.organization}</strong>
                <span className="timeline-role">{entry.title}</span>
                <Arrow diagonal />
              </button>
            ))}
          </div>
          <div className="journey-detail" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article
                key={view + selectedIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="journey-detail-top">
                  <img
                    src={selected.logoUrl}
                    alt=""
                    width="52"
                    height="52"
                    loading="lazy"
                  />
                  <span className="eyebrow">
                    {selected.endDate === 'Present'
                      ? 'CURRENT CHAPTER'
                      : 'CAREER CHAPTER'}
                  </span>
                </div>
                <span className="journey-org">{selected.organization}</span>
                <h3>{selected.title}</h3>
                <span className="journey-period">
                  {selected.startDate} — {selected.endDate}
                  {selected.location ? ' / ' + selected.location : ''}
                </span>
                <p>{selected.description}</p>
                {selected.award && (
                  <div className="award-note">✧ {selected.award}</div>
                )}
                <div className="project-tags">
                  {selected.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <a href={personalInfo.cv} className="text-link">
                  The full story in my CV <Arrow diagonal />
                </a>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
