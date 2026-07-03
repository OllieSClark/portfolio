import useReveal from "../hooks/useReveal";

const GITHUB_URL = "https://github.com/your-username";
const LINKEDIN_URL = "https://www.linkedin.com/in/your-username";
const EMAIL = "your.email@warwick.ac.uk";

export default function Contact() {
  const ref = useReveal();

  return (
    <section id="contact" className="border-t border-line">
      <div
        ref={ref}
        className="reveal max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal mb-4">
          t=2 — contact
        </p>
        <h2 className="font-display text-3xl sm:text-5xl text-paper max-w-2xl leading-tight">
          Let's talk about the work.
        </h2>
        <p className="font-body text-paper-dim mt-6 max-w-xl leading-relaxed">
          Open to quant research conversations for autumn 2026. The fastest
          way to reach me is email — CV below.
        </p>

        <div className="flex flex-wrap gap-4 mt-10">
          <a
            href={`mailto:${EMAIL}`}
            className="font-mono text-xs uppercase tracking-widest px-5 py-3 bg-gold text-ink hover:bg-paper transition-colors"
          >
            {EMAIL}
          </a>
          <a
            href="/cv.pdf"
            download
            className="font-mono text-xs uppercase tracking-widest px-5 py-3 border border-paper-dim/40 text-paper hover:border-teal hover:text-teal transition-colors"
          >
            Download CV
          </a>
        </div>

        <div className="flex gap-8 mt-16 pt-8 border-t border-line">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-paper transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-paper transition-colors"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>

      <footer className="max-w-5xl mx-auto px-6 sm:px-10 py-8">
        <p className="font-mono text-[11px] text-paper-dim/50">
          © {new Date().getFullYear()} — built with React &amp; a bit of
          stochastic calculus.
        </p>
      </footer>
    </section>
  );
}
