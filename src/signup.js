import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import './signup.css'
import { createIdle } from './idle.js'
import { rpc, CAP, SLOT, SHOW, DAYS, hhmm, clock, pacificNow } from './signup-config.js'

// Same slots as docs/signup.sql (the server enforces them). Change both together.
// [date, start, end, heading?, firstSlot?, lastSlot?]. Slots are clock quarter-hours; by default the last starts SHOW minutes
// before the end. Sat 2:15 to 4:30 is one run of quarter-hour slots (2:15 to 4:15) split under three headings; the SQL has it as one window.
const WINDOWS = [
  ['2026-11-06', '18:30', '19:10'],
  ['2026-11-06', '20:30', '22:00'],
  ['2026-11-07', '09:00', '10:00', 'Breakfast'],
  ['2026-11-07', '12:00', '13:00', 'Lunch'],
  ['2026-11-07', '14:15', '15:00', 'Middle School workshops', '14:15', '15:00'],
  ['2026-11-07', '15:15', '16:00', 'High School workshops', '15:15', '16:00'],
  ['2026-11-07', '16:00', '16:30', 'Passing period', '16:15', '16:15'],
  ['2026-11-07', '18:00', '20:00', 'Night market'],
]

const mins = (t) => +t.slice(0, 2) * 60 + +t.slice(3)

const windows = WINDOWS.map(([date, s, e, label, first = s, last]) => {
  const slots = []
  for (let m = Math.ceil(mins(first) / SLOT) * SLOT; m <= (last ? mins(last) : mins(e) - SHOW); m += SLOT) slots.push({ date, m, key: `${date} ${hhmm(m)}` })
  return { date, s: mins(s), e: mins(e), label, slots }
})
const slotByKey = Object.fromEntries(windows.flatMap((w) => w.slots).map((s) => [s.key, s]))

const $ = (id) => document.getElementById(id)
let taken = null // { slotKey: peopleSignedUp }, null until the first load
let waiting = {} // { slotKey: groupsOnTheWaitlist }
let stale = false // the last refresh failed, so counts may be old
const left = (s) => Math.max(0, CAP - (taken[s.key] || 0)) // promotions can take a slot past 8
const wait = (s) => waiting[s.key] || 0

function render() {
  if (!taken) return
  const now = pacificNow()
  const days = Object.keys(DAYS).map((date) => {
    const wins = windows
      .filter((w) => w.date === date)
      .map((w) => ({ ...w, open: w.slots.filter((s) => s.key > now) })) // slots that have started are hidden
      .filter((w) => w.open.length)
    if (!wins.length) return ''
    return `<section><h2 class="day-h">${DAYS[date]}</h2>${wins
      .map(
        (w) => `<div class="win-h"><span>${w.label ? `<b class="lbl">${w.label}</b> ` : ''}${clock(w.s)} to ${clock(w.e)}</span><span>${w.open.reduce((a, s) => a + left(s), 0)} spots open</span></div>
        <div class="rows">${w.open
          .map((s) => {
            const n = left(s)
            return `<button class="slot" data-key="${s.key}" aria-label="${DAYS[date]} ${clock(s.m)}, ${n ? `${n} spots left` : `full, ${wait(s)} on the waitlist`}"><span class="t">${clock(s.m)}</span><span class="n${n && n <= 3 ? ' few' : ''}">${n ? `${n} left` : `Full${wait(s) ? `, ${wait(s)} waiting` : ''}`}</span></button>`
          })
          .join('')}</div>`,
      )
      .join('')}</section>`
  })
  $('list').innerHTML =
    (stale ? '<p class="status stale">Could not refresh. Counts may be out of date.</p>' : '') +
    (days.join('') ? `<div class="cols">${days.join('')}</div>` : '<p class="status">All times have passed.</p>')
}

function setTaken(t, w) {
  taken = t
  stale = false
  waiting = w || {}
  render()
  if ($('dlg').open) sync()
}

let gen = 0 // bumped when a signup reply brings fresh counts, so an older in-flight load cannot overwrite them
let busy = false
async function load() {
  const g = gen
  try {
    const j = await rpc('gxp_taken')
    if (!j.taken) throw new Error('bad reply')
    if (g === gen) setTaken(j.taken, j.waiting)
  } catch {
    if (!taken) $('list').innerHTML = '<p class="status">Could not load times. Check your connection. <button id="retry">Try again</button></p>'
    else {
      stale = true
      render()
    }
  }
}

