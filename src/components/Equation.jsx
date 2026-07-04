// Eq. (1) — the GBM SDE behind Fig. 1, hand-typeset (no KaTeX dependency).
export default function Equation({ className = "" }) {
  return (
    <div className={`flex items-center justify-center gap-6 ${className}`}>
      <p className="font-display text-lg sm:text-xl text-ink italic">
        dS
        <sub className="not-italic text-[0.65em]">t</sub> = μS
        <sub className="not-italic text-[0.65em]">t</sub>
        {" "}dt + σS
        <sub className="not-italic text-[0.65em]">t</sub>
        {" "}dW
        <sub className="not-italic text-[0.65em]">t</sub>
      </p>
      <span className="font-body text-ink-dim">(1)</span>
    </div>
  );
}
