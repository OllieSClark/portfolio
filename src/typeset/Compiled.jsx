import { useEffect, useRef, useState } from "react";
import { useTypeset } from "./TypesetContext";

// A block region (figure, table) that doesn't type — it "compiles in" with a
// short settle when its turn in the document order arrives. Optionally fires
// marks (e.g. resolving a reviewer comment) when it lands.
export default function Compiled({ order, marks = [], children, className = "" }) {
  const { register, setReady, notifyDone, fireMark } = useTypeset();
  const [visible, setVisible] = useState(false);
  const elRef = useRef(null);

  useEffect(() => {
    const land = () => {
      setVisible(true);
      for (const id of marks) fireMark(id);
    };
    const unregister = register(order, {
      play: () => {
        land();
        setTimeout(() => notifyDone(order), 480);
      },
      finishNow: land,
    });
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(order);
          observer.unobserve(node);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [order, setReady]);

  return (
    <div ref={elRef} className={`ts-compile ${visible ? "is-set" : ""} ${className}`}>
      {children}
    </div>
  );
}
