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
