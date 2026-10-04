const MASTER = 0.6 // fixed in-app level; real loudness is the iPad's hardware volume
const FADE = 2 // seconds, crossfade between tracks
const STOP_FADE = 1
const OPEN = 20000 // lowpass cutoff (Hz) when a track is heard normally
const MUFFLED = 400 // cutoff a track sinks to while it fades out, so a cue sounds like the world closing in

// All tracks are started inside the Begin tap (iOS blocks later play() calls) and kept running
// silent; cue() just crossfades their gains. Reuses the idea of Course 101's SoundController.
export function createAudio(files) {
  let ctx
  let master
  let tracks // { name: { el, gain } }
  let current
  let stopTimer
  let active = false
  let muted = false

  const ramp = (gain, to, secs) => {
    const t = ctx.currentTime
    gain.gain.cancelScheduledValues(t)
    gain.gain.setValueAtTime(gain.gain.value, t)
    gain.gain.linearRampToValueAtTime(to, t + secs)
  }

  const setCutoff = (lowpass, to, secs) => {
    const t = ctx.currentTime
    lowpass.frequency.cancelScheduledValues(t)
    lowpass.frequency.setValueAtTime(lowpass.frequency.value, t)
    if (secs) lowpass.frequency.exponentialRampToValueAtTime(to, t + secs)
    else lowpass.frequency.setValueAtTime(to, t)
  }

  function init() {
    const Ctx = window.AudioContext || window.webkitAudioContext
    ctx = new Ctx()
    master = ctx.createGain()
    master.gain.value = MASTER
    master.connect(ctx.destination)
    tracks = {}
    for (const [name, src] of Object.entries(files)) {
      const el = new Audio(src)
      el.loop = true
      el.preload = 'auto'
      const gain = ctx.createGain()
      gain.gain.value = 0
      const lowpass = ctx.createBiquadFilter()
      lowpass.type = 'lowpass'
      lowpass.frequency.value = OPEN
      ctx.createMediaElementSource(el).connect(lowpass).connect(gain).connect(master)
      tracks[name] = { el, gain, lowpass }
    }
  }

  // iOS can suspend the context (call, Siri, lock). Any later touch revives playback.
  function revive() {
    if (!active || !ctx) return
    if (ctx.state !== 'running') ctx.resume()
    for (const { el } of Object.values(tracks)) if (el.paused) el.play().catch(() => {})
  }
  addEventListener('pointerdown', revive, { capture: true, passive: true })
  document.addEventListener('visibilitychange', () => !document.hidden && revive())

  return {
    // Call synchronously from the user's tap.
    start() {
      clearTimeout(stopTimer)
      active = true
      muted = false
      if (!ctx) init()
      ctx.resume()
      current = undefined
      for (const { el, gain, lowpass } of Object.values(tracks)) {
        setCutoff(lowpass, OPEN)
        gain.gain.cancelScheduledValues(ctx.currentTime)
        gain.gain.value = 0
        el.currentTime = 0
        el.play().catch(() => {})
      }
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.value = MASTER
    },
    // Crossfade to a named track. No name = keep whatever is playing.
    cue(name, fade = FADE) {
      if (!ctx || !name || name === current || !tracks[name]) return
      const prev = current
      current = name
      if (prev !== undefined) tracks[name].el.currentTime = 0 // tracks run silent from Begin; start the incoming one from its beginning, not mid-song
      for (const [n, t] of Object.entries(tracks)) ramp(t.gain, n === name ? 1 : 0, fade)
      setCutoff(tracks[name].lowpass, OPEN)
      if (prev) setCutoff(tracks[prev].lowpass, MUFFLED, fade) // the track we leave muffles as it fades
    },
    // Fade every track to silence (the playing one muffles as it goes). The next cue starts its track from the beginning.
    hush(fade = 0.6) {
      if (!ctx || current === undefined) return
      if (current) setCutoff(tracks[current].lowpass, MUFFLED, fade)
      current = null
      for (const t of Object.values(tracks)) ramp(t.gain, 0, fade)
    },
    // Mute/unmute the master level (the hardware volume stays the iPad's).
    setMuted(m) {
      muted = m
      if (ctx && active) ramp(master, m ? 0 : MASTER, 0.25)
    },
    isMuted: () => muted,
    stop() {
      if (!ctx) return
      current = undefined
      active = false
      ramp(master, 0, STOP_FADE)
      stopTimer = setTimeout(() => {
        for (const { el } of Object.values(tracks)) el.pause()
      }, STOP_FADE * 1000)
    },
    // Dev/QA: context state, which tracks are playing, and gains.
    state: () => ({
      ctx: ctx && ctx.state,
      current,
      muted,
      master: master && +master.gain.value.toFixed(2),
      tracks: tracks && Object.fromEntries(Object.entries(tracks).map(([n, t]) => [n, { playing: !t.el.paused, time: +t.el.currentTime.toFixed(1), gain: +t.gain.gain.value.toFixed(2) }])),
    }),
  }
}
