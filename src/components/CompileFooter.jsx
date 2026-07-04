import { useTypeset } from "../typeset/TypesetContext";

const revisions = [
  ["v0.1", "scaffold"],
  ["v0.2", "preprint layout"],
  ["v0.3", "figures & claims"],
  ["v0.4", "typeset engine"],
];

export default function CompileFooter() {
  const { allDone } = useTypeset();
  const version = allDone ? "v0.4" : "v0.3";
  const date = new Date().toISOString().slice(0, 10);

  return (
    <footer className="max-w-4xl mx-auto px-6 sm:px-10 py-8 space-y-3">
      <div className="font-mono text-[11px] text-ink-dim/80">
        <p className="text-ink-dim mb-1">Revision history</p>
        {revisions.map(([v, note]) => (
          <p key={v}>
            {v} — {note}
          </p>
        ))}
      </div>
      <p className="font-mono text-[11px] text-ink-dim/70 border-t border-line pt-3">
        Compiled {date} &middot; pdfTeX-live (spiritually) &middot; draft{" "}
        <span className={allDone ? "text-red" : ""}>{version}</span> &middot;
        &copy; {new Date().getFullYear()} Ollie Clark
      </p>
    </footer>
  );
}
