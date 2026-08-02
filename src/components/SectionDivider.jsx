import { useMarkFired } from "../typeset/TypesetContext";

// A section's top rule draws in from the left as the section itself starts
// being written, instead of sitting there as static furniture from first
// paint — the page assembling itself, not just text filling a fixed frame.
export default function SectionDivider({ markId }) {
  const fired = useMarkFired(markId);
  return (
    <div
      className={`border-t border-line origin-left transition-transform duration-700 ease-out ${
        fired ? "scale-x-100" : "scale-x-0"
      }`}
      aria-hidden="true"
    />
  );
}
