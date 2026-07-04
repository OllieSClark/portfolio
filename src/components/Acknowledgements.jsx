import Typed from "../typeset/Typed";
import { acknowledgements } from "../data/paper";

export default function Acknowledgements() {
  return (
    <section className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-14">
        <p className="font-display italic text-ink-dim mb-3">Acknowledgements.</p>
        <Typed
          order={130}
          script={acknowledgements}
          as="p"
          className="font-body text-sm text-ink/90 max-w-3xl leading-relaxed"
        />
      </div>
    </section>
  );
}
