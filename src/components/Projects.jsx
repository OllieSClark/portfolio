import useReveal from "../hooks/useReveal";
import projects from "../data/projects";
import BenchmarkFigure from "./BenchmarkFigure";
import Claim from "./Claim";

function ProjectRow({ project, number }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal py-10 border-t border-line first:border-t-0"
    >
      <div className="grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-10">
        <div className="font-mono text-xs text-ink-dim uppercase tracking-wider pt-1">
          {number} &middot; {project.period}
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-red mb-2">
            {project.tag}
          </p>
          <h3 className="font-display text-xl sm:text-2xl text-ink">
            {project.title}
          </h3>
          <p className="font-body text-ink/90 mt-3 max-w-2xl leading-relaxed">
            {project.description}
          </p>
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
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-mono text-xs uppercase tracking-widest text-red hover:underline mt-4"
            >
              Repository ↗
            </a>
          )}
        </div>
      </div>

      {project.benchmark && (
        <div className="sm:ml-[184px] mt-8">
          <p className="font-body text-ink/90 max-w-2xl leading-relaxed mb-6">
            Result:{" "}
            <Claim
              evidence={
                <p className="text-ink-dim">
                  See Fig. 2 below — full range plotted against the 1x
                  Fisher-scoring baseline, with test-suite and coefficient
                  agreement.
                </p>
              }
            >
              31.65x&ndash;168.6x speedup
            </Claim>{" "}
            across dense and sparse scenarios, coefficient agreement &lt;10&#8315;&#8310;
            against the original package, with the existing 394-test suite green.
          </p>
          <BenchmarkFigure />
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="results" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-red mb-4">
          &sect;2&nbsp;&nbsp;Results
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-ink mb-8">
          Selected work
        </h2>
        <div>
          {projects.map((p, i) => (
            <ProjectRow key={p.title} project={p} number={`2.${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
