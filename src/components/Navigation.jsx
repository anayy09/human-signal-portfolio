import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import personalInfo from '../config/personalInfo';
import { Arrow, chapters, Pulse } from './StoryUI';

export default function Navigation({ chapter }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return (
    <>
      <header className="site-header">
        <div className="header-inner flex items-center justify-between">
          <a
            href="#overview"
            className="brand"
            aria-label={personalInfo.name + ', back to overview'}
            onClick={() => setOpen(false)}
          >
            <span className="brand-mark">
              <Pulse />
            </span>
            <span>
              {personalInfo.name}
              <small>RESEARCH × ENGINEERING</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {chapters.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={'#' + item.id}
                aria-current={chapter === item.id ? 'location' : undefined}
              >
                {item.nav}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="cv-link" to={personalInfo.cv}>
              Résumé <Arrow diagonal />
            </Link>
            <a className="button header-cta" href="#contact">
              Let’s connect <Arrow diagonal />
            </a>
            <button
              ref={menuButton}
              className="menu-toggle"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? (
                '✕'
              ) : (
                <>
                  <span />
                  <span />
                </>
              )}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {chapters.map((item, index) => (
              <a
                key={item.id}
                href={'#' + item.id}
                onClick={() => setOpen(false)}
              >
                <span>0{index + 1}</span>
                {item.nav}
                <Arrow />
              </a>
            ))}
            <Link to={personalInfo.cv}>
              View résumé <Arrow diagonal />
            </Link>
          </nav>
        )}
      </header>
      <nav className="chapter-rail" aria-label="Story chapters">
        {chapters.map((item, index) => (
          <a
            href={'#' + item.id}
            key={item.id}
            className={chapter === item.id ? 'active' : ''}
            aria-label={'Chapter ' + (index + 1) + ': ' + item.label}
            aria-current={chapter === item.id ? 'step' : undefined}
          >
            <span className="rail-tooltip">{item.label}</span>
            <span className="rail-index">0{index + 1}</span>
            <i />
          </a>
        ))}
      </nav>
    </>
  );
}
