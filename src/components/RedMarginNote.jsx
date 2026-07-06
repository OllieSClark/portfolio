import { useMarkFired } from "../typeset/TypesetContext";

// A reviewer's-pen margin note driven by typeset marks: appears when `fireId`
// fires, gets struck through when `resolveId` fires (e.g. "needs evidence —
// R2" resolved by the benchmark figure landing). Above the `plates`
// breakpoint (shared with PlateCluster — same margin-clipping math applies
// here): true margin note; below it: inline strip above the anchor.
export default function RedMarginNote({ fireId, resolveId, side = "right", children }) {
  const fired = useMarkFired(fireId);
  const resolveFired = useMarkFired(resolveId ?? "__none__");
  const resolved = resolveId ? resolveFired : false;

  const sideCls =
    side === "left"
      ? "plates:right-full plates:mr-8 plates:w-44 plates:text-right"
      : "plates:left-full plates:ml-8 plates:w-48";

  // NOTE: no `relative` here — the absolute note anchors to the anchor
  // row's positioned column so it lands in the true margin at `plates`.
  return (
    <span
      className={`ts-margin-note ${fired ? "is-fired" : ""} ${resolved ? "is-resolved" : ""}
        block my-2 plates:absolute plates:top-0 plates:my-0 ${sideCls}`}
      aria-hidden={!fired}
    >
      {children}
      {resolved && <span className="ml-1 no-underline">✓</span>}
    </span>
  );
}
