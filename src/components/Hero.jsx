import VolSurfaceFigure from "./VolSurfaceFigure";
import Claim from "./Claim";

export default function Hero() {
  return (
    <section id="top" className="pt-32 sm:pt-40 pb-20 border-b border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-red mb-6">
          Working paper &middot; draft v0.4 &middot; not peer reviewed
        </p>

        <h1 className="font-display text-4xl sm:text-6xl leading-[1.1] text-ink">
          Statistics, optimisation, and the cost of being wrong at scale
        </h1>

        <div className="font-mono text-sm text-ink-dim mt-6 space-y-1">
          <p>Ollie Clark</p>
          <p>MDatSci, Statistics &amp; Machine Learning &mdash; University of Warwick</p>
          <p>ollie@orcus.co.uk</p>
        </div>

        <div className="mt-10 grid sm:grid-cols-[auto_1fr] gap-x-3 gap-y-2 max-w-3xl">
          <p className="font-display italic text-ink-dim">Abstract.</p>
          <p className="font-body text-ink leading-relaxed">
            Data science student at Warwick specialising in quantitative
            finance &mdash; the intersection of statistical rigour (GLMs,
            mathematical finance) and modern ML (neural networks,
            optimisation). Most recent work: a from-scratch trust-region
            optimiser that sped up bias-reduced GLM fitting by up to{" "}
            <Claim
              evidence={
                <>
                  <p className="font-mono text-ink">31.65x&ndash;168.6x speedup</p>
                  <p className="mt-1 text-ink-dim">
                    across dense and sparse benchmark scenarios, coefficient
                    agreement &lt;10&#8315;&#8310; vs. the original package,
                    394/394 tests passing. See Fig. 2, &sect;2.1.
                  </p>
                </>
              }
            >
              168x
            </Claim>
            .
          </p>
        </div>

        <VolSurfaceFigure className="mt-14 h-56 sm:h-72" />
      </div>
    </section>
  );
}
