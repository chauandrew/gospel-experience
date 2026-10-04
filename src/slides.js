// All copy and per-beat config lives here. Edit freely; no logic elsewhere hardcodes wording.
// frames entries may be a path or { src, dim, sat } (dim = brightness 0.5, sat = saturation 0.9 by default).
// auto: seconds to hold after the text lands, then advance without scrolling (no SCROLL hint).
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
    text: ['In the beginning, God created...', 'And it was good.'],
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
    text: ['Then he paused, and formed man.', 'In his own image.', 'It was very good.'],
    frames: [{ src: '/img/creation-people.jpg', dim: 0.65 }],
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
    text: ['Into that darkness, light stepped in.'],
    fx: 'glow',
    music: 'swell',
    bg: '/img/night-sky.jpg',
    auto: 1.5, // short beat: glides on to the next one by itself this many seconds after the text lands
  },
  {
    id: 'invite',
    text: ["The Gospel is the story of how God came to rescue us from our brokenness and sin"],
    fx: 'pinReveal',
    bg: '/img/hills.jpg',
    dim: 0.55,
    auto: 2.0 
    // hint: 'Scroll',
  },
  {
    id: 'finale',
    text: ["See it for yourself"],
    cta: 'Take off your headphones and get your pass at the counter',
    button: 'Done',
    bg: '/img/sunrise.svg',
    idle: 10,
  },
]
