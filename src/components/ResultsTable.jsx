// Table 2 — only the published benchmark facts; nothing invented.
const rows = [
  ["Dense scenarios", "1.00x (baseline)", "31.65x"],
  ["Sparse scenarios", "1.00x (baseline)", "168.6x"],
];

export default function ResultsTable({ className = "" }) {
  return (
    <figure className={className}>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm border-t-2 border-b-2 border-ink">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left font-medium py-2 pr-4">Scenario</th>
              <th className="text-right font-medium py-2 px-4">Fisher scoring</th>
              <th className="text-right font-medium py-2 pl-4">Trust region</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([scenario, baseline, speedup]) => (
              <tr key={scenario} className="border-b border-line/60">
                <td className="py-2 pr-4 text-ink">{scenario}</td>
                <td className="py-2 px-4 text-right text-ink-dim">{baseline}</td>
                <td className="py-2 pl-4 text-right text-red font-semibold">
                  {speedup}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-2 pr-4 text-ink">Correctness</td>
              <td className="py-2 px-4 text-right text-ink-dim" colSpan={2}>
                394/394 tests passing &middot; coefficient agreement &lt;10⁻⁶
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption className="fig-caption mt-2">
        <span className="fig-number">Table 2.</span> Fit-time speedup of the
        trust-region engine over brglm2's quasi-Fisher scoring, dense and sparse
        benchmark scenarios.
      </figcaption>
    </figure>
  );
}
