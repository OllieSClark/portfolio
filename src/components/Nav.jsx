const links = [
  { href: "#introduction", label: "§1 Intro" },
  { href: "#results", label: "§2 Results" },
  { href: "#references", label: "§3 Refs" },
  { href: "#correspondence", label: "§4 Contact" },
];

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
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-widest text-ink-dim hover:text-ink transition-colors"
            >
              {l.label}
            </a>
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
