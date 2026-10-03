# Style

Direction: dark, high contrast, large typography, generous whitespace, cinematic and introspective. A quiet contrast to a loud party. Tone: 1-2 short lines per beat, no em-dashes.

## What the references do (observed Phase 2)

**Course 101 ch1** (course101.online/chapter-1/en, 1180px viewport)
- Background is a warm taupe (~#9b9285), not dark. We keep its structure, not its palette.
- Entry: full-screen title card (outlined "CHAPTER 1" small caps over a huge yellow Poppins 700 title, `#f8c81e`, 72px) with one white START button. Same idea as our gate.
- Then a pinned stage: a single uppercase, wide letter-spaced Poppins line ("WE ASK SO MANY QUESTIONS EVERY DAY.") stays on screen while scroll triggers staggered reveals under it (chat bubbles slide/fade in one by one, about 1 per 5 wheel ticks). After the last reveal a white CONTINUE pill appears to advance to the next stage.
- So it is hybrid: scroll drives reveals inside a scene, a button (or scrolling on) ends the scene. Page height ~5800px (7 vh) for the whole first chapter intro. White body text is Roboto 22px/32px.
- Chrome: tiny "C101" wordmark top-left, hamburger top-right, soft dark gradient strip at top. We omit all chrome except the progress indicator.

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
| Headline font | Poppins 700, uppercase, `letter-spacing: 0.12em`, `clamp(32px, 5.5vw, 72px)` |
| Body font | Roboto 400, `clamp(20px, 2.4vw, 28px)`, `line-height: 1.45` |
| Eyebrow | Poppins 500, uppercase, `letter-spacing: 0.3em`, 14-16px, `--text-dim` |
| Button | white pill, black Roboto 700 uppercase 18px, min height 64px, min width 200px, radius 999px |
| Max text width | 18ch-24ch per line group, centered, so lines stay short on iPad portrait and landscape |

Fonts: self-host via npm `@fontsource/poppins` (700, 500) and `@fontsource/roboto` (400, 700), Latin subset only. No Google Fonts at runtime.

## Motion spec
- One idea per screen. Each beat is a full-viewport stage (`100svh`), `scroll-snap-align: center`, `scroll-snap-stop: always`.
- Text reveals are scroll-scrubbed (GSAP ScrollTrigger `scrub: 0.6`): opacity `--text-dim` to `--text` plus `y: 24px` to `0`, line by line (stagger).
- Easing: `power2.out` for entrances; `none` for scrubbed values. Time-based fades 600-900ms. Glow swell (Slide 3) 1.5-2.5s ease-in-out.
- Slide 2: words "Pain." "Brokenness." "Silence." fade in one at a time, each dimming slightly as the next arrives; picture-frame SVG steps normal, slightly damaged, heavy damaged across the same scroll range.
- Scroll hint: small animated chevron or Lottie click-circle at bottom of the gate-after screen, fades out after first scroll.
- Progress: 5 tiny dots, bottom center, 6px, `--text-dim` with the active one `--text`. No labels.
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
