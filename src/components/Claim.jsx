import { useId, useState } from "react";
import { useAnnotation } from "./AnnotationContext";

// A claim in running text ("168.6x speedup") that reveals its evidence in
// the margin rail on hover/focus (plates-lg+, where the rail fits), and
// inline via tap everywhere narrower — matching MarginRail's breakpoint so
// there is no width where a claim answers with nothing.
export default function Claim({ children, evidence }) {
  const id = useId();
  const { setActive } = useAnnotation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activate = () => setActive({ id, evidence });
  const deactivate = () =>
    setActive((current) => (current?.id === id ? null : current));

  return (
    <span className="relative">
      <span
        className="claim"
        tabIndex={0}
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {children}
      </span>
      {mobileOpen && (
        <span
          className="absolute left-0 top-full z-30 mt-2 block w-72 max-w-[80vw] plates-lg:hidden
            rounded border border-line bg-surface-2 p-3 text-sm shadow-md"
        >
          {evidence}
        </span>
      )}
    </span>
  );
}
