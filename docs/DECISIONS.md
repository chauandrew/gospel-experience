# Decisions (append only)

Format: date, decision, why, alternatives rejected.

## 2026-10-03

- **Vanilla JS + Vite, no React.** Almost no UI state; GSAP is imperative and fights React re-renders. Rejected: React, Svelte, no-build single file (manual PWA precache is fiddly).
- **Scroll-driven, not Continue taps.** Matches Course 101 ch1 and apple.com/os/macos feel. GSAP + ScrollTrigger for motion; CSS scroll-snap between beats so a flick advances one beat. Rejected: CSS `animation-timeline` (needs recent Safari), free scroll (fast flick skips content).
- **Gate screen is near-empty.** Only "Put on your headphones" + Begin. The tap unlocks audio (iOS autoplay policy).
- **Finale allows scrolling back up.** Done button or 10s idle resets to gate. Elsewhere idle is 20s; scroll/touch resets the timer.
- **Content is data.** Wording, slide count, effects, music cues, buttons all in `src/slides.js` so text stays flexible.
- **Audio:** reuse Course 101 music (owners gave permission); Web Audio crossfader modelled on their SoundController. Volume via iPad hardware buttons only; fixed master gain; no in-app control for now.
- **Offline:** PWA, install on both iPads at home via Add to Home Screen, airplane-mode test. No LAN fallback.
- **Deploy:** Vercel via GitHub, PR previews, human merges to main.
- **Look:** dark, typography-led; Course 101 SVGs recolored via CSS; 2-3 Lottie files (preview first, drop any that stutter on device).
- **Extras:** anonymous local-only completion counter (localStorage). Hidden staff reset skipped. Answer was ambiguous ("skip all extras" + "tap counter"); counter included, easy to remove.
- **No back button;** tiny scroll-progress indicator.
- **First commit goes on branch `init-plan`**, not main, per the never-commit-to-main rule.

## 2026-10-03 (Phase 2)

- **Hybrid scroll model, matching Course 101:** pinned full-viewport stage per beat, scroll scrubs the reveals, scroll-snap moves between beats. No Continue buttons except the finale Done. Why: that is how ch1 and the Apple page behave. Rejected: pure free scroll.
- **Palette:** near-black scenes, white text, dim gray `#86868b` for pre-reveal, Course 101 yellow `#f8c81e` as the single accent. Why: Course 101 itself is taupe, so we borrow its accent and type, not its background.
- **Type:** Poppins 700 uppercase wide-tracked headlines, Roboto body, self-hosted via fontsource. Why: observed Course 101 fonts; fontsource keeps it offline.
- **Chosen audio:** Silent_Place (ambient), BGM_Downward_Spiral (tension), BGM_Ending (pivot/finale). About 6.4 MB total.

## 2026-10-03 (Phase 2 revision)

- **Re-reviewed Course 101 with images on.** First pass was done with an image-blocking extension, so the taupe/white read was wrong. Real look: full-bleed flat illustrated scenes (ch1 green, ch2 teal framed, ch4 black cinematic). Ch4 is the nearest match to our dark brief.
- **Add a full-bleed dim background layer per beat** (image or Lottie, slow loop, film grain) behind pinned text, plus a Trirong italic serif for the one key line per beat, plus left-edge dash progress. Why: this is what makes Course 101 feel cinematic. Supersedes the plain black scenes and bottom dots in the first style draft.

## 2026-10-03 (Phase 4)

- **Timeline-per-beat instead of scroll-scrubbed reveals.** With `scroll-snap: mandatory` each beat is only ever at rest at its snap point, so there is no scroll range inside a beat to scrub. Each beat has a paused GSAP timeline that plays when the beat becomes active and resets when fully off screen (so text never pops mid-transition). Scroll still drives progression and snap.
- **Word gaps via CSS margin on `.w`, not text nodes.** Appended space text nodes lost the gap between the last two words in the live DOM (root cause not found), so `.w { margin-right: .35em }` replaces them.
- **Scroll hint is CSS, not the ClickCircle Lottie** (see PROGRESS notes).
- **Frames decay on slide 2:** three picture-frame SVGs crossfade in step with "Pain. Brokenness. Silence." Glow swell on slide 3 is a scaled radial gradient. Slide 4 gets a slow zoom on a dimmed background image.

## 2026-10-03 (Phases 5-7, bundled in one PR at the user's request)

