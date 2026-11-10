import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import './signup.css'
import { createIdle } from './idle.js'
import { rpc, slug, dayLabel, clock, pacificNow } from './signup-config.js'

const mins = (t) => +t.slice(0, 2) * 60 + +t.slice(3)

// the event and its windows come from the server (gxp_event in docs/signup.sql), which also enforces the slots
let ev
let windows = []
let slotByKey = {}
const setEvent = (e) => {
  ev = e
  windows = e.windows.map((w) => ({ date: w.date, s: mins(w.start), e: mins(w.end), label: w.label, slots: w.slots.map((t) => ({ date: w.date, m: mins(t), key: `${w.date} ${t}` })) }))
  slotByKey = Object.fromEntries(windows.flatMap((w) => w.slots).map((s) => [s.key, s]))
  document.title = `Pick a time | ${e.title}`
  $('event').textContent = e.title
}

const $ = (id) => document.getElementById(id)
let taken = null // { slotKey: peopleSignedUp }, null until the first load
let waiting = {} // { slotKey: peopleOnTheWaitlist }
let stale = false // the last refresh failed, so counts may be old
const left = (s) => Math.max(0, ev.cap - (taken[s.key] || 0)) // promotions can take a slot past the cap
const wait = (s) => waiting[s.key] || 0

function render() {
  if (!taken) return
  const now = pacificNow()
  const days = [...new Set(windows.map((w) => w.date))].map((date) => {
    const wins = windows
      .filter((w) => w.date === date)
      .map((w) => ({ ...w, open: w.slots.filter((s) => s.key > now) })) // slots that have started are hidden
      .filter((w) => w.open.length)
    if (!wins.length) return ''
    return `<section><h2 class="day-h">${dayLabel(date)}</h2>${wins
      .map(
        (w) => `<div class="win-h"><span>${w.label ? `<b class="lbl">${w.label}</b> ` : ''}${clock(w.s)} to ${clock(w.e)}</span><span>${w.open.reduce((a, s) => a + left(s), 0)} spots open</span></div>
        <div class="rows">${w.open
          .map((s) => {
            const n = left(s)
            return `<button class="slot" data-key="${s.key}" aria-label="${dayLabel(date)} ${clock(s.m)}, ${n ? `${n} spots left` : `full, ${wait(s)} people on the waitlist`}"><span class="t">${clock(s.m)}</span><span class="n${n && n <= 3 ? ' few' : ''}">${n ? `${n} left` : `Full${wait(s) ? `, ${wait(s)} waiting` : ''}`}</span></button>`
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
    const j = await rpc('gxp_taken', { p_event: slug })
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
const MAXG = 99 // sanity ceiling only; same number in docs/signup.sql
const setSize = (n) => {
  size = Math.max(1, Math.min(MAXG, n || 1))
  $('sizeOut').value = size
}
$('sizeOut').oninput = (e) => {
  const n = Number(e.target.value)
  if (Number.isInteger(n) && n >= 1) size = n // leave the field alone while typing; the submit checks it
}
// blank the field while it is being edited so typing 12 does not make 112 (select() is unreliable on iOS); restore if left empty
$('sizeOut').onfocus = (e) => {
  e.target.dataset.prev = e.target.value
  e.target.value = ''
}
$('sizeOut').onblur = (e) => {
  if (e.target.value === '') e.target.value = e.target.dataset.prev
}
// keep the stepper and button in line with the latest counts
function sync() {
  const l = left(cur)
  $('dSub').textContent = l
    ? `${l} of ${ev.cap} spots left in this slot.`
    : `This time is full. Join the waitlist (${wait(cur)} ${wait(cur) === 1 ? 'person' : 'people'} waiting) and we will add you if a spot opens.`
  if (!busy) $('ok').textContent = l ? 'Save my spot' : 'Join waitlist'
  $('ok').disabled = busy
}
function open(s) {
  cur = s
  $('form').hidden = false
  $('done').hidden = true
  $('dTitle').textContent = `${dayLabel(s.date)}, ${clock(s.m)}`
  $('name').value = ''
  $('msg').textContent = ''
  setSize(1)
  idle?.start() // back to the full 60s after a confirmation shortened it
  sync()
  $('dlg').showModal()
}

$('list').addEventListener('click', (e) => {
  if (e.target.closest('#retry')) return ev ? load() : start()
  const b = e.target.closest('.slot')
  if (b && !b.disabled) open(slotByKey[b.dataset.key])
})
$('plus').onclick = () => setSize(size + 1)
$('minus').onclick = () => setSize(size - 1)
$('cancel').onclick = () => $('dlg').close()

// ?kiosk on a shared booth iPad: back to a blank page after 60s idle (15s once a confirmation shows) so the next visitor starts fresh
let idle
if (new URLSearchParams(location.search).has('kiosk')) {
  idle = createIdle(() => location.reload(), 60)
  idle.start()
}
$('close').onclick = () => (idle ? location.reload() : $('dlg').close())

$('form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const name = $('name').value.trim()
  if (!name) {
    $('msg').textContent = 'Please enter your name.'
    return $('name').focus()
  }
  const n = Number($('sizeOut').value)
  if (!Number.isInteger(n) || n < 1 || n > MAXG) {
    $('msg').textContent = n > MAXG ? `The biggest group is ${MAXG}.` : 'Please enter how many people.'
    return $('sizeOut').focus()
  }
  size = n
  busy = true
  idle?.stop() // no idle redirect while the request is in flight
  $('ok').disabled = true
  $('ok').innerHTML = '<span class="spin" aria-hidden="true"></span>Saving...'
  $('ok').setAttribute('aria-busy', 'true')
  $('msg').textContent = ''
  try {
    const r = await rpc('gxp_signup', { p_event: slug, p_slot: cur.key, p_name: name, p_size: size, p_waitlist: full() })
    if (r.ok) {
      $('doneH').textContent = r.waitlisted ? "You're on the waitlist" : "You're in"
      $('doneInfo').textContent = `${dayLabel(cur.date)}, ${clock(cur.m)}. Group of ${size}, under ${name}.${r.waitlisted ? ` Number ${r.position} in line. Check back at the booth.` : ''}`
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
  if (ev) render()
}
tick()
setInterval(tick, 5000)

async function start() {
  if (!slug) return location.replace('/')
  try {
    const e = await rpc('gxp_event', { p_slug: slug })
    if (!e) return ($('list').innerHTML = '<p class="status">Event not found.</p>')
    setEvent(e)
  } catch {
    return ($('list').innerHTML = '<p class="status">Could not load times. Check your connection. <button id="retry">Try again</button></p>')
  }
  load()
  setInterval(() => document.hidden || load(), 60000)
  document.addEventListener('visibilitychange', () => document.hidden || load())
}
start()
