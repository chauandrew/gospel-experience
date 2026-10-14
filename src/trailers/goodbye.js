// "The Goodbye": a modern parable of the Fall (Genesis 3). Sin is a broken relationship, not a broken rule.
// A college-bound daughter coldly thanks her parents and cuts them off. Then the bridge: the Bible says this is our story with God.
// Ends on an open question ("what would the Father do next?") so the call to action is to hear the answer at the exhibit.
// Same format as story.js and king.js (see the comment blocks there). Every beat uses fit: 'contain'; art is all reused from the other trailers.
// Tone: plain-spoken and a little chilling, not emotional. The cool class drains the text colour for the cold beats.
export const tracks = {
  bed: '/audio/BGM_Biblical_View_Of_Salvation.mp3', // calm and level, for the setup
  tense: '/audio/BGM_Downward_Spiral.mp3', // enters when she says the last cold line
  turn: '/audio/BGM_Jesus_In_My_Place.mp3', // warmer; the finale question
}

export const gate = {
  text: ['Headphones on'],
  sub: '30 seconds',
  button: 'Begin',
}

export const slides = [
  {
    id: 'setup',
    cls: 'prose',
    text: ['Imagine a college-bound high school graduate', 'Her first semester is about to begin, and she sits her parents down to talk'],
    frames: [{ src: '/img/alone-room.svg', dim: 0.8, sat: 0.9 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    gap: 1.8,
    auto: 1.4,
  },
  {
    id: 'thanks',
    cls: 'prose cool',
    text: ['_"Mr. and Mrs. Smith, thank you for your efforts on my behalf"_', '_"I could hardly tolerate you all these years"_'],
    // the warm family collage under her cold words: what the parents gave
    frames: [{ src: '/img/blessed-people.jpg', dim: 0.5, sat: 0.7 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    gap: 1.8,
    auto: 1.8,
  },
  {
    id: 'goodbye',
    cls: 'prose cool',
    text: ['_"I got a full ride to a good university"_', '_"Please don\'t consider me your child any longer"_'],
    frames: [{ src: '/img/isolation.jpg', dim: 0.9, sat: 0.9 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'tense',
    gap: 1.8,
    auto: 1.8,
  },
  {
    id: 'bridge',
    cls: 'prose',
    text: ['It\'s chilling to even imagine', 'The Bible says this is our story with God'],
    frames: [{ src: '/img/genesis-dusk.svg', dim: 0.75 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'tense',
    gap: 1.8,
    auto: 1.8,
  },
  {
    id: 'finale',
    cls: 'prose',
    text: ['So what would the Father do next?'],
    cta: 'Hear what happens next at the interactive exhibit',
    button: 'Reset',
    bg: '/img/night-sky.jpg',
    ctaGap: 1.5,
    dim: 0.9,
    music: 'turn',
    idle: 15,
  },
]