- **Audio: all three tracks start inside the Begin tap and run silent; scroll only crossfades gains** (2s ramps, master 0.6). iOS only allows `play()` from a user gesture, and scrolling is not one. Revives on next touch/visibility if iOS suspends the context. Rejected: decoding to AudioBuffers (about 150 MB RAM), starting tracks on demand.
- **Idle: 20s default, per-beat override (`idle` in slides.js; finale 10s). Any touch or scroll resets it; timeout resets to the gate and fades audio.**
- **Completion counter** = reached finale once per run, in localStorage. No on-screen readout (hidden staff UI was declined); read via Safari Web Inspector.
- **PWA: `injectManifest` with a custom `src/sw.js`, classic (iife) worker, `registerType: 'prompt'`** so updates apply only after the app is fully closed. Custom route answers `.mp3` with `createPartialResponse` from the precache so iOS Range requests get 206. Unused borrowed assets (Lottie json, two images) are excluded from precache. Total precache about 5.9 MB.
- **Icons are generated placeholders** (yellow ring on black). Replace with real art if wanted.

## 2026-10-03 (wrap-up)

- **Removed `lottie-web`** (no Lottie used). Re-add only if a beat needs one.
- **Phase 10 particles not built**: needs real iPad frame-rate data first; adds heat/battery risk for an event kiosk.
- **Added `README.md` and `docs/KIOSK.md`** (event runbook: install, Guided Access, offline check, updates, reading the counter).

## 2026-10-03 (scroll gate + artwork)

- **Scroll is locked until a beat's text has fully landed.** `#scroller` gets `overflow-y: hidden` once the snap settles (polls `scrollTop == offsetTop`, so it never freezes between beats) and releases at the timeline's `unlockAt` (last text + 0.3s). A "SCROLL" hint fades in at that moment. Beats already read this run show complete instantly if you scroll back (no replay, no lock). The finale never locks. Rejected: scrubbing text with scroll (no scroll range inside a snapped beat).
- **Each beat has real artwork** from Course 101 ch1/ch2 (see `docs/ASSETS.md`), dimmed with CSS (`dim` per slide in `slides.js`) and slowly zoomed. Slide 2 uses three crossfading images instead of the picture-frame SVGs: a garden darkening into the ruined city.

## 2026-10-03 (finale art + slower glow)

- **Finale art is now a warm sunrise** (`sunrise.svg`) instead of the pale arch hall: warmer and more inviting after the green hills. Alternatives are listed in `docs/ASSETS.md`.
- **Glow swell slowed from 2.8s to 5.5s** (sine in/out), words land after 2.4s (was 0.9s). Adds about 1.5s to the forced wait on that beat.

## 2026-10-03 (staged creation, relational slide, audio lead-in)

- **Slide 1 lands as three stages**: "In the beginning, God created everything…", "And it was good.", "Very good." Each headline in `slides.js` is its own stage (1s pause between); artwork crossfades per stage and people arrive at "Very good." Lines stack so the full verse is visible at the end.
- **Slide 2 is about relational sin**, in language teens relate to: "So why does the world feel so fractured?" then Gossip. Betrayal. Loneliness., with matching art (whispering, cracked photo, lone figure). Wording and images are plain data in `slides.js`; swap freely.
- **Audio starts the instant Begin is tapped** (1.2s fade-in, no 2s wait), and the gate fades out over it during a 1.4s lead-in before the first beat. Audio cannot start before the first tap on iOS, so the Begin tap is the earliest possible moment. If sound is wanted on the "put on your headphones" screen itself, add a tap-to-start screen before it (two taps).
- **`frames` entries may be `{ src, dim }`** to set per-image brightness; tall (portrait) art is shown whole instead of cropped.

## 2026-10-03 (hard scroll lock, full reset)

- **Scroll is refused outright until the SCROLL hint has fully appeared.** The lock now engages the moment a beat is entered (not after the snap settles): wheel, touch drags and scroll keys are cancelled with `preventDefault`, and overflow hidden is added once the snap settles. Release happens at the end of the hint's fade-in (about 0.6s after the text finishes), not when the text finishes.
- **Reset is complete on Done or idle timeout:** scroller scroll position and progress dashes go back to the first beat, all timelines rewind (words, hints, art, glow, buttons hidden), lock/seen cleared, audio fades out and restarts from 0 on the next Begin. Verified by running a full pass, resetting, and starting again.
