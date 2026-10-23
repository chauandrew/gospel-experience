import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-700.css'
import './signup.css'
import { API, CAP, DAYS, clock } from './signup-config.js'

const $ = (id) => document.getElementById(id)
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const slotMins = (k) => +k.slice(11, 13) * 60 + +k.slice(14, 16)

let pass = ''
let lastRows = []
try { pass = sessionStorage.getItem('gx-admin') || '' } catch {}

function render(rows) {
  const by = {}
  lastRows = rows
  rows.forEach((r, i) => ((r.i = i), (by[r.slot] ||= []).push(r)))
  const people = rows.reduce((a, r) => a + r.size, 0)
  $('summary').textContent = `${people} people in ${rows.length} groups across ${Object.keys(by).length} slots.`
  const dates = [...new Set(Object.keys(by).map((k) => k.slice(0, 10)))].sort()
  $('days').innerHTML = dates.length
    ? dates
        .map(
          (d) => `<h2 class="day-h">${esc(DAYS[d] || d)}</h2>${Object.keys(by)
            .filter((k) => k.startsWith(d))
            .sort()
            .map((k) => `<div class="win-h"><span>${clock(slotMins(k))}</span><span>${by[k].reduce((a, r) => a + r.size, 0)} of ${CAP}</span></div>
              <ul class="people">${by[k].map((r) => `<li><span>${esc(r.name)}</span><span class="grp">${r.size}</span><button type="button" class="del" data-i="${r.i}" aria-label="Remove ${esc(r.name)}">Remove</button></li>`).join('')}</ul>`)
            .join('')}`,
        )
        .join('')
    : '<p class="status">No signups yet.</p>'
}

async function load() {
  $('msg').textContent = ''
  try {
    const r = await (await fetch(API, { method: 'POST', body: JSON.stringify({ action: 'list', pass }) })).json()
    if (!r.ok) throw new Error(r.error)
    try { sessionStorage.setItem('gx-admin', pass) } catch {}
    render(r.rows)
    $('login').hidden = true
    $('out').hidden = false
  } catch (e) {
    $('msg').textContent = e.message === 'Wrong passcode' ? e.message : 'Could not load signups. Check your connection and try again.'
    $('login').hidden = false
    $('out').hidden = true
  }
}

$('login').addEventListener('submit', (e) => {
  e.preventDefault()
  pass = $('pass').value
  load()
})
$('refresh').onclick = load
// two taps to delete: the first arms the button, the second (within 4s) removes the signup
$('days').addEventListener('click', async (e) => {
  const b = e.target.closest('.del')
  if (!b) return
  if (!b.classList.contains('arm')) {
    b.classList.add('arm')
    b.textContent = 'Tap to confirm'
    b.timer = setTimeout(() => { b.classList.remove('arm'); b.textContent = 'Remove' }, 4000)
    return
  }
  const r = lastRows[b.dataset.i]
  clearTimeout(b.timer)
  b.disabled = true
  b.innerHTML = '<span class="spin" aria-hidden="true"></span>Removing...'
  try {
    const j = await (await fetch(API, { method: 'POST', body: JSON.stringify({ action: 'delete', pass, row: r.row, slot: r.slot, name: r.name, size: r.size }) })).json()
    if (!j.ok) throw new Error(j.error)
    await load()
  } catch (err) {
    b.disabled = false
    b.textContent = err.message === 'Failed to fetch' ? 'Could not reach the sheet' : err.message
  }
})
if (pass) load()
