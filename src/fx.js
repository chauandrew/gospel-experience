import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DIM = '#86868b'
const q = (sec, sel) => [...sec.querySelectorAll(sel)]

// Wrap each word of a headline in a span so words can stagger in. Text between underscores
// (_like this_, may span several words) is a quote and gets the .quote class (italic).
function splitWords(p) {
  const words = p.textContent.split(' ')
  p.textContent = ''
  let quote = false
  // Word gaps come from CSS margin (.w), not text nodes, so they can't collapse.
  return words.map((w) => {
    if (w.startsWith('_')) quote = true
    const span = document.createElement('span')
    span.className = quote ? 'w quote' : 'w'
    span.textContent = w.replace(/^_|_$/g, '')
    p.append(span)
    if (w.endsWith('_')) quote = false
    return span
  })
}

const ART = 0.9 // opacity of full-bleed artwork (it is also darkened in CSS)
const REVEAL_LEAD = 1.3 // pause between the headline landing and the first revealed word
const REVEAL_GAP = 1.6 // seconds between revealed words (Comparison. Isolation. Betrayal.)
const OLD = 0.45 // opacity a line sinks to once the next one lands, so the eye follows the newest text
const ART_FADE = 0.9 // artwork crossfade (same as a word landing)
const HOLD = 2.5 // default timeline seconds a beat waits after its text lands before gliding on (slide `auto` overrides)
const SPEED = 2.0 // playback rate of every beat timeline; raise it to tighten the whole run (1 = original pace)

// One paused timeline per beat. Plays when the beat snaps into view, resets once fully off screen.
// Returns the timeline and `advanceAt`: the moment all text has landed and held, when the run glides on.
function buildTimeline(sec, slide) {
  const eyebrow = sec.querySelector('.eyebrow')
  const heads = q(sec, '.headline').map(splitWords) // one word-array per headline = one stage each
  const words = heads.flat()
  const reveal = q(sec, '.reveal .word')
  const cta = sec.querySelector('.cta')
  const btn = sec.querySelector('.btn')
  const bg = sec.querySelector('.bg')
  const framesBox = sec.querySelector('.frames')
  const frames = q(sec, '.frames img')

  gsap.set([eyebrow, ...words, ...reveal, cta, btn].filter(Boolean), { opacity: 0, y: 24 })
  if (bg) gsap.set(bg, { opacity: 0, scale: 1 })
  gsap.set(frames, { opacity: 0 })

  const tl = gsap.timeline({ paused: true, timeScale: SPEED * (slide.speed ?? 1), defaults: { ease: 'power2.out' } })
  const t = slide.lead ?? 0 // timeline seconds the art gets before the text starts
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
    if (k > 0) tl.to(heads[k - 1], { opacity: OLD, duration: 0.9 }, cursor)
    tl.to(ws, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, cursor)
    cursor += 0.9 + 0.12 * ws.length + (k < heads.length - 1 ? 1 : 0)
  })
  let end = cursor

  // "Gossip. Betrayal. Loneliness." appear one at a time, each fading to dim as the next arrives.
  const revealStarts = []
  if (reveal.length) {
    end += REVEAL_LEAD
    tl.to(heads[heads.length - 1], { opacity: OLD, duration: 0.7 }, end) // the question steps back as the words arrive
    reveal.forEach((w, i) => {
      const at = end + i * REVEAL_GAP
      revealStarts.push(at)
      tl.to(w, { opacity: 1, y: 0, color: '#fff', duration: 0.7 }, at)
      if (i < reveal.length - 1) tl.to(w, { color: DIM, duration: 0.7 }, at + REVEAL_GAP)
    })
    end += reveal.length * REVEAL_GAP
  }

  // Artwork crossfades in step: one image per headline stage, then one per reveal word. A bg is already the first image, so frames then
  // begin with the second headline.
  const starts = [...(bg ? headStarts.slice(1) : headStarts), ...revealStarts]
  frames.forEach((f, i) => {
    const at = i === 0 && !bg ? 0 : starts[i] ?? starts[starts.length - 1] // first image never waits for the text
    tl.to(f, { opacity: ART, duration: ART_FADE }, at)
    if (i > 0) tl.to(frames[i - 1], { opacity: 0, duration: ART_FADE }, at)
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
  return { tl, advanceAt: textEnd + (slide.auto ?? HOLD) }
}

export function initFx(scroller, slides, onBeat = () => {}) {
  const beats = [...scroller.querySelectorAll('.beat')]
  const last = beats.length - 1
  const timelines = []

  // There is no manual scrolling: the scroller is overflow hidden (CSS) and every beat but the last
  // glides (flips) to the next one by itself; programmatic scrolling works on overflow hidden.
  const advance = (i) => scroller.scrollTo({ top: beats[i + 1].offsetTop, behavior: 'smooth' })
  const enter = (i) => {
    timelines[i].restart()
    onBeat(i)
  }

  beats.forEach((sec, i) => {
    const { tl, advanceAt } = buildTimeline(sec, slides[i])
    if (i < last) tl.call(() => advance(i), null, advanceAt)
    timelines.push(tl)
    ScrollTrigger.create({
      scroller,
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => enter(i),
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
      timelines[i].pause().time(t, false) // false: still fire the advance callback
    },
    durations: () => timelines.map((tl) => tl.duration()),
  }
}
