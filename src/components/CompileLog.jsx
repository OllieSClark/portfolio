import { useEffect, useState } from "react";
import { useTypeset } from "../typeset/TypesetContext";

const LINES = [
  "This is pdfTeX (spiritually), Version 3.14",
  "(./clark-2026-portfolio.tex",
  "LaTeX2e <2026-06-01> ... 2 warnings",
  "Output written on clark-2026-portfolio (5 pages).",
];

// A brief compile-log flash before the hero starts typing. Pure theatre;
// never shown under reduced motion or after skip.
export default function CompileLog() {
  const { instant, allDone } = useTypeset();
  const [shown, setShown] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (instant.current) {
      setGone(true);
      return;
    }
    const timers = LINES.map((_, i) =>
      setTimeout(() => setShown(i + 1), 120 + i * 140)
    );
    timers.push(setTimeout(() => setGone(true), 1400));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone || allDone || shown === 0) return null;

  return (
    <div
      className="fixed bottom-10 left-4 z-40 font-mono text-[10px] leading-relaxed text-ink-dim bg-surface border border-line px-3 py-2 print:hidden"
      aria-hidden="true"
    >
      {LINES.slice(0, shown).map((l) => (
        <p key={l}>{l}</p>
      ))}
    </div>
  );
}
