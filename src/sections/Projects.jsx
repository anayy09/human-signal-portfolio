import React, { lazy, Suspense, useState } from 'react';
import personalInfo from '../config/personalInfo';
import { featuredProjectIds, projectStories } from '../config/story';
import { Arrow, SectionHeading } from '../components/StoryUI';
import ProjectArt from '../components/ProjectArt';
const CaseStudy = lazy(() => import('../components/CaseStudy'));
const filters = [
  { id: 'featured', label: 'Selected work' },
  { id: 'health', label: 'Clinical AI' },
  { id: 'systems', label: 'Systems' },
  { id: 'all', label: 'All projects' },
];

export default function Projects() {
  const [filter, setFilter] = useState('featured');
  const [selected, setSelected] = useState(null);
  const projects =
    filter === 'featured'
      ? featuredProjectIds
          .map((id) =>
            personalInfo.projects.find((project) => project.id === id)
          )
          .filter(Boolean)
      : personalInfo.projects.filter(
          (project) => filter === 'all' || project.domain === filter
        );
  return (
    <section id="work" data-chapter className="chapter-section work-section">
      <div className="container">
        <SectionHeading
          number="02"
          label="THE EXPERIMENTS"
          title={
            <>
              From possibility to <span className="cyan">proof.</span>
            </>
          }
        >
          Research becomes real when you build it. A selection of systems
          exploring what healthcare could be.
        </SectionHeading>
        <div className="filter-bar" role="group" aria-label="Filter projects">
          {filters.map((item) => (
            <button
              key={item.id}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
          <span className="project-count" role="status">
            {String(projects.length).padStart(2, '0')} STUDIES
          </span>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <button
                className="project-open"
                aria-label={'Explore ' + project.name + ' case study'}
                onClick={() => setSelected(project)}
              >
                <ProjectArt kind={projectStories[project.id].visual} />
                <div className="project-info">
                  <div className="project-meta">
                    <span>
                      {project.domain === 'health'
                        ? 'HEALTHCARE × AI'
                        : project.domain === 'nlp'
                          ? 'LANGUAGE × INTELLIGENCE'
                          : 'DATA × SYSTEMS'}
                    </span>
                    <span>{project.date}</span>
                  </div>
                  <h3>
                    {project.name}
                    <Arrow diagonal />
                  </h3>
                  <p>{projectStories[project.id].summary}</p>
                  <div className="project-tags">
                    {projectStories[project.id].tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
        <div className="project-bottom">
          <p>Each experiment starts with a better question.</p>
          <a
            className="text-link"
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
          >
            More on GitHub <Arrow diagonal />
          </a>
        </div>
        {selected && (
          <Suspense
            fallback={
              <div className="case-loading" role="status">
                Opening study…
              </div>
            }
          >
            <CaseStudy project={selected} onClose={() => setSelected(null)} />
          </Suspense>
        )}
      </div>
    </section>
  );
}
