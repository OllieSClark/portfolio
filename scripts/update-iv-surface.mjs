// Fetches Deribit's public (keyless) BTC options book summary, regrids the
// scattered (strike, expiry) implied-vol chain onto the fixed NK x NT grid
// VolSurfaceFigure.jsx renders, and writes src/data/iv-surface.json.
//
// Run via the daily GitHub Actions workflow (.github/workflows/update-iv-surface.yml).
// Local iteration: `node scripts/update-iv-surface.mjs --dry-run --verbose`.
//
// Design constants (M_MAX, T_MAX_DAYS, NK, NT) are fixed, not derived from
// whatever strikes/expiries Deribit happens to list on a given day — that
// keeps the surface's visual scale stable day to day. NK/NT must match the
// constants of the same name in src/components/VolSurfaceFigure.jsx.

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, "..", "src", "data", "iv-surface.json");

const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");

const NK = 24; // must match VolSurfaceFigure.jsx
const NT = 14; // must match VolSurfaceFigure.jsx
const M_MAX = 0.6; // +-60% log-moneyness window -> k in [-1, 1]
const T_MAX_DAYS = 180; // expiries beyond this are excluded -> tau in [0, 1]
const MIN_EXPIRIES = 3;
const MIN_STRIKES_PER_EXPIRY = 5;
const IV_MIN = 0.05;
const IV_MAX = 3.0;

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function log(...args) {
  console.log(...args);
}
function vlog(...args) {
  if (VERBOSE) console.log(...args);
}

// soft-fail: log why, exit 0, leave any existing snapshot untouched. A
// transient Deribit hiccup should never be a red CI run or a bad commit.
function abort(reason) {
  log(`update-iv-surface: skipping write — ${reason}`);
  process.exit(0);
}

// "BTC-28AUG26-110000-P" -> { strike, expiryDate, optionType }
function parseInstrumentName(name) {
  const m = /^BTC-(\d{1,2})([A-Z]{3})(\d{2})-(\d+(?:\.\d+)?)-([CP])$/.exec(name);
  if (!m) return null;
  const [, day, monStr, yy, strikeStr, cp] = m;
  const month = MONTHS.indexOf(monStr);
  if (month === -1) return null;
  const year = 2000 + Number(yy);
  // Deribit options expire 08:00 UTC on the expiry date.
  const expiryDate = new Date(Date.UTC(year, month, Number(day), 8, 0, 0));
  return { strike: Number(strikeStr), expiryDate, optionType: cp === "C" ? "call" : "put" };
}

