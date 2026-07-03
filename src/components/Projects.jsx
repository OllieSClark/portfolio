import useReveal from "../hooks/useReveal";
import projects from "../data/projects";

function ProjectRow({ project }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal group relative grid sm:grid-cols-[140px_1fr] gap-4 sm:gap-10 py-10 border-t border-line first:border-t-0"
    >
      <div className="font-mono text-xs text-paper-dim/70 uppercase tracking-wider pt-1">
        {project.period}
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-gold mb-2">
          {project.tag}
        </p>
        <h3 className="font-display text-2xl sm:text-3xl text-paper group-hover:text-teal transition-colors">
          {project.title}
        </h3>
        <p className="font-body text-paper-dim mt-3 max-w-2xl leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5">
          {project.meta.map((m) => (
            <span
              key={m}
              className="font-mono text-[11px] uppercase tracking-wider text-paper-dim/60"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="work" className="border-t border-line">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-teal mb-4">
          t=1 — work
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-paper mb-8">
          Selected work
        </h2>
        <div>
          {projects.map((p) => (
            <ProjectRow key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
