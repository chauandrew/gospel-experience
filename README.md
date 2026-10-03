# The Gospel Experience (teaser)

Offline iPad kiosk web app: dark, scroll-driven preview with ambient music. Vanilla JS + Vite, GSAP, PWA.

```
npm install
npm run dev        # http://localhost:5173
npm run dev -- --host   # same, reachable from an iPad on the same Wi-Fi
npm run build && npm run preview   # production build with service worker (http://localhost:4173)
```

- Edit all wording and per-beat settings in `src/slides.js`.
- Docs for contributors and agents: `docs/` (start with `docs/PROGRESS.md`).
- Event setup (install, Guided Access, offline check): `docs/KIOSK.md`.
- Deploys: Vercel from GitHub. PR branches get preview URLs; merging to `main` ships.
