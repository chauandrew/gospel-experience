// Shared by the signup page and the admin page.
export const API = 'https://script.google.com/macros/s/AKfycbyuFB3sh-3NWMSlGzvpMYimUEdNJPsxWNdPPYSlZo18OJYs-aY7vS3AqEjKJdxwQC-A/exec'
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
