import { useState } from "react";
import { useMarkFired } from "../typeset/TypesetContext";

// Tufte-style sidenote — ink-coloured (red stays "look here" only). Settles
// in once its fireId mark fires, matching the same weighted "compile in"
// feel figures/tables use, rather than sitting there pre-rendered from load.
// md+: floats right of the prose as a small note card. Below md: superscript
// number toggles it inline.
export default function Sidenote({ n, fireId, children }) {
  const [open, setOpen] = useState(false);
  const fired = useMarkFired(fireId);

  const body = (
    <>
      <span className="font-mono text-ink-dim mr-1">{n}.</span>
      {children}
    </>
  );

  const settleCls = `transition-all duration-500 ease-out ${
    fired ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
  }`;

  return (
    <>
      {/* md+: floated note (placed by CSS order, reads as a margin remark) */}
      <span
        className={`hidden md:block md:float-right md:clear-right md:w-48 md:ml-5 md:mb-2
          border-l border-line pl-3 text-xs font-body text-ink-dim leading-snug ${settleCls}`}
      >
        {body}
      </span>
      {/* below md: tap to expand inline; a labelled pill, not a stray digit,
          since this renders before the paragraph rather than inline within it */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`md:hidden inline-flex items-center gap-1 mb-2 px-2 py-0.5
          rounded-full border border-line text-[11px] font-mono text-ink-dim
          hover:text-ink hover:border-ink-dim/60 ${settleCls}`}
        aria-label={`Sidenote ${n}`}
        aria-expanded={open}
        aria-hidden={!fired}
        tabIndex={fired ? 0 : -1}
      >
        note {n} {open ? "▴" : "▾"}
      </button>
      {open && fired && (
        <span className="md:hidden block mb-3 rounded border border-line bg-surface p-3 text-sm font-body text-ink-dim leading-snug">
          {body}
        </span>
      )}
    </>
  );
}
