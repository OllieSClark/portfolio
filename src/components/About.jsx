import Typed from "../typeset/Typed";
import Compiled from "../typeset/Compiled";
import Sidenote from "./Sidenote";
import RedMarginNote from "./RedMarginNote";
import SectionEyebrow from "./SectionEyebrow";
import { introduction } from "../data/paper";

const keywords = [
  "Numerical optimisation",
  "Generalised linear models",
  "Generative modelling",
  "Mathematical finance",
  "Statistical computing (R, Python)",
];

export default function About() {
  return (
    <section id="introduction" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <SectionEyebrow n={1} title="Introduction" />
        <div className="grid sm:grid-cols-[2fr_1fr] gap-12">
          <div className="relative">
            <RedMarginNote fireId="intro-done" side="left">
              tighten this (v0.5)
            </RedMarginNote>
            <Sidenote n={1}>
              The original plan was gradient methods (Adam, L-BFGS); the pivot
              to trust region came mid-project, when gradient methods turned
              out not to exploit the adjusted-score structure, a documented,
              examiner-praised judgement call.
            </Sidenote>
            <Typed
              order={50}
              script={introduction}
              as="p"
              className="font-display text-xl sm:text-2xl leading-snug text-ink"
            />
          </div>
          <Compiled order={60}>
            <div className="font-mono text-sm text-ink-dim space-y-3 border-l border-line pl-6">
              <p className="text-ink">Keywords</p>
              {keywords.map((k) => (
                <p key={k}>&mdash; {k}</p>
              ))}
            </div>
          </Compiled>
        </div>
      </div>
    </section>
  );
}
