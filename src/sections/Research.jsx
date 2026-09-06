import React, { useState } from 'react';
import personalInfo from '../config/personalInfo';
import { researchLenses } from '../config/story';
import { Arrow, SectionHeading, Reveal } from '../components/StoryUI';

function ResearchNetwork({ lens }) {
  return (
    <div className={'research-network lens-' + lens} aria-hidden="true">
      <svg viewBox="0 0 420 300" fill="none">
        {[50, 90, 130].map((r) => (
          <circle
            key={r}
            cx="210"
            cy="150"
            r={r}
            stroke="#53e3d5"
            strokeOpacity=".09"
            strokeDasharray={r === 130 ? '2 5' : undefined}
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((n) => {
          const angle = (n * Math.PI) / 3;
          const x = 210 + Math.cos(angle) * 112,
            y = 150 + Math.sin(angle) * 101;
          return (
            <g key={n}>
              <path
                className="network-connection"
                d={'M210 150L' + x + ' ' + y}
                stroke="#53e3d5"
                strokeOpacity=".4"
                strokeDasharray="4 7"
              />
              <circle
                cx={x}
                cy={y}
                r="21"
                fill="#0c2024"
                stroke="#53e3d5"
                strokeOpacity=".4"
              />
              <path
                d={'M' + (x - 6) + ' ' + y + 'h12m-6-6v12'}
                stroke="#75eadd"
              />
              <circle
                cx={x}
                cy={y}
                r="29"
                stroke="#53e3d5"
                strokeOpacity=".08"
              />
            </g>
          );
        })}
        <circle
          cx="210"
          cy="150"
          r="41"
          fill="#0d2629"
          stroke="#53e3d5"
          strokeOpacity=".8"
        />
        <circle cx="210" cy="150" r="31" stroke="#53e3d5" strokeOpacity=".2" />
        {lens === 'privacy' ? (
          <>
            <path
              d="M200 150v-8a10 10 0 0 1 20 0v8m-24 0h28v20h-28z"
              stroke="#7df5e5"
              strokeWidth="1.5"
            />
            <circle cx="210" cy="160" r="2" fill="#7df5e5" />
          </>
        ) : lens === 'perception' ? (
          <>
            <path
              d="M187 150q23-30 46 0-23 30-46 0Z"
              stroke="#7df5e5"
              strokeWidth="1.5"
            />
            <circle cx="210" cy="150" r="8" stroke="#7df5e5" />
          </>
        ) : (
          <>
            <rect
              x="197"
              y="137"
              width="26"
              height="26"
              rx="3"
              stroke="#7df5e5"
            />
            <path
              d="M202 137v-8m8 8v-8m8 8v-8m-16 34v8m8-8v8m8-8v8m-21-27h-8m8 9h-8m34-9h8m-8 9h8"
              stroke="#7df5e5"
            />
            <rect
              x="204"
              y="144"
              width="12"
              height="12"
              fill="#7df5e5"
              fillOpacity=".3"
            />
          </>
        )}
        <text
          x="210"
          y="285"
          textAnchor="middle"
          fill="#8aadb1"
          fontSize="7"
          fontFamily="monospace"
        >
          {lens === 'privacy'
            ? 'CONNECTED KNOWLEDGE. INDIVIDUAL PRIVACY.'
            : lens === 'perception'
              ? 'LESS SUPERVISION. NEW PERSPECTIVES.'
              : 'COMPLEX BIOLOGY. COMPUTATIONAL POSSIBILITY.'}
        </text>
      </svg>
    </div>
  );
}

export default function Research() {
  const [lensId, setLensId] = useState('privacy');
  const [expanded, setExpanded] = useState(false);
  const lens = researchLenses.find((item) => item.id === lensId);
  const paper = personalInfo.publications.find(
    (item) => item.id === lens.publicationId
  );
  const papers = expanded
    ? personalInfo.publications
    : personalInfo.publications.slice(0, 3);
  return (
    <section
      id="research"
      data-chapter
      className="chapter-section research-section"
    >
      <div className="container">
        <SectionHeading
          number="03"
          label="THE EVIDENCE"
          title={
            <>
              Curiosity. Tested.
              <br />
              <span className="cyan">Then tested again.</span>
            </>
          }
        >
          Better models begin with better questions. Exploring intelligence that
          is useful, interpretable, and worthy of trust.
        </SectionHeading>
        <Reveal className="research-feature">
          <div className="research-feature-copy">
            <div
              className="lens-tabs"
              role="group"
              aria-label="Explore research themes"
            >
              {researchLenses.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLensId(item.id)}
                  aria-pressed={lensId === item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div key={lensId} className="lens-content" aria-live="polite">
              <h3>{lens.title}</h3>
              <p>{lens.description}</p>
              <div className="project-tags">
                {lens.terms.map((term) => (
                  <span key={term}>{term}</span>
                ))}
              </div>
              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Read the related paper <Arrow diagonal />
              </a>
            </div>
          </div>
          <ResearchNetwork lens={lensId} />
        </Reveal>
        <div className="publication-heading">
          <span className="eyebrow">THE PUBLICATION LEDGER</span>
          <a
            href={'https://orcid.org/' + personalInfo.orcid}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            ORCID profile <Arrow diagonal />
          </a>
        </div>
        <div className="publication-list">
          {papers.map((publication, i) => (
            <details className="publication" key={publication.id}>
              <summary>
                <span className="publication-index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="publication-venue">
                    {publication.venue}
                    {publication.venueNote ? ' · ' + publication.venueNote : ''}
                    {publication.firstAuthor && (
                      <span className="first-author">FIRST AUTHOR</span>
                    )}
                  </span>
                  <h3>{publication.title}</h3>
                </div>
                <span className="publication-year">{publication.year}</span>
                <span className="expand-symbol">+</span>
              </summary>
              <div className="publication-detail">
                <p>{publication.description}</p>
                <p className="publication-authors">
                  {publication.authors.join(', ')}
                </p>
                <a
                  className="text-link"
                  href={publication.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read publication <Arrow diagonal />
                </a>
              </div>
            </details>
          ))}
        </div>
        <button
          className="ledger-toggle text-link"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded
            ? 'Show selected publications'
            : 'View all ' +
              personalInfo.publications.length +
              ' publications'}{' '}
          <span>{expanded ? '−' : '+'}</span>
        </button>
        <div className="patent-ledger">
          <div>
            <span className="eyebrow">IDEAS INTO INVENTIONS</span>
            <h3>Beyond the paper.</h3>
          </div>
          <div>
            {personalInfo.patents.map((patent) => (
              <details key={patent.id} className="patent">
                <summary>
                  <span
                    className={
                      patent.granted ? 'patent-status granted' : 'patent-status'
                    }
                  >
                    {patent.granted ? 'GRANTED' : 'PUBLISHED'}
                  </span>
                  <span>{patent.title}</span>
                  <span>+</span>
                </summary>
                <ul>
                  {patent.grants.map((grant) => (
                    <li key={grant.number}>
                      {grant.label} · {grant.number}
                      <br />
                      {grant.status} · {grant.date}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
