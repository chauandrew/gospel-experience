// "The King and the Maiden": the Kierkegaard parable (Course 101 chapter 3), told in four beats, then the counter pitch.
// Same format as story.js (see the comment block there). Rough first pass: copy, art and timings are all placeholders to tune.
// cls: 'prose' sets long sentences in smaller sentence case; 'cool' drains the text colour for the cold beat.
export const tracks = {
  drone: '/audio/Drifting_Mirages.mp3', // ch3 music, ambient bed
  pad: '/audio/Love_Will_Save_You.mp3', // ch3 music, warmer; comes in when the King lays down his crown
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
    text: ['How would a King win a humble maiden\'s heart?', 'He could ride into her village in full majesty, banners flying, power on display.'],
    frames: [{ src: '/img/king-maiden-intro.jpg', dim: 0.5, sat: 0.8, pos: '50% 0%' }],
    fx: 'pinReveal',
    music: 'drone',
    auto: 2.4,
  },
  {
    id: 'fear',
    cls: 'prose cool',
    text: ['But power would only terrify her.', 'It commands submission, but it can never force love.'],
    frames: [{ src: '/img/god-appears.jpg', dim: 0.85, sat: 0.6 }],
    fx: 'pinReveal',
    music: 'drone',
    auto: 3,
  },
  {
    id: 'choice',
    cls: 'prose',
    text: ['So the King chooses a different way.', 'He lays down his crown, steps off the throne, and meets her in the dirt as a common peasant.'],
    frames: [{ src: '/img/king-veils-himself.jpg', dim: 0.6, sat: 1, pos: '75% 50%' }],
    fx: 'pinReveal',
    music: 'pad',
    musicAt: 1, // the pad swells in as the crown comes off
    auto: 3.2,
  },
  {
    id: 'finale',
    cls: 'prose',
    text: ['This is why God entered our history as Jesus.', 'Not to overwhelm us with power, but to meet us where we are.'],
    cta: 'Step inside to explore the story. Get your pass at the counter.',
    button: 'Reset',
    frames: [{ src: '/img/ridge.jpg', dim: 0.55, sat: 1, pos: '100% 25%' }],
    music: 'pad',
    idle: 15,
  },
]
