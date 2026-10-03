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
let starting // timer for the short lead-in between the tap and the first beat

// iOS only plays audio started from a tap, so the music starts the moment Begin is tapped; the gate
// fades out over it, then the first beat starts.
function begin() {
  if (starting) return
  counted = false
  audio.start()
  audio.cue('ambient', 1.2)
  gateEl.classList.add('leaving')
  starting = setTimeout(() => {
    starting = undefined
    gateEl.hidden = true
    gateEl.classList.remove('leaving')
    scroller.hidden = false
    progress.hidden = false
    scroller.scrollTop = 0
    idle.start()
    fx.start()
  }, 1400)
}

function reset() {
  idle.stop()
  clearTimeout(starting)
  starting = undefined
  gateEl.classList.remove('leaving')
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
