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
