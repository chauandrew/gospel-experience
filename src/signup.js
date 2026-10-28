import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import './signup.css'
import { createIdle } from './idle.js'
import { API, CAP, DAYS, hhmm, clock, pacificNow } from './signup-config.js'

// Same windows as docs/signup-script.gs (the server enforces them). Change both together.
const WINDOWS = [
  ['2026-11-06', '18:30', '19:10'],
  ['2026-11-06', '20:30', '22:00'],
  ['2026-11-07', '09:00', '10:00'],
  ['2026-11-07', '14:20', '16:00'],
  ['2026-11-07', '18:00', '20:00'],
]

const mins = (t) => +t.slice(0, 2) * 60 + +t.slice(3)

const windows = WINDOWS.map(([date, s, e]) => {
  const slots = []
  for (let m = mins(s); m < mins(e); m += 10) slots.push({ date, m, key: `${date} ${hhmm(m)}`, end: `${date} ${hhmm(m + 10)}` })
  return { date, s: mins(s), e: mins(e), slots }
})
const slotByKey = Object.fromEntries(windows.flatMap((w) => w.slots).map((s) => [s.key, s]))

const $ = (id) => document.getElementById(id)
let taken = null // { slotKey: peopleSignedUp }, null until the first load
const left = (s) => CAP - (taken[s.key] || 0)

function render() {
  if (!taken) return
  const now = pacificNow()
  // one-tap default for people who do not want to pick: the soonest slot that has not started and has room
  const nx = Object.values(slotByKey).find((s) => s.key > now && left(s) > 0)
  $('next').hidden = !nx
  if (nx) {
    $('next').dataset.key = nx.key
    $('next').innerHTML = `<span class="next-k">Next available</span><span class="next-t">${nx.date === now.slice(0, 10) ? '' : `${DAYS[nx.date]}, `}${clock(nx.m).replace(':00', '')}</span><span class="next-n">${left(nx)} ${left(nx) === 1 ? 'spot' : 'spots'} left</span>`
  }
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
    : '<p class="status">All times have passed.</p>'
}

function setTaken(t) {
  taken = t
  render()
  if ($('dlg').open) sync()
}

let gen = 0 // bumped when a signup reply brings fresh counts, so an older in-flight load cannot overwrite them
let busy = false
async function load() {
  const g = gen
  try {
    const j = await (await fetch(API)).json()
    if (!j.taken) throw new Error('bad reply')
    if (g === gen) setTaken(j.taken)
  } catch {
    if (!taken) $('list').innerHTML = '<p class="status">Could not load times. Check your connection. <button id="retry">Try again</button></p>'
    else {
      $('list').querySelector('.stale')?.remove()
      $('list').insertAdjacentHTML('afterbegin', '<p class="status stale">Could not refresh. Counts may be out of date.</p>')
    }
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
  $('ok').disabled = busy || l < 1
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
  idle?.start() // back to the full 60s after a confirmation shortened it
  sync()
  $('dlg').showModal()
}

$('next').addEventListener('click', () => open(slotByKey[$('next').dataset.key]))
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
    // text/plain keeps this a simple request, so the browser skips a CORS preflight
    const r = await (await fetch(API, { method: 'POST', body: JSON.stringify({ slot: cur.key, name, size }), signal: AbortSignal.timeout?.(20000) })).json()
    if (r.ok) {
      $('doneInfo').textContent = `${DAYS[cur.date]}, ${clock(cur.m)}. Group of ${size}, under ${name}.`
      $('form').hidden = true
      $('done').hidden = false
    } else {
      $('msg').textContent = r.error
    }
    if (r.taken && typeof r.taken === 'object') {
      gen++ // fresh counts came back with the reply
      setTaken(r.taken)
    } else await load()
  } catch {
    $('msg').textContent = 'Could not save. Check your connection and try again.'
  }
  busy = false
  if (idle) {
    idle.start()
    if (!$('done').hidden) idle.setSecs(15) // the next visitor should not find this confirmation
  }
  $('ok').textContent = 'Save my spot'
  $('ok').removeAttribute('aria-busy')
  if ($('form').hidden === false) sync()
})

load()
setInterval(() => document.hidden || load(), 60000)
document.addEventListener('visibilitychange', () => document.hidden || load())
