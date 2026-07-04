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
          <h3 className="font-display text-xl sm:text-2xl text-ink">
            {project.title}
          </h3>
          {project.id === "brglm2" && (
            <RedMarginNote fireId="r2" resolveId="r2-resolved">
              needs evidence (R2)
            </RedMarginNote>
          )}
          {project.id === "bny" && (
            <Sidenote n={3}>
              Present tense is deliberate. What an intern may publish is a
              negotiation that concludes in mid-August; the write-up follows
              the lawyers.
            </Sidenote>
          )}
          {project.id === "wq" && (
            <RedMarginNote fireId="wq-note">
              cite? or does the trophy count
            </RedMarginNote>
          )}
          {project.id === "diss" && (
            <Sidenote n={4}>
              Starts July 2026. A plan, not results. This entry gets
              rewritten from actual status as the year progresses.
            </Sidenote>
          )}
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

export default function Projects() {
  return (
    <section id="results" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28 relative">
        <PlateCluster
          numeral="II"
          caption="Conference season, loosely interpreted."
          className="xl:top-40"
          photos={[
            { src: golf, alt: "Two friends on a golf course in autumn" },
            { src: stairs, alt: "Friends in black tie on a staircase lined with framed portraits" },
            { src: trophy, alt: "The author and a friend at a formal dinner, trophy on the table" },
          ]}
        />
        <SectionEyebrow n={2} title="Results" className="mb-4" />
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-8">
          Selected work
        </h2>
        <div>
          {projects.map((p, i) => (
            <ProjectRow key={p.id} project={p} number={`2.${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
