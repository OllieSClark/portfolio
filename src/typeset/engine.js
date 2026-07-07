// Pure script-runner for the typeset effect. A script is an array of ops;
// the runner mutates a segment list and reports it after every step so the
// consuming component can render partial state. No React in here.

// ---- op constructors (used by src/data/paper.jsx scripts) ----
export const t = (text, opts = {}) => ({ op: "t", text, ...opts });
export const typo = (wrong, right) => ({ op: "typo", wrong, right });
export const swap = (vague, precise, opts = {}) => ({
  op: "swap",
  vague,
  precise,
  ...opts,
});
export const cite = (n) => ({ op: "cite", n });
export const pause = (ms) => ({ op: "pause", ms });
export const mark = (id) => ({ op: "mark", id });

let nextSegId = 1;
const seg = (kind, props = {}) => ({ id: nextSegId++, kind, text: "", ...props });

// Human-ish cadence: variance per char, longer beats after punctuation.
function charDelay(ch, cps) {
  const base = 1000 / cps;
  let d = base * (0.6 + Math.random() * 0.8);
  if (",;:".includes(ch)) d += 70 + Math.random() * 70;
  if (".!?".includes(ch)) d += 140 + Math.random() * 110;
  else if (Math.random() < 0.02) d += 80;
  return d;
}

// Terminal state of a script, for finishNow / instant mode.
export function finalSegments(script) {
  const out = [];
  for (const op of script) {
    if (op.op === "t") out.push({ ...seg("text", { wrap: op.wrap }), text: op.text });
    else if (op.op === "typo") out.push({ ...seg("text"), text: op.right });
    else if (op.op === "swap") {
      out.push({ ...seg("strike", { struck: true }), text: op.vague });
      out.push({ ...seg("text", { wrap: op.wrap }), text: " " + op.precise });
    } else if (op.op === "cite") out.push({ ...seg("cite"), n: op.n });
  }
  return out;
}

export function scriptMarkIds(script) {
  return script
    .filter((op) => op.op === "mark" || op.op === "cite")
    .map((op) => (op.op === "cite" ? `cite-${op.n}` : op.id));
}

// Runs a script. Returns { start, finishNow, cancel }.
// `speed` is sampled at every keystroke, so the scheduler can change the
// pace of a run already in flight (reader scrolling ahead → hurry).
export function createRun(script, { onState, onMark, onDone, cps = 55, speed = () => 1 }) {
  let segments = [];
  let timer = null;
  let finished = false;

  const report = () => onState([...segments]);
  const later = (fn, ms) => {
    timer = setTimeout(fn, ms / speed());
  };

  function typeInto(target, text, i, cpsHere, then) {
    if (i >= text.length) return then();
    target.text += text[i];
    report();
    later(() => typeInto(target, text, i + 1, cpsHere, then), charDelay(text[i], cpsHere));
  }

  function deleteFrom(target, count, then) {
    if (count <= 0 || target.text.length === 0) {
      segments = segments.filter((s) => s !== target);
      report();
      return then();
    }
    target.text = target.text.slice(0, -1);
    report();
    later(() => deleteFrom(target, count - 1, then), 38);
  }

  function runOp(i) {
    if (finished) return;
    if (i >= script.length) return finish();
    const op = script[i];
    const next = () => runOp(i + 1);

    if (op.op === "t") {
      const s = seg("text", { wrap: op.wrap });
      segments.push(s);
      typeInto(s, op.text, 0, op.cps || cps, next);
    } else if (op.op === "typo") {
      const s = seg("typo");
      segments.push(s);
      typeInto(s, op.wrong, 0, cps, () =>
        later(() => {
          deleteFrom(s, op.wrong.length, () => {
            const fixed = seg("text");
            segments.push(fixed);
            typeInto(fixed, op.right, 0, cps * 1.25, next);
          });
        }, 380)
      );
    } else if (op.op === "swap") {
      const vague = seg("strike");
      segments.push(vague);
      typeInto(vague, op.vague, 0, cps, () =>
        later(() => {
          vague.struck = true;
          report();
          later(() => {
            const precise = seg("text", { wrap: op.wrap });
            segments.push(precise);
            typeInto(precise, " " + op.precise, 0, cps, next);
          }, 300);
        }, 420)
      );
    } else if (op.op === "cite") {
      segments.push({ ...seg("cite"), n: op.n, flash: true });
      onMark(`cite-${op.n}`);
      report();
      later(next, 260);
    } else if (op.op === "pause") {
      later(next, op.ms);
    } else if (op.op === "mark") {
      onMark(op.id);
      later(next, 30);
    } else {
      next();
    }
  }

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    onDone();
  }

  return {
    start: () => runOp(0),
    finishNow: () => {
      if (finished) return;
      clearTimeout(timer);
      segments = finalSegments(script);
      for (const id of scriptMarkIds(script)) onMark(id);
      report();
      finish();
    },
    cancel: () => {
      finished = true;
      clearTimeout(timer);
    },
  };
}
