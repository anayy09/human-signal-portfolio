import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import styled from 'styled-components';
import { scrollBridge } from '../three/scrollBridge';

const constellationsData = [
  {
    name: 'Ursa Major',
    scale: 3,
    position: [-60, 50, -180],
    stars: [
      { pos: [1, 2, 0] }, { pos: [3.5, 1.8, 0] },
      { pos: [5, 1, 0] }, { pos: [6.5, 1.5, 0] },
      { pos: [9, 2.5, 0] }, { pos: [8.5, 4.5, 0] },
      { pos: [6, 4, 0] },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [3, 6]],
  },
  {
    name: 'Cassiopeia',
    scale: 3,
    position: [60, 30, -150],
    stars: [
      { pos: [0, 0, 0] }, { pos: [2, 1.5, 0] },
      { pos: [4, 0, 0] }, { pos: [6, 1.5, 0] },
      { pos: [8, 0, 0] },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: 'Orion',
    scale: 4,
    position: [10, -40, -120],
    stars: [
      { pos: [0, 10, 0] }, { pos: [2, 9.5, 0] },
      { pos: [1, 8, 0] }, { pos: [0.5, 6, 0] },
      { pos: [1.5, 6, 0] }, { pos: [1, 4, 0] },
      { pos: [3, 4.5, 0] },
    ],
    lines: [[0, 1], [0, 3], [1, 2], [1, 4], [3, 5], [4, 5], [2, 3], [2, 4]],
  },
];

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background: #0a0b0f;
`;

function AnimatedStars() {
  const starsRef = useRef();

  useFrame(({ clock }) => {
    if (starsRef.current) {
      const t = clock.getElapsedTime();
      starsRef.current.rotation.x = Math.sin(t / 70) / 22;
      starsRef.current.rotation.y = Math.cos(t / 70) / 22;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={130}
      depth={65}
      count={420}
      factor={5}
      saturation={0.12}
      fade
      speed={0.25}
    />
  );
}

/* Camera drifts down and tilts slightly as the visitor scrolls the page. */
function ScrollRig() {
  useFrame(({ camera }, delta) => {
    const p = scrollBridge.progress;
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -p * 6, 1.6, delta);
    camera.rotation.z = THREE.MathUtils.damp(camera.rotation.z, p * 0.05, 1.6, delta);
  });
  return null;
}

/* Soft nebula glow whose hue follows the section accent. */
function Nebula() {
  const matRef = useRef();
  const target = useMemo(() => new THREE.Color(scrollBridge.accent), []);

  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.28)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (!matRef.current) return;
    target.set(scrollBridge.accent);
    matRef.current.color.lerp(target, 0.02);
  });

  return (
    <sprite position={[-28, -10, -80]} scale={[110, 80, 1]}>
      <spriteMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0.16}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={scrollBridge.accent}
      />
    </sprite>
  );
}

/*
 * One shooting star: a ring-buffer polyline. Geometry and material are
 * allocated once; frames only shift the position buffer in place.
 */
function ShootingStar({ seed = 0, trailLength = 14 }) {
  const lineRef = useRef();
  const state = useRef({
    active: false,
    nextAt: 6 + seed * 9 + Math.random() * 12,
    pos: new THREE.Vector3(),
    vel: new THREE.Vector3(),
  });

  const positions = useMemo(() => new Float32Array(trailLength * 3), [trailLength]);
  const colors = useMemo(() => {
    const c = new Float32Array(trailLength * 3);
    for (let i = 0; i < trailLength; i += 1) {
      const fade = 1 - i / trailLength;
      c[i * 3] = fade;
      c[i * 3 + 1] = fade;
      c[i * 3 + 2] = fade;
    }
    return c;
  }, [trailLength]);

  useFrame(({ clock }) => {
    const s = state.current;
    const line = lineRef.current;
    if (!line) return;
    const time = clock.getElapsedTime();

    if (!s.active && time > s.nextAt) {
      s.active = true;
      s.pos.set((Math.random() - 0.5) * 100, 50 + Math.random() * 50, (Math.random() - 0.5) * 100);
      s.vel.set((Math.random() - 0.5) * 0.5, -1 - Math.random() * 1.5, (Math.random() - 0.5) * 0.5);
      for (let i = 0; i < trailLength; i += 1) {
        positions[i * 3] = s.pos.x;
        positions[i * 3 + 1] = s.pos.y;
        positions[i * 3 + 2] = s.pos.z;
      }
      line.visible = true;
    }

    if (s.active) {
      s.pos.add(s.vel);
      positions.copyWithin(3, 0, (trailLength - 1) * 3);
      positions[0] = s.pos.x;
      positions[1] = s.pos.y;
      positions[2] = s.pos.z;
      line.geometry.attributes.position.needsUpdate = true;

      if (s.pos.y < -50) {
        s.active = false;
        s.nextAt = time + 14 + Math.random() * 28;
        line.visible = false;
      }
    }
  });

  return (
    <line ref={lineRef} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

function RealMoon() {
  const moonRef = useRef();
  const { viewport } = useThree();
  const moonTexture = useLoader(THREE.TextureLoader, '/moon.png');

  useEffect(() => {
    if (moonTexture) {
      moonTexture.minFilter = THREE.LinearFilter;
      moonTexture.generateMipmaps = false;
      moonTexture.anisotropy = 1;
    }
  }, [moonTexture]);

  const fixedMoonPosition = useMemo(
    () => new THREE.Vector3(viewport.width * 0.6, viewport.height * 0.05, -30),
    [viewport]
  );

  useFrame(({ clock }) => {
    if (moonRef.current) {
      const t = clock.getElapsedTime() * 0.03;
      moonRef.current.position.x = fixedMoonPosition.x + Math.sin(t) * 0.2;
      moonRef.current.position.y = fixedMoonPosition.y + Math.cos(t * 0.7) * 0.1;
      moonRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group ref={moonRef} position={fixedMoonPosition}>
      <sprite scale={[12, 12, 1]}>
        <spriteMaterial
          map={moonTexture}
          transparent
          opacity={0.92}
          depthTest
          depthWrite={false}
          fog={false}
          sizeAttenuation
        />
      </sprite>
    </group>
  );
}

function Constellation({ data }) {
  const { stars, lines, scale, position } = data;

  const starPositions = useMemo(() => {
    const arr = new Float32Array(stars.length * 3);
    stars.forEach((star, i) => {
      arr[i * 3] = star.pos[0] * scale;
      arr[i * 3 + 1] = star.pos[1] * scale;
      arr[i * 3 + 2] = star.pos[2] * scale;
    });
    return arr;
  }, [stars, scale]);

  const lineGeometry = useMemo(() => {
    const pts = [];
    lines.forEach(([s, e]) => {
      pts.push(new THREE.Vector3(...stars[s].pos).multiplyScalar(scale));
      pts.push(new THREE.Vector3(...stars[e].pos).multiplyScalar(scale));
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [lines, stars, scale]);

  useEffect(() => () => lineGeometry.dispose(), [lineGeometry]);

  return (
    <group position={position}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c8d8f8" size={0.45} sizeAttenuation transparent opacity={0.65} />
      </points>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#8ab0ee" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

function Constellations() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.003;
      groupRef.current.rotation.x = Math.sin(t * 0.002) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {constellationsData.map(c => (
        <Constellation key={c.name} data={c} />
      ))}
    </group>
  );
}

function CosmicScene() {
  return (
    <>
      <color attach="background" args={['#0A0B0F']} />
      <ambientLight intensity={0.06} />
      <ScrollRig />
      <Nebula />
      <AnimatedStars />
      <ShootingStar seed={0} />
      <ShootingStar seed={1} />
      <ShootingStar seed={2} />
      <Constellations />
      <RealMoon />
      <EffectComposer>
        <Bloom intensity={0.22} luminanceThreshold={0.38} luminanceSmoothing={0.9} />
        <Vignette offset={0.3} darkness={0.55} eskil={false} />
      </EffectComposer>
    </>
  );
}

export default function CosmicBackground() {
  const prefersReduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    scrollBridge.reducedMotion = prefersReduced;
  }, [prefersReduced]);

  // Keep the bridge fed with document scroll progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollBridge.progress = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Stop rendering entirely when the tab is hidden
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Reduced motion: render a single static frame ('demand' + no invalidations)
  const frameloop = prefersReduced ? 'demand' : hidden ? 'never' : 'always';

  return (
    <BackgroundContainer aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        frameloop={frameloop}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <CosmicScene />
        </Suspense>
      </Canvas>
    </BackgroundContainer>
  );
}
