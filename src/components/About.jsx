import useReveal from "../hooks/useReveal";

export default function About() {
  const ref = useReveal();

  return (
    <section id="about" className="border-t border-line">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal mb-8">
          t=0 — about
        </p>
        <div ref={ref} className="reveal grid sm:grid-cols-[2fr_1fr] gap-12">
          <p className="font-display text-2xl sm:text-3xl leading-snug text-paper">
            I'm a final-year MDatSci student reading Statistics &amp; Machine
            Learning at the University of Warwick. My interest sits where
            probability theory meets markets — I like problems that reward
            being precise about uncertainty.
          </p>
          <div className="font-mono text-sm text-paper-dim space-y-3 border-l border-line pl-6">
            <p>Warwick — MDatSci, Statistics &amp; ML</p>
            <p>Focus — generative modelling, applied probability</p>
            <p>Based in the UK</p>
            <p>Open to quant research roles, autumn 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
