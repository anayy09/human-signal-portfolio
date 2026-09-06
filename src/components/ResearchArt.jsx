import React, { useEffect, useRef } from 'react';

const TAU = Math.PI * 2;

// Three illustrative studies: continuous signals, latent contours, and compute volume.
// This renderer is independent of the hero's neural sculpture and graph scenes.
function signalField(ctx, t) {
  const point = (u, v) => {
    const envelope = Math.exp(-u * u * 1.5);
    const wave =
      Math.sin(u * 9 - t * 1.9 + v * 2.4) * 30 * envelope +
      Math.sin(u * 4 + v * 5 - t * 0.8) * 18;
    return {
      x: u * 205 + v * 40,
      y: v * 98 + wave - Math.cos(u * 2) * 20,
    };
  };
  for (let row = 0; row < 38; row++) {
    const v = (row / 37) * 2 - 1;
    const light =
      0.3 + 0.45 * Math.pow(Math.sin(row * 0.15 - t) * 0.5 + 0.5, 3);
    ctx.strokeStyle = `rgba(83,227,213,${light})`;
    ctx.lineWidth = row % 6 === 0 ? 1.3 : 0.65;
    ctx.beginPath();
    for (let col = 0; col <= 100; col++) {
      const p = point((col / 100) * 2 - 1, v);
      if (col) ctx.lineTo(p.x, p.y);
      else ctx.moveTo(p.x, p.y);
    }
    ctx.stroke();
    // Discrete samples travel across the continuous surface.
    if (row % 4 === 0) {
      const u = ((t * 0.25 + row * 0.071) % 2) - 1;
      const p = point(u, v);
      ctx.fillStyle = '#d4fff1';
      ctx.shadowColor = '#53e3d5';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, TAU);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  ctx.strokeStyle = '#53e3d525';
  ctx.lineWidth = 0.6;
  for (let col = 0; col <= 20; col++) {
    ctx.beginPath();
    for (let row = 0; row < 38; row++) {
      const p = point((col / 20) * 2 - 1, (row / 37) * 2 - 1);
      if (row) ctx.lineTo(p.x, p.y);
      else ctx.moveTo(p.x, p.y);
    }
    ctx.stroke();
  }
}

function latentAtlas(ctx, t) {
  const contour = (angle, layer) => {
    const z = layer / 23;
    const radius = 52 + Math.sin(z * Math.PI) * 85;
    const fold =
      1 +
      0.16 * Math.sin(angle * 3 + z * 4 + t * 0.7) +
      0.075 * Math.cos(angle * 7 - t * 0.5);
    const rotation = t * 0.22;
    const x = Math.cos(angle + rotation) * radius * fold;
    const depth = Math.sin(angle + rotation) * radius * fold;
    return {
      x: x + Math.sin(z * 4 + t * 0.4) * 22,
      y: (z - 0.5) * 260 + depth * 0.36,
    };
  };
  const scan = ((t * 0.22) % 1) * 23;
  for (let layer = 0; layer < 24; layer++) {
    const proximity = Math.exp(-Math.pow((layer - scan) / 2.5, 2));
    ctx.strokeStyle = `rgba(${proximity > 0.5 ? '201,255,222' : '92,218,167'},${0.28 + proximity * 0.65})`;
    ctx.lineWidth = 0.8 + proximity * 1.5;
    ctx.beginPath();
    for (let k = 0; k <= 96; k++) {
      const p = contour((k / 96) * TAU, layer);
      if (k) ctx.lineTo(p.x, p.y);
      else ctx.moveTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.stroke();
    if (proximity > 0.7) {
      ctx.fillStyle = `rgba(83,227,150,${proximity * 0.035})`;
      ctx.fill();
    }
  }
  // Correspondences reveal continuity between the stacked feature slices.
  for (let k = 0; k < 12; k++) {
    ctx.strokeStyle = '#6fffbd26';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let layer = 0; layer < 24; layer++) {
      const p = contour((k / 12) * TAU, layer);
      if (layer) ctx.lineTo(p.x, p.y);
      else ctx.moveTo(p.x, p.y);
    }
    ctx.stroke();
    const p = contour((k / 12) * TAU, scan);
    ctx.fillStyle = '#c9ffdd';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, TAU);
    ctx.fill();
  }
  ctx.strokeStyle = '#99d7b84a';
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(183, -155);
  ctx.lineTo(183, 155);
  for (let n = 0; n <= 12; n++) {
    const y = -155 + (n / 12) * 310;
    ctx.moveTo(183, y);
    ctx.lineTo(n % 3 === 0 ? 194 : 189, y);
  }
  ctx.stroke();
  const y = (scan / 23 - 0.5) * 260;
  ctx.fillStyle = '#b4ffcf';
  ctx.fillRect(177, y - 2, 17, 4);
}

