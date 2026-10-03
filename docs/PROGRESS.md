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
- [ ] Phase 8: Device QA + polish
- [ ] Phase 9: Kiosk deploy (manual)
- [ ] Phase 10 (optional): Particles

## Next agent start here
Phase 8: device QA + polish (human on a real iPad, then Sonnet/Opus for fixes). Phases 5-7 shipped together: audio (`src/audio.js`), idle reset + finale + counter (`src/idle.js`, `src/counter.js`, wiring in `src/main.js`), PWA (`vite.config.js`, `src/sw.js`, `public/icons/`). Checklist for the iPad:
1. Open the Vercel URL in Safari, Add to Home Screen, launch from the icon (standalone).
2. Tap Begin with headphones on: music must start. Scroll: tracks should crossfade (ambient to tense on beat 2, to swell on beat 3).
3. Airplane mode, fully close the app, reopen: must load and play audio (precache + Range 206 handling).
4. Walk away mid-experience: reset to gate after 20s (10s on finale), audio fades out. Tap Done: same.
5. Check pacing (beat durations), scroll-snap feel, no rubber-band/zoom/selection, Lottie not used.
6. Read the count: Safari Web Inspector from a Mac (Settings > Safari > Advanced > Web Inspector on iPad) then `localStorage.getItem('gx-completions')`.
Updates: new versions wait until the app is fully closed and reopened (registerType 'prompt', no reload prompt UI). To force an update on an iPad: swipe the app away, reopen while online, close again, reopen.

## Known issues / device test results
- Fonts: fontsource latin subsets only; no Devanagari etc. Keep it that way for precache size.
- Done button currently just returns to the gate (full reset/idle/audio fade is Phase 6).
- Verified in desktop Chrome at 1180x820 only; not yet on a real iPad.
- Audio could not be heard or truly autoplay-tested here (automation clicks lack user activation: context stays suspended). Logic verified: cues set the right track, stop clears. Real playback needs the iPad check above.
- Offline verified in desktop Chrome: with the preview server killed, reload served page, 5 fonts, and Range request to an mp3 returned 206.
- Idle verified (2s override reset to gate) and counter incremented once on reaching finale.
- Master gain is 0.6 in `src/audio.js` (`MASTER`); tune after hearing it in headphones.
- The Chrome automation tab is `visibilityState: hidden`, so requestAnimationFrame is paused and animations cannot be watched live. QA was done by seeking timelines (`window.__fx.seek`) and screenshotting after a flush. Real-time smoothness and timing still need a real iPad check (Phase 8).
- `lottie-web` is installed but unused. ClickCircle Lottie is a full-screen 1440x1024 comp with off-center targets, unsuitable as a scroll hint; hint is CSS (pill label + line). Decide in Phase 8 whether to drop the dependency.
- Slide 4 backdrop (`sky.png`) is a bright white image dimmed with CSS filter; check legibility on iPad.
- Beat durations (s): 2.4, 5.7, 2.8, 14 (slow bg zoom), 3.9. Tune pacing on device.
