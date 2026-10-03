# Progress

See `docs/PLAN.md` for phase details and recommended model per phase.

- [x] Phase 0: Repo + docs foundation (branch `init-plan`)
- [x] Phase 1: Scaffold (Vercel connection is manual, see below)
- [x] Phase 2: Reference study + style (STYLE.md, chosen assets)
- [x] Phase 3: Assets + gate + shell (scroll-snap, slides.js)
- [x] Phase 4: Motion
- [ ] Phase 5: Audio
- [ ] Phase 6: Idle, reset, finale, counter
- [ ] Phase 7: PWA + offline
- [ ] Phase 8: Device QA + polish
- [ ] Phase 9: Kiosk deploy (manual)
- [ ] Phase 10 (optional): Particles

## Next agent start here
Phase 5: Audio (Sonnet 5.5). `slides.js` already has `music: 'ambient' | 'tense' | 'swell'` per beat (finale has none: keep playing `swell`). Map: ambient = `Silent_Place.mp3`, tense = `BGM_Downward_Spiral.mp3`, swell = `BGM_Ending.mp3` (all in `public/audio/`). Create `src/audio.js` (single `AudioContext` created in the Begin click handler in `main.js` `begin()`, per-track GainNode, 2s crossfades, master gain about 0.3, fade-out in `reset()`). Hook cues from `src/fx.js`: each beat has a ScrollTrigger with `onEnter`/`onEnterBack`; call `audio.cue(slides[i].music)` there (pass a callback into `initFx`). Motion is done: `src/fx.js` builds one paused GSAP timeline per beat (word-stagger headline, eyebrow, reveal words, cta, button, glow, bg zoom, picture frames), plays on beat enter, resets once fully off screen. Dev only: `window.__fx.seek(i, t)` and `window.__fx.durations()` for QA.

## Known issues / device test results
- Fonts: fontsource latin subsets only; no Devanagari etc. Keep it that way for precache size.
- Done button currently just returns to the gate (full reset/idle/audio fade is Phase 6).
- Verified in desktop Chrome at 1180x820 only; not yet on a real iPad.
- The Chrome automation tab is `visibilityState: hidden`, so requestAnimationFrame is paused and animations cannot be watched live. QA was done by seeking timelines (`window.__fx.seek`) and screenshotting after a flush. Real-time smoothness and timing still need a real iPad check (Phase 8).
- `lottie-web` is installed but unused. ClickCircle Lottie is a full-screen 1440x1024 comp with off-center targets, unsuitable as a scroll hint; hint is CSS (pill label + line). Decide in Phase 8 whether to drop the dependency.
- Slide 4 backdrop (`sky.png`) is a bright white image dimmed with CSS filter; check legibility on iPad.
- Beat durations (s): 2.4, 5.7, 2.8, 14 (slow bg zoom), 3.9. Tune pacing on device.
