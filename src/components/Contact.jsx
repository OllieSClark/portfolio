import Typed from "../typeset/Typed";
import Compiled from "../typeset/Compiled";
import SectionEyebrow from "./SectionEyebrow";
import PlateCluster from "./PlateCluster";
import { correspondenceHead, correspondenceBody } from "../data/paper";
import trio from "../assets/plates/trio.jpg";
import pair from "../assets/plates/pair.jpg";
import ball from "../assets/plates/ball.jpg";

const GITHUB_URL = "https://github.com/OllieSClark";
const LINKEDIN_URL = "https://www.linkedin.com/in/oliver-clark-a8926729b";
const EMAIL = "ollie@orcus.co.uk";

export default function Contact() {
  return (
    <section id="correspondence" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28 relative">
        <SectionEyebrow n={4} title="Correspondence" className="mb-4" />
        <Typed
          order={150}
          script={correspondenceHead}
          as="h2"
          className="font-display text-fluid-md text-ink max-w-2xl leading-tight"
        />
        <Typed
          order={155}
          script={correspondenceBody}
          as="p"
          className="font-body text-ink/90 mt-6 max-w-xl leading-relaxed"
        />

        <PlateCluster
          numeral="III"
          caption="The research group, annual meeting."
          className="plates:top-20"
          photos={[
            { src: pair, alt: "The author and a friend at a summer ball", width: 720, height: 480 },
            { src: ball, alt: "A large group in formalwear on stone steps", width: 720, height: 480 },
            { src: trio, alt: "Three friends in evening dress on a lawn", width: 720, height: 480 },
          ]}
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
