// All copy and per-beat config lives here. Edit freely; no logic elsewhere hardcodes wording.
// frames entries may be a path or { src, dim, sat } (dim = brightness 0.5, sat = saturation 0.9 by default).
// auto: timeline seconds to hold after the text lands (real time is this divided by SPEED in fx.js), then advance without scrolling (no SCROLL hint).
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
    eyebrow: 'Genesis 1',
    text: ['In the beginning, God created the heavens and the earth.', 'And God saw that it was good.'],
    // every stage is alive: bright coast, then green garden
    frames: [
      { src: '/img/sea.jpg', dim: 0.7 },
      { src: '/img/genesis-garden.svg', dim: 0.75 },
    ],
    fx: 'pinReveal',
    music: 'ambient',
    hint: 'Scroll',
  },
  {
    id: 'man',
    eyebrow: 'Genesis 2',
    text: ['Then God created man in his own image.', 'And God blessed them.', 'And behold, it was very good.'],
    // warm valley, then people together, then the golden field
    frames: [{ src: '/img/eden-valley.jpg', dim: 0.6, sat: 1 }, { src: '/img/blessed-people.jpg', dim: 0.6 }, { src: '/img/creation-people.jpg', dim: 0.65 }],
    fx: 'pinReveal',
    music: 'ambient',
    hint: 'Scroll',
  },
  {
    id: 'tension',
    text: ['So why does the world feel so fractured?'],
    reveal: ['Comparison.', 'Isolation.', 'Betrayal.'],
    // first image sits behind the question, then one per word above
    frames: ['/img/genesis-dusk.svg', { src: '/img/photo-wall.svg', dim: 0.3, sat: 0.3 }, { src: '/img/alone-room.svg', dim: 0.8 }, '/img/whisper.svg'],
    fit: 'contain', // show each whole image (zoomed out) with soft edges instead of cropping to fill
    fx: 'fadeWords',
    music: 'tense',
    hint: 'Scroll',
  },
  {
    id: 'pivot',
    text: ['But that\'s not how the story ends.', 'The Gospel is the story of how God came to rescue us.'],
    fx: 'glow',
    music: 'swell',
    // night sky behind the light swelling from the start, then the golden ridge for the Gospel line
    bg: '/img/night-sky.jpg',
    frames: [{ src: '/img/ridge.svg', dim: 0.6, sat: 1 }],
    auto: 3.2, // glides on to the finale by itself this long after the text lands (timeline seconds, played at SPEED in fx.js)
  },
  {
    id: 'finale',
    text: ["See it for yourself"],
    cta: 'Take off your headphones and get your pass at the counter',
    button: 'Done',
    bg: '/img/sunrise.svg',
    idle: 15,
  },
]
