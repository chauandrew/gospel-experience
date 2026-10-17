// "Mud Pies": C. S. Lewis's image from "The Weight of Glory": a child in a slum is happy making mud pies and cannot imagine what is
// meant by the offer of a holiday at the sea. Lewis's point is that our desires are not too strong but too weak: we are far too easily pleased.
// Paraphrased on purpose (no Lewis text on screen). Four beats, then the counter pitch.
// Same format as story.js and king.js (see the comment block in story.js). Light and hopeful: the turn is the offer, not a loss.
// Every beat uses fit: 'contain' so the whole picture shows on any screen.
// Music reuses the King's pair: the calm bed, then the warmer track as soon as the sea is offered.
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
    id: 'pies',
    cls: 'prose',
    text: ['C. S. Lewis described a child growing up in a slum', 'He is perfectly happy making mud pies in the gutter'],
    // original flat illustration (see docs/ASSETS.md); swap for a photo if one turns up
    frames: [{ src: '/img/mud-pies.svg', dim: 0.8, sat: 0.9 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'bed',
    gap: 1.8,
    auto: 1.4,
  },
  {
    id: 'sea',
    cls: 'prose',
    text: ['Now offer him a holiday at the sea', 'He cannot picture it, so he says no thanks and goes back to his pies'],
    frames: [{ src: '/img/sea.jpg', dim: 0.8, sat: 1 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'turn',
    gap: 1.8,
    auto: 1.8,
  },
  {
    id: 'us',
    cls: 'prose',
    text: ['Lewis said we are like that with God', 'We do not want too much, we settle for too little'],
    // the course's "ornaments of life" collage (phone, house, trophy) as the mud pies
    frames: [{ src: '/img/ornaments-of-life.jpeg', dim: 0.7, sat: 0.9 }],
    fit: 'contain',
    fx: 'pinReveal',
    music: 'turn',
    gap: 1.8,
    auto: 1.8,
  },
  {
    id: 'finale',
    cls: 'prose',
    text: ['What if what we are chasing are mud pies?', 'And what is the sea?'],
    cta: 'Walk through the whole story at the interactive exhibit',
    button: 'Reset',
    bg: '/img/eden-valley.jpg',
    ctaGap: 1.5,
    dim: 1,
    music: 'turn',
    idle: 15,
  },
]
