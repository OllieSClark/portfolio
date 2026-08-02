import { useEffect, useRef, useState } from "react";
import { createRun, finalSegments, scriptMarkIds } from "./engine";
import { useTypeset } from "./TypesetContext";

function Citation({ n, flash }) {
  return (
    <sup className={`ts-cite ${flash ? "ts-cite-flash" : ""}`}>
      <a href={`#ref-${n}`} aria-label={`Reference ${n}`}>
        [{n}]
      </a>
    </sup>
  );
}

// A struck segment's text sometimes carries a leading/trailing space (kept
// there so the surrounding prose reads naturally when concatenated) — but
// drawing the strikethrough across that space renders as a stray floating
// tick beside the word. Keep the line-through to the visible word only.
function renderStrike(s) {
  const text = s.text;
  const lead = text.match(/^\s*/)[0];
  const trail = lead.length < text.length ? text.slice(lead.length).match(/\s*$/)[0] : "";
  const core = text.slice(lead.length, text.length - trail.length);
  return (
    <span key={s.id}>
      {lead}
      <span className={`ts-strike ${s.struck ? "is-struck" : ""}`}>{core}</span>
      {trail}
    </span>
  );
}

function renderSegment(s) {
  if (s.kind === "cite") return <Citation key={s.id} n={s.n} flash={s.flash} />;
  if (s.kind === "strike") return renderStrike(s);
  const cls = s.kind === "typo" ? "ts-typo" : undefined;
  const inner = (
    <span key={s.id} className={cls}>
      {s.text}
    </span>
  );
  return s.wrap ? <span key={s.id}>{s.wrap(inner)}</span> : inner;
}

// A typed prose region. `order` is its global document-order slot; the
// TypesetContext scheduler decides when it plays. Click fast-forwards it.
export default function Typed({ order, script, as: Tag = "p", className = "" }) {
  const {
    register,
    setReady,
    setVisibility,
    notifyDone,
    finishRegion,
    fireMark,
    speedRef,
  } = useTypeset();
  const [segments, setSegments] = useState([]);
  const [status, setStatus] = useState("idle");
  const elRef = useRef(null);
  const runRef = useRef(null);
  const statusRef = useRef("idle");
  statusRef.current = status;

  useEffect(() => {
    const unregister = register(order, {
      play: () => {
        setStatus("typing");
        runRef.current = createRun(script, {
          onState: setSegments,
          onMark: fireMark,
          speed: () => speedRef.current,
          onDone: () => {
            setStatus("done");
            notifyDone(order);
          },
        });
        runRef.current.start();
      },
      finishNow: () => {
        runRef.current?.cancel();
        setSegments(finalSegments(script));
        for (const id of scriptMarkIds(script)) fireMark(id);
        setStatus("done");
      },
    });
    return () => {
      runRef.current?.cancel();
      unregister();
    };
    // register once; script identity is stable per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibility(order, entry.isIntersecting);
        if (entry.isIntersecting) setReady(order);
      },
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [order, setReady, setVisibility]);

  const handleClick = () => {
    if (statusRef.current === "typing") finishRegion(order);
  };

  return (
    <Tag ref={elRef} className={className} onClick={handleClick}>
      {segments.map(renderSegment)}
      {status === "typing" && <span className="ts-caret" aria-hidden="true" />}
      {status !== "done" && segments.length === 0 && (
        // reserve a line of height so sections don't collapse pre-typing
        <span aria-hidden="true">&nbsp;</span>
      )}
    </Tag>
  );
}
