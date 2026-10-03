// Anonymous, local-only count of how many people reached the finale. Read it from the iPad with
// Safari Web Inspector: localStorage.getItem('gx-completions').
const KEY = 'gx-completions'

export function countCompletion() {
  try {
    localStorage.setItem(KEY, String(Number(localStorage.getItem(KEY) || 0) + 1))
  } catch {
    // storage unavailable: counting is best-effort
  }
}
