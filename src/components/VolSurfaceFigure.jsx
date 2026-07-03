import { useEffect, useRef } from "react";

// Figure 1 — a live wireframe implied-volatility surface: one smile curve
// per maturity slice, stacked with a small vertical/horizontal offset to
// read as a surface, gently recalibrating each frame like a live feed.
export default function VolSurfaceFigure({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr;
    const SLICES = 9;
    const POINTS = 40;
    let t = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function smile(k, maturity, phase) {
      const skew = -0.25 - maturity * 0.08;
      const convexity = 0.9 - maturity * 0.05;
      const wobble = 0.015 * Math.sin(phase + k * 3 + maturity * 1.3);
      return 0.18 + skew * k * 0.1 + convexity * k * k + wobble;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const marginX = width * 0.08;
      const plotW = width * 0.84;
      const topY = height * 0.12;
      const stackH = height * 0.72;

      for (let s = 0; s < SLICES; s++) {
        const maturity = s / (SLICES - 1);
        const rowY = topY + maturity * stackH;
        const depthOffset = maturity * width * 0.06;

        ctx.beginPath();
        for (let i = 0; i <= POINTS; i++) {
          const k = (i / POINTS) * 2 - 1; // moneyness -1..1
          const v = smile(k, maturity, t);
          const x = marginX + depthOffset + (i / POINTS) * (plotW - depthOffset);
          const y = rowY - v * height * 0.5;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const isBack = s === SLICES - 1;
        ctx.strokeStyle = isBack ? "#B33A2B" : "#1C1712";
        ctx.globalAlpha = isBack ? 0.85 : 0.16 + (s / SLICES) * 0.28;
        ctx.lineWidth = isBack ? 1.6 : 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    resize();
    draw();
    window.addEventListener("resize", resize);

    let raf;
    if (!prefersReduced) {
      const loop = () => {
        t += 0.01;
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

  return (
    <figure className={className}>
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
      <figcaption className="fig-caption mt-2">
        <span className="fig-number">Fig. 1.</span> Implied volatility surface,
        recalibrating live (illustrative smile-skew simulation, not market data).
      </figcaption>
    </figure>
  );
}
