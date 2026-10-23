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
try { pass = sessionStorage.getItem('gx-admin') || '' } catch {}

function render(rows) {
  const by = {}
  rows.forEach((r) => (by[r.slot] ||= []).push(r))
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
              <ul class="people">${by[k].map((r) => `<li><span>${esc(r.name)}</span><span>${r.size}</span></li>`).join('')}</ul>`)
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
if (pass) load()
