import { rpc, pacificNow, esc } from './signup-config.js'

// Fills `el` with a link per event to `path?e=<slug>`. Events whose last slot has passed are skipped unless `all`.
export async function showEvents(el, path, all = false) {
  try {
    const now = pacificNow()
    const evs = (await rpc('gxp_event_list')).filter((e) => all || e.windows.some((w) => w.slots.some((s) => `${w.date} ${s}` > now)))
    el.innerHTML = evs.length
      ? evs.map((e) => `<a class="ev" href="${path}?e=${encodeURIComponent(e.slug)}">${esc(e.title)}</a>`).join('')
      : '<p class="status">No upcoming events.</p>'
  } catch {
    el.innerHTML = '<p class="status">Could not load events. Check your connection and reload.</p>'
  }
}
