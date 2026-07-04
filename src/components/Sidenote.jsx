import { useState } from "react";

// Tufte-style static sidenote — ink-coloured (red stays "look here" only).
// md+: floats right of the prose as a small note card. Below md: superscript
// number toggles it inline.
export default function Sidenote({ n, children }) {
  const [open, setOpen] = useState(false);

  const body = (
    <>
      <span className="font-mono text-ink-dim mr-1">{n}.</span>
      {children}
    </>
  );

  return (
    <>
      {/* md+: floated note (placed by CSS order, reads as a margin remark) */}
      <span
        className="hidden md:block md:float-right md:clear-right md:w-48 md:ml-5 md:mb-2
          border-l border-line pl-3 text-xs font-body text-ink-dim leading-snug"
      >
        {body}
      </span>
      {/* below md: tap the number to expand inline */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden align-super text-[0.7em] font-mono text-ink-dim px-0.5"
        aria-label={`Sidenote ${n}`}
        aria-expanded={open}
      >
        {n}
      </button>
      {open && (
        <span className="md:hidden block my-2 rounded border border-line bg-surface p-3 text-sm font-body text-ink-dim leading-snug">
          {body}
        </span>
      )}
    </>
  );
}