// text size: scales the page behind the dialog, back to normal on reload (idle redirect)
const ZOOMS = [0.7, 0.85, 1, 1.25, 1.5] // default is index 1
let zi = 1
function zoom(d) {
  zi = Math.max(0, Math.min(ZOOMS.length - 1, zi + d))
  $('signup').style.setProperty('--z', ZOOMS[zi])
  $('signup').classList.toggle('one-col', ZOOMS[zi] > 1.2) // two columns would be cramped
  $('zout').disabled = zi === 0
  $('zin').disabled = zi === ZOOMS.length - 1
}
$('zout').onclick = () => zoom(-1)
$('zin').onclick = () => zoom(1)
zoom(0)

// signup dialog
let cur = null
let size = 1
const full = () => left(cur) < 1 // a full slot takes the waitlist instead
const setSize = (n) => {
  size = Math.max(1, Math.min(full() ? CAP : left(cur), n))
  $('sizeOut').textContent = size
}
// keep the stepper and button in line with the latest counts
function sync() {
  const l = left(cur)
  $('dSub').textContent = l
    ? `${l} of ${CAP} spots left in this slot.`
    : `This time is full. Join the waitlist (${wait(cur)} ${wait(cur) === 1 ? 'group' : 'groups'} waiting) and we will add you if a spot opens.`
  $('cap').textContent = l ? `max ${l}` : ''
  if (!busy) $('ok').textContent = l ? 'Save my spot' : 'Join waitlist'
  $('ok').disabled = busy
  setSize(size)
}
function open(s) {
  cur = s
  $('form').hidden = false
  $('done').hidden = true
  $('dTitle').textContent = `${DAYS[s.date]}, ${clock(s.m)}`
  $('name').value = ''
  $('msg').textContent = ''
  size = 1
  idle?.start() // back to the full 60s after a confirmation shortened it
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
$('cancel').onclick = () => $('dlg').close()

// On a booth iPad the trailer links here as /signup/?kiosk=<trailer>. Idle or Done sends the visitor back to that trailer.
const TRAILERS = { king: '/king/', mudpies: '/mudpies/', story: '/story/' }
const k = new URLSearchParams(location.search).get('kiosk')
const home = Object.hasOwn(TRAILERS, k) ? TRAILERS[k] : undefined // own keys only, so ?kiosk=constructor is ignored
let idle
if (home) {
  $('back').href = home
  $('back').hidden = false
  idle = createIdle(() => location.replace(home), 60)
  idle.start()
}
$('close').onclick = () => (home ? location.replace(home) : $('dlg').close())

$('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = $('name').value.trim()
  if (!name) {
    $('msg').textContent = 'Please enter your name.'
    return $('name').focus()
  }
  busy = true
  idle?.stop() // no idle redirect while the request is in flight
  $('ok').disabled = true
  $('ok').innerHTML = '<span class="spin" aria-hidden="true"></span>Saving...'
  $('ok').setAttribute('aria-busy', 'true')
  $('msg').textContent = ''
  try {
    const r = await rpc('gxp_signup', { p_slot: cur.key, p_name: name, p_size: size, p_waitlist: full() })
    if (r.ok) {
      $('doneH').textContent = r.waitlisted ? "You're on the waitlist" : "You're in"
      $('doneInfo').textContent = `${DAYS[cur.date]}, ${clock(cur.m)}. Group of ${size}, under ${name}.${r.waitlisted ? ` Number ${r.position} in line. Check back at the booth.` : ''}`
      $('form').hidden = true
      $('done').hidden = false
    } else {
      $('msg').textContent = r.error
    }
    if (r.taken && typeof r.taken === 'object') {
      gen++ // fresh counts came back with the reply
      setTaken(r.taken, r.waiting)
    } else await load()
  } catch {
    $('msg').textContent = 'Could not save. Check your connection and try again.'
  }
  busy = false
  if (idle) {
    idle.start()
    if (!$('done').hidden) idle.setSecs(15) // the next visitor should not find this confirmation
  }
  $('ok').removeAttribute('aria-busy')
  if ($('form').hidden === false) sync()
})

// big Pacific clock; also redraws the list each minute so started slots drop off on time
let shown = ''
function tick() {
  const now = pacificNow()
  if (now === shown) return
  shown = now
  $('clock').textContent = clock(+now.slice(11, 13) * 60 + +now.slice(14, 16))
  render()
}
tick()
setInterval(tick, 5000)

load()
setInterval(() => document.hidden || load(), 60000)
document.addEventListener('visibilitychange', () => document.hidden || load())
