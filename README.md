# Portfolio Starter

A React + Vite + Tailwind CSS v4 single-page portfolio, built around a live
canvas simulation of a stochastic diffusion process as the hero's signature
visual (ties directly into the implied-vol-surface dissertation work).

## Run it locally

```bash
npm install
npm run dev
```

Open the printed localhost URL.

## Before you deploy — things to personalise

1. **Your name / copy** — `src/components/Hero.jsx`, `About.jsx`
2. **Projects** — `src/data/projects.js` (edit descriptions, add links if you want them clickable)
3. **CV** — drop your actual PDF at `public/cv.pdf` (must be exactly that filename — the nav and hero/contact buttons all link to `/cv.pdf`)
4. **GitHub / LinkedIn / email** — top of `src/components/Contact.jsx`
5. **Page title & meta description** — `index.html`
6. **Favicon** — `public/favicon.svg` (currently a simple path glyph, feel free to swap)

## Deploying (free) — Vercel

1. Push this folder to a new GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output dir `dist` (defaults are correct).
4. Deploy. You get a `your-project.vercel.app` URL, with an option to attach a custom domain later.

Alternative: GitHub Pages works too, but needs a `base` path tweak in
`vite.config.js` plus a gh-pages deploy workflow — Vercel is the path of
least resistance for a Vite app and is free for this use case.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite` — no separate config file needed,
  theme tokens live in `src/index.css` under `@theme`)
- No animation library — the hero uses a hand-rolled canvas simulation
  (`src/components/DiffusionField.jsx`); everything else uses CSS
  transitions and IntersectionObserver-based scroll reveals
  (`src/hooks/useReveal.js`)
