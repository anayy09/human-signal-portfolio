import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import ResearchArt from '../components/ResearchArt';
import { Arrow } from '../components/StoryUI';

const moments = [
  {
    mode: 'signal-field',
    artwork: 'Living signal field',
    kicker: '01 / OBSERVE',
    title: 'First, listen.',
    phrase: 'A heartbeat. A waveform. A change over time.',
    text: 'Before there is a prediction, there is a signal. My work begins with the messy, incomplete traces that people leave in clinical data.',
    note: 'Physiological signals · Longitudinal health data',
  },
  {
    mode: 'latent-atlas',
    artwork: 'Latent atlas',
    kicker: '02 / UNDERSTAND',
    title: 'Find the pattern.',
    phrase: 'Complexity becomes a question we can test.',
    text: 'Models connect images, language, and time. The challenge is understanding what they learn, where they fail, and when their confidence deserves our trust.',
    note: 'Representation learning · Interpretability · Uncertainty',
  },
  {
    mode: 'compute-fabric',
    artwork: 'Compute fabric',
    kicker: '03 / CONNECT',
    title: 'Make it matter.',
    phrase: 'The model is part of something much larger.',
    text: 'A useful idea needs a system around it: reproducible pipelines, scalable computation, and careful validation. That is where my research meets engineering.',
    note: 'High-performance computing · Clinical infrastructure',
  },
];

export default function ResearchStory() {
  const root = useRef(null);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ['start start', 'end end'],
  });
  const line = useTransform(scrollYProgress, [0, 1], [0.02, 1]);
  useMotionValueEvent(scrollYProgress, 'change', (value) =>
    setIndex(Math.min(2, Math.floor(value * 3)))
  );
  const moment = moments[index];
  function goTo(next) {
    const element = root.current;
    const top = element.getBoundingClientRect().top + window.scrollY;
    const distance = element.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * (next === 0 ? 0.02 : (next + 0.2) / 3),
      behavior: reduced ? 'instant' : 'smooth',
    });
  }
  return (
    <section
      ref={root}
      id="research-story"
      className="research-story"
      aria-label="An interactive research story"
    >
      <div className="story-sticky">
        <div className="story-top container">
          <span className="eyebrow">
            THE HUMAN SIGNAL / A STORY IN THREE MOVEMENTS
          </span>
          <a href="#work">
            Skip to selected work <Arrow />
          </a>
        </div>
        <div className="story-scene container">
          <div className="story-words" aria-live="polite">
            <span className="eyebrow">{moment.kicker}</span>
            <motion.div
              key={index}
              initial={
                reduced ? false : { opacity: 0, y: 35, filter: 'blur(8px)' }
              }
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.65 }}
            >
              <h2>{moment.title}</h2>
              <h3>{moment.phrase}</h3>
              <p>{moment.text}</p>
              <span className="story-methods">{moment.note}</span>
            </motion.div>
          </div>
          <div className="story-art">
            <button
              className="story-playback"
              onClick={() => setPlaying((value) => !value)}
              aria-label={
                playing ? 'Pause research story' : 'Play research story'
              }
            >
              {playing ? 'Ⅱ Pause' : '▶ Play'}
            </button>
            <ResearchArt mode={moment.mode} playing={playing} />
            <span className="story-art-caption">
              ILLUSTRATIVE RESEARCH STUDY / {moment.artwork.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="story-controls container">
          <div className="story-progress">
            <motion.div style={{ scaleX: line }} />
          </div>
          <div
            className="story-step-buttons"
            role="group"
            aria-label="Research story movements"
          >
            {moments.map((item, i) => (
              <button
                key={item.mode}
                aria-pressed={i === index}
                onClick={() => goTo(i)}
              >
                <span>0{i + 1}</span>
                {item.title}
              </button>
            ))}
          </div>
          <span className="story-scroll-note">SCROLL TO CONTINUE ↓</span>
        </div>
      </div>
    </section>
  );
}
