// "The Christmas Tree": Course 101 chapter 2 ("Christmas tree of life"), told in four beats, then the counter pitch.
// Opens on a general truth, turns on the tree being dead (cut from its roots, gone in a few weeks), bridges to our lives,
// and ends on the course's own open question, so the answer is at the exhibit.
// Same format as story.js and king.js (see the comment block in story.js). Plain-spoken, light, not somber.
// Every beat uses fit: 'contain' so the whole tree shows on any screen. Art is the two ch2b tree SVGs, rasterized (see docs/ASSETS.md).
// Music reuses the King's pair: a calm bed, and a slightly warmer track for the question.
export const tracks = {
  bed: '/audio/BGM_Biblical_View_Of_Salvation.mp3',
  turn: '/audio/BGM_Jesus_In_My_Place.mp3',
}

export const gate = {
  text: ['Headphones on'],
  sub: '30 seconds',
  button: 'Begin',
}

export const slides = [
  {
    id: 'tree',
    cls: 'prose',
    text: ['Someone once compared human life to a Christmas tree', 'We decorate it with lights and ornaments and it fills the room with the smell of pine'],
    frames: [{ src: '/img/tree-decorated.png', dim: 0.85, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    gap: 1.8,
    auto: 1.4,
  },
  {
    id: 'dead',
    cls: 'prose cool',
    text: ['But the tree is dead', 'It will be out on the curb in a few weeks'],
    frames: [{ src: '/img/tree-plain.png', dim: 0.55, sat: 0.3 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    gap: 1.8,
    auto: 1.8,
  },
  {
    id: 'life',
    cls: 'prose',
    text: ['We decorate our lives with ornaments like degrees and accomplishments', 'But what happens at the end of 70 or 80 such years?'],
    frames: [{ src: '/img/tree-decorated.png', dim: 0.65, sat: 0.8 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    gap: 1.8,
    auto: 1.8,
  },
  {
    id: 'finale',
    cls: 'prose',
    text: ['Can a tree cut from its root be reattached?', 'Who could work such a miracle?'],
    cta: 'Walk through the whole story at the interactive exhibit',
    button: 'Reset',
    frames: [{ src: '/img/tree-plain.png', dim: 0.6, sat: 0.8 }],
    fit: 'contain',
    music: 'turn',
    ctaGap: 1.5,
    idle: 15,
  },
]
