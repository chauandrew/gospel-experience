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

// One paused timeline per beat. Plays when the beat snaps into view, resets once fully off screen.
function buildTimeline(sec, slide) {
  const eyebrow = sec.querySelector('.eyebrow')
  const words = q(sec, '.headline').flatMap(splitWords)
  const reveal = q(sec, '.reveal .word')
  const cta = sec.querySelector('.cta')
  const btn = sec.querySelector('.btn')
  const bg = sec.querySelector('.bg')
  const frames = q(sec, '.frames img')
  const glow = sec.querySelector('.glow')

  gsap.set([eyebrow, ...words, ...reveal, cta, btn].filter(Boolean), { opacity: 0, y: 24 })
  if (bg) gsap.set(bg, { opacity: 0, scale: 1 })
  if (glow) gsap.set(glow, { opacity: 0, scale: 0.3 })
  gsap.set(frames, { opacity: 0 })

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
  let t = 0
  if (glow) {
    tl.to(glow, { opacity: 1, scale: 1.4, duration: 2.8, ease: 'power2.inOut' }, 0)
    t = 0.9 // let the light swell before the words land
  }
  if (bg) {
    tl.to(bg, { opacity: 0.6, duration: 1.5 }, 0)
    tl.to(bg, { scale: 1.1, duration: 14, ease: 'none' }, 0)
  }
  if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.8 }, t)
  if (words.length) tl.to(words, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, t + 0.2)

  // end of headline words
  let end = t + 0.2 + 0.9 + 0.12 * words.length
  if (frames.length) tl.to(frames[0], { opacity: 0.35, duration: 1.2 }, t)

  // "Pain. Brokenness. Silence." appear one at a time, each fading to dim as the next arrives.
  if (reveal.length) {
    end += 0.4
    reveal.forEach((w, i) => {
      const at = end + i * 1.1
      tl.to(w, { opacity: 1, y: 0, color: '#fff', duration: 0.7 }, at)
      if (i < reveal.length - 1) tl.to(w, { color: DIM, duration: 0.7 }, at + 1.1)
      if (frames[i + 1]) {
        tl.to(frames[i + 1], { opacity: 0.35, duration: 1.1 }, at)
        tl.to(frames[i], { opacity: 0, duration: 1.1 }, at)
      }
    })
    end += reveal.length * 1.1
  }
  if (cta) tl.to(cta, { opacity: 1, y: 0, duration: 1 }, end + 0.2)
  if (btn) tl.to(btn, { opacity: 1, y: 0, duration: 0.8 }, end + (cta ? 1.2 : 0.2))
  return tl
}

export function initFx(scroller, slides) {
  const timelines = []
  scroller.querySelectorAll('.beat').forEach((sec, i) => {
    const tl = buildTimeline(sec, slides[i])
    timelines.push(tl)
    ScrollTrigger.create({
      scroller,
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => tl.restart(),
      onEnterBack: () => tl.restart(),
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

  return {
    // Call after the scroller is shown (it is hidden at init, so measurements need a refresh).
    start() {
      ScrollTrigger.refresh()
      timelines.forEach((tl) => tl.pause(0))
      timelines[0].restart()
    },
    reset() {
      timelines.forEach((tl) => tl.pause(0))
    },
    // Dev/QA: jump beat i's timeline to time t (seconds) without needing rAF.
    seek(i, t) {
      timelines[i].pause(t)
    },
    durations: () => timelines.map((tl) => tl.duration()),
  }
}
