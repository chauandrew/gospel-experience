# Progress

See `docs/PLAN.md` for phase details and recommended model per phase.

- [x] Phase 0: Repo + docs foundation (branch `init-plan`)
- [x] Phase 1: Scaffold (Vercel connection is manual, see below)
- [x] Phase 2: Reference study + style (STYLE.md, chosen assets)
- [x] Phase 3: Assets + gate + shell (scroll-snap, slides.js)
- [ ] Phase 4: Motion
- [ ] Phase 5: Audio
- [ ] Phase 6: Idle, reset, finale, counter
- [ ] Phase 7: PWA + offline
- [ ] Phase 8: Device QA + polish
- [ ] Phase 9: Kiosk deploy (manual)
- [ ] Phase 10 (optional): Particles

## Next agent start here
Phase 4: Motion (Opus 5.5 or Sonnet 5.5). Shell is done: gate, `src/slides.js` (all copy), `src/sections.js` (renders gate/beats/progress dashes, IntersectionObserver for the active dash), `src/style.css` (tokens from STYLE.md), CSS scroll-snap (`y mandatory`, `stop: always`). `fx`, `music`, `bg`, `reveal` fields in `slides.js` are rendered/declared but NOT yet animated. Add `src/fx.js` with GSAP ScrollTrigger (scroller is `#scroller`, pass it as `scroller:` to ScrollTrigger). Slide 4 background (`/img/sky.png`) is almost invisible under the 0.82 overlay and the image is bright white; tune or swap. Assets downloaded but unused yet: `public/audio/*`, `public/svg/frame-*.svg`, `public/lottie/clickcircle.json`, `public/img/{shooting-star,leaves}.png`. Human still owes: Vercel import + iPad preview check.

## Known issues / device test results
- Fonts: fontsource latin subsets only; no Devanagari etc. Keep it that way for precache size.
- Done button currently just returns to the gate (full reset/idle/audio fade is Phase 6).
- Verified in desktop Chrome at 1180x820 only; not yet on a real iPad.
