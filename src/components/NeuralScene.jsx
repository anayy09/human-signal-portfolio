import React, { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;
const COUNT = 2304;
function brainPoint(i) {
  const side = i < COUNT / 2 ? -1 : 1;
  const k = i % (COUNT / 2),
    phi = (Math.PI * (Math.floor(k / 48) + 0.5)) / 24,
    theta = (TAU * (k % 48)) / 48;
  const fold =
    1 +
    0.085 * Math.sin(phi * 15 + Math.sin(theta * 5) * 2) +
    0.05 * Math.cos(theta * 11 + phi * 5);
  return {
    x: side * (7 + Math.sin(phi) * (68 + 62 * Math.cos(theta)) * fold),
    y: Math.cos(phi) * 131 * fold,
    z: Math.sin(phi) * Math.sin(theta) * 93 * fold,
  };
}
function ecg(t) {
  const p = ((t % 1) + 1) % 1;
  return (
    0.13 * Math.exp(-Math.pow((p - 0.16) / 0.045, 2)) -
    0.2 * Math.exp(-Math.pow((p - 0.37) / 0.018, 2)) +
    1.2 * Math.exp(-Math.pow((p - 0.41) / 0.015, 2)) -
    0.38 * Math.exp(-Math.pow((p - 0.45) / 0.02, 2)) +
    0.23 * Math.exp(-Math.pow((p - 0.67) / 0.085, 2))
  );
}
const clusters = [
  { x: -150, y: -90, z: 0 },
  { x: 150, y: -90, z: 0 },
  { x: -150, y: 90, z: 0 },
  { x: 150, y: 90, z: 0 },
  { x: 0, y: 0, z: 40 },
];
function target(i, mode, t) {
  if (mode === 'intelligence') return brainPoint(i);
  if (mode === 'signals') {
    const lane = Math.floor(i / 768),
      sample = i % 768,
      u = sample / 768;
    return {
      x: (u - 0.5) * 410,
      y:
        (lane - 1) * 95 -
        (lane === 0
          ? ecg(u * 3 - t * 0.65)
          : lane === 1
            ? Math.sin(u * 35 - t * 4) * 0.27 + Math.sin(u * 67 + t * 3) * 0.12
            : Math.sin(u * 17 - t * 2) * 0.46) *
          56,
      z: Math.sin(u * TAU * 2 + t) * 14,
    };
  }
  const group = i % 5,
    seed = Math.floor(i / 5),
    center = clusters[group],
    phi = Math.acos(1 - 2 * ((seed + 0.5) / 461)),
    theta = seed * 2.399963;
  const radius = group === 4 ? 44 : 29;
  return {
    x: center.x + radius * Math.sin(phi) * Math.cos(theta + t * 0.35),
    y: center.y + radius * Math.cos(phi),
    z: center.z + radius * Math.sin(phi) * Math.sin(theta + t * 0.35),
  };
}

// All activity is illustrative. Playback controls the simulation clock, not just a label.
export default function NeuralScene({
  mode,
  playing = true,
  speed = 1,
  className = '',
}) {
  const canvasRef = useRef(null),
    controls = useRef({ mode, playing, speed }),
    wake = useRef(() => {});
  useEffect(() => {
    controls.current = { mode, playing, speed };
    wake.current();
  }, [mode, playing, speed]);
  useEffect(() => {
    const canvas = canvasRef.current,
      ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      elapsed = 0,
      visible = true,
      dirty = true,
      drag = null,
      orbit = 0;
    let previousMode = controls.current.mode;
    let positions = Array.from({ length: COUNT }, (_, i) =>
      target(i, previousMode, 0)
    );
    const project = (p, rotation, scale) => {
      const x = p.x * Math.cos(rotation) + p.z * Math.sin(rotation),
        z = -p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
      const perspective = 700 / (700 + z);
      return {
        x: width / 2 + x * scale * perspective,
        y: height * 0.49 + (p.y * 0.96 - z * 0.16) * scale * perspective,
        z,
      };
    };
    function draw(delta) {
      const {
        mode: currentMode,
        playing: running,
        speed: rate,
      } = controls.current;
      if (running) elapsed += delta * rate;
      canvas.dataset.scene = currentMode;
      const scale = Math.min(width / 505, height / 410);
      const rotation =
        currentMode === 'intelligence'
          ? -0.3 + elapsed * 0.65 + orbit
          : currentMode === 'systems'
            ? Math.sin(elapsed * 0.35) * 0.18 + orbit * 0.2
            : 0;
      const rgb =
        currentMode === 'signals'
          ? '96,249,175'
          : currentMode === 'systems'
            ? '115,165,255'
            : '78,239,223';
      ctx.clearRect(0, 0, width, height);
      const halo = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width * 0.5, 1)
      );
      halo.addColorStop(0, 'rgba(' + rgb + ',.13)');
      halo.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
      const morphing = previousMode !== currentMode;
      if (morphing && !running)
        positions = positions.map((_, i) => target(i, currentMode, elapsed));
      const pts = positions.map((p, i) => {
        const dest = target(i, currentMode, elapsed);
        const blend = running ? 1 - Math.exp(-delta * 9) : 1;
        p.x += (dest.x - p.x) * blend;
        p.y += (dest.y - p.y) * blend;
        p.z += (dest.z - p.z) * blend;
        return project(p, rotation, scale);
      });
      if (currentMode === 'signals') {
        for (let lane = 0; lane < 3; lane++) {
          ctx.strokeStyle = 'rgba(' + rgb + ',' + (1 - lane * 0.22) + ')';
          ctx.lineWidth = lane === 0 ? 2 : 1.3;
          ctx.shadowColor = 'rgba(' + rgb + ',.6)';
          ctx.shadowBlur = 7;
          ctx.beginPath();
          pts
            .slice(lane * 768, (lane + 1) * 768)
            .forEach((p, i) =>
              i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
            );
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.font = '9px monospace';
          ctx.fillStyle = '#a8d5c9';
          ctx.fillText(
            ['CARDIAC RHYTHM', 'NEURAL OSCILLATION', 'RESPIRATORY WAVE'][lane],
            width * 0.1,
            height * 0.49 + (lane - 1) * 95 * scale - 42 * scale
          );
        }
        const scan = ((elapsed * 0.2) % 1) * width;
        ctx.fillStyle = 'rgba(' + rgb + ',.06)';
        ctx.fillRect(scan - 18, height * 0.13, 36, height * 0.75);
        ctx.strokeStyle = 'rgba(' + rgb + ',.45)';
        ctx.beginPath();
        ctx.moveTo(scan, height * 0.13);
        ctx.lineTo(scan, height * 0.88);
        ctx.stroke();
      } else {
        if (currentMode === 'intelligence') {
          ctx.lineWidth = 0.65;
          pts.forEach((p, i) => {
            if (i % 48 === 47) return;
            ctx.strokeStyle =
              'rgba(' + rgb + ',' + (0.1 + (130 - p.z) / 1300) + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
            if (i % 3 === 0 && i % 1152 < 1104) {
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pts[i + 48].x, pts[i + 48].y);
            }
            ctx.stroke();
          });
        } else {
          const hub = project(clusters[4], rotation, scale);
          clusters.slice(0, 4).forEach((cluster, j) => {
            const p = project(cluster, rotation, scale);
            ctx.strokeStyle = 'rgba(' + rgb + ',.35)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 5]);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(hub.x, hub.y);
            ctx.stroke();
            ctx.setLineDash([]);
            for (let k = 0; k < 3; k++) {
              let u = (elapsed * 0.35 + k / 3 + j * 0.17) % 1;
              const x = p.x + (hub.x - p.x) * u,
                y = p.y + (hub.y - p.y) * u;
              ctx.shadowColor = 'rgba(' + rgb + ',.8)';
              ctx.shadowBlur = 12;
              ctx.fillStyle = '#c7e5ff';
              ctx.beginPath();
              ctx.arc(x, y, 2.6, 0, TAU);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
            ctx.fillStyle = '#abc9e8';
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(
              ['SITE A', 'SITE B', 'COMPUTE', 'VALIDATION'][j],
              p.x,
              p.y + 44 * scale
            );
          });
          ctx.textAlign = 'center';
          ctx.fillStyle = '#c2dcff';
          ctx.fillText('SHARED MODEL', hub.x, hub.y + 61 * scale);
          ctx.textAlign = 'left';
        }
        pts
          .map((p, i) => ({ ...p, i }))
          .sort((a, b) => b.z - a.z)
          .forEach((p) => {
            const light = Math.pow(
              (Math.sin(p.i * 0.11 - elapsed * 3) + 1) / 2,
              16
            );
            const opacity = Math.max(
              0.25,
              Math.min(1, 0.7 - p.z / 380 + light * 0.5)
            );
            ctx.fillStyle = 'rgba(' + rgb + ',' + opacity + ')';
            ctx.beginPath();
            ctx.arc(p.x, p.y, (1.05 + light * 1.7) * scale, 0, TAU);
            ctx.fill();
          });
      }
      previousMode = currentMode;
    }
    function schedule() {
      dirty = true;
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    }
    function tick(now) {
      frame = 0;
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 1 / 30;
      if (dirty || now - last >= 30) {
        draw(delta);
        last = now;
        dirty = false;
      }
      if (controls.current.playing && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    }
    wake.current = schedule;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
      schedule();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = 0;
        schedule();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        last = 0;
        schedule();
      }
    };
    const down = (e) => {
      if (e.pointerType === 'touch') return;
      drag = { x: e.clientX, orbit };
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
      if (!drag) return;
      orbit = drag.orbit + (e.clientX - drag.x) * 0.009;
      schedule();
    };
    const up = () => {
      drag = null;
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      wake.current = () => {};
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className={'neural-canvas ' + className}
      data-scene={mode}
      aria-hidden="true"
    />
  );
}
