import { useAnnotation } from "./AnnotationContext";

// The reviewer's-pen margin — shows whichever claim's evidence is active.
export default function MarginRail() {
  const { active } = useAnnotation();

  return (
    <aside className="hidden xl:block fixed top-1/3 right-6 w-72 z-30">
      <div
        className={`rounded border border-line bg-surface-2 p-4 text-sm shadow-sm transition-all duration-200 ${
          active ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        <p className="fig-caption mb-2">EVIDENCE</p>
        {active ? active.evidence : null}
      </div>
    </aside>
  );
}
