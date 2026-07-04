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

function renderSegment(s) {
  if (s.kind === "cite") return <Citation key={s.id} n={s.n} flash={s.flash} />;
  const cls =
    s.kind === "typo"
      ? "ts-typo"
      : s.kind === "strike"
        ? `ts-strike ${s.struck ? "is-struck" : ""}`
        : undefined;
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
  const { register, setReady, setVisibility, notifyDone, finishRegion, fireMark } =
    useTypeset();
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
