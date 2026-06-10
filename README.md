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
