// "Mud Pies": C. S. Lewis, "The Weight of Glory" (permission checked by the author). The trailer walks through his passage in order:
// a hook (why is "I'll be happy when..." never enough?), then the quote in four beats, then his closing line as the finale.
// Same format as story.js and king.js (see the comment block in story.js). The words are the picture, so the art is atmospheric, not literal.
// Every beat uses fit: 'contain' so the whole picture shows on any screen.
// Music reuses the King's calm bed throughout.
export const tracks = {
  pensive: '/audio/Silent_Place.mp3',
  turn: '/audio/BGM_Jesus_In_My_Place.mp3',
}

export const gate = {
  text: ['Headphones on'],
  sub: '30 seconds',
  button: 'Begin',
}

export const slides = [
  {
    id: 'hook',
    cls: 'prose',
    text: ['Why does _"I\'ll be happy when..."_ never seem to arrive?', 'C. S. Lewis phrased it like this:'],
    frames: [{ src: '/img/night-sky.jpg', dim: 0.7, sat: 0.9 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'pensive',
    gap: 1.8,
    auto: 1.4,
  },
  {
    id: 'half',
    cls: 'prose',
    eyebrow: 'C. S. Lewis',
    text: ['_We are half-hearted creatures, fooling about with drink and sex and ambition_'],
    frames: [{ src: '/img/alone-room.svg', dim: 0.8, sat: 0.9 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'pensive',
    // gap: 1.8,
    auto: 3.8, 
  },
  {
    id: 'offered',
    cls: 'prose',
    eyebrow: 'C. S. Lewis',
    text: ['_when infinite joy is offered us, like an ignorant child who wants to go on making mud pies in a slum_'],
    // a tiny figure under a huge golden sky: the offer is far bigger than the pies
    frames: [{ src: '/img/ridge.jpg', dim: 0.7, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'pensive',
    // gap: 1.8,
    auto: 3.8,
  },
  {
    id: 'sea',
    cls: 'prose',
    eyebrow: 'C. S. Lewis',
    text: ['_because he cannot imagine what is meant by the offer of a holiday at the sea_'],
    frames: [{ src: '/img/sea.jpg', dim: 0.8, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'pensive',
    // gap: 1.8,
    auto: 3.8,
  },
  {
    id: 'finale',
    cls: 'prose',
    eyebrow: 'C. S. Lewis',
    text: ['_We are far too easily pleased._'],
    cta: 'Walk through the whole story at the interactive exhibit',
    button: 'Reset',
    bg: '/img/eden-valley.jpg',
    ctaGap: 1.5,
    dim: 1,
    music: 'pensive',
    idle: 15,
  },
]
