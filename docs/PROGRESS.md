# Progress

See `docs/PLAN.md` for phase details and recommended model per phase.

- [x] Phase 0: Repo + docs foundation (branch `init-plan`)
- [x] Phase 1: Scaffold (Vercel connection is manual, see below)
- [x] Phase 2: Reference study + style (STYLE.md, chosen assets)
- [x] Phase 3: Assets + gate + shell (slides.js; scroll-snap later replaced by self-advancing beats)
- [x] Phase 4: Motion
- [x] Phase 5: Audio
- [x] Phase 6: Idle, reset, finale, counter
- [x] Phase 7: PWA + offline
- [ ] Phase 8 (human, iPad): Device QA + polish
- [ ] Phase 9 (human, see docs/KIOSK.md): Kiosk deploy (manual)
- [ ] Phase 10 (optional): Particles (not built, see notes)

## Next agent start here
Waiting on the human: merge the open PR, confirm the Vercel project is connected to the repo (no deployment was visible through the GitHub API), then Phase 8 device QA (checklist below) and Phase 9 (`docs/KIOSK.md`). When the human reports iPad findings, fix them in a small PR (Sonnet 5.5; Opus 5.5 only for hard audio or rendering bugs).

## How the experience works now
- Gate: "Headphones on" with "30 seconds" under it (the run is about 33s; close enough). Tap Begin (or press Space): music starts in that tap, the run begins about 1.4s later.
- No manual scrolling. The scroller is overflow hidden and every beat except the last glides to the next on its own once its text has landed plus a hold (`auto` in `src/trailers/story.js`). Beats: creation, man, tension, light/Gospel, finale.
- The finale shows "See it for yourself", the CTA and a Reset button. Reset, Space, or 15s idle returns to the gate and stops the audio. A mute button (top right) is shown during a run and clears on Reset.
- Pace is real seconds in the constants at the top of `src/fx.js` (`WORD`, `STAGGER`, `STAGE_GAP`, `REVEAL_*`, `HOLD`) plus per-beat `speed`, `auto`, `lead` and `musicAt` in `slides.js`. Run from the Begin tap to the Reset button: about 34s by the simulated clock (beats leave at 4.7, 6.6, 10.0 and 6.4s, finale text 2.2s, plus the 1.4s gate fade and the flips).3, 7.0, 11.0 and 6.4s, finale text 2.2s, plus the 1.4s gate fade and the flips). Stopwatch history: 55s before the timing fix (the earlier `SPEED` setting never worked, see DECISIONS), 23s after halving the timings (too fast), then retuned in two steps toward 35s. Tension plays at `speed: 0.85`; man is back at 1.0. Holds after the last text are 2.0s on creation, man and tension (tension `auto` is 1.7 because it plays at 0.85x) and 2.5s on the light/Gospel beat.
- Music: ambient on beats 1-2, switches to tense when "Then something happened" lands (`musicAt: 1`), on the light/Gospel beat the music drops to silence as the beat opens (`hush`), then the swell starts exactly on "But" (`musicAt: 0`). The track being left is low-passed as it fades.
- Quotes: wrap words in `_underscores_` in slide text for italics. Older lines dim to 45% when the next one lands.

## Phase 8 iPad checklist
1. Open the Vercel URL in Safari, Add to Home Screen, launch from the icon (standalone).
2. Tap Begin with headphones on: music must start. Let it run: no scrolling possible, each beat flips to the next, the tension music change lands on "Then something happened", and the whole run is about 25s.
3. Watch the light/Gospel beat for black squares or flicker (the glow was removed and `ridge.jpg` rasterized to fix this; unconfirmed on device). Also watch tension (large SVGs with filters).
4. Mute button works and clears on Reset. Hardware volume buttons still control loudness.
5. Airplane mode, fully close the app, reopen: must load and play audio.
6. Reset button, Space (with a keyboard) and the 15s finale idle all return to the gate, audio fades out.
7. Check reading time (about 17 words in 3.5s on the first two beats), image legibility under the text, and tune the `fx.js` timing constants / each beat's `auto`. Tune `MASTER` in `src/audio.js` after hearing it.

Phase 10 (particles) intentionally not built: it only makes sense after seeing real iPad frame rate, and the motion is already rich. Add only if the human asks.

## Known issues / device test results
- Not yet run on a real iPad. Verified only in desktop Chrome by seeking timelines and taking screenshots.
- Black-square glitch (reported on the light beat on iPad) has had two fix attempts; see DECISIONS. If it persists, next steps: pre-dim images instead of the CSS `filter`, and rasterize the remaining large SVGs (`photo-wall.svg` 460 KB, `genesis-garden.svg`, `genesis-dusk.svg`, `alone-room.svg`).
- `man.png` / `newborn.jpg` style experiments were rejected; man beat opens on `eden-valley.jpg`. `newborn` and other crops are in git history only.
- Audio could not be heard or truly autoplay-tested here (automation clicks lack user activation: context stays suspended). Cue logic, mute and the lowpass wiring were verified by state only. Real playback needs the iPad check.
- The Chrome automation tab is `visibilityState: hidden`, so requestAnimationFrame is paused and animations cannot be watched live. QA is done by seeking timelines (`window.__fx.seek(i, t)`, in timeline seconds) and screenshotting after a flush; ScrollTrigger can restart a timeline after a seek, so re-seek once if a screenshot looks like time 0. Real-time smoothness still needs the iPad.
- Offline was verified in desktop Chrome earlier (page, fonts, mp3 Range request 206) before the latest art changes; re-verify in airplane mode on the iPad.
- Fonts: fontsource latin subsets only (Poppins 700 italic added for quotes); keep it that way for precache size.
- Master gain is 0.6 (`MASTER` in `src/audio.js`).
- `lottie-web` was removed (unused); Lottie files stay in `public/lottie/` but are excluded from precache.
- The completion counter is local-only (`gx-completions`, see KIOSK.md).
