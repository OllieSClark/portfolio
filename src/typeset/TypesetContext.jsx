import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

// Global scheduler for typed regions. Regions register with a document-order
// number; the scheduler plays exactly one at a time, top-down. A region the
// reader has demonstrably scrolled past (visibility reported false) completes
// instantly — nobody waits for text above the viewport. A region the reader
// is *outpacing* doesn't skip: it types faster, so the pacing follows the
// reader instead of the reader following the pacing.
const TypesetContext = createContext(null);

// Pace multipliers. Soft: the reader has scrolled and a later region is
// waiting its turn. Hard: the currently-typing region was scrolled clean out
// of the viewport mid-play.
const HURRY_SOFT = 3;
const HURRY_HARD = 10;

export function TypesetProvider({ children }) {
  const regionsRef = useRef(new Map());
  const instantRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  // engine runs read this each keystroke, so pace changes apply mid-word
  const speedRef = useRef(1);
  // no hurrying on first load — pace only ever rises after real reader intent
  const scrolledRef = useRef(false);
  const [, bump] = useReducer((x) => x + 1, 0);
  const [marks, setMarks] = useState(() => new Set());
  const [allDone, setAllDone] = useState(false);

  const fireMark = useCallback((id) => {
    setMarks((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const checkAllDone = useCallback(() => {
    const recs = [...regionsRef.current.values()];
    if (recs.length > 0 && recs.every((r) => r.status === "done")) {
      setAllDone(true);
    }
  }, []);

  const schedule = useCallback(() => {
    const entries = [...regionsRef.current.entries()].sort((a, b) => a[0] - b[0]);
    const readyAfter = (idx) =>
      entries.slice(idx + 1).some(([, r]) => r.status === "ready");

    // something is typing: set its pace and let it run. Scrolled clean out
    // of view with a region waiting below → hard hurry (it keeps typing,
    // fast, instead of snapping complete). Reader has scrolled and someone
    // is waiting → soft hurry. Otherwise natural pace.
    const typingIdx = entries.findIndex(([, r]) => r.status === "typing");
    if (typingIdx !== -1) {
      const [, tr] = entries[typingIdx];
      if (tr.visible === false && readyAfter(typingIdx)) {
        speedRef.current = HURRY_HARD;
      } else if (scrolledRef.current && readyAfter(typingIdx)) {
        speedRef.current = HURRY_SOFT;
      } else {
        speedRef.current = 1;
      }
      return;
    }

    for (let idx = 0; idx < entries.length; idx++) {
      const [, rec] = entries[idx];
      if (rec.status === "done") continue;
      if (rec.status === "ready") {
        // ready but demonstrably off screen (a fast scroll made every
        // region intersect transiently): complete instantly instead of
        // typing the whole backlog in real time
        if (rec.visible === false && readyAfter(idx)) {
          rec.status = "done";
          rec.finishNow();
          continue;
        }
        rec.status = "typing";
        speedRef.current =
          scrolledRef.current && readyAfter(idx) ? HURRY_SOFT : 1;
        rec.play();
        return;
      }
      // idle: backfill only when this region is *known* to be off screen
      // (visible === false). Unknown visibility means its observer simply
      // hasn't reported yet — observers deliver in arbitrary order, and
      // treating "unknown" as "scrolled past" instant-finished the hero
      // title on fast loads whenever a lower region's observer won the race.
      if (rec.visible === false && readyAfter(idx)) {
        rec.status = "done";
        rec.finishNow();
        continue;
      }
      // unknown visibility: its initial observation lands within a frame —
      // hold the queue so document order is preserved
      return;
    }
    checkAllDone();
  }, [checkAllDone]);

  const register = useCallback(
    (order, api) => {
      regionsRef.current.set(order, { ...api, status: "idle" });
      if (instantRef.current) {
        const rec = regionsRef.current.get(order);
        rec.status = "done";
        // defer so the component finishes mounting first
        queueMicrotask(() => {
          rec.finishNow();
          checkAllDone();
        });
      }
      bump();
      return () => regionsRef.current.delete(order);
    },
    [checkAllDone]
  );

  const setReady = useCallback(
    (order) => {
      const rec = regionsRef.current.get(order);
      if (rec && rec.status === "idle") {
        rec.status = "ready";
        schedule();
      }
    },
    [schedule]
  );

  // live viewport tracking so the scheduler can tell "ready and on screen"
  // from "made ready by a transient intersection during a fast scroll"
  const setVisibility = useCallback(
    (order, visible) => {
      const rec = regionsRef.current.get(order);
      if (!rec || rec.visible === visible) return;
      rec.visible = visible;
      schedule();
    },
    [schedule]
  );

  const notifyDone = useCallback(
    (order) => {
      const rec = regionsRef.current.get(order);
      if (rec) rec.status = "done";
      schedule();
      checkAllDone();
    },
    [schedule, checkAllDone]
  );

  const finishRegion = useCallback(
    (order) => {
      const rec = regionsRef.current.get(order);
      if (rec && rec.status !== "done") {
        rec.status = "done";
        rec.finishNow();
        schedule();
        checkAllDone();
      }
    },
    [schedule, checkAllDone]
  );

  const skipEverything = useCallback(() => {
    instantRef.current = true;
    for (const rec of regionsRef.current.values()) {
      if (rec.status !== "done") {
        rec.status = "done";
        rec.finishNow();
      }
    }
    setAllDone(true);
  }, []);

  // Reader intent: the first wheel / touch / scroll unlocks hurrying. The
  // plain scroll listener attaches after a beat so a browser-driven initial
  // scroll (fragment jump, restoration) can't count as intent on its own.
  useEffect(() => {
    if (scrolledRef.current) return undefined;
    const markScrolled = () => {
      if (scrolledRef.current) return;
      scrolledRef.current = true;
      schedule();
    };
    window.addEventListener("wheel", markScrolled, { passive: true });
    window.addEventListener("touchmove", markScrolled, { passive: true });
    const t = setTimeout(
      () => window.addEventListener("scroll", markScrolled, { passive: true }),
      400
    );
    return () => {
      clearTimeout(t);
      window.removeEventListener("wheel", markScrolled);
      window.removeEventListener("touchmove", markScrolled);
      window.removeEventListener("scroll", markScrolled);
    };
  }, [schedule]);

  const value = useMemo(
    () => ({
      instant: instantRef,
      speedRef,
      marks,
      allDone,
      fireMark,
      register,
      setReady,
      setVisibility,
      notifyDone,
      finishRegion,
      skipEverything,
    }),
    [
      marks,
      allDone,
      fireMark,
      register,
      setReady,
      setVisibility,
      notifyDone,
      finishRegion,
      skipEverything,
    ]
  );

  return <TypesetContext.Provider value={value}>{children}</TypesetContext.Provider>;
}

export function useTypeset() {
  return useContext(TypesetContext);
}

export function useMarkFired(id) {
  const { marks } = useTypeset();
  return marks.has(id);
}
