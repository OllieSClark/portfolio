import Typed from "../typeset/Typed";
import Compiled from "../typeset/Compiled";
import RedMarginNote from "./RedMarginNote";
import SectionEyebrow from "./SectionEyebrow";
import SectionDivider from "./SectionDivider";
import Claim from "./Claim";
import AcademicTable from "./AcademicTable";
import { introduction } from "../data/paper";

const keywords = [
  "Numerical optimisation",
  "Generalised linear models",
  "Generative modelling",
  "Mathematical finance",
  "Statistical computing (R, Python)",
];

const stack = ["Python", "R", "PyTorch", "NumPy / pandas", "Java", "Spring", "LaTeX", "Git"];

const y3Evidence = (
  <>
    <span className="block font-mono text-ink">Year 3 — 78.5% (First)</span>
    <span className="block mt-1 text-ink-dim">
      CS342 Machine Learning 86, ST349 ML Frameworks 84, CS331 Neural
      Computing 72, ST339 Mathematical Finance 73. See Table 1, &sect;1.
    </span>
  </>
);

const prizeEvidence = (
  <>
    <span className="block font-mono text-ink">CS350 Data Science Project — 89</span>
    <span className="block mt-1 text-ink-dim">
      Final report &amp; viva also graded 89 (Grade 1). Awarded the Best Data
      Science Third-Year Prize by the Department of Computer Science. Basis
      of the brglm2 work, &sect;2.1. See Table 1, &sect;1.
    </span>
  </>
);

const y2Evidence = (
  <>
    <span className="block font-mono text-ink">Year 2 — 70.7%</span>
    <span className="block mt-1 text-ink-dim">
      The softest year by class average; ST227 Stochastic Processes (81) is
      the module most directly relevant to the current dissertation work on
      diffusion models. See Table 1, &sect;1.
    </span>
  </>
);

const y1Evidence = (
  <>
    <span className="block font-mono text-ink">Year 1 — 76.3% (First)</span>
    <span className="block mt-1 text-ink-dim">
      IB104 Mathematical Programming 1 at 96 is the highest single mark
      across all three years; ST119 Probability 2 88, ST117 Introduction to
      Statistical Modelling 84. See Table 1, &sect;1.
    </span>
  </>
);

const avgEvidence = (
  <>
    <span className="block font-mono text-ink">Weighted average, Years 1&ndash;3 — 75.5%</span>
    <span className="block mt-1 text-ink-dim">
      Warwick&rsquo;s own year weightings (10% / 20% / 30%) applied to
      76.3 / 70.7 / 78.5. The MDatSci dissertation year carries the
      remaining 40% of the final classification and isn&rsquo;t reflected
      yet. See Table 1, &sect;1.
    </span>
  </>
);

export default function About() {
  return (
    <section id="introduction">
      <SectionDivider markId="sec-intro" />
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <SectionEyebrow n={1} title="Introduction" />
        <div className="grid sm:grid-cols-[2fr_1fr] gap-12">
          <div className="relative">
            <RedMarginNote fireId="intro-done" side="left">
              tighten this (v0.5)
            </RedMarginNote>
            <Typed
              order={50}
              script={introduction}
              as="p"
              className="font-display text-fluid-sm leading-snug text-ink"
            />
          </div>
          <Compiled order={60}>
            <div className="font-mono text-sm text-ink-dim space-y-3 border-l border-line pl-6">
              <p className="text-ink">Keywords</p>
              {keywords.map((k) => (
                <p key={k}>&mdash; {k}</p>
              ))}
              <p className="text-ink pt-3">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] uppercase tracking-wider border border-line px-1.5 py-0.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Compiled>
        </div>

        <Compiled order={65} className="mt-14">
          <div className="max-w-2xl">
            <p className="font-body text-ink/90 leading-relaxed">
              Three years into the MDatSci, most recent first. Year 3:{" "}
              <Claim evidence={y3Evidence}>78.5% (First)</Claim> — anchored by{" "}
              <Claim evidence={prizeEvidence}>
                the Data Science Project (89, Best Data Science Third-Year
                Prize, Dept. of Computer Science)
              </Claim>
              . Year 2: <Claim evidence={y2Evidence}>70.7%</Claim>, the
              softest year, though Stochastic Processes&rsquo; 81 pointed
              straight at the diffusion-model dissertation to come. Year 1:{" "}
              <Claim evidence={y1Evidence}>76.3% (First)</Claim>, opened by a
              96 in Mathematical Programming — still the highest mark on
              record. Warwick-weighted average across the three years so
              far: <Claim evidence={avgEvidence}>75.5%</Claim>; the
              dissertation year (40% of the classification) is what&rsquo;s
              left to write.
            </p>
          </div>
          <AcademicTable className="mt-8 max-w-2xl" />
        </Compiled>
      </div>
    </section>
  );
}
