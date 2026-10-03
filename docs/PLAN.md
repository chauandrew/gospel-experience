# Gospel Experience Teaser: Plan (v3, phased, scroll-driven)

## Context
Offline iPad kiosk (Safari, Guided Access) for a noisy night market. Scroll-driven cinematic story (Course 101 ch1 / apple.com/os/macos feel), ambient music in headphones, idle reset. Repo `/Users/andrewchau/projects/gxp` is empty (greenfield). Built across several short sessions (limited credits), so every phase is self-contained, ends with a commit/PR, and leaves notes for the next agent.

## Confirmed decisions
- **Stack**: vanilla JS + Vite, GSAP + ScrollTrigger, lottie-web, vite-plugin-pwa. No React (no meaningful UI state; GSAP is imperative).
- **Gate screen**: near-empty. "Put on your headphones" + one Begin button. Tap = audio unlock + reveals experience.
- **Progression by scroll** with CSS scroll-snap between beats (`scroll-snap-type: y mandatory`, `scroll-snap-stop: always`); GSAP motion within beats. Native scroll in a fixed container; `overscroll-behavior: none`, no zoom.
- **Content flexible**: all wording, slide count, effects, music cues, button labels in `src/slides.js`.
- **Finale**: scroll back up allowed. Done button or 10s idle resets to gate.
- **Idle**: 20s elsewhere, 10s on finale. Scroll/touch resets timer.
- **Audio**: reuse Course 101 music (permission granted), Web Audio crossfader modelled on their `SoundController`. Volume = iPad hardware buttons only, fixed master gain in app.
- **Offline**: PWA, install on both iPads at home, airplane-mode test. No LAN fallback.
- **Deploy**: Vercel via GitHub; PR previews, human merges to main.
- **Look**: dark, typography-led; Course 101 SVGs recolored via CSS; 2-3 Lottie files (preview first, drop any that stutter).
- **Extras**: anonymous local-only completion counter (localStorage). Hidden staff reset skipped. (Answers conflicted, "skip all extras" + "tap counter"; counter included, trivial to remove.)
- No back button; tiny scroll-progress indicator.

## Repo docs framework (for future agents)
Created in Phase 0 and kept current every phase:
```
CLAUDE.md             # short: project summary, commands, "read docs/ first", rules (branch+PR, no em-dashes, terse)
docs/PLAN.md          # this plan (copied in)
docs/DECISIONS.md     # ADR-style log: date, decision, why, alternatives rejected. Append only.
docs/STYLE.md         # design tokens (colors, type scale, spacing, motion easing/durations), copy tone, CSS rules
docs/PROGRESS.md      # phase checklist + "next agent start here" notes, known issues, device test results
docs/ASSETS.md        # every borrowed asset: source URL, local path, license/permission note, where used
```
Rule in `CLAUDE.md`: at the end of a phase update `PROGRESS.md`, log any new decision in `DECISIONS.md`, then open a PR.

## Architecture
```
index.html  vite.config.js  package.json
public/audio/ svg/ lottie/ fonts/ icons/
src/
  main.js       # gate -> unlock audio -> build sections -> ScrollTrigger
  slides.js     # ALL content/config (gate copy + slides)
  sections.js   # renders sections from slides.js, attaches fx by name
  fx.js         # named effects: pinReveal, fadeWords, glow, parallax, lottieScrub
  audio.js      # crossfade controller, cue(name), fadeOut()
  idle.js       # resettable timer -> reset
  counter.js    # localStorage completion count
  style.css
```
`slides.js` entries: `{ id, eyebrow?, text[], reveal?[], fx, music?, idle?, button?, cta?, lottie?, svg? }`.

## Course 101 assets (hosts `course101-online.s3.amazonaws.com/assets/`, `cdn.prod.website-files.com/5ecd12d9d0406daae74fdc52/`; download, never hotlink)
- Music: `c101-online-chapter-2a-music/` Silent_Place 1.7 MB, Walk_In_The_Moonlight 0.8, Forest_Sanctuary 0.8, SFX_Heartbeat_Loop 0.13; `c101-online-chapter-4a-music/` BGM_Ending 2.4, BGM_Downward_Spiral 1.5, BGM_Guilt_Shame.
- Lottie: ch1 `ch1-soul.json`, `ch1-cogs.json`; ch4 `ClickCircle_v5.json`, `Introduction_Part1/2.json`, `DownwardSpiral.json`.
- SVG: ch2 picture frames (normal/slightly/heavy damaged), trees, fruit; ch4 silhouettes (white/black/shadow).
- Fonts: family from `css/course101.webflow.shared.*.min.css`.

