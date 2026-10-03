import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DIM = '#86868b'
const q = (sec, sel) => [...sec.querySelectorAll(sel)]

// Wrap each word of a headline in a span so words can stagger in.
function splitWords(p) {
  const words = p.textContent.split(' ')
  p.textContent = ''
  // Word gaps come from CSS margin (.w), not text nodes, so they can't collapse.
  return words.map((w) => {
    const span = document.createElement('span')
    span.className = 'w'
    span.textContent = w
    p.append(span)
    return span
  })
}

const ART = 0.9 // opacity of full-bleed artwork (it is also darkened in CSS)

// One paused timeline per beat. Plays when the beat snaps into view, resets once fully off screen.
// Returns the timeline and `unlockAt`: the moment all text has landed and scrolling may continue.
function buildTimeline(sec) {
  const eyebrow = sec.querySelector('.eyebrow')
  const heads = q(sec, '.headline').map(splitWords) // one word-array per headline = one stage each
  const words = heads.flat()
  const reveal = q(sec, '.reveal .word')
  const cta = sec.querySelector('.cta')
  const btn = sec.querySelector('.btn')
  const bg = sec.querySelector('.bg')
  const framesBox = sec.querySelector('.frames')
  const frames = q(sec, '.frames img')
  const glow = sec.querySelector('.glow')
  const hint = sec.querySelector('.hint')

  gsap.set([eyebrow, ...words, ...reveal, cta, btn].filter(Boolean), { opacity: 0, y: 24 })
  if (bg) gsap.set(bg, { opacity: 0, scale: 1 })
  if (glow) gsap.set(glow, { opacity: 0, scale: 0.3 })
  if (hint) gsap.set(hint, { opacity: 0 })
  gsap.set(frames, { opacity: 0 })

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
  let t = 0
  if (glow) {
    tl.to(glow, { opacity: 1, scale: 1.4, duration: 5.5, ease: 'sine.inOut' }, 0)
    t = 2.4 // let the light swell before the words land
  }
  if (bg) {
    tl.to(bg, { opacity: ART, duration: 1.5 }, 0)
    tl.to(bg, { scale: 1.1, duration: 14, ease: 'none' }, 0)
  }
  if (framesBox) {
    gsap.set(framesBox, { scale: 1 })
    tl.to(framesBox, { scale: 1.08, duration: 10, ease: 'none' }, 0)
  }
  if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, t)
  // Each headline is its own stage, with a pause before the next one lands.
  let cursor = t + 0.2
  const headStarts = []
  heads.forEach((ws, k) => {
    headStarts.push(cursor)
    tl.to(ws, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, cursor)
    cursor += 0.9 + 0.12 * ws.length + (k < heads.length - 1 ? 1 : 0)
  })
  let end = cursor

  // "Gossip. Betrayal. Loneliness." appear one at a time, each fading to dim as the next arrives.
  const revealStarts = []
  if (reveal.length) {
    end += 0.4
    reveal.forEach((w, i) => {
      const at = end + i * 1.1
      revealStarts.push(at)
      tl.to(w, { opacity: 1, y: 0, color: '#fff', duration: 0.7 }, at)
      if (i < reveal.length - 1) tl.to(w, { color: DIM, duration: 0.7 }, at + 1.1)
    })
    end += reveal.length * 1.1
  }

  // Artwork crossfades in step: with the reveal words if there are any (first image sits behind the
  // headline), otherwise with each headline stage.
  const starts = reveal.length ? [headStarts[0], ...revealStarts] : headStarts
  frames.forEach((f, i) => {
    const at = starts[i] ?? starts[starts.length - 1]
    tl.to(f, { opacity: ART, duration: 1.2 }, at)
    if (i > 0) tl.to(frames[i - 1], { opacity: 0, duration: 1.2 }, at)
  })
  let textEnd = end
  if (cta) {
    tl.to(cta, { opacity: 1, y: 0, duration: 1 }, end + 0.2)
    textEnd = end + 1.2
  }
  if (btn) {
    const at = end + (cta ? 1.2 : 0.2)
    tl.to(btn, { opacity: 1, y: 0, duration: 0.8 }, at)
    textEnd = at + 0.8
  }
  // Scrolling is released only once the SCROLL hint has fully appeared.
  const hintAt = textEnd + 0.3
  if (hint) tl.to(hint, { opacity: 1, duration: 0.6 }, hintAt)
  return { tl, unlockAt: hintAt + (hint ? 0.6 : 0) }
}

export function initFx(scroller, slides, onBeat = () => {}) {
  const beats = [...scroller.querySelectorAll('.beat')]
  const last = beats.length - 1
  const timelines = []
  const seen = new Set() // beats whose text has fully landed this run
  let settleTimer

  // While locked, all scrolling input is refused: wheel, touch drags and scroll keys are cancelled
  // immediately, and once the snap has settled the scroller also gets overflow hidden.
  let locked = false
  const stop = (e) => locked && e.cancelable && e.preventDefault()
  scroller.addEventListener('wheel', stop, { passive: false })
  scroller.addEventListener('touchmove', stop, { passive: false })
  addEventListener('keydown', (e) => {
    if (locked && [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home'].includes(e.key)) e.preventDefault()
  })
  const setLocked = (on) => {
    locked = on
    if (!on) scroller.style.overflowY = ''
  }
  const unlock = (i) => {
    seen.add(i)
    setLocked(false)
  }
  // Lock right away; add overflow hidden once the snap has settled, so we never freeze the scroller
  // between two beats while momentum is still carrying it.
  const lockWhenSettled = (i) => {
    clearInterval(settleTimer)
    if (i === last || seen.has(i)) return setLocked(false)
    setLocked(true)
    settleTimer = setInterval(() => {
      if (seen.has(i)) return clearInterval(settleTimer)
      if (Math.abs(scroller.scrollTop - beats[i].offsetTop) < 2) {
        scroller.style.overflowY = 'hidden'
        clearInterval(settleTimer)
      }
    }, 60)
  }
  const enter = (i) => {
    if (seen.has(i)) timelines[i].progress(1) // already read: show it complete, no replay
    else timelines[i].restart()
    lockWhenSettled(i)
    onBeat(i)
  }

  beats.forEach((sec, i) => {
    const { tl, unlockAt } = buildTimeline(sec)
    tl.call(() => unlock(i), null, unlockAt)
    timelines.push(tl)
    ScrollTrigger.create({
      scroller,
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => enter(i),
      onEnterBack: () => enter(i),
    })
    // Reset only when the beat is completely off screen so text never pops mid-transition.
    ScrollTrigger.create({
      scroller,
      trigger: sec,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => tl.pause(0),
      onLeaveBack: () => tl.pause(0),
    })
  })

  const clear = () => {
    clearInterval(settleTimer)
    seen.clear()
    setLocked(false)
    timelines.forEach((tl) => tl.pause(0))
  }

  return {
    // Call after the scroller is shown (it is hidden at init, so measurements need a refresh).
    start() {
      clear()
      ScrollTrigger.refresh()
      enter(0)
    },
    reset: clear,
    // Dev/QA: jump beat i's timeline to time t (seconds) without needing rAF.
    seek(i, t) {
      timelines[i].pause().time(t, false) // false: still fire the unlock callback
    },
    durations: () => timelines.map((tl) => tl.duration()),
    isLocked: () => locked,
  }
}
