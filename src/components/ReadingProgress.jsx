import { useEffect, useState } from "react";

// Thin red fill along the nav's bottom edge, tracking scroll position through
// the document — the "p. x / 5" counter's continuous cousin.
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setPct(scrollable > 0 ? Math.min(100, (doc.scrollTop / scrollable) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 h-[2px] bg-red print:hidden"
      style={{ width: `${pct}%`, transition: "width 120ms ease-out" }}
      aria-hidden="true"
    />
  );
}
