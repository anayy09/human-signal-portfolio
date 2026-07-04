import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

/*
 * Orbital navigation globe: dot-matrix Earth, waypoint markers, and the
 * career trajectory replayed as great-circle arcs. Land dots come from
 * /maps/globe-dots.json (built by scripts/gen-globe-dots.mjs).
 */

const R = 2;
const LAVENDER = '#C9A0DC';
const GOLD = '#D4A574';
const BLUE = '#5B8DEF';

const latLonToVec3 = (lat, lon, radius = R) => {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(lambda),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(lambda)
  );
};

function LandDots({ dots }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(dots.length * 3);
    dots.forEach(([lat10, lon10], i) => {
      const v = latLonToVec3(lat10 / 10, lon10 / 10, R);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    });
    return arr;
  }, [dots]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#4A6BA8"
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.62}
        depthWrite={false}
      />
    </points>
  );
}

/* Solid inner sphere so far-side dots and markers occlude */
function Core() {
  return (
    <mesh>
      <sphereGeometry args={[R * 0.992, 48, 48]} />
      <meshBasicMaterial color="#0B0E16" />
    </mesh>
  );
}

function Marker({ place, career, current, focused, onHover }) {
  const ref = useRef();
  const pos = useMemo(
    () => latLonToVec3(place.coordinates[1], place.coordinates[0], R * 1.005),
    [place]
  );
  // Ring lies flat on the sphere surface (its +z along the outward normal)
  const ringQuat = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        pos.clone().normalize()
      ),
    [pos]
  );
  const color = current ? BLUE : career ? GOLD : LAVENDER;
  const base = current ? 0.045 : career ? 0.036 : 0.024;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    let s = 1;
    if (current) s = 1 + Math.sin(clock.getElapsedTime() * 2.4) * 0.3;
    if (focused) s = 1.8;
    ref.current.scale.setScalar(s);
  });

  return (
    <group position={pos}>
      <mesh
        ref={ref}
        onPointerOver={e => {
          e.stopPropagation();
          onHover(place);
        }}
        onPointerOut={e => {
          e.stopPropagation();
          onHover(null);
        }}
      >
        <sphereGeometry args={[base, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      {(current || focused) && (
        <mesh quaternion={ringQuat}>
          <ringGeometry args={[base * 1.9, base * 2.15, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

/* One great-circle leg with an animated draw range */
const ARC_POINTS = 64;

function useArcGeometry(from, to) {
  return useMemo(() => {
    const v1 = latLonToVec3(from[1], from[0], 1).normalize();
    const v2 = latLonToVec3(to[1], to[0], 1).normalize();
    const angle = v1.angleTo(v2);
    const lift = 0.16 + 0.3 * Math.min(1, angle / 1.6);
    const pts = new Float32Array(ARC_POINTS * 3);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < ARC_POINTS; i += 1) {
      const t = i / (ARC_POINTS - 1);
      tmp.copy(v1).lerp(v2, t).normalize();
      const radius = R * (1 + Math.sin(Math.PI * t) * lift);
      pts[i * 3] = tmp.x * radius;
      pts[i * 3 + 1] = tmp.y * radius;
      pts[i * 3 + 2] = tmp.z * radius;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    return geometry;
  }, [from, to]);
}

function ArcLeg({ from, to, index, total, reducedMotion }) {
  const geometry = useArcGeometry(from, to);
  const lineRef = useRef();

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    const line = lineRef.current;
    if (!line) return;
    if (reducedMotion) {
      line.geometry.setDrawRange(0, ARC_POINTS);
      line.material.opacity = 0.3;
      return;
    }
    const LEG = 0.85; // seconds per leg
    const HOLD = 2.6; // pause with the full route lit
    const cycle = total * LEG + HOLD;
    const t = clock.getElapsedTime() % cycle;
    const start = index * LEG;

    if (t < start) {
      line.geometry.setDrawRange(0, 0);
    } else if (t < start + LEG) {
      const p = (t - start) / LEG;
      line.geometry.setDrawRange(0, Math.max(2, Math.floor(p * ARC_POINTS)));
      line.material.opacity = 0.85;
    } else {
      line.geometry.setDrawRange(0, ARC_POINTS);
      line.material.opacity = 0.3;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        color={GOLD}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
}

function Atmosphere() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.28, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(123, 104, 182, 0.35)');
    grad.addColorStop(0.6, 'rgba(91, 141, 239, 0.12)');
    grad.addColorStop(1, 'rgba(91, 141, 239, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <sprite scale={[R * 3.4, R * 3.4, 1]} position={[0, 0, -0.5]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

function Scene({ dots, places, itinerary, focusPlace, reducedMotion, onHover }) {
  const globeRef = useRef();
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const [tooltip, setTooltip] = useState(null);

  const careerIds = useMemo(() => new Set(itinerary.map(leg => leg.placeId)), [itinerary]);
  const currentId = useMemo(
    () => itinerary.find(leg => leg.current)?.placeId,
    [itinerary]
  );

  const legs = useMemo(() => {
    const resolved = itinerary
      .map(leg => places.find(p => p.id === leg.placeId))
      .filter(Boolean);
    return resolved.slice(0, -1).map((place, i) => ({
      from: place.coordinates,
      to: resolved[i + 1].coordinates,
      key: `${place.id}->${resolved[i + 1].id}`,
    }));
  }, [itinerary, places]);

  const handleHover = place => {
    setTooltip(place);
    onHover(place);
    gl.domElement.style.cursor = place ? 'pointer' : 'grab';
  };

  useFrame((_, delta) => {
    const globe = globeRef.current;
    const controls = controlsRef.current;
    if (!globe) return;

    const target = focusPlace || tooltip;
    if (target) {
      // Rotate the globe so the focused city faces the camera
      const local = latLonToVec3(target.coordinates[1], target.coordinates[0], 1).normalize();
      const toCamera = camera.position.clone().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(local, toCamera);
      globe.quaternion.slerp(q, 1 - Math.exp(-5 * delta));
      if (controls) controls.autoRotate = false;
    } else if (controls) {
      controls.autoRotate = !reducedMotion;
    }
  });

  return (
    <>
      <Atmosphere />
      <group ref={globeRef}>
        <Core />
        <LandDots dots={dots} />
        {legs.map((leg, i) => (
          <ArcLeg
            key={leg.key}
            from={leg.from}
            to={leg.to}
            index={i}
            total={legs.length}
            reducedMotion={reducedMotion}
          />
        ))}
        {places.map(place => (
          <Marker
            key={place.id}
            place={place}
            career={careerIds.has(place.id)}
            current={place.id === currentId}
            focused={focusPlace?.id === place.id}
            onHover={handleHover}
          />
        ))}
        {tooltip && (
          <Html
            position={latLonToVec3(
              tooltip.coordinates[1],
              tooltip.coordinates[0],
              R * 1.12
            )}
            style={{ pointerEvents: 'none' }}
            zIndexRange={[10, 0]}
          >
            <div
              style={{
                background: 'rgba(8, 12, 20, 0.95)',
                border: '1px solid rgba(201, 160, 220, 0.25)',
                borderRadius: 8,
                padding: '0.5rem 0.7rem',
                whiteSpace: 'nowrap',
                transform: 'translate(-50%, calc(-100% - 10px))',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#E8ECF4',
                }}
              >
                {tooltip.name}
              </p>
              {(tooltip.significance || tooltip.story) && (
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#98A2B8' }}>
                  {tooltip.significance || tooltip.story}
                </p>
              )}
            </div>
          </Html>
        )}
      </group>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.45}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
      />
    </>
  );
}

export default function Globe({ places, itinerary, focusPlace, onHover, active }) {
  const [dots, setDots] = useState(null);
  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    let live = true;
    fetch('/maps/globe-dots.json')
      .then(res => res.json())
      .then(data => {
        if (live) setDots(data);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  if (!dots) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.5, 5.3], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={active && !reducedMotion ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ cursor: 'grab' }}
    >
      <Scene
        dots={dots}
        places={places}
        itinerary={itinerary}
        focusPlace={focusPlace}
        reducedMotion={reducedMotion}
        onHover={onHover}
      />
    </Canvas>
  );
}
