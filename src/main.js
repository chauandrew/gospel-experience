import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/trirong/latin-400-italic.css'
import './style.css'
import { gate, slides, tracks } from './slides.js'
import { renderGate, renderSections } from './sections.js'
import { initFx } from './fx.js'
import { createAudio } from './audio.js'
import { createIdle } from './idle.js'
import { countCompletion } from './counter.js'

const $ = (id) => document.getElementById(id)
const gateEl = $('gate')
const scroller = $('scroller')
const progress = $('progress')

let counted = false

function begin() {
  counted = false
  idle.start()
  audio.start() // must run inside the tap: iOS only allows playback started from a user gesture
  gateEl.hidden = true
  scroller.hidden = false
  progress.hidden = false
  scroller.scrollTop = 0
  fx.start()
}

function reset() {
  idle.stop()
  scroller.hidden = true
  progress.hidden = true
  gateEl.hidden = false
  fx.reset()
  audio.stop()
}

renderGate(gateEl, gate, begin)
renderSections(scroller, progress, slides, reset)
const audio = createAudio(tracks)
const idle = createIdle(reset)
const fx = initFx(scroller, slides, (i) => {
  audio.cue(slides[i].music)
  idle.setSecs(slides[i].idle)
  if (i === slides.length - 1 && !counted) {
    counted = true
    countCompletion()
  }
})

if (import.meta.env.DEV) Object.assign(window, { __fx: fx, __audio: audio, __idle: idle })

// Block pinch zoom on iOS Safari.
document.addEventListener('gesturestart', (e) => e.preventDefault())
