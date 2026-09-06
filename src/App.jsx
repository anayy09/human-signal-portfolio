import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import ResearchStory from './sections/ResearchStory';
import CosmicJourneys from './sections/CosmicJourneys';
import Projects from './sections/Projects';
import Research from './sections/Research';
import Timeline from './sections/Timeline';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import './styles/story.css';
import './styles/immersive.css';

const CVViewer = lazy(() => import('./components/CVViewer'));

function Portfolio() {
  const [chapter, setChapter] = useState('overview');
  useEffect(() => {
    // A direct hash URL arrives before React has created the target section.
    let mounted = true;
    const anchor = window.location.hash.slice(1);
    if (anchor)
      document.fonts.ready.then(() => {
        if (mounted)
          document
            .getElementById(anchor)
            ?.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setChapter(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    );
    document
      .querySelectorAll('[data-chapter]')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navigation chapter={chapter} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <ResearchStory />
        <Projects />
        <Research />
        <Timeline />
        <Skills />
        <CosmicJourneys />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route
            path="/cv"
            element={
              <Suspense
                fallback={
                  <p className="route-loading">Opening curriculum vitae…</p>
                }
              >
                <CVViewer />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <div className="not-found">
                <span className="eyebrow">404 / SIGNAL NOT FOUND</span>
                <h1>A little off course.</h1>
                <a href="/" className="button primary">
                  Return to the story ↗
                </a>
              </div>
            }
          />
        </Routes>
      </MotionConfig>
    </BrowserRouter>
  );
}
