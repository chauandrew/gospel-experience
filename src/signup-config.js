// Shared by the signup page and the admin page.
export const API = 'https://script.google.com/macros/s/AKfycbyuFB3sh-3NWMSlGzvpMYimUEdNJPsxWNdPPYSlZo18OJYs-aY7vS3AqEjKJdxwQC-A/exec'
export const CAP = 8
export const DAYS = { '2026-11-06': 'Fri Nov 6', '2026-11-07': 'Sat Nov 7' }

const pad = (n) => String(n).padStart(2, '0')
export const hhmm = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
export const clock = (m) => `${Math.floor(m / 60) % 12 || 12}:${pad(m % 60)}${m < 720 ? 'am' : 'pm'}`
