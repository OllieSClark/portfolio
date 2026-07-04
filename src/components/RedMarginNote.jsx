import { useMarkFired } from "../typeset/TypesetContext";

// A reviewer's-pen margin note driven by typeset marks: appears when `fireId`
// fires, gets struck through when `resolveId` fires (e.g. "needs evidence —
// R2" resolved by the benchmark figure landing). xl+: true margin; below xl:
// inline strip above the anchor.
export default function RedMarginNote({ fireId, resolveId, children }) {
  const fired = useMarkFired(fireId);
  const resolveFired = useMarkFired(resolveId ?? "__none__");
  const resolved = resolveId ? resolveFired : false;

  return (
    <span className="relative block xl:inline">
      <span
        className={`ts-margin-note ${fired ? "is-fired" : ""} ${resolved ? "is-resolved" : ""}
          block my-2 xl:absolute xl:left-full xl:top-0 xl:ml-10 xl:w-52 xl:my-0`}
        aria-hidden={!fired}
      >
        {children}
        {resolved && <span className="ml-1 no-underline">✓</span>}
      </span>
    </span>
  );
}
