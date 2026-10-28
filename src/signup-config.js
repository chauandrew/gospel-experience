// Shared by the signup page and the admin page. Server code is docs/signup.sql.
const RPC = 'https://ypakruerprnjptzwuhgd.supabase.co/rest/v1/rpc/'
const KEY = 'sb_publishable_HYLPapCIgwYOo28zJ6fkYQ_apjmCix_' // public by design; RLS blocks the tables, only the gxp_ functions in docs/signup.sql are callable
export const rpc = async (fn, args = {}, ms = 20000) => {
  const r = await fetch(RPC + fn, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(args), signal: AbortSignal.timeout?.(ms) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}
export const CAP = 8
const TZ = 'America/Los_Angeles'
export const DAYS = { '2026-11-06': 'Fri Nov 6', '2026-11-07': 'Sat Nov 7' }

const pad = (n) => String(n).padStart(2, '0')
export const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
export const clock = (m) => `${Math.floor(m / 60) % 12 || 12}:${pad(m % 60)}${m < 720 ? 'am' : 'pm'}`

// "2026-11-06 18:05" in Pacific time, comparable with slot keys as plain strings
export const pacificNow = () => {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value]),
  )
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`
}
