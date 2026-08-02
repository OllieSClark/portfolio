import { useMarkFired } from "../typeset/TypesetContext";

// Generic settle-in for static furniture (titles, dates, tags, links) that
// should appear alongside its region's own typing rather than sitting there
// pre-rendered from load — same "compile in" feel as figures/dividers/notes.
export default function MarkReveal({ markId, as: Tag = "div", className = "", children }) {
  const fired = useMarkFired(markId);
  return (
    <Tag
      className={`transition-all duration-500 ease-out ${
        fired ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
