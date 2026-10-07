// "The King and the Maiden": Kierkegaard's parable (Philosophical Fragments; Course 101 chapter 3), told in four beats, then the counter pitch.
// Follows the original: the king loves a humble maiden; he could overwhelm her with his power but wants a lover, not a cringing subject;
// only love makes the unequal equal, so he descends and becomes a beggar for real ("no mere disguise"). Then the bridge to Jesus.
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
    text: ['How would a king win the heart of a poor village girl?', 'He could ride in with an army. She wouldn\'t dare say no.'],
    frames: [{ src: '/img/king-maiden-intro.jpg', dim: 0.45, sat: 0.8 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    auto: 2.5,
  },
  {
    id: 'fear',
    cls: 'prose cool',
    text: ['But would she love him?', 'Power can get you obedience, but it can\'t get you love.'],
    frames: [{ src: '/img/woman-covers-face.jpg', dim: 1.1, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    auto: 2.4,
  },
  {
    id: 'choice',
    cls: 'prose',
    text: ['So he takes off the crown.', 'He goes to her as a beggar so they can meet as equals.'],
    frames: [{ src: '/img/king-veils-himself.jpg', dim: 0.65, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'turn',
    musicAt: 1, // the second track comes in on the crown line
    auto: 3.2,
  },
  {
    id: 'finale',
    cls: 'prose top',
    text: ['The Bible says God became human.', 'Why would he do that?'],
    cta: 'Step inside to explore the story. Get your pass at the counter.',
    button: 'Reset',
    // Bethlehem at night: the stable lit from inside under the star (ch5 panorama, glow added). Text sits in the upper half so the light stays clear.
    bg: '/img/stable-glow.jpg',
    dim: 1.2,
    music: 'turn',
    idle: 15,
  },
]
