import { useEffect, useState } from "react";

const SECTIONS = ["top", "introduction", "results", "references", "correspondence"];

export default function PageNumber() {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let current = 1;
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) current = i + 1;
      });
      setPage(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="hidden sm:block fixed bottom-4 left-4 z-30 font-mono text-[11px] text-ink-dim/80 print:hidden"
      aria-hidden="true"
    >
      p. {page} / {SECTIONS.length}
    </div>
  );
}
