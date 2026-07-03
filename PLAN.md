# Working Paper v2 — "The Paper Writes Itself"

## Context

The `redesign/working-paper` branch has a solid first implementation: preprint layout (title block, abstract, §1–§3), CMU Serif/STIX/Plex Mono typography, FT-salmon ground, reviewer's-pen `Claim` → `MarginRail` evidence interaction, live Fig. 1 (vol surface) and Fig. 2 (brglm2 benchmark). The user has picked this direction to run with and wants the defining upgrade: **the page should feel like the paper is being written in front of you** — full theatrical typing, with typos that get corrected, citations that get inserted live, and richer paper furniture (References, Table 1, Tufte sidenotes, a LaTeX-y compile footer).

User decisions (locked):
- **Full theatrical typing**: every section types itself as it scrolls into view, typos/corrections/citations mid-stream.
- **Real References section**: numbered citations to real papers/repos, superscript `[n]` links in the text.
- **Plays every visit** (no localStorage gate) — so the show must be *fast* and *skippable*.
- **Extras**: Table 1 (benchmark results table), margin sidenotes, compile footer with ticking version number.

This plan is committed to the branch as `PLAN.md` (step 1) so work can resume from any fresh session.

---

## UX spec

### The typing experience
- Sections type **top-down, one at a time**, triggered by IntersectionObserver as each enters the viewport (replaces the current `useReveal` fade on typed sections).
- Base speed ~50–70 chars/sec with human variance: micro-pauses after punctuation, slightly slower on long words, occasional burst. A full section finishes in **≤ 4 seconds** — theatrical but never boring.
- **Blocks don't type.** Figures, tables, and the benchmark chart "compile in" (brief opacity/translate settle, like a figure being placed by LaTeX). Only prose types.
- **Cursor**: a thin red caret (reviewer's pen ink) sits at the type point; blinks when paused, solid while typing.

### Scripted imperfections (the signature)
Each section's script can include:
- **Typo + fix**: types a misspelling (`studnet`), brief pause, backspaces, retypes correctly. 2–3 per page total — more reads as gimmick.
- **Reviewer swap** (tracked change): a vague word gets typed, then wavy-underlined in red, struck through, and replaced with the precise one — e.g. `significantly faster` → ~~significantly faster~~ `up to 168.6× faster`. This is the epistemic joke of the whole site: vagueness gets corrected into evidence. 1–2 uses, on the highest-value claims.
- **Citation insertion**: a sentence finishes, beat, then a superscript `[2]` pops in at the end with a small red flash, simultaneously the matching entry appears in References. Clicking `[n]` scrolls to the reference.
- **Margin note**: a red handwritten-register note appears in the margin during typing (e.g. `add benchmark — done ✓` next to Fig. 2). Distinct from evidence annotations (those stay hover-triggered) and from sidenotes (those are static, ink-coloured).

### Escape hatches (non-negotiable, since it plays every visit)
- **Skip control**: fixed, always visible while any animation is pending — footer-style button `⏭ skip typesetting` (mono, small, bottom-right). Clicking completes ALL sections to final state instantly.
- **Click-to-finish a section**: clicking anywhere inside a currently-typing section fast-forwards that section.
- **`prefers-reduced-motion`**: entire page renders final state, no cursor, no animation. The existing CSS media query stays; the typeset engine checks it once at mount.
- Nav links / command-free deep links: jumping to `#results` via nav instantly completes every section above and including the target.

### New paper furniture
- **Table 1** in §2.1: real benchmark summary table — columns like Scenario / Fisher scoring (baseline) / Trust region / Speedup, rows Dense / Sparse, plus the 394/394 + <10⁻⁶ agreement row. Mono font, hairline rules, numbered caption (`Table 1.`) matching fig-caption styling. Only the two real published numbers (31.65×, 168.6×) plus test/agreement facts — nothing invented.
- **References section** (new, between §2 and Correspondence — becomes `§3 References`, Correspondence becomes `§4`): numbered entries, mono-ish hanging-indent format. Real citations:
  1. Kosmidis — `brglm2`: bias reduction in GLMs (R package + the Kosmidis & Firth bias-reduction work)
  2. Steihaug (1983) — CG method and trust regions (the subproblem solver used)
  3. Jin & Agarwal (2025) — SNR-weighted arbitrage-penalised DDPM for IV surfaces (dissertation base paper)
  4. Corenflos et al. (2025) — exact conditional simulation via SDE bridging (dissertation extension)
  5. Vuletić & Cont — VolGAN (GAN baseline the dissertation benchmarks against)
  6. The user's fork: github.com/OllieSClark/brglm2 `feat/trust-region`
  **Verify exact author/year/venue strings with WebSearch during implementation** — cite conservatively (authors, year, title, venue; no page numbers if unverified).
- **Sidenotes**: static Tufte-style numbered margin notes in ink (NOT red — red stays "look here" only). 2–3 total, e.g. next to §1: why trust-region beat gradient methods (the examiner-praised mid-project pivot, from the content draft); next to the dissertation entry: "starts July 2026" clarifier. Desktop: true margin (the layout is max-w-4xl, margin rail exists at xl); mobile: collapse to tap-to-expand inline.
- **Compile footer**: `Compiled {today} · pdfTeX-live · draft v0.4` in the footer; during the page's typing lifecycle the version ticks v0.3 → v0.4 when the last section completes. Date is real (`new Date()`), no fake toolchain claims beyond the joke register.

### Signed-off extras (user approved 2026-07-04)

**Paper authenticity**
- **Print stylesheet** — `@media print` typesets the whole site as an A4 working paper: hide nav/skip/caret/interactive chrome, force final (fully-typed) content, ink-on-white, figures as static snapshots with captions, References included. Test via Playwright `page.pdf()`.
- **Cite-this-page BibTeX** — small `[cite]` control near the title block; copies `@misc{clark2026portfolio, author={Clark, Ollie}, title={...}, year={2026}, howpublished={\url{...}}}` to clipboard with a brief "copied ✓" confirmation.
- **Eq. (1)** — the GBM SDE `dS_t = μS_t dt + σS_t dW_t` typeset in styled HTML/CSS (italic serif variables, no KaTeX dependency), numbered `(1)`, placed under Fig. 1; Fig. 1 caption references it ("sample paths of (1)").
- **Manuscript-status tags** — replace project `tag` strings with publication-lifecycle statuses: brglm2 = *published*, BNY = *in progress*, WorldQuant = *presented*, dissertation = *in preparation*. Update `projects.js` tags accordingly.

**Interaction**
- **Page-number indicator** — fixed corner element "p. n / N" tracking scroll position by section (title=1, §1=2, §2=3, §3=4, §4=5, + print/refs as applicable), mono, ink-dim. Hidden on mobile if cramped.
- **Copy-selection-as-quote** — `copy` event listener appends `\n\n— Clark (2026), working paper, §n` (section derived from selection anchor) to copied text. Pure clipboard augmentation, no popover UI needed for v1.

**Theatre**
- **Reviewer 2, resolved** — during §2.1 typing, a red margin comment appears: *"needs evidence — R2"*; when Fig. 2 + Table 1 compile in, the comment gets struck through with a small ✓. Implemented as a `mark()` op pair in the §2.1 script.
- **Acknowledgements** — short real line before References (supervisor Prof. Paul Jenkins / Warwick Statistics for the dissertation; keep to verifiable facts).
- **Revision history appendix** — small appendix after References: `v0.1 — scaffold · v0.2 — preprint layout · v0.3 — figures · v0.4 — typeset engine` (honest, maps to real git history; grows over time).
- **Compile-log flash** — ~0.6s of mono pdflatex-style log lines in the corner before the hero starts typing (skipped entirely under reduced-motion or skip-all). Lowest priority; build last.

---

## Architecture

### New: `src/typeset/` module
- **`TypesetContext.jsx`** — provider holding global state: `reducedMotion` (checked once), `skipAll` flag + `skipEverything()`, per-section registry so sections complete in order and nav-jumps can force-complete predecessors. Exposes `useTypesetControls()`.
- **`engine.js`** — pure script-runner: takes a script (array of ops) + emits progressive render state via callback, driven by `setTimeout` chains (not rAF — char cadence is timer-natural). Ops:
  - `t(text, {speed})` — type characters
  - `typo(wrong, right)` — type wrong, pause, backspace, type right
  - `swap(vague, precise)` — type vague, wavy-underline+strike it, type precise after it
  - `cite(n)` — pop in superscript citation node
  - `pause(ms)`
  - `mark(id)` — fire a side-effect (margin note appears, references entry reveals, version ticks)
  - `done`
  Engine supports `finishNow()` → jumps to terminal state.
- **`Typed.jsx`** — component: `<Typed script={...} onDone={...}/>`. Renders completed segments as real JSX (so `Claim`, links, italics all still work — segments carry a `render` wrapper, e.g. `{ wrap: (txt) => <Claim …>{txt}</Claim>, text: "168.6× faster" }`), plus the in-flight partial text and caret. Typo/strike segments render with dedicated CSS classes then remove/persist per script.
- **`useTypesetSection.js`** — hook per section: registers with context, IntersectionObserver (reuse the pattern from `src/hooks/useReveal.js`), returns `{ ref, play, finished }`; handles click-to-fast-forward on the section container.

Layout-shift note: prose typing grows sections downward (below the viewport) — acceptable and invisible. Figures/tables reserve their height (`min-h` on containers) so their compile-in doesn't jump the page.

### Content as scripts
- **`src/data/paper.jsx`** (new) — single source for all typed copy, structured as per-section scripts referencing the ops above. Prose currently hardcoded in `Hero/About/Projects/Contact` moves here; `projects.js` stays the data source for project rows (scripts are generated from it: title fast-typed, description typed at speed, meta chips pasted).
- **`src/data/references.js`** (new) — the citation list; consumed by both `References.jsx` and the `cite(n)` op.

### Components modified/created
- Modified: `Hero.jsx`, `About.jsx`, `Projects.jsx`, `Contact.jsx` (wrap prose in `<Typed>`), `Nav.jsx` (add §3 References, renumber Correspondence → §4; nav click force-completes), `App.jsx` (wrap in `TypesetProvider`, mount skip button + compile footer), `index.css` (caret, typo strike, swap wavy-strike, citation flash, sidenote + table styles).
- Created: `src/typeset/*` (above), `src/components/References.jsx`, `src/components/ResultsTable.jsx` (Table 1), `src/components/Sidenote.jsx`, `src/components/SkipTypesetting.jsx`, `src/components/CompileFooter.jsx`.
- Unchanged: `VolSurfaceFigure.jsx`, `BenchmarkFigure.jsx`, `Claim.jsx`, `MarginRail.jsx`, `AnnotationContext.jsx` — the claims-with-receipts layer keeps working inside typed content.

### Where each imperfection lives (initial script)
- Hero abstract: `studnet → student` typo; `swap("faster", "up to 168.6× faster")` wrapped in the existing Claim; `cite(1)` (brglm2) at abstract end.
- §1 Introduction: clean typing (no gags — establishes rhythm), sidenote 1 pops (trust-region pivot story).
- §2.1 brglm2: `cite(2)` (Steihaug) after "CG-Steihaug subproblem solver"; margin note `add benchmark — done ✓` fires as Fig. 2 + Table 1 compile in.
- §2.4 dissertation: `cite(3,4,5)` cluster as the description types; sidenote "starts July 2026".
- §3 References: entries appear as their `cite()` fires earlier; any not-yet-cited entries type in when the section itself is reached.
- Footer: version ticks v0.3 → v0.4 on last-section completion.

---

## Implementation steps

1. **Commit this plan** to `redesign/working-paper` as `PLAN.md` (user wants a restart point in-branch).
2. Verify citation strings (WebSearch: Kosmidis brglm2 paper, Steihaug 1983, VolGAN Vuletić/Cont, Jin & Agarwal 2025, Corenflos et al. 2025) → write `src/data/references.js`.
3. Build `src/typeset/` engine + context + `Typed` + hook, with CSS (caret, typo, swap, flash). Unit-test the engine informally via a scratch page before wiring sections.
4. Build `References.jsx`, `ResultsTable.jsx`, `Sidenote.jsx`, `CompileFooter.jsx`, `SkipTypesetting.jsx`; renumber sections in `Nav.jsx`/`Contact.jsx`.
5. Move prose into `src/data/paper.jsx` scripts; wire `Hero/About/Projects/Contact` through `<Typed>`; add imperfections per the map above.
6. Wire escape hatches: skip-all button, click-to-finish, nav force-complete, reduced-motion instant render.
7. Signed-off extras, in value order: manuscript-status tags + Eq. (1) + acknowledgements + revision history (cheap statics) → BibTeX cite + page-number indicator + copy-as-quote (small interactions) → Reviewer 2 resolved (script op) → print stylesheet (biggest) → compile-log flash (last, optional if timing feels crowded).
8. Polish pass: timing feel (speeds, pauses), make sure MarginRail/Claim hovers still work on typed content, mobile sidenote collapse.
9. Commit in logical chunks (engine / furniture / scripts / extras / polish).

## Verification

- `npm run lint` + `npm run build` clean.
- Drive with Playwright against the dev server (pattern already used this session — install `playwright` as a temp devDep, screenshot, then remove):
  - Print stylesheet: `page.pdf()` / `emulateMedia({media:'print'})` screenshot — nav/skip hidden, content final, ink-on-white.
  - BibTeX button click → read clipboard (or intercept) → valid BibTeX.
  - Copy-selection: select text, fire copy, assert appended citation line.
  - Load page → screenshot mid-typing (caret visible, partial text) → wait → screenshot completed hero.
  - Click `⏭ skip typesetting` early → assert all sections final, references populated, version reads v0.4.
  - Emulate `prefers-reduced-motion` (`page.emulateMedia`) → assert zero animation, full content immediately.
  - Click a citation `[n]` → assert scroll to references entry.
  - Hover the 168.6× Claim → margin evidence still appears.
  - `console --errors` equivalent: assert no page errors.
- Manual check by user on `npm run dev` (dev server already running; remind about `npm install` after branch switch).

## Risks / mitigations
- **Skimmers**: full-theatrical is deliberately chosen; mitigated by ≤4s/section, click-to-finish, persistent skip, instant nav jumps.
- **Gimmick fatigue**: imperfections are rationed (2–3 typos, 1–2 swaps site-wide) and every gag lands on a real claim with real evidence.
- **Citation accuracy**: verify via WebSearch before writing; conservative fields only.
- **Long session/context**: `PLAN.md` in-branch is the restart point; each step commits separately.
