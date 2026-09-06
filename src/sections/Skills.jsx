import React from 'react';
import personalInfo from '../config/personalInfo';
import { Reveal } from '../components/StoryUI';

export default function Skills() {
  return (
    <section id="skills" className="skills-section container">
      <Reveal>
        <div className="skills-heading">
          <span className="eyebrow">THE TOOLKIT</span>
          <h2>Ideas need good instruments.</h2>
        </div>
        <div className="skills-grid">
          {personalInfo.skillCategories.map((category) => (
            <div key={category.id} className="skill-category">
              <span className="skill-index">{category.index} /</span>
              <h3>{category.title}</h3>
              <div className="skill-list">
                {category.skills.map((skill) => (
                  <span key={skill.name} title={skill.context + ' use'}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="honors">
          <span className="eyebrow">ALONG THE WAY</span>
          {personalInfo.awards.map((award) => (
            <div key={award.title}>
              <span>✧</span>
              <p>
                {award.title}
                <small>
                  {award.org} · {award.year}
                </small>
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
