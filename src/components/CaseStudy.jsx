import React, { useEffect, useRef } from 'react';
import { Arrow } from './StoryUI';
import ProjectArt from './ProjectArt';
import { projectStories } from '../config/story';

export default function CaseStudy({ project, onClose }) {
  const dialog = useRef(null);
  const story = projectStories[project.id];
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      aria-labelledby="case-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            onClose();
        }
      }}
    >
      <div className="dialog-header">
        <span className="eyebrow">PROJECT STUDY / {project.date}</span>
        <button
          className="dialog-close"
          onClick={onClose}
          aria-label="Close case study"
          autoFocus
        >
          ×
        </button>
      </div>
      <div className="dialog-content">
        <h2 id="case-title">{project.name}</h2>
        <p>{story.question || story.summary}</p>
        <ProjectArt kind={story.visual} />
        <span className="eyebrow">THE APPROACH</span>
        <p className="case-description">{project.description}</p>
        <dl className="case-metrics">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
        <p className="case-note">
          Project-level results and methods. The visualization is illustrative;
          it does not display live clinical data.
        </p>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="button primary"
        >
          Explore the source <Arrow diagonal />
        </a>
        {project.imageUrl && (
          <details className="original-preview">
            <summary>View original project illustration</summary>
            <img
              src={project.imageUrl}
              alt={project.name + ' project illustration'}
              loading="lazy"
              width="2752"
              height="1536"
            />
          </details>
        )}
      </div>
    </dialog>
  );
}
