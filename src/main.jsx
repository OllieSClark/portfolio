import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// The paper opens on its title page, every time — don't let the browser
// restore a mid-scroll position from before a refresh, and drop any #fragment
// so a late anchor-scroll can't jump past the title once React has rendered
// the anchors. (In-page citation/nav links still work; only reloads change.)
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}
window.scrollTo(0, 0);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
