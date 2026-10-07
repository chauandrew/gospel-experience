import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/poppins/latin-700-italic.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/trirong/latin-400-italic.css'
import './style.css'
import { inject } from '@vercel/analytics'
import { renderGate, renderSections, resetProgress } from './sections.js'
import { gsap } from 'gsap'
import { initFx } from './fx.js'
import { createAudio } from './audio.js'
import { createIdle } from './idle.js'
import { countCompletion } from './counter.js'

// Runs one trailer: gate -> self-advancing beats -> finale. The caller (src/trailers/*.js) supplies the copy and the music.
export function runTrailer({ gate, slides, tracks }) {
  // Vercel Web Analytics (page views). Needs to be switched on in the Vercel dashboard; it only reports while the iPad is online.
  inject()

  const $ = (id) => document.getElementById(id)
  const gateEl = $('gate')
  const scroller = $('scroller')
  const progress = $('progress')
  const muteBtn = $('mute')

  const paintMute = (m) => {
    muteBtn.setAttribute('aria-pressed', m)
    muteBtn.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound')
  }
  muteBtn.addEventListener('click', () => {
    const m = !audio.isMuted()
    audio.setMuted(m)
    paintMute(m)
    muteBtn.blur() // so a later Space press is not swallowed by the button
  })

  let counted = false
  let atFinale = false
  let starting // timer for the short lead-in between the tap and the first beat

  // iOS only plays audio started from a tap, so the music starts the moment Begin is tapped; the gate
  // fades out over it, then the first beat starts.
  function begin() {
    if (starting) return
    counted = false
    audio.start()
    paintMute(false)
    audio.cue('ambient', 1.2)
    gateEl.classList.add('leaving')
    starting = setTimeout(() => {
      starting = undefined
      gateEl.hidden = true
      gateEl.classList.remove('leaving')
      scroller.hidden = false
      progress.hidden = false
      muteBtn.hidden = false
      scroller.scrollTop = 0
      resetProgress(progress)
      idle.start()
      fx.start()
    }, 1400)
  }

  function reset() {
    atFinale = false
    idle.stop()
    clearTimeout(starting)
    starting = undefined
    gateEl.classList.remove('leaving')
    scroller.hidden = true
    scroller.scrollTop = 0
    progress.hidden = true
    muteBtn.hidden = true
    paintMute(false)
    gateEl.hidden = false
    resetProgress(progress)
    fx.reset()
    audio.stop()
  }

  renderGate(gateEl, gate, begin)
  renderSections(scroller, progress, slides, reset)
  const audio = createAudio(tracks)
  const idle = createIdle(reset)
  const fx = initFx(
    scroller,
    slides,
    (i) => {
      atFinale = i === slides.length - 1
      if (slides[i].hush) audio.hush()
      if (slides[i].musicAt == null) audio.cue(slides[i].music) // else fx cues it when that headline lands
      idle.setSecs(slides[i].idle)
      if (i === slides.length - 1 && !counted) {
        counted = true
        countCompletion()
      }
    },
    (i) => audio.cue(slides[i].music),
  )

  if (import.meta.env.DEV) Object.assign(window, { __fx: fx, __audio: audio, __idle: idle, __gsap: gsap })

  // Spacebar works only on the two end screens: Begin on the gate, Reset on the finale. Mid-run it does nothing.
  addEventListener('keydown', (e) => {
    if (e.code !== 'Space') return
    e.preventDefault()
    if (!gateEl.hidden) begin()
    else if (atFinale) reset()
  })

  // Block pinch zoom on iOS Safari.
  document.addEventListener('gesturestart', (e) => e.preventDefault())
}
