const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm bg-ink/70 border-b border-line">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-mono text-sm tracking-tight text-paper hover:text-gold transition-colors"
        >
          your.name<span className="text-gold">()</span>
        </a>
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-paper transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/cv.pdf"
            download
            className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-gold/60 text-gold hover:bg-gold hover:text-ink transition-colors"
          >
            CV ↓
          </a>
        </nav>
      </div>
    </header>
  );
}
