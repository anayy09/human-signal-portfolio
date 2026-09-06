import React from 'react';
import { Link } from 'react-router-dom';
import personalInfo from '../config/personalInfo';
import { Arrow } from './StoryUI';
export default function CVViewer() {
  return (
    <main className="cv-page container">
      <header>
        <Link to="/" className="text-link">
          ← Back to the story
        </Link>
        <div>
          <span className="eyebrow">THE FULL PICTURE</span>
          <h1>Curriculum vitae.</h1>
        </div>
        <a href="/CV_Sinhal_Anay.pdf" download className="button primary">
          Download PDF <Arrow diagonal />
        </a>
      </header>
      <p className="cv-fallback">
        If the preview is unavailable,{' '}
        <a href="/CV_Sinhal_Anay.pdf" target="_blank" rel="noreferrer">
          open the PDF in a new tab ↗
        </a>
        .
      </p>
      <iframe
        src="/CV_Sinhal_Anay.pdf#toolbar=1&navpanes=0"
        title={personalInfo.name + ', curriculum vitae'}
      />
    </main>
  );
}
