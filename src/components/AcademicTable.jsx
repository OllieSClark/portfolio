// Table 1 — year-by-year classification record, most recent first. Marks and
// weightings are the official Warwick year marks/weightings; nothing here is
// rounded or massaged beyond what the transcript itself reports.
const rows = [
  ["Year 3", "30%", "78.5%", "CS350 Data Science Project — 89 (Best Data Science Third-Year Prize, Dept. of Computer Science)"],
  ["Year 2", "20%", "70.7%", "ST227 Stochastic Processes — 81"],
  ["Year 1", "10%", "76.3%", "IB104 Mathematical Programming 1 — 96"],
];

export default function AcademicTable({ className = "" }) {
  return (
    <figure className={className}>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-sm border-t-2 border-b-2 border-ink">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left font-medium py-2 pr-4">Year</th>
              <th className="text-right font-medium py-2 px-4">Weighting</th>
              <th className="text-right font-medium py-2 px-4">Mark</th>
              <th className="text-left font-medium py-2 pl-4">Highlight</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([year, weighting, mark, highlight]) => (
              <tr key={year} className="border-b border-line/60">
                <td className="py-2 pr-4 text-ink whitespace-nowrap">{year}</td>
                <td className="py-2 px-4 text-right text-ink-dim">{weighting}</td>
                <td className="py-2 px-4 text-right text-red font-semibold whitespace-nowrap">
                  {mark}
                </td>
                <td className="py-2 pl-4 text-ink-dim">{highlight}</td>
              </tr>
            ))}
            <tr className="border-b border-line/60">
              <td className="py-2 pr-4 text-ink whitespace-nowrap">Year 4 (MDatSci)</td>
              <td className="py-2 px-4 text-right text-ink-dim">40%</td>
              <td className="py-2 px-4 text-right text-ink-dim" colSpan={2}>
                dissertation in progress — not yet reflected
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-ink whitespace-nowrap">Weighted avg. (Y1–3)</td>
              <td className="py-2 px-4 text-right text-ink-dim">60%</td>
              <td className="py-2 px-4 text-right text-red font-semibold whitespace-nowrap">
                75.5%
              </td>
              <td className="py-2 pl-4 text-ink-dim">provisional, pending Year 4</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption className="fig-caption mt-2">
        <span className="fig-number">Table 1.</span> Classification record by
        year, most recent first, against Warwick&rsquo;s own year weightings.
      </figcaption>
    </figure>
  );
}
