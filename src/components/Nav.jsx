import { useMarkFired } from "../typeset/TypesetContext";

// The outline builds itself: each section's nav entry appears the moment its
// prose starts being written (a mark at the head of the section's first
// script). Slots are always rendered so the layout never shifts; scrolled-past
// sections force-complete and backfill their entries.
const links = [
  { href: "#introduction", label: "§1 Intro", markId: "sec-intro" },
  { href: "#results", label: "§2 Results", markId: "sec-results" },
  { href: "#references", label: "§3 Refs", markId: "sec-refs" },
  { href: "#correspondence", label: "§4 Contact", markId: "sec-contact" },
];

function NavLink({ href, label, markId }) {
  const fired = useMarkFired(markId);
  return (
    <a
      href={href}
      aria-hidden={!fired}
      tabIndex={fired ? 0 : -1}
      className={`font-mono text-xs uppercase tracking-widest text-ink-dim hover:text-ink
        transition-all duration-500 ${
          fired ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
        }`}
    >
      {label}
    </a>
  );
}

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-sm bg-paper/85 border-b border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
        <a
          href="#top"
          className="font-mono text-xs tracking-tight text-ink-dim hover:text-red transition-colors"
        >
          Clark (2026), working paper
        </a>
        <nav className="hidden sm:flex items-center gap-6">
          {links.map((l) => (
            <NavLink key={l.href} {...l} />
          ))}
          <a
            href="/cv.pdf"
            download
            className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-red/60 text-red hover:bg-red hover:text-paper transition-colors"
          >
            CV ↓
          </a>
        </nav>
      </div>
    </header>
  );
}