function computeFabric(ctx, t) {
  const project = (x, y, z) => ({
    x: (x - z) * 28,
    y: (x + z - 5) * 14 + (y - 2) * 37,
  });
  const polygon = (points, fill, stroke) => {
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  };
  ctx.lineWidth = 0.7;
  const scan = (t * 0.75) % 5;
  for (let y = 0; y < 5; y++) {
    for (let z = 0; z < 6; z++) {
      for (let x = 0; x < 6; x++) {
        const p = project(x, y, z);
        const strength = Math.exp(-Math.pow((x - scan) / 0.7, 2));
        ctx.strokeStyle = `rgba(112,165,240,${0.12 + strength * 0.22})`;
        ctx.beginPath();
        for (const [dx, dy, dz] of [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ]) {
          if (x + dx > 5 || y + dy > 4 || z + dz > 5) continue;
          const q = project(x + dx, y + dy, z + dz);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
        }
        ctx.stroke();
        ctx.fillStyle = `rgba(158,205,255,${0.3 + strength * 0.6})`;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    }
  }
  polygon(
    [
      project(scan, 0, 0),
      project(scan, 0, 5),
      project(scan, 4, 5),
      project(scan, 4, 0),
    ],
    '#62aeff12',
    '#8bd4ff99'
  );
  for (let n = 0; n < 20; n++) {
    const x = (t * 0.9 + n * 0.37) % 5;
    const y = (n * 3) % 4;
    const z = (n * 7) % 5;
    const a = project(x, y, z),
      b = project(x + 0.45, y, z);
    const c = project(x + 0.45, y, z + 0.45),
      d = project(x, y, z + 0.45);
    const e = project(x, y + 0.45, z + 0.45),
      f = project(x + 0.45, y + 0.45, z + 0.45);
    const g = project(x + 0.45, y + 0.45, z);
    polygon([a, b, c, d], '#a4e5ff', '#c6f2ff');
    polygon([d, c, f, e], '#378eac', '#78cbe0');
    polygon([b, g, f, c], '#436dbb', '#8bc9f3');
  }
}

const studies = {
  'signal-field': signalField,
  'latent-atlas': latentAtlas,
  'compute-fabric': computeFabric,
};

export default function ResearchArt({ mode, playing }) {
  const canvasRef = useRef(null);
  const controls = useRef({ mode, playing });
  const wake = useRef(() => {});
  useEffect(() => {
    controls.current = { mode, playing };
    wake.current();
  }, [mode, playing]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0;
    let visible = true,
      dirty = true;
    let current = controls.current.mode,
      previous = current,
      mix = 1;
    function draw(delta) {
      const state = controls.current;
      if (state.mode !== current) {
        previous = current;
        current = state.mode;
        mix = state.playing ? 0 : 1;
      }
      if (state.playing) {
        time += delta;
        mix = Math.min(1, mix + delta * 1.8);
      }
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height * 0.51);
      const scale = Math.min(width / 520, height / 395);
      ctx.scale(scale, scale);
      const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 225);
      glow.addColorStop(0, '#53e3d50c');
      glow.addColorStop(1, '#53e3d500');
      ctx.fillStyle = glow;
      ctx.fillRect(-260, -210, 520, 420);
      if (mix < 1) {
        ctx.globalAlpha = 1 - mix;
        studies[previous](ctx, time);
      }
      ctx.globalAlpha = mix;
      studies[current](ctx, time);
      ctx.restore();
    }
    function schedule() {
      dirty = true;
      if (!frame && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    }
    function tick(now) {
      frame = 0;
      if (dirty || now - last >= 30) {
        draw(last ? Math.min((now - last) / 1000, 0.08) : 1 / 30);
        last = now;
        dirty = false;
      }
      if (controls.current.playing && visible && !document.hidden)
        frame = requestAnimationFrame(tick);
    }
    wake.current = schedule;
    const resize = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
      schedule();
    });
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (visible) schedule();
    });
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (!document.hidden) schedule();
    };
    resize.observe(canvas);
    visibility.observe(canvas);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      wake.current = () => {};
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="research-canvas"
      data-scene={mode}
      aria-hidden="true"
    />
  );
}
