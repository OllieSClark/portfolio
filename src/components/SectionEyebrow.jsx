// Section marker: § set slightly smaller/lighter and tight against its digit
// (letterspacing between § and the number made it read as a floating glyph),
// with the tracking kept on the section word.
export default function SectionEyebrow({ n, title, className = "mb-8" }) {
  return (
    <p
      className={`font-mono text-xs uppercase tracking-[0.25em] text-red ${className}`}
    >
      <span className="text-[0.85em] text-red/70">&sect;</span>
      {n}&nbsp;&nbsp;{title}
    </p>
  );
}
