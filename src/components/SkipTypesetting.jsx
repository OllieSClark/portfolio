import { useTypeset } from "../typeset/TypesetContext";

export default function SkipTypesetting() {
  const { allDone, skipEverything } = useTypeset();
  if (allDone) return null;

  return (
    <button
      type="button"
      onClick={skipEverything}
      className="fixed bottom-4 right-4 z-40 font-mono text-[11px] uppercase tracking-widest
        px-3 py-2 border border-line bg-paper/90 text-ink-dim
        hover:border-red hover:text-red transition-colors"
    >
      ⏭ skip typesetting
    </button>
  );
}
