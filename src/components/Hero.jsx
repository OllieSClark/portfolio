import DiffusionField from "./DiffusionField";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <DiffusionField className="absolute inset-0 w-full h-full opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-ink/40 to-ink pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 w-full">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal mb-6">
          dS = μS dt + σS dW
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] text-paper max-w-3xl">
          Your Name
        </h1>
        <p className="font-display text-2xl sm:text-3xl text-paper-dim mt-3 max-w-2xl">
          Statistics &amp; Machine Learning, Warwick
        </p>
        <p className="font-body text-base sm:text-lg text-paper-dim/90 mt-6 max-w-xl leading-relaxed">
          MDatSci student working on generative models for volatility
          surfaces, statistical signal research, and applied probability.
          Looking for quant research roles starting autumn 2026.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <a
            href="#work"
            className="font-mono text-xs uppercase tracking-widest px-5 py-3 bg-gold text-ink hover:bg-paper transition-colors"
          >
            See the work
          </a>
          <a
            href="/cv.pdf"
            download
            className="font-mono text-xs uppercase tracking-widest px-5 py-3 border border-paper-dim/40 text-paper hover:border-teal hover:text-teal transition-colors"
          >
            Download CV
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="relative mx-auto mt-16 mb-8 font-mono text-[10px] uppercase tracking-widest text-paper-dim/60 hover:text-teal transition-colors"
      >
        scroll ↓
      </a>
    </section>
  );
}
