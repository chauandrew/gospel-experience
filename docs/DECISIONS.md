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

## 2026-10-03 (slide 2 words)

- **Slide 2 words are now Comparison. Isolation. Betrayal.** (user's choice; they escalate from social-media envy to withdrawal to being hurt by someone close). Art matches: photo wall of everyone else's happy moments, someone alone in a dark room, a whispered secret. Swap freely in `slides.js` (`reveal` + `frames`; frames[0] sits behind the question, then one per word).

## 2026-10-03 (slide 1 green, slide 2 pacing and framing)

- **Slide 1 opens on the green garden** (the sunset-hills art looked like a dead world), then a bright coast, then people. Removed `genesis-dawn.svg`.
- **Slide 2 pacing slowed**: 1.3s before the first word (was 0.4), 2.2s between words (was 1.1), art crossfade 1.6s. Tunable constants at the top of `src/fx.js`.
- **Real cause of "only a portion of the image" fixed**: frame images lived in a CSS grid cell, and the portrait whisper art inflated the cell to about 1500px tall, so every other image was cropped from a stretched box. Frames are now absolutely positioned. Slide 2 also uses `fit: 'contain'` (whole image, soft edges); other slides still fill with `cover`.

## 2026-10-03 (flip, auto-advance, darker comparison)

- **Creation images flipped**: coast first, then garden, then people.
- **Light beat auto-advances** (`auto: 2.5` in `slides.js`): 2.5s after its text lands it glides to the next beat with a smooth programmatic scroll (works while manual input is locked). No SCROLL hint on that beat. Any beat can opt in. Revisiting it by scrolling back shows it complete and does not re-advance.
- **Comparison art kept but made cold**: photo wall at brightness 0.3 and saturation 0.3 (`{ src, dim, sat }` frame option) so it reads as envy, not joy.

## 2026-10-03 (creation of man beat)

- **Genesis split in two**: beat 1 is creation ("In the beginning, God created..." / "And it was good.", coast then garden). New beat 2 `man` (eyebrow "Genesis 2") is the creation of man: "Then he paused, and formed man." / "In his own image." / "It was very good." Copy is drawn from Course 101 ch1 (the "pause" and "own image" lines) and Gen 1:27 / 2:7. Tone rule: plain statements, no sermon voice. Run is now 6 beats.
- **Art**: one image (`creation-people.jpg`) behind the whole man beat; a frame count lower than the line count is fine, the last frame just stays.
- **Man beat copy and art (author edit)**: "Then God created man in his own image." / "And God blessed them." / "It was very good." Art follows the lines: Eden garden backdrop with a silhouette fading in, then a collage of people together (hugs, family, friends) for "blessed", then the golden field. Beat 1 line is now "In the beginning, God created the heavens and the earth".
- **Man beat stage 1 art swapped** to the bright ch2 valley (`eden-valley.jpg`); the silhouette and the dark Eden backdrop were dropped as too gloomy for "made in his image".

## 2026-10-03 (merge pivot and invite)

- **Pivot and invite merged into one beat** (`pivot`): "But that's not how the story ends." then the Gospel line, staged like the other multi-line beats. Glow stays; art crossfades night sky to the golden ridge (`ridge.svg`, Course 101 ch6). Auto-advances to the finale 2.5s after the text lands (the long line needs reading time). `hills.jpg` and the separate `invite` beat were removed. The run is now 5 beats: genesis, man, tension, pivot, finale. Tradeoff: the night sky now fades in with the first line (about 2.6s) rather than at 0s, so the glow swells on black first.

## 2026-10-03 (faster pacing)

- **Run tightened from about 45s to about 25s** with one knob: `SPEED = 1.8` in `src/fx.js`, applied as the `timeScale` of every beat timeline. Everything (word stagger, pauses, art crossfades, hint, auto holds) scales together; raise or lower SPEED to retune. Fixed waits per beat (timeline seconds / SPEED): genesis 5.9/1.8, man 8.0/1.8, tension 10.9/1.8, pivot 11.5/1.8, finale about 3.6/1.8, plus gate fade 1.4s and scroll glides. The merged beat's `auto` hold went from 2.0 to 3.2 timeline seconds so its long line keeps about 1.8s real reading time after landing. `auto` and `seek(i, t)` are in timeline seconds, not real seconds.
- **Slide 2 word gap 2.2 to 1.6** timeline seconds (`REVEAL_GAP` in `src/fx.js`), about 0.9s real at SPEED 1.8. Tension beat is now about 8.6/1.8 = 4.8s of fixed wait.
- **Merged light beat opens faster**: pre-text pause 2.4 to 1.0 timeline seconds (`t` in `src/fx.js`), and the night sky is the `bg` again (fades in at 0s under the glow) so the first stretch is not a glow on black. Frames on a beat that has a `bg` now start with the second headline (the bg is the first image). Fixed wait for the beat is about 10.1/1.8 = 5.6s, down from 6.4s.

## 2026-10-03 (self-advancing run)

- **No manual scrolling.** `#scroller` is `overflow-y: hidden`; every beat except the last glides to the next on its own (`advance` in `src/fx.js`) after its text lands plus a hold (`auto` in `slides.js`, default `HOLD` 2.5 timeline seconds; genesis 2.2, man 2.4, tension 2.7, pivot 3.2). The SCROLL hint, the scroll lock/settle machinery and the revisit logic were removed. Dev hook `isLocked` is gone. Idle still works: each beat re-arms the timer, no beat is near 20s, and the finale uses 10s.
- **`speed` per beat**: multiplier on `SPEED` (man uses 1.33 so its text lands in 0.75 of the time).
- **Light beat glitch (black squares on iPad)**: cause not reproducible off-device. Best guess is the ridge SVG under a CSS filter inside a scaling box (re-rasterized each frame), so `ridge.svg` became `ridge.jpg`. If it persists, next suspects are the large `.glow` layer scaling and the filter on `.bg`; `photo-wall.svg` and `sunrise.svg` are the other big SVGs and could be rasterized the same way.
- **Black squares, second pass**: the big `.glow` layer was scaled up to 1.4 (about 47 MB at retina) and GSAP repainted `.bg`, `.frames` and `.glow` every frame. Now the glow is never scaled past 1 (`circle closest-side` gradient fades to nothing at the layer edge; a farther stop leaves a visible square edge) and `.bg`, `.frames`, `.glow` have `will-change: transform, opacity` so they are their own GPU layers. Artwork crossfade `ART_FADE` 1.6 to 0.9 so it matches a word landing. Glow reaches about 45vmax radius (was about 53). Unverified on device; if squares persist, next step is to drop the glow scale tween and the `.bg` brightness filter (pre-dim the image instead).

## 2026-10-03 (crossfade pivot, fade-through-black transitions)

- **Glow removed.** The light beat is now a plain crossfade, night sky then the golden ridge (`fx: 'crossfade'`). `.glow`, its tween and its CSS are deleted (this also removes the biggest suspect for the iPad black squares).
- **Beat-to-beat moves fade through black, not a vertical glide.** `advance` in `src/fx.js` fades the finished beat out over 0.5s, jumps the overflow-hidden scroller instantly, and the next beat's timeline fades its art and text in from black.
- **Softer warm-to-dark cut (man to tension)**: `lead: 1.1` on tension gives the dark art about 0.6s alone before the question lands; the first image of a beat without a `bg` now starts at 0, not with the text. The track being left (`ambient`) is muffled by a per-track lowpass (20 kHz to 400 Hz) over the 2s crossfade (`src/audio.js`). Audio change is untested by ear. Skipped from the pasted advice: extra "Anxiety" word, vignette and a desaturation tween (the dark art is already dim).
- **Tension opens with a bridge line**: "That's how it was meant to be." then the existing question (copy fix for the jump from "very good" to "fractured"). Tension's `lead` is 0.8. Tension is now about 8s of fixed wait (about 12.0 + 2.7 timeline seconds / 1.8).
- **Fade-through-black reverted to the vertical flip** (author preference): `advance` is a smooth scroll again. The lead, the audio lowpass and the crossfaded light beat stay. Timing of a flip: the `auto` hold in `slides.js` (and `speed`, `SPEED` in `fx.js`).
- **Italic quotes**: in `slides.js` headline text, wrap words in underscores (`_like this_`, may span several words, or a whole line). `splitWords` in `src/fx.js` strips the underscores and adds `.quote` (italic, Poppins 700 italic is imported in `main.js`). Plain `"` characters are untouched.
- **Punctuation rule**: no end period on our own display lines (bridge, tension, pivot, CTA, the three reveal words); scripture lines keep their punctuation and are italic quotes. Question marks stay.
- **Older lines step back**: when the next headline lands, the previous one fades to `OLD` (0.45 opacity, constant in `src/fx.js`); on the tension beat the question also dims when the three words arrive. The newest text is always the brightest, so the eye follows it now that periods are gone.
- **Spacebar resets** (`src/main.js`): during a run, Space does the same as the finale button, back to the gate (audio fades, run state clears). A keydown counts as a user gesture, so Begin works right after. The finale button now reads "Reset" (was "Done").
- **Spacebar narrowed to the two end screens** (supersedes the line above): Space is Begin on the gate and Reset on the finale; mid-run it does nothing (`atFinale` in `src/main.js`, set from the beat callback).

## 2026-10-03 (art pass: finale, tension, creation, cross)

- **Finale backdrop** is `desert-city.jpg` (ch5), dim 0.8 so the gold shows and the text stays legible.
- **Tension has two images before the three words**: genesis-garden behind "That's how it was meant to be", crossfading to genesis-dusk when "Then something happened" lands. `starts` in `src/fx.js` is now general: one image per headline stage (minus one when the beat has a `bg`), then one per reveal word. Creation's second image became `creation-field.jpg` (ch7 heaven-field) since the garden moved.
- **Cross in view**: the first ridge file (`JesusInMyPlace_1`) has no cross; swapped to `_3` (cross on the ridge) and added a per-image `pos` option (CSS object-position, `'100% 25%'`) so the top-right cross stays on screen under cover cropping, including on a narrower iPad aspect.
- **Pace**: `SPEED` 1.8 to 2.0 in `src/fx.js` (run is about 25s).
- **Creation image swapped again** to the green ch2 valley (`eden-valley.jpg`); the man beat's first stage went back to `genesis-garden.svg` so two consecutive beats do not open on the same picture. Tension also opens on the garden, on purpose (the world as it was meant to be).
- **Creation image is now the ch1 Eden river** (`eden-river.jpg`, cropped to 16:9, shown at dim 1.1): vivid green, matches the flat style of the garden. The valley (`eden-valley.jpg`) was dropped from the repo; man's opener stays the garden.
- **Man beat opener restored** to the ch2 valley (`eden-valley.jpg`, back from git history) after the garden swap; the creation slide keeps the river, tension keeps the garden.

## 2026-10-03 (mute button)

- **Mute button** (`#mute`, top right, 48px, shown only during a run): toggles `audio.setMuted` (master gain ramps to 0 and back to 0.6 in 0.25s). Mute state clears on Reset and on every Begin, so one student's choice never carries to the next. It is a master-level mute only; the iPad's hardware volume is still the real volume control.
- **Man beat opener is a newborn with family** (`newborn.jpg`, cropped from the ch7 collage) instead of the valley: new life fits "created man in his own image". Soft at iPad size because it is a 1000px crop; if it looks too blurry, find a higher-res source or switch back to `eden-valley.jpg` (git history).
- **Newborn opener rejected** by the author; man beat is back on the valley (`eden-valley.jpg`) while a better "created man" image is found. Candidates seen: ch3 "Creation of Adam" hands panel (4096x1545, blue), ch6/4a still of clasped hands by a lake (960x540 photo), ch7 double-exposure silhouettes.
- **Music change timed to a line**: `musicAt: n` on a slide cues its music when headline n lands (`onCue` in `src/fx.js`) instead of when the beat opens. Tension uses `musicAt: 1`, so the tense track and the lowpass muffle on the ambient track begin at "Then something happened"; the first line ("That's how it was meant to be") still plays over the warm music.
- **Docs refreshed** for the self-advancing run (PROGRESS, KIOSK, README, CLAUDE, STYLE note). PLAN.md is left as the original plan.
- **Incoming music starts from its beginning.** All tracks start silent in the Begin tap (iOS needs a tap), so a track cued later used to fade in mid-song (the tense track was about 6-8s in). `cue()` now sets the incoming track's `currentTime` to 0 before the fade (gain is 0 then, so the seek is inaudible). The ambient track at Begin is already at 0. Dev `__audio.state()` now reports each track's `time`.

## 2026-10-03 (timing bug: SPEED never applied)

- **Found and fixed**: the global `SPEED` factor (1.8, then 2.0) was passed as `timeScale` inside the `gsap.timeline({...})` config, which GSAP ignores (`gsap.timeline({ timeScale: 2 }).timeScale()` is 1; only the `.timeScale()` method works). Every earlier "faster" estimate was computed as if it applied, and QA by seeking timelines could not notice. The author timed the real run at 55s.
- **Fix, as requested, is real timings instead of a speed metric**: `SPEED` is gone. The timings in `src/fx.js` were halved directly (`WORD` 0.45, `STAGGER` 0.06, `STAGE_GAP` 0.5, `REVEAL_LEAD` 0.65, `REVEAL_GAP` 0.8, `HOLD` 1.25, art crossfade = `WORD`, eyebrow/bg/cta/button fades halved) and the per-beat holds in `slides.js` halved (`auto`: creation 1.1, man 1.2, tension 1.1, light/Gospel 1.6; tension `lead` 0.4). The per-beat `speed` (man 1.33) now really works via `tl.timeScale(...)`. Pace was verified with a simulated clock (dev hooks `__fx.play(i)` and `__gsap`, stepping `gsap.updateRoot`): beats leave at 3.6, 3.5, 6.7 and 4.3s, finale text lands at 1.7s, so about 24s from Begin to Reset. To retune, edit those constants or a beat's `auto`.
- **Pace retuned to about 30s** (the author's stopwatch read 23s on the halved timings and it felt too fast): all `fx.js` timings scaled up about 1.3x (`WORD` 0.6, `STAGGER` 0.08, `STAGE_GAP` 0.65, `REVEAL_LEAD` 0.85, `REVEAL_GAP` 1.05, `HOLD` 1.6; eyebrow, bg and cta/button fades to match) and the per-beat `auto` holds (creation 1.45, man 1.55, tension 1.45, light/Gospel 2.1; tension `lead` 0.5). Simulated clock: beats leave at 4.8, 4.6, 8.7 and 5.7s, finale text at 2.2s; about 30s from Begin to Reset (the simulation ran about 1s high against the stopwatch last time).
- **Pace retuned again to about 35s** (author: 30s still felt too fast, especially man and tension): man's `speed` 1.33 removed (back to 1.0), tension `speed: 0.85` added, and holds raised (`auto`: creation 2.0, man 2.4, tension 2.1, light/Gospel 2.8). Simulated clock: beats leave at 5.3, 7.0, 11.0 and 6.4s, finale text 2.2s, about 36s with the gate fade and flips (the simulation ran about 1s high against the stopwatch earlier, so expect about 35s).
- **Dead gap after the last tension word removed.** A reveal beat's text was treated as finished one `REVEAL_GAP` after the last word appeared, so tension waited about 0.5s of nothing before its hold even began. Text now ends when the last word has landed (`src/fx.js`). Remaining wait after the last text is the deliberate hold (`auto` divided by the beat's speed): creation 2.0s, man 2.4s, tension 2.5s, light/Gospel 2.8s.
- **Holds set by the author**: 2.0s real after the last text on creation, man and tension (`auto` 2.0, 2.0, 1.7 because tension plays at 0.85x), 2.5s on the light/Gospel beat (`auto` 2.5). The finale has no hold; it waits for Reset or the 15s idle.

## 2026-10-04 (Opus content/feel/flow review, first batch applied)

- The author accepted items 2, 4, 5, 6, 7 and 8 of the review (items 1, 3, 9 and 10 and the bolder ideas are not applied; man and tension copy stay as they were).
- **Gospel line**: "But that's not how it ends" / "God stepped into the story as Jesus" (names Jesus, no definition of the word Gospel).
- **Finale**: "See it for yourself" with the CTA "Walk through the whole story at the interactive exhibit" (no pass mentioned).
- **Silence before the turn**: pivot has `hush: true`, `lead: 0.9`, `musicAt: 0`. `audio.hush()` fades every track to 0 over 0.6s (the playing track low-passes as it goes) and clears `current`, so the next `cue()` starts its track from the beginning; the swell then starts on "But" about 1.0s into the beat.
- **Creation**: second line is `_"And it was good."_`, hold 1.6s.
- **Tension art**: Comparison is `alone-room.svg` (a face lit by a phone), Isolation is the dusk held at dim 0.6, Betrayal is `whisper.svg` darkened (dim 0.5, sat 0.6). `photo-wall.svg` is no longer used and was removed (still in git history).
- **Gate**: "Headphones on / 35 seconds". The run is about 34s by the simulated clock; if the pace changes, change this line.
- **Isolation art replaced** (the author did not want the dusk reused): ch1 sky-foreground figure looking out at the night, `isolation.jpg`, dim 0.9. **Holds shortened**: creation `auto` 1.6 to 1.2, man 2.0 to 1.5 (about 0.4s and 0.5s less after "it was good" / "it was very good"). Run is about 33s by the simulated clock.
- **Gate second line** (`gate.sub`, "35 seconds") is rendered with the `.cta` style (italic serif, yellow) instead of a second all-caps headline, so the gate no longer reads as one sentence.
