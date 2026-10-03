// Calls onIdle after `secs` with no touch or scroll. Only runs between start() and stop().
export function createIdle(onIdle, defaultSecs = 20) {
  let timer
  let secs = defaultSecs
  let active = false

  const arm = () => {
    clearTimeout(timer)
    if (active) timer = setTimeout(onIdle, secs * 1000)
  }
  // Capture phase so scroll events (which don't bubble) on the scroller are seen too.
  for (const ev of ['pointerdown', 'touchstart', 'touchmove', 'scroll'])
    addEventListener(ev, arm, { capture: true, passive: true })

  return {
    start() {
      active = true
      secs = defaultSecs
      arm()
    },
    stop() {
      active = false
      clearTimeout(timer)
    },
    // Per-beat timeout (null = default).
    setSecs(s) {
      secs = s ?? defaultSecs
      arm()
    },
  }
}