## Phases (each = one PR, one short session)
Model key: **Opus 5.5** = design/taste/hard debugging, **Sonnet 5.5** = default building, **Haiku 4.5** = mechanical/config.

**Phase 0: Repo + docs foundation** (Haiku 4.5)
First commit on branch `init-plan` (never main): `git init` state, `.gitignore`, `docs/PLAN.md` (this plan), `DECISIONS.md` (seed with decisions above), `STYLE.md` (stub), `PROGRESS.md` (phase checklist), `ASSETS.md`, `CLAUDE.md`. Note: with no commits yet there is no `main` to PR against, so first commit goes on `init-plan`, pushed; you merge it as the base or set it as default.
Done when: docs exist, PR/branch pushed.

**Phase 1: Scaffold + deploy pipeline** (Haiku 4.5)
`npm create vite` vanilla, add `gsap lottie-web vite-plugin-pwa`, blank page, connect Vercel to GitHub, confirm preview URL loads on iPad.
Done when: preview URL opens on an iPad.

**Phase 2: Reference study + style** (Opus 5.5)
Open Course 101 ch1 and apple.com/os/macos in Chrome tool; record scroll pacing, pin length, easing, type scale in `STYLE.md`; preview candidate Lottie/SVG and choose 2-3; pick font. Outputs are docs, little code.
Done when: `STYLE.md` has tokens + motion spec; `ASSETS.md` lists chosen assets.

**Phase 3: Assets download + gate + shell** (Sonnet 5.5)
Download chosen assets into `public/`; dark theme CSS, locked-down touch CSS; gate screen with Begin; scroll container + scroll-snap; `slides.js` + `sections.js` rendering 5 plain sections with text.
Done when: gate then scroll through 5 sections with snap, works in desktop and iPad preview.

**Phase 4: Motion** (Opus 5.5 for fx design, or Sonnet 5.5 if STYLE.md is detailed)
`fx.js`: pinReveal, fadeWords (Slide 2 "Pain. Brokenness. Silence."), glow swell (Slide 3), picture-frame SVG decay, Lottie beats, progress indicator.
Done when: all 5 beats animate, 60fps on iPad preview, total run ~30-45s.

**Phase 5: Audio** (Sonnet 5.5)
`audio.js` crossfader, unlock on Begin, per-section cues via ScrollTrigger, fade-out on reset; fixed master gain.
Done when: music starts on Begin, crossfades by section, stops on reset.

**Phase 6: Idle, reset, finale, counter** (Sonnet 5.5)
`idle.js` (20s / 10s on finale, resets on scroll/touch), finale CTA + Done, `counter.js`.
Done when: walk-away resets to gate with audio faded; Done resets; count increments.

**Phase 7: PWA + offline** (Sonnet 5.5; Haiku 4.5 for icons)
Manifest, icons, Workbox precache of all assets incl. audio with range requests, apple meta tags, update strategy (no mid-event surprise updates).
Done when: airplane-mode reload works in desktop and on iPad standalone.

**Phase 8: Device QA + polish** (Opus 5.5 only if hard bugs; else Sonnet 5.5)
Real iPad pass: rubber-band/pull-to-refresh, zoom, selection, audio on first tap, Lottie perf, scroll feel, 30-min soak, headphone check. Fix issues; record results in `PROGRESS.md`.
Done when: checklist passes on both iPads.

**Phase 9: Kiosk deploy (manual, no model needed)**
Guided Access setup, Auto-Lock Never, volume preset, install PWA on both iPads at home, airplane-mode test, charger plan.

**Optional Phase 10: Particles** (Sonnet 5.5): flagged canvas module only if time and perf allow.

Cheapest path if credits run short: Phases 0, 1, 3, 5, 6, 7 give a working but plain experience; 2 and 4 are the polish.

## Risks to verify early
- Scroll-snap plus pinned GSAP can fight each other on iOS; prototype in Phase 3/4, fall back to GSAP-only snap if needed.
- Audio must start from the Begin tap (single `AudioContext`).
- Service worker audio range requests on iOS Safari.
- PWA cache eviction: re-verify airplane mode the morning of the event.

## Verification (end to end)
- `npm run build && npm run preview`: gate shows only prompt + Begin; tap starts audio; scroll-snap drives 5 beats; DevTools offline reload works.
- 20s idle returns to gate with audio faded; finale 10s.
- Real iPad standalone: no zoom/selection/pull-to-refresh, smooth scroll, airplane-mode full run.
