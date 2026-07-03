import useReveal from "../hooks/useReveal";

const keywords = [
  "Numerical optimisation",
  "Generalised linear models",
  "Generative modelling",
  "Mathematical finance",
  "Statistical computing (R, Python)",
];

export default function About() {
  const ref = useReveal();

  return (
    <section id="introduction" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-red mb-8">
          &sect;1&nbsp;&nbsp;Introduction
        </p>
        <div ref={ref} className="reveal grid sm:grid-cols-[2fr_1fr] gap-12">
          <p className="font-display text-xl sm:text-2xl leading-snug text-ink">
            I work at the point where statistics and ML overlap in quant
            finance: GLMs give valid, interpretable inference; ML models
            predict better when the true relationship is too complex for a
            closed form. The brglm2 project (&sect;2.1) sits exactly there
            &mdash; a classical statistical method, bias-reduced GLM
            estimation, made practical at scale through modern numerical
            optimisation.
          </p>
          <div className="font-mono text-sm text-ink-dim space-y-3 border-l border-line pl-6">
            <p className="text-ink">Keywords</p>
            {keywords.map((k) => (
              <p key={k}>&mdash; {k}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
