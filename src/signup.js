import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import './signup.css'
import { API, CAP, DAYS, hhmm, clock } from './signup-config.js'

const TZ = 'America/Los_Angeles'
// Same windows as docs/signup-script.gs (the server enforces them). Change both together.
const WINDOWS = [
  ['2026-11-06', '18:00', '19:30'],
  ['2026-11-06', '20:30', '21:30'],
  ['2026-11-07', '09:00', '10:00'],
  ['2026-11-07', '15:00', '17:00'],
  ['2026-11-07', '19:00', '21:00'],
]

const mins = (t) => +t.slice(0, 2) * 60 + +t.slice(3)

const windows = WINDOWS.map(([date, s, e]) => {
  const slots = []
  for (let m = mins(s); m < mins(e); m += 10) slots.push({ date, m, key: `${date} ${hhmm(m)}`, end: `${date} ${hhmm(m + 10)}` })
  return { date, s: mins(s), e: mins(e), slots }
})
const slotByKey = Object.fromEntries(windows.flatMap((w) => w.slots).map((s) => [s.key, s]))

// "2026-11-06 18:05" in Pacific time, comparable with slot keys as plain strings
const pacificNow = () => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value]),
  )
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`
}

const $ = (id) => document.getElementById(id)
let taken = null // { slotKey: peopleSignedUp }, null until the first load
const left = (s) => CAP - (taken[s.key] || 0)

function render() {
  if (!taken) return
  const now = pacificNow()
  const days = Object.keys(DAYS).map((date) => {
    const wins = windows
      .filter((w) => w.date === date)
      .map((w) => ({ ...w, open: w.slots.filter((s) => s.end > now) })) // past slots are hidden
      .filter((w) => w.open.length)
    if (!wins.length) return ''
    return `<section><h2 class="day-h">${DAYS[date]}</h2>${wins
      .map(
        (w) => `<div class="win-h"><span>${clock(w.s)} to ${clock(w.e)}</span><span>${w.open.reduce((a, s) => a + left(s), 0)} spots open</span></div>
        <div class="rows">${w.open
          .map((s) => {
            const n = left(s)
            return `<button class="slot" data-key="${s.key}" ${n ? '' : 'disabled'} aria-label="${DAYS[date]} ${clock(s.m)}, ${n ? `${n} spots left` : 'full'}"><span class="t">${clock(s.m)}</span><span class="n${n && n <= 3 ? ' few' : ''}">${n ? `${n} left` : 'Full'}</span></button>`
          })
          .join('')}</div>`,
      )
      .join('')}</section>`
  })
  $('list').innerHTML = days.join('')
    ? `<div class="cols">${days.join('')}</div>`
    : '<p class="status">All sign-up times have passed.</p>'
}

function setTaken(t) {
  taken = t
  render()
  if ($('dlg').open) sync()
}

async function load() {
  try {
    const j = await (await fetch(API)).json()
    if (!j.taken) throw new Error('bad reply')
    setTaken(j.taken)
  } catch {
    if (!taken) $('list').innerHTML = '<p class="status">Could not load times. Check your connection. <button id="retry">Try again</button></p>'
    else $('list').insertAdjacentHTML('afterbegin', '<p class="status">Could not refresh. Counts may be out of date.</p>')
  }
}

// signup dialog
let cur = null
let size = 1
const setSize = (n) => {
  size = Math.max(1, Math.min(left(cur), n))
  $('sizeOut').textContent = size
}
// keep the stepper and button in line with the latest counts
function sync() {
  const l = left(cur)
  $('cap').textContent = l ? `max ${l}` : 'full'
  $('ok').disabled = l < 1
  setSize(size)
}
function open(s) {
  cur = s
  $('form').hidden = false
  $('done').hidden = true
  $('dTitle').textContent = `${DAYS[s.date]}, ${clock(s.m)}`
  $('dSub').textContent = `${left(s)} of ${CAP} spots left in this slot.`
  $('name').value = ''
  $('msg').textContent = ''
  size = 1
  sync()
  $('dlg').showModal()
}

$('list').addEventListener('click', (e) => {
  if (e.target.closest('#retry')) return load()
  const b = e.target.closest('.slot')
  if (b && !b.disabled) open(slotByKey[b.dataset.key])
})
$('plus').onclick = () => setSize(size + 1)
$('minus').onclick = () => setSize(size - 1)
$('cancel').onclick = $('close').onclick = () => $('dlg').close()

$('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = $('name').value.trim()
  if (!name) {
    $('msg').textContent = 'Please enter your name.'
    return $('name').focus()
  }
  $('ok').disabled = true
  $('ok').textContent = 'Signing up...'
  $('msg').textContent = ''
  try {
    // text/plain keeps this a simple request, so the browser skips a CORS preflight
    const r = await (await fetch(API, { method: 'POST', body: JSON.stringify({ slot: cur.key, name, size }) })).json()
    if (r.ok) {
      $('doneInfo').textContent = `${DAYS[cur.date]}, ${clock(cur.m)}. Group of ${size}, under ${name}.`
      $('form').hidden = true
      $('done').hidden = false
    } else {
      $('msg').textContent = r.error
    }
    if (r.taken && typeof r.taken === 'object') setTaken(r.taken) // fresh counts came back with the reply
    else await load()
  } catch {
    $('msg').textContent = 'Could not reach the sign-up sheet. Check your connection and try again.'
  }
  $('ok').textContent = 'Sign up'
  if ($('form').hidden === false) sync()
})

load()
setInterval(() => document.hidden || load(), 60000)
document.addEventListener('visibilitychange', () => document.hidden || load())
