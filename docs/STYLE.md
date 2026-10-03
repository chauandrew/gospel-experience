# Style

Direction: dark, high contrast, large typography, generous whitespace, cinematic and introspective. A quiet contrast to a loud party. Tone: 1-2 short lines per beat, no em-dashes.

## What the references do (observed Phase 2)

**Course 101** (re-reviewed with images on, 1180px viewport; the first pass was done with an image blocker and mis-read the look)
- **Ch1 (illustrated, full-bleed):** flat, grainy, muted green/teal vector illustration fills the screen; a looping animated character (cyclist) stays alive behind everything. Title card: outlined "CHAPTER 1" small caps over a huge yellow Poppins 700 title (`#f8c81e`, 72px) with one white START pill. Scrolling dissolves the title and fades in a pinned uppercase, wide-tracked Poppins line ("WE ASK SO MANY QUESTIONS EVERY DAY."), then speech bubbles pop in one per ~5 wheel ticks (each fades from grey to full, offset left/right). A CONTINUE pill fades in after the last bubble. Sound icon and hamburger top-right, "C101" top-left.
- **Ch2 (framed scene):** teal background, a large illustrated character (back of head, looking at a "TV") on the left, the scene in a dark picture frame on the right. Inside the frame, scenes crossfade as you scroll (starfield, Garden of Eden, ruined city). Text over scenes: small white Roboto 22px line, then a huge yellow Poppins headline, e.g. "WHAT IS WRONG WITH OUR WORLD?". Left edge: tiny dash progress marks (active one yellow). Bottom: yellow "SCROLL FOR MORE" pill with a vertical line.
- **Ch4 (closest to our brief: black cinematic):** pure black screen, white text, concentric-ring "click target" (the ClickCircle Lottie) to advance, body in Mukta 22px, a large italic serif (Trirong 35px) for the key line, left-edge dash progress marks, then a full-bleed dim painterly photo/illustration background fades in behind the text (a lone tree at dusk). Uses taps on targets to advance, not scrolling.
- Takeaways: (1) full-bleed illustration with a looping subtle animation behind text is what makes it cinematic; (2) text is pinned, scroll reveals items; (3) a single yellow accent on black or deep teal; (4) tiny edge dash progress; (5) a mix of sans (Poppins) and an italic serif for emotional lines.
- Whole-site chrome we skip: wordmark, hamburger, sound toggle (the progress dashes we keep).

**Apple macOS page** (apple.com/os/macos)
- Near-black charcoal (`#1d1d1f`), pill nav, huge two-line headlines (about 56px, SF Pro, tight tracking, white) with a small gray eyebrow above and gray body below.
- Headline text fades from dim gray to white as it scrolls into place (scroll-scrubbed opacity), then media cards slide up. Lots of empty space; one idea per screen.
- Takeaway: scrubbed opacity/translate on text lines, big type, eyebrow + headline + support text hierarchy.

## Tokens (proposed, adjust in Phase 4 on device)

| Token | Value |
|-------|-------|
| `--bg` | `#000` (gate), `#0b0b0d` (scenes) |
| `--bg-glow` | radial gradient from `#2a2418` to transparent, used for the Slide 3 light swell |
| `--text` | `#fff` |
| `--text-dim` | `#86868b` (inactive lines, eyebrow, pre-reveal state) |
| `--accent` | `#f8c81e` (Course 101 yellow; gate button hover, light/glow, finale CTA) |
| Emotional line font | Trirong italic 400 (or Spectral italic), `clamp(28px, 3.6vw, 40px)`, used for the one key sentence per beat |
| Headline font | Poppins 700, uppercase, `letter-spacing: 0.12em`, `clamp(32px, 5.5vw, 72px)` |
| Body font | Roboto 400, `clamp(20px, 2.4vw, 28px)`, `line-height: 1.45` |
| Eyebrow | Poppins 500, uppercase, `letter-spacing: 0.3em`, 14-16px, `--text-dim` |
| Button | white pill, black Roboto 700 uppercase 18px, min height 64px, min width 200px, radius 999px |
| Max text width | 18ch-24ch per line group, centered, so lines stay short on iPad portrait and landscape |

Fonts: self-host via npm `@fontsource/poppins` (700, 500), `@fontsource/roboto` (400, 700), `@fontsource/trirong` (italic 400), Latin subset only. No Google Fonts at runtime.

## Motion spec
- One idea per screen. Each beat is a full-viewport stage (`100svh`), `scroll-snap-align: center`, `scroll-snap-stop: always`.
- Text reveals are scroll-scrubbed (GSAP ScrollTrigger `scrub: 0.6`): opacity `--text-dim` to `--text` plus `y: 24px` to `0`, line by line (stagger).
- Easing: `power2.out` for entrances; `none` for scrubbed values. Time-based fades 600-900ms. Glow swell (Slide 3) 1.5-2.5s ease-in-out.
- Slide 2: words "Pain." "Brokenness." "Silence." fade in one at a time, each dimming slightly as the next arrives; picture-frame SVG steps normal, slightly damaged, heavy damaged across the same scroll range.
- Progress: 5 short horizontal dashes on the left edge (Course 101 style), 20px wide, `--text-dim`; active one `--accent`. No labels.
- Background layer: each beat gets a full-bleed dim image or Lottie behind the text (opacity about 0.35-0.5, darkened), crossfading between beats; keep one subtle looping motion alive (slow zoom, drifting grain). Add a film-grain overlay (tiny PNG noise at 4-6% opacity), as in ch1.
- Scroll hint: bottom-center yellow "SCROLL" pill with a thin vertical line, as in ch2, fades out after first scroll.
- Target total run: 30-45s. Each beat about 6-9s of reading plus scroll.

## Fixed rules
- Disable text selection, tap highlight, pinch zoom, pull-to-refresh, rubber-band (`overscroll-behavior: none`, `user-select: none`, `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`).
- Touch targets 64px+.
- Self-host fonts and assets; no network at runtime.
- Use `svh`/`dvh` units, not `vh`, for iPad Safari toolbars.
- Respect safe areas (`env(safe-area-inset-*)`).

## Open items for Phase 3/4
- Decide scroll-snap vs GSAP-only snap after testing on iPad (see PLAN risks).
- Preview the chosen Lottie files on the dark background; recolor via CSS `filter` or Lottie color override if they assume a light background.
