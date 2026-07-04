import { useMarkFired } from "../typeset/TypesetContext";

// A reviewer's-pen margin note driven by typeset marks: appears when `fireId`
// fires, gets struck through when `resolveId` fires (e.g. "needs evidence —
// R2" resolved by the benchmark figure landing). xl+: true margin; below xl:
// inline strip above the anchor.
export default function RedMarginNote({ fireId, resolveId, children }) {
  const fired = useMarkFired(fireId);
  const resolveFired = useMarkFired(resolveId ?? "__none__");
  const resolved = resolveId ? resolveFired : false;

  // NOTE: no `relative` here — the absolute note anchors to the project
  // row's positioned column so it lands in the true right margin on xl.
  return (
    <span
      className={`ts-margin-note ${fired ? "is-fired" : ""} ${resolved ? "is-resolved" : ""}
        block my-2 xl:absolute xl:left-full xl:top-0 xl:ml-8 xl:w-48 xl:my-0`}
      aria-hidden={!fired}
    >
      {children}
      {resolved && <span className="ml-1 no-underline">✓</span>}
    </span>
  );
}
