import { useEffect } from "react";
import { useTypeset } from "../typeset/TypesetContext";

const SECTION_LABELS = {
  introduction: "§1",
  results: "§2",
  references: "§3",
  correspondence: "§4",
};

// Document-level behaviours that make the page act like a paper:
// - copying a passage appends a citation line
// - printing force-finishes the typesetting so you never print half a draft
export default function PaperBehaviours() {
  const { skipEverything } = useTypeset();

  useEffect(() => {
    const onCopy = (e) => {
      const selection = document.getSelection();
      const text = selection?.toString() ?? "";
      if (text.trim().length < 20) return;
      let node = selection.anchorNode;
      if (node && node.nodeType === Node.TEXT_NODE) node = node.parentElement;
      const section = node?.closest?.("section")?.id;
      const label = SECTION_LABELS[section];
      const source = `— Clark (2026), working paper${label ? `, ${label}` : ""}`;
      e.clipboardData.setData("text/plain", `${text}\n\n${source}`);
      e.preventDefault();
    };

    const onBeforePrint = () => skipEverything();

    document.addEventListener("copy", onCopy);
    window.addEventListener("beforeprint", onBeforePrint);
    return () => {
      document.removeEventListener("copy", onCopy);
      window.removeEventListener("beforeprint", onBeforePrint);
    };
  }, [skipEverything]);

  return null;
}
