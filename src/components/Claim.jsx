import { useId, useLayoutEffect, useRef, useState } from "react";
import { useAnnotation } from "./AnnotationContext";

const EDGE_MARGIN = 12;

// A claim in running text ("168.6x speedup") that reveals its evidence in
// the margin rail on hover/focus (plates-lg+, where the rail fits), and
// inline via tap everywhere narrower — matching MarginRail's breakpoint so
// there is no width where a claim answers with nothing.
export default function Claim({ children, evidence }) {
  const id = useId();
  const { setActive } = useAnnotation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const popRef = useRef(null);

  const activate = () => setActive({ id, evidence });
  const deactivate = () =>
    setActive((current) => (current?.id === id ? null : current));

  // The popover is anchored `left-0` off the claim word, which can sit
  // anywhere in a line of running text — near either viewport edge on
  // mobile. Measure after it mounts (shift starts at 0) and nudge it back
  // on-screen if it collides with either edge, instead of letting it clip.
  useLayoutEffect(() => {
    if (!mobileOpen) return;

    const clamp = () => {
      const el = popRef.current;
      if (!el) return;
      // getBoundingClientRect reflects any transform already applied, so a
      // fresh delta here is relative to the *current* on-screen position —
      // safe to call repeatedly (e.g. on resize) without compounding.
      const rect = el.getBoundingClientRect();
      let delta = 0;
      if (rect.right > window.innerWidth - EDGE_MARGIN) {
        delta = window.innerWidth - EDGE_MARGIN - rect.right;
      } else if (rect.left < EDGE_MARGIN) {
        delta = EDGE_MARGIN - rect.left;
      }
      if (delta !== 0) setShift((s) => s + delta);
    };

    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [mobileOpen]);

  const openMobile = () => {
    setShift(0);
    setMobileOpen((v) => !v);
  };

  return (
    <span className="relative">
      <span
        className="claim"
        tabIndex={0}
        onMouseEnter={activate}
        onMouseLeave={deactivate}
        onFocus={activate}
        onBlur={deactivate}
        onClick={openMobile}
      >
        {children}
      </span>
      {mobileOpen && (
        <span
          ref={popRef}
          style={shift ? { transform: `translateX(${shift}px)` } : undefined}
          className="absolute left-0 top-full z-30 mt-2 block w-72 max-w-[80vw] plates-lg:hidden
            rounded border border-line bg-surface-2 p-3 text-sm shadow-md"
        >
          {evidence}
        </span>
      )}
    </span>
  );
}
