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
    text: [
      'Why does lasting happiness always seem like it\'s around the next corner?', 
      'Get good grades to get into a good college to get a good job and so on', 
    ],
    frames: [{ src: '/img/night-sky.jpg', dim: 0.7, sat: 0.9 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'pensive',
    gap: 1.8,
    auto: 2.4,
  },
  {
    id: 'half',
    cls: 'prose',
    eyebrow: 'C. S. Lewis',
    text: [
      'C. S. Lewis phrased it like this:',
      '_We [strive for] drink and ambition when infinite joy is offered us_'
    ],
    frames: [{ src: '/img/alone-room.svg', dim: 0.8, sat: 0.9 }],
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
    text: [
      '_like an ignorant child who wants to make mud pies in a slum because he cannot imagine the offer of a holiday at the sea_',
      '_"We are far too easily pleased."_'
    ],
    frames: [{ src: '/img/sea.jpg', dim: 0.8, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'pensive',
    gap: 2.4,
    auto: 2.4,
  },
  {
    id: 'finale',
    cls: 'prose',
    text: ['We keep chasing small things, when something far bigger is available', 'Is that true for you?'],
    cta: 'Come and see',
    button: 'Reset',
    bg: '/img/eden-valley.jpg',
    gap: 2.4,
    ctaGap: 1.5,
    dim: 1,
    music: 'pensive',
    idle: 15,
  },
]
