import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import personalInfo from '../config/personalInfo';
import NeuralScene from '../components/NeuralScene';
import { Arrow } from '../components/StoryUI';

const layers = {
  intelligence: {
    label: 'Intelligence',
    title: 'A model is only the beginning.',
    detail:
      'A rotating neural structure explores learned representations. Drag to inspect it; change the speed to follow the activity.',
    code: 'NEURAL REPRESENTATION',
    action: 'Explore clinical AI research',
    paper: 'pub-fcl',
    hint: 'DRAG TO ROTATE',
    parameter: 'Rotation speed',
  },
  signals: {
    label: 'Signals',
    title: 'Listen before you predict.',
    detail:
      'Cardiac, neural, and respiratory rhythms unfold together. Change the playback rate to inspect how patterns develop over time.',
    code: 'PHYSIOLOGICAL SIGNALS',
    action: 'Read the wearable-signal research',
    paper: 'pub-stress',
    hint: 'THREE SIGNALS / ONE TIMELINE',
    parameter: 'Signal playback rate',
  },
  systems: {
    label: 'Systems',
    title: 'Intelligence moves through a system.',
    detail:
      'Watch updates travel between sites, computation, validation, and a shared model. Change the rate to follow the flow.',
    code: 'DISTRIBUTED COMPUTATION',
    action: 'Explore HPC research',
    paper: 'pub-quantum',
    hint: 'FOLLOW THE MODEL UPDATES',
    parameter: 'Transfer playback rate',
  },
};
export default function Hero() {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState('intelligence'),
    [playing, setPlaying] = useState(true),
    [speed, setSpeed] = useState(1);
  const layer = layers[mode],
    paper = personalInfo.publications.find((p) => p.id === layer.paper);
  return (
    <section id="overview" data-chapter className="hero container">
      <div className="hero-topline">
        <span className="eyebrow">
          <span className="status-dot" />
          AT THE INTERSECTION OF HUMAN & MACHINE
        </span>
        <span className="edition">PORTFOLIO / 2026</span>
      </div>
      <div className="hero-grid">
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-intro">
            <span className="tiny-cross">+</span>Hi, I’m{' '}
            {personalInfo.name.split(' ')[0]}.{' '}
            <span className="muted">Researcher. Engineer. Explorer.</span>
          </div>
          <h1>
            Intelligence.
            <br />
            With a{' '}
            <span className="human-word">
              human
              <svg viewBox="0 0 360 16" fill="none" aria-hidden="true">
                <path
                  d="M2 12C93 2 247 1 357 8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <br />
            heartbeat<span className="cyan">.</span>
          </h1>
          <p className="hero-description">
            I turn complex health data into meaningful intelligence. Building at
            the intersection of clinical AI, high-performance computing, and
            human care.
          </p>
          <div className="hero-buttons flex flex-wrap items-center gap-4">
            <a href="#research-story" className="button primary">
              Enter the story <Arrow diagonal />
            </a>
            <a href="#work" className="text-link">
              Explore my work <Arrow />
            </a>
          </div>
          <div className="hero-availability">
            <span className="status-dot" />
            {personalInfo.hero.status}
          </div>
        </motion.div>
        <div
          className={
            'neural-stage mode-' +
            mode +
            (playing ? ' is-playing' : ' is-paused')
          }
        >
          <div className="stage-top">
            <span>
              <i />
              {playing ? 'IN MOTION' : 'PAUSED'} / {layer.code}
            </span>
            <button
              className="animation-toggle"
              onClick={() => setPlaying((value) => !value)}
              aria-label={
                playing ? 'Pause visualization' : 'Play visualization'
              }
            >
              {playing ? 'Ⅱ Pause' : '▶ Play'}
            </button>
          </div>
          <div className="orbital orbital-one" />
          <div className="orbital orbital-two" />
          <NeuralScene mode={mode} playing={playing} speed={speed} />
          <div className="stage-bottom">
            <span className="crosshair">⊕</span>
            <span>{layer.hint}</span>
            <span>ILLUSTRATIVE / NO PATIENT DATA</span>
          </div>
        </div>
      </div>
      <div className="hero-console">
        <div
          className="layer-selector"
          role="group"
          aria-label="Explore research layers"
        >
          {Object.entries(layers).map(([key, item], i) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              aria-pressed={mode === key}
            >
              <span />0{i + 1} {item.label}
            </button>
          ))}
        </div>
        <div className="mode-inspector" aria-live="polite">
          <h2>{layer.title}</h2>
          <p>{layer.detail}</p>
          <a href={paper.url} target="_blank" rel="noreferrer">
            {layer.action}
            <Arrow diagonal />
          </a>
        </div>
        <label className="scene-speed">
          {layer.parameter}
          <input
            type="range"
            min=".3"
            max="2"
            step=".1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <output>{speed.toFixed(1)}×</output>
          <small>
            {playing ? 'Adjust the motion' : 'Press Play to animate'}
          </small>
        </label>
      </div>
      <div className="hero-bottom">
        <a href="#research-story" className="scroll-cue">
          <span className="scroll-mouse">
            <i />
          </span>
          SCROLL INTO THE STORY ↓
        </a>
        <a href="#journeys" className="text-link expedition-link">
          Expeditions / Exploration Log <Arrow diagonal />
        </a>
        <Link to={personalInfo.cv} className="text-link">
          View résumé <Arrow diagonal />
        </Link>
      </div>
    </section>
  );
}
