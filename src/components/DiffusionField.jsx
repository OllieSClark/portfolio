import { useEffect, useRef } from "react";

/**
 * Renders live sample paths of a geometric Brownian motion,
 *   dS = mu * S dt + sigma * S dW
 * the SDE underlying the implied-vol-surface work in the dissertation.
 * Paths are simulated in real time (Euler–Maruyama) and drift across
 * the canvas, redrawn each frame. This is the page's one signature
 * animation — everything else stays quiet.
 */
export default function DiffusionField({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr;
    const PATH_COUNT = 5;
    const colors = ["#D4A72C", "#5FA8A0"];
    let paths = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initPaths();
    }

    function initPaths() {
      paths = Array.from({ length: PATH_COUNT }, (_, i) => {
        const points = [];
        let s = height * (0.35 + Math.random() * 0.3);
        const n = 260;
        for (let t = 0; t < n; t++) {
          points.push(s);
          const dt = 1;
          const mu = 0.0002;
          const sigma = 0.018 + i * 0.004;
          const dW = (Math.random() - 0.5) * 2 * Math.sqrt(dt);
          s = s * (1 + mu * dt + sigma * dW);
          s = Math.max(height * 0.08, Math.min(height * 0.92, s));
        }
        return {
          points,
          color: colors[i % colors.length],
          opacity: 0.14 + Math.random() * 0.16,
          offset: Math.random() * points.length,
          speed: 0.06 + Math.random() * 0.05,
        };
      });
    }

    function step(path) {
      const last = path.points[path.points.length - 1];
      const dt = 1;
      const mu = 0.0002;
      const sigma = 0.02;
      const dW = (Math.random() - 0.5) * 2 * Math.sqrt(dt);
      let next = last * (1 + mu * dt + sigma * dW);
      next = Math.max(height * 0.08, Math.min(height * 0.92, next));
      path.points.push(next);
      if (path.points.length > 400) path.points.shift();
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const spacing = width / 220;

      paths.forEach((path) => {
        if (!prefersReduced) step(path);
        ctx.beginPath();
        ctx.strokeStyle = path.color;
        ctx.globalAlpha = path.opacity;
        ctx.lineWidth = 1.3;
        const pts = path.points;
        const start = Math.max(0, pts.length - 220);
        for (let i = start; i < pts.length; i++) {
          const x = (i - start) * spacing;
          const y = pts[i];
          if (i === start) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    let raf;
    if (!prefersReduced) {
      const loop = () => {
        draw();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
