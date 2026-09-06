import React from 'react';
import personalInfo from '../config/personalInfo';
import { Reveal, Arrow } from '../components/StoryUI';

export default function About() {
  return (
    <div id="about">
      <div className="metrics-band">
        <div className="metrics-inner container">
          <div className="metric">
            <strong>
              {String(personalInfo.publications.length).padStart(2, '0')}
              <span>↗</span>
            </strong>
            <span>
              Peer-reviewed
              <br />
              publications
            </span>
          </div>
          <div className="metric">
            <strong>
              {String(personalInfo.patents.length).padStart(2, '0')}
            </strong>
            <span>
              Patents
              <br />& applications
            </span>
          </div>
          <div className="metric">
            <strong>
              {String(personalInfo.experience.length).padStart(2, '0')}
              <span>+</span>
            </strong>
            <span>
              Institutions.
              <br />
              One curiosity.
            </span>
          </div>
          <div className="affiliation">
            <img src="/logos/uf.png" alt="" width="37" height="37" />
            <div>
              <small>CURRENTLY BUILDING AT</small>
              <strong>{personalInfo.education[0].organization}</strong>
              <span>{personalInfo.experience[0].organization}</span>
            </div>
          </div>
        </div>
      </div>
      <Reveal className="about-grid container">
        <div>
          <span className="eyebrow">
            <span className="chapter-number">01</span> THE SPARK
          </span>
          <h2>
            Behind every data point,
            <br />
            there’s <span>a human story.</span>
          </h2>
        </div>
        <div>
          <p>{personalInfo.about.intro}</p>
          <a href="#research" className="text-link">
            Get to know my research <Arrow />
          </a>
        </div>
      </Reveal>
    </div>
  );
}
