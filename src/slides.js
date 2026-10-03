// All copy and per-beat config lives here. Edit freely; no logic elsewhere hardcodes wording.
// fx = scroll motion, music = key into `tracks` below, bg = dimmed backdrop image.
// Music files are Course 101 tracks (see docs/ASSETS.md).
export const tracks = {
  ambient: '/audio/Silent_Place.mp3',
  tense: '/audio/BGM_Downward_Spiral.mp3',
  swell: '/audio/BGM_Ending.mp3',
}

export const gate = {
  text: ['Put on your headphones.'],
  button: 'Begin',
}

export const slides = [
  {
    id: 'genesis',
    eyebrow: 'Genesis 1',
    text: ['In the beginning, God created everything… and it was good. Very good.'],
    fx: 'pinReveal',
    music: 'ambient',
    bg: '/img/genesis-garden.svg',
    dim: 0.75, // brighter: this is the "very good" beat
    hint: 'Scroll',
  },
  {
    id: 'tension',
    text: ["But look around. It doesn't always feel that way, does it?"],
    reveal: ['Pain.', 'Brokenness.', 'Silence.'],
    // artwork crossfades in step with the three words above
    frames: ['/img/genesis-dusk.svg', '/img/genesis-fall.svg', '/img/broken-world.svg'],
    hint: 'Scroll',
    fx: 'fadeWords',
    music: 'tense',
  },
  {
    id: 'pivot',
    text: ['Into that darkness… light stepped in.'],
    fx: 'glow',
    music: 'swell',
    bg: '/img/night-sky.jpg',
    hint: 'Scroll',
  },
  {
    id: 'invite',
    text: ["The Gospel isn't just an ancient book. It's the story of how God came to rescue us."],
    fx: 'pinReveal',
    bg: '/img/hills.jpg',
    dim: 0.55,
    hint: 'Scroll',
  },
  {
    id: 'finale',
    text: ["You've read the preview. Now step inside."],
    cta: 'Take off your headphones and ask for your pass at the counter.',
    button: 'Done',
    bg: '/img/arch.svg',
    idle: 10,
  },
]
