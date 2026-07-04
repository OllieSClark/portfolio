import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

// Global scheduler for typed regions. Regions register with a document-order
// number; the scheduler plays exactly one at a time, top-down. A region that
// was scrolled past without playing (a later region became visible first)
// completes instantly — nobody waits for text above the viewport.
const TypesetContext = createContext(null);

export function TypesetProvider({ children }) {
  const regionsRef = useRef(new Map());
  const instantRef = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
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
    if (entries.some(([, r]) => r.status === "typing")) return;
    const readyAfter = (idx) =>
      entries.slice(idx + 1).some(([, r]) => r.status === "ready");
    for (let idx = 0; idx < entries.length; idx++) {
      const [, rec] = entries[idx];
      if (rec.status === "done") continue;
      if (rec.status === "ready") {
        rec.status = "typing";
        rec.play();
        return;
      }
      // idle: if something below is already visible, this was scrolled past
      if (readyAfter(idx)) {
        rec.status = "done";
        rec.finishNow();
        continue;
      }
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

  const value = useMemo(
    () => ({
      instant: instantRef,
      marks,
      allDone,
      fireMark,
      register,
      setReady,
      notifyDone,
      finishRegion,
      skipEverything,
    }),
    [marks, allDone, fireMark, register, setReady, notifyDone, finishRegion, skipEverything]
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
