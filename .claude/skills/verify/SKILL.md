---
name: verify
description: Build/launch/drive recipe for verifying changes to this portfolio site end-to-end in a real browser.
---

# Verifying this site

Surface: browser GUI (Vite + React single page with a typing "typeset engine").

## Launch

```bash
npm run dev            # background; serves on http://localhost:5173
```

## Drive (Playwright)

Playwright isn't a project dep — install it in the session scratchpad
(`npm init -y && npm i playwright`) and run a script from there against
localhost:5173. Chromium binaries are already present on this machine.

Flows worth driving:
- Load at 1440×900: nav §-links should be hidden (opacity 0) except brand/CV;
  hero title types; Fig. 1 (canvas vol surface) compiles in.
- Click "skip typesetting" → all typed regions finish, nav links all visible,
  reference entries all opacity 1.
- Jump-to-bottom probe (`End` key ~0.5s after load): all sections must
  backfill within ~3s (scheduler fast-forwards offscreen regions — regression
  guard for TypesetContext visibility tracking).
- Mobile 375px: no horizontal overflow; margin plates (`figure img` with
  /plates/ src) all hidden.
- Context with `reducedMotion: "reduce"`: full text present immediately,
  nav all visible, canvas static.

## Gotchas

- `html { scroll-behavior: smooth }` means programmatic jumps intersect every
  region transiently — this is why the scheduler tracks live visibility.
- Check `page.on("pageerror"/"console")` — the typeset engine fails quietly.
