# ELM Health Prototype

Interactive prototype for the NHS health onboarding journey within the ELM Life Management platform.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4
- React Router v6
- Lucide React icons

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## GitHub Pages

Live URL: [https://danielbayley80.github.io/elm-prototyping/](https://danielbayley80.github.io/elm-prototyping/)

**Important:** Pages must serve the **built** app, not the source tree. If you see a blank page or a 404 for `main.tsx`, GitHub is serving the dev `index.html` from the repo root.

1. Push to `main` — the deploy workflow builds `dist/` and pushes it to the `gh-pages` branch.
2. In the repo on GitHub: **Settings → Pages → Build and deployment**
3. Set **Source** to **Deploy from a branch**
4. Set **Branch** to `gh-pages` / **`/ (root)`** (not `main`)

```bash
npm run build:pages   # production build with /elm-prototyping/ base path
npm run preview:pages # preview that build locally at /elm-prototyping/
```

## Journey

1. **Dashboard** — Margaret demo home with "Connect my health records" CTA
2. **Select source** — NHS GP (England) + coming-soon mocks
3. **NHS Login** — Mock OAuth + GP credentials (linkage key route)
4. **Consent** — Safety information + data processing consent
5. **Sync options** — Calendar and notification preferences
6. **Healthcare hub** — Records, appointments, prescriptions

## Reset prototype state

Clear `localStorage` key `elm-health-prototype` in browser dev tools to reset connection state.
# elm-prototyping
