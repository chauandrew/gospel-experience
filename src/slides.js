// All copy and per-beat config lives here. Edit freely; no logic elsewhere hardcodes wording.
// fx / music / bg are consumed in later phases (motion, audio).
export const gate = {
  text: ['Put on your headphones.'],
  button: 'Begin',
}

export const slides = [
  {
    id: 'genesis',
    eyebrow: 'Genesis 1',
    text: ['In the beginning, God created everything… and it was good. Very good.'],
    fx: 'pinReveal',
    music: 'ambient',
  },
  {
    id: 'tension',
    text: ["But look around. It doesn't always feel that way, does it?"],
    reveal: ['Pain.', 'Brokenness.', 'Silence.'],
    fx: 'fadeWords',
    music: 'tense',
  },
  {
    id: 'pivot',
    text: ['Into that darkness… light stepped in.'],
    fx: 'glow',
    music: 'swell',
  },
  {
    id: 'invite',
    text: ["The Gospel isn't just an ancient book. It's the story of how God came to rescue us."],
    fx: 'pinReveal',
    bg: '/img/sky.png',
  },
  {
    id: 'finale',
    text: ["You've read the preview. Now step inside."],
    cta: 'Take off your headphones and ask for your pass at the counter.',
    button: 'Done',
    idle: 10,
  },
]
