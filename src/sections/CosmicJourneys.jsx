import React, { useEffect, useMemo, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import personalInfo from '../config/personalInfo';
import {
  Section,
  Container,
  SectionHeader,
  revealVariants,
} from '../components/ui/Section';

// TopoJSON fetched from public/ so the geometry never enters the JS bundle
const WORLD_URL = '/maps/world.json';
const INDIA_URL = '/maps/india.json';

const LAVENDER = '#C9A0DC';

const MapControls = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
  margin: 2.25rem 0 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const MapToggle = styled.button`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.label};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.4rem 0.9rem;
  border-radius: ${p => p.theme.radius.pill};
  border: 1px solid ${p => (p.$active ? 'rgba(201, 160, 220, 0.4)' : 'rgba(91, 141, 239, 0.1)')};
  background: ${p => (p.$active ? 'rgba(201, 160, 220, 0.1)' : 'transparent')};
  color: ${p => (p.$active ? p.theme.colors.accent : p.theme.colors.subtle)};
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(201, 160, 220, 0.3);
    color: ${p => p.theme.colors.muted};
  }
`;

const FlightLog = styled.span`
  margin-left: auto;
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${p => p.theme.colors.subtle};

  b {
    font-weight: 500;
    color: ${p => p.theme.colors.accent};
  }
`;

const MapContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 520px;
  background: rgba(6, 9, 16, 0.97);
  border-radius: ${p => p.theme.radius.lg};
  border: 1px solid rgba(201, 160, 220, 0.09);
  overflow: hidden;

  @media (max-width: ${p => p.theme.breakpoints.tablet}) {
    height: 380px;
    border-radius: ${p => p.theme.radius.md};
  }

  @media (max-width: ${p => p.theme.breakpoints.mobile}) {
    height: 300px;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const MapChrome = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  pointer-events: none;
  z-index: 10;
`;

const MapStat = styled.div`
  font-family: ${p => p.theme.fonts.code};
  font-size: ${p => p.theme.type.tick};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(201, 160, 220, 0.35);

  span {
    color: rgba(201, 160, 220, 0.7);
  }
`;

const Tooltip = styled.div`
  position: fixed;
  background: rgba(8, 12, 20, 0.96);
  color: ${p => p.theme.colors.light};
  padding: 0.7rem 0.875rem;
  border-radius: ${p => p.theme.radius.md};
  font-size: 0.825rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  pointer-events: none;
  white-space: nowrap;
  z-index: 9999;
  border: 1px solid rgba(201, 160, 220, 0.15);
  max-width: 240px;

  h4 {
    margin: 0 0 0.3rem 0;
    font-size: 0.875rem;
    color: ${p => p.theme.colors.accent};
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 0.775rem;
    color: ${p => p.theme.colors.muted};
    white-space: normal;
    line-height: 1.5;
  }
`;

const mapConfigs = {
  world: {
    projectionConfig: { scale: 135, center: [0, 20] },
    zoom: { center: [0, 20], zoom: 1 },
    url: WORLD_URL,
    label: 'World map of visited places',
  },
  india: {
    projectionConfig: { scale: 825, center: [82, 22.5] },
    zoom: { center: [82, 22.5], zoom: 1 },
    url: INDIA_URL,
    label: 'India map of visited places',
  },
};

const CosmicJourneys = () => {
  const { visitedPlaces = [] } = personalInfo;
  const theme = useTheme();

  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [currentMap, setCurrentMap] = useState('world');
  const config = mapConfigs[currentMap];
  const [mapView, setMapView] = useState(config.zoom);

  useEffect(() => {
    setMapView(mapConfigs[currentMap].zoom);
  }, [currentMap]);

  useEffect(() => {
    if (!tooltipContent) return undefined;
    const handleMouseMove = e =>
      setTooltipPosition({ x: e.clientX + 15, y: e.clientY + 15 });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [tooltipContent]);

  const countries = useMemo(
    () =>
      new Set(visitedPlaces.map(place => place.name.split(',').pop().trim()))
        .size,
    [visitedPlaces]
  );

  const displayedPlaces =
    currentMap === 'india'
      ? visitedPlaces.filter(
          place =>
            place.coordinates[0] > 68 &&
            place.coordinates[0] < 98 &&
            place.coordinates[1] > 8 &&
            place.coordinates[1] < 37
        )
      : visitedPlaces;

  return (
    <Section id="journeys">
      <Container>
        <SectionHeader
          index="07"
          name="expeditions"
          title={<>Exploration <em>Log</em></>}
          accent={LAVENDER}
          intro="Every coordinate this observer has physically visited, charted like the sky above it."
        />

        <MapControls
          variants={revealVariants.container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <MapToggle $active={currentMap === 'world'} onClick={() => setCurrentMap('world')}>
            World
          </MapToggle>
          <MapToggle $active={currentMap === 'india'} onClick={() => setCurrentMap('india')}>
            India
          </MapToggle>
          <FlightLog>
            <b>{visitedPlaces.length}</b> waypoints · <b>{countries}</b> countries
          </FlightLog>
        </MapControls>

        <MapContainer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMap}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%' }}
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={config.projectionConfig}
                aria-label={config.label}
                width={800}
                height={500}
                style={{ width: '100%', height: '100%' }}
              >
                <ZoomableGroup
                  center={mapView.center}
                  zoom={mapView.zoom}
                  onMoveEnd={({ coordinates, zoom }) =>
                    setMapView({ center: coordinates, zoom })
                  }
                  minZoom={0.5}
                  maxZoom={10}
                >
                  <Geographies geography={config.url}>
                    {({ geographies }) =>
                      geographies.map(geo => {
                        const isIndia =
                          currentMap === 'world' &&
                          geo.properties &&
                          (geo.properties.GU_A3 === 'IND' ||
                            geo.properties.ISO_A3 === 'IND' ||
                            geo.properties.ADM0_A3 === 'IND' ||
                            String(geo.properties.SOVEREIGNT).toLowerCase() === 'india' ||
                            String(geo.properties.name).toLowerCase() === 'india');

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isIndia ? 'rgba(123, 104, 182, 0.55)' : 'rgba(14, 22, 38, 0.95)'}
                            stroke={isIndia ? 'rgba(201, 160, 220, 0.3)' : 'rgba(91, 141, 239, 0.06)'}
                            strokeWidth={0.5}
                            style={{
                              default: { outline: 'none', transition: 'fill 0.2s ease' },
                              hover: {
                                outline: 'none',
                                fill: isIndia
                                  ? 'rgba(201, 160, 220, 0.5)'
                                  : 'rgba(20, 32, 55, 1)',
                              },
                              pressed: { outline: 'none' },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {displayedPlaces.map(place => {
                    const currentZoom = mapView.zoom || 1;
                    const isHovered = hoveredMarker === place.id;
                    const dotR = Math.max(1.2, (isHovered ? 5.5 : 3.5) / currentZoom);
                    const ringR = Math.max(2, 9 / currentZoom);
                    const strokeW = Math.max(0.1, 0.5 / currentZoom);

                    return (
                      <Marker
                        key={place.id}
                        coordinates={place.coordinates}
                        onMouseEnter={() => {
                          setTooltipContent({
                            name: place.name,
                            story: place.story,
                            significance: place.significance,
                          });
                          setHoveredMarker(place.id);
                        }}
                        onMouseLeave={() => {
                          setTooltipContent(null);
                          setHoveredMarker(null);
                        }}
                      >
                        <motion.g
                          animate={{ scale: isHovered ? 1.15 : 1 }}
                          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                          style={{ pointerEvents: 'auto' }}
                        >
                          <circle
                            cx={0}
                            cy={0}
                            r={dotR}
                            fill={LAVENDER}
                            stroke="rgba(255,255,255,0.12)"
                            strokeWidth={strokeW}
                          />
                          {isHovered && (
                            <motion.circle
                              cx={0}
                              cy={0}
                              r={ringR}
                              fill="none"
                              stroke={LAVENDER}
                              strokeWidth={Math.max(0.15, 0.8 / currentZoom)}
                              initial={{ opacity: 0.6, scale: 1 }}
                              animate={{ opacity: [0.6, 0.05, 0.6], scale: [1, 1.8, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </motion.g>
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            </motion.div>
          </AnimatePresence>

          <MapChrome>
            <MapStat>
              <span>{displayedPlaces.length}</span> nodes in frame
            </MapStat>
            <MapStat>drag · scroll to navigate</MapStat>
          </MapChrome>
        </MapContainer>
      </Container>

      {tooltipContent && (
        <Tooltip style={{ left: tooltipPosition.x, top: tooltipPosition.y }}>
          <h4>{tooltipContent.name}</h4>
          {tooltipContent.significance && (
            <p>
              <em>{tooltipContent.significance}</em>
            </p>
          )}
          {tooltipContent.story && <p>{tooltipContent.story}</p>}
        </Tooltip>
      )}
    </Section>
  );
};

export default CosmicJourneys;
