import React, { Suspense, lazy, useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import GlobalStyles from './styles/GlobalStyles';
import theme from './config/theme';
import personalInfo from './config/personalInfo';
import Navigation from './components/Navigation';
import CosmicLoader from './components/CosmicLoader';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Timeline from './sections/Timeline';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Research from './sections/Research';
import Contact from './sections/Contact';

// Heavy, below-the-fold or off-route: split out of the main chunk.
// The sky itself is async too; the calibration veil covers its arrival.
const CosmicBackground = lazy(() => import('./components/CosmicBackground'));
const CosmicJourneys = lazy(() => import('./sections/CosmicJourneys'));
const CVViewer = lazy(() => import('./components/CVViewer'));

const VISITED_KEY = 'observatory-visited';

function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero
          name={personalInfo.name}
          title={personalInfo.title}
          description={personalInfo.description}
          github={personalInfo.github}
          linkedin={personalInfo.linkedin}
          email={personalInfo.email}
          cv={personalInfo.cv}
          orcid={personalInfo.orcid}
        />
        <About about={personalInfo.about} />
        <Timeline
          education={personalInfo.education}
          experience={personalInfo.experience}
        />
        <Projects projects={personalInfo.projects} />
        <Skills skillCategories={personalInfo.skillCategories} />
        <Research
          publications={personalInfo.publications}
          patents={personalInfo.patents}
          orcid={personalInfo.orcid}
        />
        <Suspense fallback={null}>
          <CosmicJourneys />
        </Suspense>
        <Contact
          email={personalInfo.email}
          linkedin={personalInfo.linkedin}
          github={personalInfo.github}
          orcid={personalInfo.orcid}
        />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  // First visit this session: brief calibration veil while WebGL warms below.
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem(VISITED_KEY);
    } catch {
      return true;
    }
  });

  const finishLoading = useCallback(() => {
    try {
      sessionStorage.setItem(VISITED_KEY, '1');
    } catch {
      /* private mode: just skip persistence */
    }
    setLoading(false);
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <MotionConfig reducedMotion="user">
          <GlobalStyles />
          <Suspense fallback={null}>
            <CosmicBackground />
          </Suspense>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/cv"
              element={
                <Suspense fallback={null}>
                  <CVViewer />
                </Suspense>
              }
            />
          </Routes>
          <AnimatePresence>
            {loading && <CosmicLoader onDone={finishLoading} />}
          </AnimatePresence>
        </MotionConfig>
      </ThemeProvider>
    </Router>
  );
}
