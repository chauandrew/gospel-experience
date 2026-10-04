// All copy and per-beat config lives here. Edit freely; no logic elsewhere hardcodes wording.
// frames entries may be a path or { src, dim, sat, pos } (dim = brightness 0.5, sat = saturation 0.9, pos = CSS object-position, e.g. '100% 25%' to keep a corner in view).
// Images change in step with the text: one per headline, then one per reveal word.
// speed: per-beat playback multiplier (1.33 = this beat's text lands in 0.75 of the time).
// auto: seconds a beat holds after its text lands before gliding on by itself (divided by the beat's speed; default 1.6).
// musicAt: index of the headline that triggers this beat's music crossfade (default: when the beat opens).
// lead: seconds of art alone before the text starts (default 0).
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
  text: ['Put on your headphones'],
  button: 'Begin',
}

export const slides = [
  {
    id: 'genesis',
    text: ['In the beginning, God created the heavens and the earth.', '_"And God saw that it was good."_'],
    // every stage is alive: bright coast, then flowered hills
    frames: [
      { src: '/img/sea.jpg', dim: 0.7 },
      { src: '/img/eden-river.jpg', dim: 1.1, sat: 1.1 },
    ],
    fx: 'pinReveal',
    music: 'ambient',
    auto: 2.0,
  },
  {
    id: 'man',
    text: ['Then God created man in his own image.', '_"God blessed them."_', '_"And behold, it was very good."_'],
    // warm valley, then people together, then the golden field
    frames: [{ src: '/img/creation-people.jpg', dim: 0.6, sat: 1 }, { src: '/img/blessed-people.jpg', dim: 0.6 }, { src: '/img/eden-valley.jpg', dim: 0.65 }],
    auto: 2.4,
    fx: 'pinReveal',
    music: 'ambient',
  },
  {
    id: 'tension',
    text: ['That\'s how it was meant to be', 'Then something happened'],
    reveal: ['Comparison', 'Isolation', 'Betrayal'],
    // garden behind the first line, dusk when it breaks, then one image per word above
    frames: [{ src: '/img/genesis-garden.svg', dim: 0.75 }, '/img/genesis-dusk.svg', { src: '/img/photo-wall.svg', dim: 0.3, sat: 0.3 }, { src: '/img/alone-room.svg', dim: 0.8 }, '/img/whisper.svg'],
    fit: 'contain', // show each whole image (zoomed out) with soft edges instead of cropping to fill
    fx: 'fadeWords',
    music: 'tense',
    musicAt: 1, // the music change starts when headline 1 ("Then something happened") lands, not when the slide opens
    lead: 0.5, // seconds the dark art fades in before the first line lands (softens the cut from the warm beat)
    speed: 0.85, // plays slower than the others: the reading and the three words need room
    auto: 2.1,
  },
  {
    id: 'pivot',
    text: ['But that\'s not how it ends', 'The Gospel is the story of how God stepped in and changed the story'],
    fx: 'crossfade',
    music: 'swell',
    // night sky, then the golden ridge crossfades in for the Gospel line
    bg: '/img/night-sky.jpg',
    frames: [{ src: '/img/ridge.jpg', dim: 0.6, sat: 1, pos: '100% 25%' }],
    auto: 2.8, // glides on to the finale by itself this long after the text lands
  },
  {
    id: 'finale',
    text: ["See it for yourself"],
    cta: 'Get your pass at the counter',
    button: 'Reset',
    bg: '/img/desert-city.jpg',
    dim: 0.8,
    idle: 15,
  },
]
