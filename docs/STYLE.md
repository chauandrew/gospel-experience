# Style (stub, filled in Phase 2)

Direction: dark mode, high contrast, large clean typography, generous whitespace, cinematic and introspective. A quiet contrast to a loud party. Reference: Course 101 ch1 (course101.online/chapter-1/en) and apple.com/os/macos for scroll pacing and motion.

## To define in Phase 2
- Colors (background, text, accent glow)
- Font family and type scale (from Course 101 CSS or a self-hosted alternative)
- Spacing and touch target minimum (64px+)
- Motion: easing, durations, pin lengths, scroll-snap behavior
- Copy tone: short, 1-2 lines per beat, no em-dashes

## Fixed rules
- Disable text selection, tap highlight, pinch zoom, pull-to-refresh, rubber-band (`overscroll-behavior: none`, `user-select: none`, `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`).
- Self-host fonts and assets. No network at runtime.
