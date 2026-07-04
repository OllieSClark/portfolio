import { useMarkFired } from "../typeset/TypesetContext";

// A reviewer's-pen margin note driven by typeset marks: appears when `fireId`
// fires, gets struck through when `resolveId` fires (e.g. "needs evidence —
// R2" resolved by the benchmark figure landing). xl+: true margin; below xl:
// inline strip above the anchor.
export default function RedMarginNote({ fireId, resolveId, side = "right", children }) {
  const fired = useMarkFired(fireId);
  const resolveFired = useMarkFired(resolveId ?? "__none__");
  const resolved = resolveId ? resolveFired : false;

  const sideCls =
    side === "left"
      ? "xl:right-full xl:mr-8 xl:w-44 xl:text-right"
      : "xl:left-full xl:ml-8 xl:w-48";

  // NOTE: no `relative` here — the absolute note anchors to the anchor
  // row's positioned column so it lands in the true margin on xl.
  return (
    <span
      className={`ts-margin-note ${fired ? "is-fired" : ""} ${resolved ? "is-resolved" : ""}
        block my-2 xl:absolute xl:top-0 xl:my-0 ${sideCls}`}
      aria-hidden={!fired}
    >
      {children}
      {resolved && <span className="ml-1 no-underline">✓</span>}
    </span>
  );
}
