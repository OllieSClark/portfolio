import references from "../data/references";
import Compiled from "../typeset/Compiled";
import { useMarkFired } from "../typeset/TypesetContext";

function Entry({ r }) {
  const fired = useMarkFired(`cite-${r.id}`);
  return (
    <li
      id={`ref-${r.id}`}
      className={`transition-opacity duration-500 ${fired ? "opacity-100" : "opacity-0"}`}
    >
      <span className="font-mono text-xs text-red mr-2">[{r.id}]</span>
      <span className="font-body text-sm text-ink">
        {r.authors} ({r.year}). {r.title}.{" "}
        <span className="italic text-ink-dim">{r.venue}.</span>{" "}
        <a
          href={r.url}
          target="_blank"
          rel="noreferrer"
          className="text-red hover:underline break-all"
        >
          ↗
        </a>
      </span>
    </li>
  );
}

// §3 — entries fade in as their cite() fires in the text above; reaching the
// section itself fires any remaining ones via the Compiled marks list.
export default function References({ order }) {
  return (
    <section id="references" className="border-t border-line">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-red mb-8">
          &sect;3&nbsp;&nbsp;References
        </p>
        <Compiled order={order} marks={references.map((r) => `cite-${r.id}`)}>
          <ol className="space-y-3 max-w-3xl pl-1">
            {references.map((r) => (
              <Entry key={r.id} r={r} />
            ))}
          </ol>
        </Compiled>
      </div>
    </section>
  );
}
