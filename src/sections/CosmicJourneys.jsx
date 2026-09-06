import React, {
  Component,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import personalInfo from '../config/personalInfo';
import { SectionHeading } from '../components/StoryUI';
const Globe = lazy(() => import('../three/Globe'));
const places = personalInfo.visitedPlaces;
const legs = personalInfo.itinerary.map((leg) => ({
  ...leg,
  place: places.find((p) => p.id === leg.placeId),
}));
const careerIds = new Set(legs.map((leg) => leg.placeId));
const excursions = places.filter((place) => !careerIds.has(place.id));

class GlobeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="globe-message">
        The interactive globe is unavailable in this browser. Explore every
        place using the log beside it.
      </p>
    ) : (
      this.props.children
    );
  }
}

export default function CosmicJourneys() {
  const root = useRef(null);
  const [active, setActive] = useState(false),
    [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null),
    [hovered, setHovered] = useState(null);
  const [playing, setPlaying] = useState(true),
    [replay, setReplay] = useState(0);
  const focus = hovered || selected;
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: '180px' }
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const select = (place) => {
    setSelected(place);
    setHovered(null);
  };
  return (
    <section
      id="journeys"
      ref={root}
      data-chapter
      className="chapter-section expeditions-section"
    >
      <div className="container">
        <SectionHeading
          number="05"
          label="EXPEDITIONS"
          title={
            <>
              Exploration <span className="cyan">Log.</span>
            </>
          }
        >
          The places that shaped the person behind the research. Follow the
          career route, spin the globe, or choose a coordinate to explore.
        </SectionHeading>
        <div className="expedition-deck">
          <div className="expedition-orbit">
            <div className="globe-viewport">
              <div className="globe-hud">
                <span>EARTH / EXPLORATION ATLAS</span>
                <span>
                  {places.length} WAYPOINTS ·{' '}
                  {
                    new Set(places.map((p) => p.name.split(',').at(-1).trim()))
                      .size
                  }{' '}
                  COUNTRIES
                </span>
              </div>
              {loaded && (
                <GlobeBoundary>
                  <Suspense
                    fallback={
                      <p className="globe-message">Opening the atlas…</p>
                    }
                  >
                    <Globe
                      places={places}
                      itinerary={personalInfo.itinerary}
                      focusPlace={focus}
                      onSelect={select}
                      active={active}
                      playing={playing}
                      replay={replay}
                    />
                  </Suspense>
                </GlobeBoundary>
              )}
              <div className="globe-legend">
                <span>
                  <i />
                  Career trajectory
                </span>
                <span>
                  <i />
                  Field excursions
                </span>
                <span>
                  <i />
                  Current station
                </span>
              </div>
              <span className="globe-drag-hint">
                DRAG TO ROTATE · SELECT A PLACE TO FLY THERE
              </span>
            </div>
            <div className="globe-controls">
              <button
                onClick={() => {
                  setSelected(null);
                  setHovered(null);
                  setPlaying((value) => !value);
                }}
              >
                {playing ? 'Pause globe' : 'Play globe'}
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setHovered(null);
                  setPlaying(true);
                  setReplay((n) => n + 1);
                }}
              >
                Replay career route ↻
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setHovered(null);
                }}
              >
                Free exploration
              </button>
            </div>
            <div className="expedition-readout" aria-live="polite">
              {focus ? (
                <>
                  <span className="eyebrow">SELECTED COORDINATE</span>
                  <h3>{focus.name}</h3>
                  <p>{focus.story || focus.significance}</p>
                  <span className="coordinate-value">
                    {Math.abs(focus.coordinates[1]).toFixed(2)}°{' '}
                    {focus.coordinates[1] >= 0 ? 'N' : 'S'} /{' '}
                    {Math.abs(focus.coordinates[0]).toFixed(2)}°{' '}
                    {focus.coordinates[0] >= 0 ? 'E' : 'W'}
                  </span>
                </>
              ) : (
                <>
                  <span className="eyebrow">AN OPEN-ENDED JOURNEY</span>
                  <h3>Curiosity has coordinates.</h3>
                  <p>
                    Cyan arcs trace the career route. Select a log entry or a
                    globe marker to bring a place into view.
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="exploration-log">
            <h3>
              Career trajectory{' '}
              <span>01 — {String(legs.length).padStart(2, '0')}</span>
            </h3>
            <div className="career-route">
              {legs.map((leg) => (
                <button
                  key={leg.placeId}
                  aria-pressed={selected?.id === leg.placeId}
                  className="career-stop"
                  onClick={() => select(leg.place)}
                  onMouseEnter={() => setHovered(leg.place)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span>{leg.current ? 'NOW' : leg.year}</span>
                  <div>
                    <strong>{leg.place.name.split(',')[0]}</strong>
                    <small>{leg.label}</small>
                  </div>
                  <span>↗</span>
                </button>
              ))}
            </div>
            <h3>
              Field excursions <span>{excursions.length} PLACES</span>
            </h3>
            <div className="excursion-chips">
              {excursions.map((place) => (
                <button
                  key={place.id}
                  aria-pressed={selected?.id === place.id}
                  onClick={() => select(place)}
                  onMouseEnter={() => setHovered(place)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {place.name.replace(/, [^,]+$/, '')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
