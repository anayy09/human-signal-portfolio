import React from 'react';
import personalInfo from '../config/personalInfo';
import { Arrow } from './StoryUI';
export default function Footer() {
  return (
    <footer className="site-footer container">
      <a href="#overview" className="footer-name">
        {personalInfo.name}
        <span>Research with purpose. Engineering with care.</span>
      </a>
      <span className="footer-copyright">
        © {new Date().getFullYear()} {personalInfo.name}
      </span>
      <a href="#overview" className="back-top">
        Back to the beginning <Arrow diagonal />
      </a>
    </footer>
  );
}
