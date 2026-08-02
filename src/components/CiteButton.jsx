import { useState } from "react";

const BIBTEX = `@misc{clark2026portfolio,
  author       = {Clark, Ollie},
  title        = {Evidence, not assertion},
  year         = {2026},
  howpublished = {Working paper (personal portfolio)},
  note         = {MDatSci (Data Science), University of Warwick}
}`;

export default function CiteButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable (permissions/http) — quietly do nothing
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="font-mono text-xs text-ink-dim hover:text-red transition-colors print:hidden"
      title="Copy BibTeX citation"
    >
      {copied ? "copied ✓" : "[cite]"}
    </button>
  );
}
