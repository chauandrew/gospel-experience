# The Gospel Experience (teaser)

Offline iPad kiosk web app: a dark, self-advancing (no scrolling) 25-second preview with music. Tap Begin, it plays through five beats, then Reset. Vanilla JS + Vite, GSAP, PWA.

```
npm install
npm run dev        # http://localhost:5173
npm run dev -- --host   # same, reachable from an iPad on the same Wi-Fi
npm run build && npm run preview   # production build with service worker (http://localhost:4173)
```

- Each trailer is one file in `src/trailers/` (all its wording and per-beat settings) plus one page, `<name>/index.html`. The home page (`index.html`) lists them. To add a trailer: copy `king/index.html` and `src/trailers/king.js`, change the module name, add the page to `vite.config.js` `rollupOptions.input`, and add a button to `index.html`.
- Docs for contributors and agents: `docs/` (start with `docs/PROGRESS.md`).
- Event setup (install, Guided Access, offline check): `docs/KIOSK.md`.
- Deploys: Vercel from GitHub. PR branches get preview URLs; merging to `main` ships.
