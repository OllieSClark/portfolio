import { createContext, useContext, useState } from "react";

const AnnotationContext = createContext(null);

export function AnnotationProvider({ children }) {
  const [active, setActive] = useState(null);
  return (
    <AnnotationContext.Provider value={{ active, setActive }}>
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotation() {
  return useContext(AnnotationContext);
}
