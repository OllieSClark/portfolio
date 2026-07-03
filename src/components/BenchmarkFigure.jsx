// Figure 2 — the real brglm2 trust-region benchmark: 31.65x-168.6x speedup
// over the original Fisher-scoring fit, plotted as a range on a 1x baseline.
// Only the two reported numbers are plotted; nothing here is fabricated.
const LOW = 31.65;
const HIGH = 168.6;
const MAX_TICK = 180;
const TICKS = [1, 50, 100, 150];

function xFor(value) {
  return (value / MAX_TICK) * 100;
}

export default function BenchmarkFigure({ className = "" }) {
  return (
    <figure className={className}>
      <div className="rounded border border-line bg-surface p-6">
        <div className="relative h-24">
          {/* baseline + ticks */}
          <div className="absolute inset-x-0 top-10 h-px bg-line" />
          {TICKS.map((tick) => (
            <div
              key={tick}
              className="absolute top-6 flex flex-col items-center text-xs font-mono text-ink-dim"
              style={{ left: `${xFor(tick)}%`, transform: "translateX(-50%)" }}
            >
              <span className="h-4 w-px bg-line" />
              <span className="mt-1">{tick}x</span>
            </div>
          ))}

          {/* speedup range bar */}
          <div
            className="absolute top-8 h-2 rounded-full bg-ink/80"
            style={{
              left: `${xFor(LOW)}%`,
              width: `${xFor(HIGH) - xFor(LOW)}%`,
            }}
          />
          <div
            className="absolute top-6 h-6 w-0.5 bg-red"
            style={{ left: `${xFor(LOW)}%` }}
          />
          <div
            className="absolute top-6 h-6 w-0.5 bg-red"
            style={{ left: `${xFor(HIGH)}%` }}
          />

          <div
            className="absolute -top-1 font-mono text-sm text-ink"
            style={{ left: `${xFor(LOW)}%`, transform: "translateX(-8%)" }}
          >
            31.65x
          </div>
          <div
            className="absolute -top-1 font-mono text-sm font-semibold text-red"
            style={{ left: `${xFor(HIGH)}%`, transform: "translateX(-92%)" }}
          >
            168.6x
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-4 text-center font-mono text-sm">
          <div>
            <div className="text-lg text-ink">394/394</div>
            <div className="text-xs text-ink-dim">tests passing</div>
          </div>
          <div>
            <div className="text-lg text-ink">&lt;10⁻⁶</div>
            <div className="text-xs text-ink-dim">coefficient agreement</div>
          </div>
          <div>
            <div className="text-lg text-red">31.65x–168.6x</div>
            <div className="text-xs text-ink-dim">speedup, dense &amp; sparse</div>
          </div>
        </div>
      </div>
      <figcaption className="fig-caption mt-2">
        <span className="fig-number">Fig. 2.</span> Trust-region vs. Fisher-scoring
        fit time, brglm2 reimplementation, across dense and sparse benchmark scenarios.
      </figcaption>
    </figure>
  );
}
