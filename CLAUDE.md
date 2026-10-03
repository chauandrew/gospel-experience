# Gospel Experience Teaser

Offline iPad kiosk web app (vanilla JS + Vite, GSAP, lottie-web, vite-plugin-pwa). Scroll-driven dark cinematic story, ambient music, idle auto-reset. Runs on 2 iPads (Safari, Guided Access) at a noisy retreat booth.

## Start here
1. Read `docs/PROGRESS.md` (current phase and "next agent start here" notes).
2. Read `docs/PLAN.md` (phases, architecture, model per phase), `docs/DECISIONS.md`, `docs/STYLE.md`, `docs/ASSETS.md` as needed.

## Rules
- Branch + PR for every phase. Never commit or push to main. Human merges.
- At the end of a phase: update `docs/PROGRESS.md`, append any new decision to `docs/DECISIONS.md` (never rewrite history), record any borrowed asset in `docs/ASSETS.md`.
- All wording and per-slide behavior live in `src/slides.js`. Do not hardcode copy elsewhere.
- Must work 100% offline. Download assets into `public/`, never hotlink.
- Keep it simple: no frameworks beyond the listed stack, no unrequested features.
- Never use em-dashes. Be terse.
