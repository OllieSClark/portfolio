import { useEffect } from "react";
import { useTypeset } from "../typeset/TypesetContext";
import ClaudeMark from "./ClaudeMark";

const revisions = [
  ["v0.1", "scaffold"],
  ["v0.2", "preprint layout"],
  ["v0.3", "figures & claims"],
  ["v0.4", "typeset engine"],
];

export default function CompileFooter() {
  const { allDone, fireMark } = useTypeset();
  const version = allDone ? "v0.4" : "v0.3";
  const date = new Date().toISOString().slice(0, 10);

  // this credit lives outside the typed prose, so its citation fires as soon
  // as the footer itself is on the page rather than waiting on a typed cite()
  useEffect(() => {
    fireMark("cite-7");
  }, [fireMark]);

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
        &copy; {new Date().getFullYear()} Ollie Clark &middot; typeset with{" "}
        <ClaudeMark className="mx-0.5" />
        Claude<sup className="ts-cite"><a href="#ref-7">[7]</a></sup>
      </p>
    </footer>
  );
}
