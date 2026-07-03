import { useId, useState } from "react";
import { useAnnotation } from "./AnnotationContext";

// A claim in running text ("168.6x speedup") that reveals its evidence
// in the margin rail on hover/focus, and inline on mobile via tap.
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
        <span className="mt-2 block lg:hidden rounded border border-line bg-surface-2 p-3 text-sm">
          {evidence}
        </span>
      )}
    </span>
  );
}
