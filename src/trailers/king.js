// "The King and the Maiden": the Kierkegaard parable (Course 101 chapter 3), told in four beats, then the counter pitch.
// Same format as story.js (see the comment block there). Plain-spoken on purpose: the point is "huh, I never thought of Jesus like that", not a feeling.
// Every beat uses fit: 'contain' so the whole picture shows on any screen (a laptop and an iPad crop very differently).
// cls: 'prose' sets long sentences in smaller sentence case; 'cool' drains the text colour for the cold beat.
// Tone: thought-provoking, not emotional. Both tracks were picked for being steady and unhurried in their first 40s
// (low loudness swing, few attacks); the first-pass pair (Drifting Mirages, Love Will Save You) was busier and swelled.
export const tracks = {
  bed: '/audio/BGM_Biblical_View_Of_Salvation.mp3', // ch6a, calm and level
  turn: '/audio/BGM_Jesus_In_My_Place.mp3', // ch6a, steady and a little warmer; enters when the King drops the crown
}

export const gate = {
  text: ['Headphones on'],
  sub: '30 seconds',
  button: 'Begin',
}

export const slides = [
  {
    id: 'question',
    cls: 'prose',
    text: ['Imagine a king who falls for a poor village girl.', 'He could ride in with an army. Nobody would dare say no.'],
    frames: [{ src: '/img/king-maiden-intro.jpg', dim: 0.45, sat: 0.8 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    auto: 2.5,
  },
  {
    id: 'fear',
    cls: 'prose cool',
    text: ['But she would be terrified of him.', 'Power gets you obedience. It can\'t get you love.'],
    frames: [{ src: '/img/god-appears.jpg', dim: 0.7, sat: 0.6 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    auto: 3,
  },
  {
    id: 'choice',
    cls: 'prose',
    text: ['So he does something that makes no sense.', 'He drops the crown and shows up as someone she can say no to.'],
    frames: [{ src: '/img/king-veils-himself.jpg', dim: 0.5, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'turn',
    musicAt: 1, // the second track comes in on the crown line
    auto: 3.2,
  },
  {
    id: 'finale',
    cls: 'prose',
    text: ['Maybe that is why God showed up as Jesus.', 'He did not bring an army. He came as a carpenter anyone could turn down.'],
    cta: 'Step inside to explore the story. Get your pass at the counter.',
    button: 'Reset',
    frames: [{ src: '/img/reaching-hand.jpg', dim: 0.6 }],
    fit: 'contain',
    music: 'turn',
    idle: 15,
  },
]
