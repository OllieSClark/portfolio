import Typed from "../typeset/Typed";
import Compiled from "../typeset/Compiled";
import { correspondenceHead, correspondenceBody } from "../data/paper";

const GITHUB_URL = "https://github.com/OllieSClark";
const LINKEDIN_URL = "https://www.linkedin.com/in/your-username";
const EMAIL = "ollie@orcus.co.uk";

export default function Contact() {
  return (
    <section id="correspondence" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-red mb-4">
          &sect;4&nbsp;&nbsp;Correspondence
        </p>
        <Typed
          order={150}
          script={correspondenceHead}
          as="h2"
          className="font-display text-3xl sm:text-4xl text-ink max-w-2xl leading-tight"
        />
        <Typed
          order={155}
          script={correspondenceBody}
          as="p"
          className="font-body text-ink/90 mt-6 max-w-xl leading-relaxed"
        />

        <Compiled order={160}>
          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href={`mailto:${EMAIL}`}
              className="font-mono text-xs uppercase tracking-widest px-5 py-3 bg-red text-paper hover:bg-ink transition-colors"
            >
              {EMAIL}
            </a>
            <a
              href="/cv.pdf"
              download
              className="font-mono text-xs uppercase tracking-widest px-5 py-3 border border-ink-dim/40 text-ink hover:border-red hover:text-red transition-colors"
            >
              Download CV
            </a>
          </div>

          <div className="flex gap-8 mt-16 pt-8 border-t border-line">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-ink-dim hover:text-ink transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs uppercase tracking-widest text-ink-dim hover:text-ink transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </Compiled>
      </div>
    </section>
  );
}
