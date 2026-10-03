import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/trirong/latin-400-italic.css'
import './style.css'
import { gate, slides } from './slides.js'
import { renderGate, renderSections } from './sections.js'
import { initFx } from './fx.js'

const $ = (id) => document.getElementById(id)
const gateEl = $('gate')
const scroller = $('scroller')
const progress = $('progress')

function begin() {
  gateEl.hidden = true
  scroller.hidden = false
  progress.hidden = false
  scroller.scrollTop = 0
  fx.start()
}

function reset() {
  scroller.hidden = true
  progress.hidden = true
  gateEl.hidden = false
  fx.reset()
}

renderGate(gateEl, gate, begin)
renderSections(scroller, progress, slides, reset)
const fx = initFx(scroller, slides)

if (import.meta.env.DEV) window.__fx = fx

// Block pinch zoom on iOS Safari.
document.addEventListener('gesturestart', (e) => e.preventDefault())
