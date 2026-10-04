// All copy and per-beat config lives here. Edit freely; no logic elsewhere hardcodes wording.
// frames entries may be a path or { src, dim, sat } (dim = brightness 0.5, sat = saturation 0.9 by default).
// speed: per-beat multiplier on the global SPEED in fx.js (1.33 = text lands in 0.75 of the time).
// auto: timeline seconds a beat holds after its text lands before gliding on by itself (real time is this divided by SPEED in fx.js; default 2.5).
// lead: timeline seconds of art alone before the text starts (default 0).
// There is no manual scrolling: every beat but the last advances on its own.
// fit: 'contain' on a slide with frames shows whole images instead of cropping to fill.
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
    text: ['In the beginning, God created the heavens and the earth.', '_"And God saw that it was good."_'],
    // every stage is alive: bright coast, then green garden
    frames: [
      { src: '/img/sea.jpg', dim: 0.7 },
      { src: '/img/genesis-garden.svg', dim: 0.75 },
    ],
    fx: 'pinReveal',
    music: 'ambient',
    auto: 2.2,
  },
  {
    id: 'man',
    text: ['Then God created man in his own image.', '_"God blessed them."_', '_"And behold, it was very good."_'],
    // warm valley, then people together, then the golden field
    frames: [{ src: '/img/eden-valley.jpg', dim: 0.6, sat: 1 }, { src: '/img/blessed-people.jpg', dim: 0.6 }, { src: '/img/creation-people.jpg', dim: 0.65 }],
    speed: 1.33,
    auto: 2.4,
    fx: 'pinReveal',
    music: 'ambient',
  },
  {
    id: 'tension',
    text: ['That\'s how it was meant to be', 'Then something happened'],
    reveal: ['Comparison', 'Isolation', 'Betrayal'],
    // first image sits behind the question, then one per word above
    frames: ['/img/genesis-dusk.svg', { src: '/img/photo-wall.svg', dim: 0.3, sat: 0.3 }, { src: '/img/alone-room.svg', dim: 0.8 }, '/img/whisper.svg'],
    fit: 'contain', // show each whole image (zoomed out) with soft edges instead of cropping to fill
    fx: 'fadeWords',
    music: 'tense',
    lead: 0.8, // timeline seconds the dark art fades in before the first line lands (softens the cut from the warm beat)
    auto: 2.7,
  },
  {
    id: 'pivot',
    text: ['But that\'s not how it ends', 'The Gospel is the story of how God stepped in and changed the story'],
    fx: 'crossfade',
    music: 'swell',
    // night sky, then the golden ridge crossfades in for the Gospel line
    bg: '/img/night-sky.jpg',
    frames: [{ src: '/img/ridge.jpg', dim: 0.6, sat: 1 }],
    auto: 3.2, // glides on to the finale by itself this long after the text lands (timeline seconds, played at SPEED in fx.js)
  },
  {
    id: 'finale',
    text: ["See it for yourself"],
    cta: 'Get your pass at the counter',
    button: 'Done',
    bg: '/img/sunrise.svg',
    idle: 15,
  },
]
