import projects from "../data/projects";
import BenchmarkFigure from "./BenchmarkFigure";
import ResultsTable from "./ResultsTable";
import RedMarginNote from "./RedMarginNote";
import Sidenote from "./Sidenote";
import SectionEyebrow from "./SectionEyebrow";
import PlateCluster from "./PlateCluster";
import Typed from "../typeset/Typed";
import Compiled from "../typeset/Compiled";
import { projectScripts, brglm2Result } from "../data/paper";
import golf from "../assets/plates/golf.jpg";
import stairs from "../assets/plates/stairs.jpg";
import trophy from "../assets/plates/trophy.jpg";

// Document-order slots for the typed regions in §2 (spaced for insertion).
const ORDERS = { brglm2: 80, bny: 100, wq: 110, diss: 120 };

// brglm2 is the one proven, quantified result — it gets the full row, the
// benchmark figure, the table. Everything else (in progress, or not yet
// started) is honest about that in its own copy, so it shouldn't share the
// same visual weight: it reads as a compact "current & upcoming" strip.
const featured = projects.find((p) => p.id === "brglm2");
const current = projects.filter((p) => p.id !== "brglm2");

function ProjectRow({ project, number }) {
  return (
    <div className="py-10 border-t border-line first:border-t-0">
      <div className="grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-10">
        <div className="font-mono text-xs text-ink-dim uppercase tracking-wider pt-1">
          {number} &middot; {project.period}
        </div>

        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-widest text-red mb-2">
            {project.tag}
          </p>
          <h3 className="font-display text-fluid-sm text-ink">
            {project.title}
          </h3>
          <RedMarginNote fireId="r2" resolveId="r2-resolved">
            needs evidence (R2)
          </RedMarginNote>
          <Sidenote n={1}>
            The original plan was gradient methods (Adam, L-BFGS); the pivot
            to trust region came mid-project, when gradient methods turned
            out not to exploit the adjusted-score structure, a documented,
            examiner-praised judgement call.
          </Sidenote>
          <Typed
            order={ORDERS[project.id]}
            script={projectScripts[project.id]}
            as="p"
            className="font-body text-ink/90 mt-3 max-w-2xl leading-relaxed"
          />
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5">
            {project.meta.map((m) => (
              <span
                key={m}
                className="font-mono text-[11px] uppercase tracking-wider text-ink-dim"
              >
                {m}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 mt-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs uppercase tracking-widest text-red hover:underline"
              >
                Repository ↗
              </a>
            )}
            {project.report && (
              <a
                href={project.report}
                download
                className="font-mono text-xs uppercase tracking-widest text-red hover:underline"
              >
                Report (PDF) ↓
              </a>
            )}
          </div>
        </div>
      </div>

      {project.benchmark && (
        <div className="sm:ml-[184px] mt-8">
          <Sidenote n={2}>
            Benchmarks are the package&rsquo;s own scenarios, and the 394 tests
            are the original author&rsquo;s, which is rather the point.
          </Sidenote>
          <Typed
            order={85}
            script={brglm2Result}
            as="p"
            className="font-body text-ink/90 max-w-2xl leading-relaxed mb-6"
          />
          <Compiled order={90} marks={["r2-resolved"]}>
            <BenchmarkFigure />
            <ResultsTable className="mt-8" />
          </Compiled>
        </div>
      )}
    </div>
  );
}

// The compact companions to the annotation attached to each row below —
// kept here rather than inline so CompactProjectRow stays a plain map.
const NOTES = {
  bny: (
    <Sidenote n={3}>
      Present tense is deliberate. What an intern may publish is a
      negotiation that concludes in mid-August; the write-up follows the
      lawyers.
    </Sidenote>
  ),
  wq: (
    <RedMarginNote fireId="wq-note">cite? or does the certificate count</RedMarginNote>
  ),
  diss: (
    <Sidenote n={4}>
      Starts July 2026. A plan, not results. This entry gets rewritten from
      actual status as the year progresses.
    </Sidenote>
  ),
};

function CompactProjectRow({ project }) {
  return (
    <div className="relative py-5 border-t border-line first:border-t-0">
      {NOTES[project.id]}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="font-display text-base text-ink">{project.title}</h4>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-dim shrink-0">
          {project.period}
        </span>
      </div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-red mt-1">
        {project.tag}
      </p>
      <Typed
        order={ORDERS[project.id]}
        script={projectScripts[project.id]}
        as="p"
        className="font-body text-sm text-ink/80 mt-2 max-w-2xl leading-snug"
      />
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {project.meta.map((m) => (
          <span
            key={m}
            className="font-mono text-[10px] uppercase tracking-wider text-ink-dim/70"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="results" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28 relative">
        <SectionEyebrow n={2} title="Results" className="mb-4" />
        <h2 className="font-display text-fluid-md text-ink mb-8">
          Selected work
        </h2>
        <PlateCluster
          numeral="II"
          caption="Conference season, loosely interpreted."
          className="plates:top-40"
          photos={[
            { src: golf, alt: "Two friends on a golf course in autumn", width: 480, height: 720 },
            { src: stairs, alt: "Friends in black tie on a staircase lined with framed portraits", width: 480, height: 720 },
            { src: trophy, alt: "The author and a friend at a formal dinner, trophy on the table", width: 720, height: 480 },
          ]}
        />
        <div>
          <ProjectRow project={featured} number="2.1" />
        </div>

        <div className="mt-12">
          <p className="font-mono text-xs text-ink-dim uppercase tracking-wider mb-1">
            2.2 &middot; Current &amp; upcoming
          </p>
          <div>
            {current.map((p) => (
              <CompactProjectRow key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
