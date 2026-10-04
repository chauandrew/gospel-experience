# Progress

See `docs/PLAN.md` for phase details and recommended model per phase.

- [x] Phase 0: Repo + docs foundation (branch `init-plan`)
- [x] Phase 1: Scaffold (Vercel connection is manual, see below)
- [x] Phase 2: Reference study + style (STYLE.md, chosen assets)
- [x] Phase 3: Assets + gate + shell (scroll-snap, slides.js)
- [x] Phase 4: Motion
- [x] Phase 5: Audio
- [x] Phase 6: Idle, reset, finale, counter
- [x] Phase 7: PWA + offline
- [ ] Phase 8 (human, iPad): Device QA + polish
- [ ] Phase 9 (human, see docs/KIOSK.md): Kiosk deploy (manual)
- [ ] Phase 10 (optional): Particles (not built, see notes)

## Next agent start here
Waiting on the human: Phase 8 device QA (checklist below) and Phase 9 (`docs/KIOSK.md`). Nothing else is blocked on code. When the human reports iPad findings, fix them in a small PR (Sonnet 5.5; Opus 5.5 only for hard scroll-snap/audio bugs).

Phase 8 iPad checklist:
1. Open the Vercel URL in Safari, Add to Home Screen, launch from the icon (standalone).
2. Tap Begin with headphones on: music must start. Scroll: tracks crossfade (ambient, tense on beat 2, swell on beat 3).
3. Airplane mode, fully close the app, reopen: must load and play audio.
4. Walk away mid-experience: reset to gate after 20s (10s on finale), audio fades out. Tap Done: same.
5. Check pacing, scroll-snap feel, no rubber-band/zoom/selection, slide 4 backdrop legibility, glow beat.
6. Tune `MASTER` in `src/audio.js` after hearing it.

Phase 10 (particles) intentionally not built: it only makes sense after seeing real iPad frame rate, and the motion is already rich. Add only if the human asks.

## Known issues / device test results
- Slide 1/2 art changed (see DECISIONS). On iPad check legibility over `creation-people.jpg` and that `alone.svg`'s tiny figure is visible.
- The run now advances by itself (no manual scrolling, no SCROLL hint; see DECISIONS). Verify on iPad: each beat glides to the next after its text lands, the whole run is about 25s, nothing can be scrolled by hand, Done and the 10s finale idle still reset, and the black-square glitch in the light beat is gone (ridge is now a jpg).
- Fonts: fontsource latin subsets only; no Devanagari etc. Keep it that way for precache size.
- Done button currently just returns to the gate (full reset/idle/audio fade is Phase 6).
- Verified in desktop Chrome at 1180x820 only; not yet on a real iPad.
- Audio could not be heard or truly autoplay-tested here (automation clicks lack user activation: context stays suspended). Logic verified: cues set the right track, stop clears. Real playback needs the iPad check above.
- Offline verified in desktop Chrome: with the preview server killed, reload served page, 5 fonts, and Range request to an mp3 returned 206.
- Idle verified (2s override reset to gate) and counter incremented once on reaching finale.
- Master gain is 0.6 in `src/audio.js` (`MASTER`); tune after hearing it in headphones.
- The Chrome automation tab is `visibilityState: hidden`, so requestAnimationFrame is paused and animations cannot be watched live. QA was done by seeking timelines (`window.__fx.seek`) and screenshotting after a flush. Real-time smoothness and timing still need a real iPad check (Phase 8).
- `lottie-web` was removed (unused). ClickCircle Lottie is a full-screen 1440x1024 comp with off-center targets, unsuitable as a scroll hint; hint is CSS. Lottie files stay in `public/lottie/` but are excluded from precache.
- No Vercel deployment was visible via the GitHub API when checked; confirm the Vercel project is connected to the repo.
- Slide 4 backdrop (`sky.png`) is a bright white image dimmed with CSS filter; check legibility on iPad.
- Beat durations (s): 2.4, 5.7, 2.8, 14 (slow bg zoom), 3.9. Tune pacing on device.
