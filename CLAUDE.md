# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal portfolio site (React + Vite + Tailwind CSS v4). Static content, no backend, no routing, no state management — one page composed of five section components rendered in order.

## Commands

```bash
npm install
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # oxlint
```

There is no test suite configured.

## Architecture

- `src/App.jsx` composes the whole page: `Nav`, `Hero`, `About`, `Projects`, `Contact`, in that order — this is the entire routing/layout model.
- `src/data/projects.js` is the single source of truth for portfolio content rendered by `Projects.jsx`; edit data here rather than in the component.
- Styling is Tailwind v4 via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js`. Theme tokens (colors, fonts) are defined in `src/index.css` under `@theme` as CSS custom properties (`--color-ink`, `--color-gold`, `--font-display`, etc.), not in a JS config.
- No animation library is used anywhere:
  - The hero's signature visual, `src/components/DiffusionField.jsx`, is a hand-rolled `<canvas>` animation simulating geometric Brownian motion (Euler–Maruyama) — a deliberate nod to the site owner's implied-vol-surface dissertation work. It respects `prefers-reduced-motion` by freezing the paths and skipping the `requestAnimationFrame` loop.
  - Scroll-triggered fade/rise-ins elsewhere use `src/hooks/useReveal.js` (IntersectionObserver hook that toggles an `is-visible` class) paired with the `.reveal` CSS class in `src/index.css`.
- `prefers-reduced-motion` is handled in two places that must stay in sync: the CSS global override in `index.css` and the explicit check inside `DiffusionField.jsx`.

## Personalisation touch points (per README)

- Copy: `src/components/Hero.jsx`, `About.jsx`
- Projects: `src/data/projects.js`
- CV: must be placed at `public/cv.pdf` exactly — Nav/Hero/Contact all link to `/cv.pdf`
- Socials/email: top of `src/components/Contact.jsx`
- Page title/meta: `index.html`
- Favicon: `public/favicon.svg`

## Deployment

Vercel is the intended target (Framework preset: Vite, build `npm run build`, output `dist`, auto-detected). GitHub Pages is possible but needs a `base` path change in `vite.config.js` plus a gh-pages workflow.
