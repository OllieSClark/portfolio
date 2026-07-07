# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page portfolio styled as an academic **working paper** (React 19 + Vite + Tailwind CSS v4). No backend, no routing, no state library. The conceit: the paper's outline already exists and the prose is being *typeset* live — text types in with typos and reviewer strikethroughs, figures "compile in", citations pop, a reviewer scribbles margin notes in red. Everything serves that fiction; changes should too.

## Commands

```bash
npm install
npm run dev       # Vite dev server (5173, or next free port)
npm run build     # production build to dist/
npm run preview   # serve dist/ (4173) — timing-sensitive behaviour differs from dev; verify here
npm run lint      # oxlint (3 known react/only-export-components warnings are accepted)
```

No test suite. End-to-end verification is scripted Playwright against a running server — see `.claude/skills/verify/SKILL.md` for the launch/drive recipe and the regression probes (End-key backfill, reduced motion, mobile overflow).

## Architecture

`src/main.jsx` → `src/App.jsx` composes everything inside `TypesetProvider` + `AnnotationProvider`:
sections `Hero → About → Projects → Acknowledgements → References → Contact`, plus fixed furniture (`Nav`, `MarginRail`, `SkipTypesetting`, `PageNumber`, `CompileLog`, `CompileFooter`, `PaperBehaviours`).

### The typeset engine (`src/typeset/`) — the heart of the site

- **`engine.js`** — pure script runner, no React. A script is an array of ops built with exported constructors: `t(text, {cps})`, `typo(wrong, right)`, `swap(vague, precise)`, `cite(n)`, `pause(ms)`, `mark(id)`. `createRun` executes with human-ish per-char cadence; its `speed` callback is sampled at **every keystroke**, so pace changes apply mid-word. `finalSegments`/`scriptMarkIds` compute terminal state for instant completion.
- **`TypesetContext.jsx`** — global scheduler. Regions register with a document-order number; exactly one plays at a time, top-down. Scheduling rules (each encodes a hard-won behaviour — change with care):
  - A region is only ever *backfilled* (completed instantly) when its visibility is **known false** (`visible === false`). Unknown visibility means its IntersectionObserver hasn't reported yet; observers deliver in arbitrary order, and treating "unknown" as "scrolled past" instant-skipped the hero title on fast loads.
  - Reader pacing, not skipping: `speedRef` multiplies typing speed. `HURRY_SOFT` (3×) when the reader has scrolled and a later region is ready; `HURRY_HARD` (10×) when the typing region was scrolled clean out of view. First load is never hurried — `scrolledRef` only flips on real reader intent (wheel/touchmove immediately; plain `scroll` events only after a 400 ms guard so browser-driven initial scrolls don't count).
  - `marks` (a Set of fired ids) drives everything reactive: nav links appear (`sec-*`), reference entries fade in (`cite-*`), red margin notes fire/resolve. `useMarkFired(id)` is the consumer hook.
  - `prefers-reduced-motion` → `instantRef` → every region completes on registration; also honoured inside `VolSurfaceFigure` (static frame) and the CSS global override in `index.css`. Three places, kept in sync.
- **`Typed.jsx`** — a typed prose region (`order`, `script`, `as`, `className`). Click fast-forwards just that region. Reserves one `&nbsp;` line pre-play so layout doesn't collapse.
- **`Compiled.jsx`** — non-typing block (figure/table) that settles in when its turn arrives; settle delay follows `speedRef` too.

**All typed prose lives in `src/data/paper.jsx` as scripts** — edit copy there, not in components. Static furniture (titles, project meta) stays in components/`src/data/projects.js`. References: `src/data/references.js` (verified citations — keep fields conservative). Document-order numbers are spaced by 10s; slot new regions between existing ones.

### Startup invariants (`src/main.jsx`)

Loads always open on the title page: `scrollRestoration = "manual"`, any `#fragment` stripped via `replaceState` (a late anchor-scroll would jump past the title and skip its typing), then `scrollTo(0, 0)`. In-page anchor links still work; only reloads are affected.

### Layout system

- Content column is `max-w-4xl` (896 px), centred. Theme tokens live in `src/index.css` under `@theme` (no `tailwind.config.js`): Working Paper palette (`--color-paper/-ink/-red/-line/...`), fonts, and:
  - **Custom breakpoints `plates` (85 rem/1360 px) and `plates-lg` (100 rem/1600 px)** — the widths at which the true margin outside the column fits the margin furniture *with headroom*. Tailwind's `xl`/`2xl` sat exactly flush and clipped. Users of these: `PlateCluster` (photo gallery hangs in the left margin above `plates`, compact inline strip below), `RedMarginNote` (both sides), `MarginRail`+`Claim` (evidence rail needs 312 px so it shows at `plates-lg`+; below that `Claim`'s inline tap-fallback takes over — the two breakpoints must stay matched or claims answer with nothing).
  - **Fluid headline sizes** `--text-fluid-lg/md/sm` (clamp()-based), replacing discrete `sm:` jumps.
- Plate photos carry real `width`/`height` attributes (intrinsic px of the JPGs in `src/assets/plates/`) so lazy-loading causes no layout shift.
- Claim evidence JSX must use `<span className="block">`, never `<p>` — it renders inline inside typed paragraphs.

### Paper behaviours worth knowing before "fixing" them

- Copying ≥20 chars appends a citation line (`PaperBehaviours`); printing force-finishes typesetting and restyles as an A4 paper (`@media print` in `index.css`).
- `CompileLog` is a fake pdfTeX log flash on load; `CompileFooter`'s draft version flips v0.3→v0.4 when typesetting completes; `ClaudeMark` is the waddling crab.
- Fonts are all self-hosted: STIX Two Text + IBM Plex Mono via Fontsource, CMU Serif via `src/assets/fonts/`. No third-party requests at runtime — keep it that way.

## Content touch points

- Typed copy: `src/data/paper.jsx` · Projects: `src/data/projects.js` · References: `src/data/references.js`
- Socials/email: top of `src/components/Contact.jsx` · Title/meta: `index.html`
- CV at `public/cv.pdf` exactly (Nav/Contact link `/cv.pdf`); project report at `public/brglm2-report.pdf`

## Deployment

Vercel, Vite preset (build `npm run build`, output `dist`, auto-detected). GitHub Pages would need a `base` path in `vite.config.js`.
