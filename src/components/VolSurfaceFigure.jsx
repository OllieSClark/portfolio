import { useEffect, useRef } from "react";

// Figure 1 — a true 3D wireframe implied-volatility surface σ(k, τ):
// perspective-projected mesh with painter's-sorted quads (paper-filled for
// hidden-line removal), depth-cued ink strokes, a red ATM ridge, and a slow
// sinusoidal yaw sway. Recalibrates live each frame via a small wobble term.
const NK = 24; // moneyness samples
const NT = 14; // maturity samples
const Z_SCALE = 1.4;
const ELEV = 0.42; // elevation ~24°
const F = 4; // weak-perspective focal length (world units)

function sigma(k, tau, t) {
  const skew = -0.32 / (1 + 2.2 * tau);
  const curv = 0.55 / (1 + 1.6 * tau);
  const atm = 0.16 + 0.05 * tau;
  const wobble =
    0.012 * Math.sin(3 * k + 1.3 * tau + t) +
    0.006 * Math.sin(7 * k - 2 * tau + 1.7 * t);
  return atm + skew * k + curv * k * k + wobble;
}

export default function VolSurfaceFigure({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr;
    let t = 0;

    // grid coordinates, precomputed once
    const ks = Array.from({ length: NK }, (_, i) => (i / (NK - 1)) * 2 - 1);
    const taus = Array.from({ length: NT }, (_, j) => j / (NT - 1));

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(time) {
      const theta = -0.55 + 0.28 * Math.sin(0.25 * time);
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const cosE = Math.cos(ELEV);
      const sinE = Math.sin(ELEV);
      const S = Math.min(width, height) * 0.62;
      const cx = width / 2;
      const cy = height * 0.52;

      // vertex buffer: screen x, y, and normalised depth
      const pts = new Array(NK * NT);
      let minD = Infinity;
      let maxD = -Infinity;
      const sigMid = 0.16 + 0.025; // centre of atm term-structure range

      for (let j = 0; j < NT; j++) {
        for (let i = 0; i < NK; i++) {
          const x = ks[i];
          const y = 2 * taus[j] - 1;
          const z = (sigma(ks[i], taus[j], time) - sigMid) * Z_SCALE;

          const xr = x * cosT - y * sinT;
          const yr = x * sinT + y * cosT;
          const depth = yr * cosE + z * sinE;
          const p = F / (F + depth);
          const sx = cx + xr * S * p;
          const sy = cy + (yr * sinE - z * cosE) * S * p;

          if (depth < minD) minD = depth;
          if (depth > maxD) maxD = depth;
          pts[j * NK + i] = { sx, sy, depth };
        }
      }

      const range = maxD - minD || 1;
      for (const v of pts) v.dn = (v.depth - minD) / range; // 0 far … 1 near
      return pts;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const pts = project(t);

      // painter's algorithm over quads, farthest first
      const quads = [];
      for (let j = 0; j < NT - 1; j++) {
        for (let i = 0; i < NK - 1; i++) {
          const a = pts[j * NK + i];
          const b = pts[j * NK + i + 1];
          const c = pts[(j + 1) * NK + i + 1];
          const d = pts[(j + 1) * NK + i];
          quads.push({ a, b, c, d, depth: (a.depth + c.depth) / 2 });
        }
      }
      quads.sort((q1, q2) => q2.depth - q1.depth);

      for (const { a, b, c, d } of quads) {
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.lineTo(c.sx, c.sy);
        ctx.lineTo(d.sx, d.sy);
        ctx.closePath();
        ctx.fillStyle = "#FFF1E5"; // paper — occludes mesh lines behind
        ctx.fill();

        // stroke the two leading edges (a→b along k, a→d along τ)
        const near = (a.dn + c.dn) / 2;
        ctx.strokeStyle = "#1C1712";
        ctx.globalAlpha = 0.15 + near * 0.45;
        ctx.lineWidth = 0.75 + near * 0.25;
        ctx.beginPath();
        ctx.moveTo(b.sx, b.sy);
        ctx.lineTo(a.sx, a.sy);
        ctx.lineTo(d.sx, d.sy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // red ATM ridge — the k = 0 polyline across maturities
      const iAtm = Math.round((NK - 1) / 2);
      ctx.beginPath();
      for (let j = 0; j < NT; j++) {
        const v = pts[j * NK + iAtm];
        if (j === 0) ctx.moveTo(v.sx, v.sy);
        else ctx.lineTo(v.sx, v.sy);
      }
      ctx.strokeStyle = "#B33A2B";
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // axis labels at the near corners
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = "#1C1712";
      ctx.globalAlpha = 0.45;
      const kEnd = pts[NK - 1];
      const tEnd = pts[(NT - 1) * NK];
      ctx.fillText("k", kEnd.sx + 6, kEnd.sy + 4);
      ctx.fillText("τ", tEnd.sx - 12, tEnd.sy + 4);
      ctx.globalAlpha = 1;
    }

    function handleResize() {
      resize();
      draw();
    }

    resize();
    draw();
    window.addEventListener("resize", handleResize);

    let raf;
    let running = false;
    const loop = () => {
      t += 0.01;
      draw();
      raf = requestAnimationFrame(loop);
    };

    // pause the loop while offscreen
    let io;
    if (!prefersReduced) {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      });
      io.observe(canvas);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
    };
  }, []);

  return (
    <figure className={className}>
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
      <figcaption className="fig-caption mt-2">
        <span className="fig-number">Fig. 1.</span> Wireframe implied-volatility
        surface &sigma;(k,&nbsp;&tau;), recalibrating live
        (illustrative skew and term structure, not market data).
      </figcaption>
    </figure>
  );
}
