// A tiny hand-drawn crab — "Clawd", the Claude Code mascot — that waddles
// side to side rather than doing anything showier. No external assets.
export default function ClaudeMark({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="0.95em"
      height="0.95em"
      aria-hidden="true"
      className={`inline-block align-[-0.15em] claude-mark ${className}`}
    >
      {/* claws */}
      <path
        d="M3.2 5.4 C1.8 4.6 1.4 3.2 2 2.2 C2.9 2.4 3.6 3.4 3.9 4.6"
        fill="none"
        stroke="#B33A2B"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M12.8 5.4 C14.2 4.6 14.6 3.2 14 2.2 C13.1 2.4 12.4 3.4 12.1 4.6"
        fill="none"
        stroke="#B33A2B"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* body */}
      <ellipse cx="8" cy="9.3" rx="4.6" ry="3.4" fill="#1C1712" />
      {/* eyes */}
      <circle cx="6.2" cy="7.6" r="0.6" fill="#FFF1E5" />
      <circle cx="9.8" cy="7.6" r="0.6" fill="#FFF1E5" />
      {/* legs */}
      <path d="M4 11 L2 12.3 M12 11 L14 12.3 M4.3 12.2 L2.6 14 M11.7 12.2 L13.4 14"
        stroke="#1C1712" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}
