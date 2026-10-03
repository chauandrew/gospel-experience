// All copy and per-beat config lives here. Edit freely; no logic elsewhere hardcodes wording.
// frames entries may be a path or { src, dim } (dim = brightness, default 0.5).
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
    // Each line lands as its own stage; the artwork changes with it (people arrive at "Very good.")
    text: ['In the beginning, God created everything…', 'And it was good.', 'Very good.'],
    frames: ['/img/genesis-dawn.svg', '/img/genesis-garden.svg', { src: '/img/creation-people.jpg', dim: 0.65 }],
    fx: 'pinReveal',
    music: 'ambient',
    hint: 'Scroll',
  },
  {
    id: 'tension',
    text: ['So why does the world feel so fractured?'],
    reveal: ['Gossip.', 'Betrayal.', 'Loneliness.'],
    // first image sits behind the question, then one per word above
    frames: ['/img/genesis-dusk.svg', '/img/whisper.svg', '/img/cracked-photo.svg', { src: '/img/alone.svg', dim: 1 }],
    fx: 'fadeWords',
    music: 'tense',
    hint: 'Scroll',
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
    bg: '/img/sunrise.svg',
    idle: 10,
  },
]
