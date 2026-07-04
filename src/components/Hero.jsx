import VolSurfaceFigure from "./VolSurfaceFigure";
import Equation from "./Equation";
import CiteButton from "./CiteButton";
import Typed from "../typeset/Typed";
import Compiled from "../typeset/Compiled";
import { heroTitle, heroAbstract } from "../data/paper";

export default function Hero() {
  return (
    <section id="top" className="pt-32 sm:pt-40 pb-20 border-b border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        <div className="flex items-baseline justify-between gap-4 mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-red">
            Working paper &middot; draft v0.4 &middot; not peer reviewed
          </p>
          <CiteButton />
        </div>

        <Typed
          order={10}
          script={heroTitle}
          as="h1"
          className="font-display text-4xl sm:text-6xl leading-[1.1] text-ink min-h-[1.2em]"
        />

        <Compiled order={20}>
          <div className="font-mono text-sm text-ink-dim mt-6 space-y-1">
            <p>Ollie Clark</p>
            <p>MDatSci, Statistics &amp; Machine Learning &mdash; University of Warwick</p>
            <p>ollie@orcus.co.uk</p>
          </div>
        </Compiled>

        <div className="mt-10 grid sm:grid-cols-[auto_1fr] gap-x-3 gap-y-2 max-w-3xl">
          <p className="font-display italic text-ink-dim">Abstract.</p>
          <Typed
            order={30}
            script={heroAbstract}
            as="p"
            className="font-body text-ink leading-relaxed"
          />
        </div>

        <Compiled order={40} className="mt-14">
          <VolSurfaceFigure className="h-56 sm:h-72" />
          <Equation className="mt-6" />
        </Compiled>
      </div>
    </section>
  );
}
