import { useState } from "react";

// Tufte-style static sidenote — ink-coloured (red stays "look here" only).
// xl+: sits in the true right margin beside the anchor. Below xl: superscript
// number toggles it inline.
export default function Sidenote({ n, children }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="xl:pointer-events-none align-super text-[0.7em] font-mono text-ink-dim px-0.5"
        aria-label={`Sidenote ${n}`}
      >
        {n}
      </button>
      <span
        className={`
          ${open ? "block" : "hidden"} my-2 rounded border border-line bg-surface p-3
          text-sm font-body text-ink-dim leading-snug
          xl:block xl:absolute xl:left-full xl:top-0 xl:ml-10 xl:w-52
          xl:border-0 xl:bg-transparent xl:p-0 xl:text-xs
        `}
      >
        <span className="font-mono text-ink-dim mr-1">{n}.</span>
        {children}
      </span>
    </span>
  );
}