async function fetchChain(currency) {
  const url = `https://www.deribit.com/api/v2/public/get_book_summary_by_currency?currency=${currency}&kind=option`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Deribit HTTP ${res.status}`);
  const body = await res.json();
  if (!Array.isArray(body?.result)) throw new Error("Deribit response missing result[]");
  return body.result;
}

function median(nums) {
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// least-squares fit of iv ~ a + b*k + c*k^2 (matches the synthetic model's
// own quadratic-in-moneyness shape, and is robust against sparse strikes)
function fitQuadratic(points) {
  // normal equations for [1, k, k^2] basis
  let S0 = 0, S1 = 0, S2 = 0, S3 = 0, S4 = 0, T0 = 0, T1 = 0, T2 = 0;
  for (const { k, iv } of points) {
    const k2 = k * k;
    S0 += 1; S1 += k; S2 += k2; S3 += k2 * k; S4 += k2 * k2;
    T0 += iv; T1 += iv * k; T2 += iv * k2;
  }
  // solve the 3x3 system [[S0,S1,S2],[S1,S2,S3],[S2,S3,S4]] . [a,b,c] = [T0,T1,T2]
  const A = [
    [S0, S1, S2, T0],
    [S1, S2, S3, T1],
    [S2, S3, S4, T2],
  ];
  for (let col = 0; col < 3; col++) {
    let pivot = col;
    for (let r = col + 1; r < 3; r++) if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    [A[col], A[pivot]] = [A[pivot], A[col]];
    if (Math.abs(A[col][col]) < 1e-12) return null; // degenerate (e.g. all same k)
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = A[r][col] / A[col][col];
      for (let c = col; c < 4; c++) A[r][c] -= f * A[col][c];
    }
  }
  const [a, b, c] = [A[0][3] / A[0][0], A[1][3] / A[1][1], A[2][3] / A[2][2]];
  return (k) => a + b * k + c * k * k;
}

function smoothGrid(grid, passes) {
  let g = grid;
  const nt = g.length;
  const nk = g[0].length;
  for (let p = 0; p < passes; p++) {
    const out = [];
    for (let j = 0; j < nt; j++) {
      const row = [];
      for (let i = 0; i < nk; i++) {
        let sum = 0;
        let count = 0;
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const jj = Math.min(Math.max(j + dj, 0), nt - 1);
            const ii = Math.min(Math.max(i + di, 0), nk - 1);
            sum += g[jj][ii];
            count++;
          }
        }
        row.push(sum / count);
      }
      out.push(row);
    }
    g = out;
  }
  return g;
}

function buildGrid(rows) {
  const spot = median(rows.map((r) => r.underlying_price).filter((v) => Number.isFinite(v) && v > 0));
  if (!Number.isFinite(spot) || spot <= 0) return { error: "no valid spot price found" };

  const now = new Date();

  // one entry per (strike, expiry): prefer the OTM side (calls above spot,
  // puts below), which trades tighter/more liquid mark IV than deep ITM legs
  const byKey = new Map();
  for (const row of rows) {
    const parsed = parseInstrumentName(row.instrument_name);
    if (!parsed) continue;
    if (!Number.isFinite(row.mark_iv) || row.mark_iv <= 0) continue;
    const daysToExpiry = (parsed.expiryDate - now) / 86400000;
    if (daysToExpiry <= 0 || daysToExpiry > T_MAX_DAYS) continue;

    const isOtm =
      (parsed.optionType === "call" && parsed.strike >= spot) ||
      (parsed.optionType === "put" && parsed.strike < spot);
    const key = `${parsed.expiryDate.toISOString()}|${parsed.strike}`;
    const existing = byKey.get(key);
    if (!existing || (isOtm && !existing.isOtm)) {
      byKey.set(key, {
        expiryDate: parsed.expiryDate,
        daysToExpiry,
        strike: parsed.strike,
        iv: row.mark_iv / 100, // Deribit reports mark_iv as a percentage
        isOtm,
      });
    }
  }

  // group by expiry
  const byExpiry = new Map();
  for (const pt of byKey.values()) {
    const key = pt.expiryDate.toISOString();
    if (!byExpiry.has(key)) byExpiry.set(key, []);
    byExpiry.get(key).push(pt);
  }

  const ks = Array.from({ length: NK }, (_, i) => (i / (NK - 1)) * 2 - 1);
  const taus = Array.from({ length: NT }, (_, j) => j / (NT - 1));

  const slices = [];
  for (const [, pts] of byExpiry) {
    if (pts.length < MIN_STRIKES_PER_EXPIRY) continue;
    const withK = pts
      .map((p) => ({ k: Math.log(p.strike / spot) / M_MAX, iv: p.iv, daysToExpiry: p.daysToExpiry }))
      .filter((p) => Number.isFinite(p.k) && Number.isFinite(p.iv) && p.iv >= IV_MIN && p.iv <= IV_MAX);
    if (withK.length < MIN_STRIKES_PER_EXPIRY) continue;

    const fit = fitQuadratic(withK);
    if (!fit) continue;

    const kMin = Math.min(...withK.map((p) => p.k));
    const kMax = Math.max(...withK.map((p) => p.k));
    const ivAtKMin = fit(kMin);
    const ivAtKMax = fit(kMax);

    const rowValues = ks.map((k) => {
      const kClamped = Math.max(kMin, Math.min(kMax, k));
      // flat-clamp extrapolation beyond the real strike range, never let the
      // quadratic run away past what was actually observed
      if (k < kMin) return ivAtKMin;
      if (k > kMax) return ivAtKMax;
      return fit(kClamped);
    });

    slices.push({ tauReal: Math.min(1, withK[0].daysToExpiry / T_MAX_DAYS), rowValues });
  }

  if (slices.length < MIN_EXPIRIES) {
    return { error: `only ${slices.length} usable expiries (need >= ${MIN_EXPIRIES})` };
  }
  slices.sort((a, b) => a.tauReal - b.tauReal);

  // interpolate each of the NK moneyness columns across the NT tau grid,
  // flat-extrapolated before the first / after the last real expiry
  const grid = taus.map((tau) => {
    if (tau <= slices[0].tauReal) return slices[0].rowValues.slice();
    if (tau >= slices[slices.length - 1].tauReal) return slices[slices.length - 1].rowValues.slice();
    let lo = slices[0], hi = slices[slices.length - 1];
    for (let s = 0; s < slices.length - 1; s++) {
      if (tau >= slices[s].tauReal && tau <= slices[s + 1].tauReal) {
        lo = slices[s];
        hi = slices[s + 1];
        break;
      }
    }
    const span = hi.tauReal - lo.tauReal || 1;
    const w = (tau - lo.tauReal) / span;
    return lo.rowValues.map((v, i) => v + (hi.rowValues[i] - v) * w);
  });

  // Fitting each expiry slice independently and linearly bridging between
  // them (plus the flat-clamped edges) stitches together fine numerically
  // but looks jagged/boxy as a rendered wireframe — a couple of light 3x3
  // box-blur passes (edge-clamped) removes the stitching seams without
  // washing out the real skew/term-structure shape.
  const smoothed = smoothGrid(grid, 4);

  for (const row of smoothed) {
    for (const v of row) {
      if (!Number.isFinite(v) || v < IV_MIN || v > IV_MAX) {
        return { error: `grid contains an out-of-range value (${v})` };
      }
    }
  }

  return { spot, grid: smoothed, sliceCount: slices.length };
}

async function main() {
  let rows;
  try {
    rows = await fetchChain("BTC");
  } catch (err) {
    abort(`fetch failed (${err.message})`);
    return;
  }
  vlog(`fetched ${rows.length} BTC option rows`);

  const result = buildGrid(rows);
  if (result.error) {
    abort(result.error);
    return;
  }

  const { spot, grid, sliceCount } = result;
  const flat = grid.flat();
  vlog(
    `usable expiries: ${sliceCount}, spot: ${spot.toFixed(2)}, ` +
      `iv min/mean/max: ${Math.min(...flat).toFixed(3)}/${(flat.reduce((a, b) => a + b, 0) / flat.length).toFixed(3)}/${Math.max(...flat).toFixed(3)}`
  );

  const snapshot = {
    schemaVersion: 1,
    asOf: new Date().toISOString().slice(0, 10),
    fetchedAt: new Date().toISOString(),
    instrument: "BTC",
    spot,
    nk: NK,
    nt: NT,
    grid,
  };

  if (DRY_RUN) {
    log("--dry-run: not writing file. Snapshot would be:");
    log(JSON.stringify(snapshot, null, 2).slice(0, 800) + " ...");
    return;
  }

  const prev = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, "utf8") : null;
  const next = JSON.stringify(snapshot, null, 2) + "\n";
  if (prev === next) {
    log("update-iv-surface: no change from existing snapshot, skipping write.");
    return;
  }
  writeFileSync(OUT_PATH, next);
  log(`update-iv-surface: wrote ${OUT_PATH} (${sliceCount} expiries, spot ${spot.toFixed(2)})`);
}

main().catch((err) => {
  // an actual bug (not a data/fetch problem) — let this fail loudly
  console.error("update-iv-surface: unexpected error", err);
  process.exit(1);
});
