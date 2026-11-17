/* Paco's Island: every line of player-facing text.

   Kept in one file so the editorial checks (prosekeep, plain-language-default,
   red-pen-editor) can read all of it. Functions build lines that carry
   numbers or names. */
'use strict';
const Copy = {
  title: "Paco’s Island",
  intro: 'Paco is an iguana with a boat, and every day he asks seven questions. The fewer people who give your answer, the farther he takes you.',
  howHeading: 'How to play',
  how: [
    'Each question has a fixed list of right answers.',
    'Type one before the clock runs out. Wrong guesses cost only time.',
    'A common answer earns 10 points. An answer almost nobody gives earns close to 100.',
    'Answer fast for up to 20 more points.',
    'Everyone gets the same seven questions each day.',
  ],
  tripLegend: 'Choose a trip',
  tripOpens: (n) => `Opens at ${n.toLocaleString('en-US')} total points`,
  start: "Start today's trip",
  resume: "Finish today's trip",
  seeResults: "See today's results",
  credit: 'A game by Ron Bronson',

  progress: (i) => `Question ${i} of 7`,
  answerLabel: 'Your answer',
  answer: 'Answer',
  secondsLeft: (s) => `${s} seconds left`,
  empty: 'Type an answer first.',
  wrong: 'Not on the list. Try another.',
  off: (name) => `${name} is real, but it doesn't fit this question.`,
  typo: (name) => `Counted as ${name}.`,
  timeUp: "Time's up. You'll see every answer at the end.",
  points: (n) => `${n} points`,
  split: (rare, fast) => `${rare} for the answer and ${fast} for speed.`,
  rarer: (p) => (p === 0 ? 'The most common answer today.' : `Rarer than ${p}% of today's answers.`),
  next: 'Next question',
  finish: 'See where Paco got you',
  estimated: 'Shares are estimates until more people play today.',

  where: {
    boat: (s) => `Paco got you to ${s}.`,
    atv: (s) => `Paco drove you to ${s}.`,
    dive: (s) => `Paco took you down ${s}.`,
  },
  nextStop: (name, n) => `${name} was ${n} ${n === 1 ? 'point' : 'points'} farther.`,
  madeIt: { boat: 'Paco got you all the way to his island.', atv: 'Paco drove you all the way to the upper waterfall.' },
  todayTotal: (today, all) => `${today} points today. ${all.toLocaleString('en-US')} points in all.`,
  unlock: (n, trip) => `${n.toLocaleString('en-US')} more points opens the ${trip}.`,
  unlocked: (trip) => `You opened the ${trip}. Pick it on tomorrow's trip.`,
  tripShort: { atv: 'ATV ride', dive: 'dive' },
  copyResult: 'Copy my result',
  copied: 'Copied',
  copyFailed: 'Your browser blocked copying. Select the text below and copy it.',
  yourAnswers: 'Your answers',
  noAnswer: 'No answer',
  everyAnswer: 'See every answer',
  nobody: 'nobody yet',
  comeBack: (time) => `New questions arrive at ${time} your time.`,

  share: (day, line, score, squares) => `Paco's Island, day ${day}\n${line} ${score} points.\n${squares}`,

  moveHeading: 'Move my progress',
  moveBody: 'Open this link on your other device. It brings your points, open trips and past days with it.',
  copyLink: 'Copy link',
  close: 'Close',
  importHeading: 'Bring in progress from another device?',
  importBody: (pts) => `This link holds ${pts.toLocaleString('en-US')} points. Using it replaces the progress on this device.`,
  importYes: 'Use this progress',
  importNo: "Keep this device's progress",
  importBad: "This link didn't work. Copy it again from your other device.",
  noScene: 'The trip picture needs WebGL, which this browser has turned off. The game still works.',
};
if (typeof module !== 'undefined') module.exports = Copy;
