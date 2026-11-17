/* Paco's Island: every line of player-facing text.

   Kept in one file so the editorial checks (prosekeep, plain-language-default,
   red-pen-editor) can read all of it. Functions build lines that carry
   numbers or names. */
'use strict';
const Copy = {
  title: "Paco’s Island",
  intro: 'Paco is an iguana with a boat, and every day he asks seven questions. The rarer your answer, the farther he takes you.',
  howHeading: 'How to play',
  how: [
    'Each question has a fixed list of right answers.',
    'Type one before the clock runs out. Wrong guesses cost only time.',
    'Rarer answers earn more points, up to 20,000.',
    'A fast answer earns a speed bonus. The rarer the answer, the bigger the bonus.',
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
  typo: (name) => `Counted as ${name}`,
  timeUp: "Time's up. You'll see every answer at the end.",
  points: (n) => `${n.toLocaleString('en-US')} points`,
  forRarity: (n) => `${n.toLocaleString('en-US')} for rarity`,
  forSpeed: (n) => `+${n.toLocaleString('en-US')} for speed`,
  next: 'Next question',
  finish: 'See where Paco got you',

  where: {
    boat: (s) => `Paco got you to ${s}.`,
    walk: (s) => `Paco walked you to ${s}.`,
    atv: (s) => `Paco drove you to ${s}.`,
    dive: (s) => `Paco took you down ${s}.`,
  },
  nextStop: (name, n) => `${name} was ${n.toLocaleString('en-US')} ${n === 1 ? 'point' : 'points'} farther.`,
  madeIt: { boat: 'Paco got you all the way to his island.', walk: 'Paco walked you all the way to Cascada Ixtalita.', atv: 'Paco drove you all the way to the upper waterfall.' },
  lifetime: (all) => `${all.toLocaleString('en-US')} ${all === 1 ? 'point' : 'points'}`,
  sheetHead: 'Today',
  rarityTotal: 'Rarity',
  speedTotal: 'Speed bonus',
  total: 'Total',
  time: 'Time',
  hudDepth: (d) => `Depth ${d}`,
  hudNext: (s) => `Next stop: ${s}`,
  hudAt: (s) => `At ${s}`,
  unlock: (n, trip) => `${n.toLocaleString('en-US')} more ${n === 1 ? 'point' : 'points'} to open the ${trip}`,
  unlocked: (trip) => `You opened the ${trip}. Pick it on tomorrow's trip.`,
  tripShort: { boat: 'boat trip', walk: 'walk', atv: 'ATV ride', dive: 'dive' },
  copyResult: 'Copy my result',
  copied: 'Copied',
  copyFailed: 'Your browser blocked copying. Select the text above and copy it.',
  noAnswer: 'No answer',
  sheetHint: 'Select a row to see its question and every right answer.',
  // AP style: spell out one through nine.
  count: (n) => (n < 10 ? ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][n] : n.toLocaleString('en-US')),
  allHead: (n) => `All ${Copy.count(n)} right answers and their rarity points`,
  // AP style times: 6 p.m., 6:30 a.m., noon, midnight.
  apTime: (d) => { const h = d.getHours(), m = d.getMinutes(); if (!m && h === 0) return 'midnight'; if (!m && h === 12) return 'noon'; return `${h % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`; },
  comeBack: (time) => `New questions at ${time} your time`,

  // Share marks, from no answer to 20,000 points and up.
  marks: ['🌊', '🐚', '🦀', '🐢', '🦎'],
  markAhead: '🏝️',
  share: (day, line, rows, rarity, speed, total, time) => `Paco's Island, day ${day}\n${line}\n${rows}\nRarity ${rarity}\nSpeed ${speed}\nTotal ${total}\nTime ${time}`,

  // Levels. Mario is Paco's iguana twin brother and his rival on the island.
  level: {
    legend: 'Choose a level',
    paco: "Paco's mode",
    pacoNote: 'The full game',
    mario: "Mario's mode",
    marioNote: 'Easier questions, 40 seconds each and half points',
  },
  marioIntro: "Mario is Paco's iguana twin brother and his rival on the island. He asks easier questions and gives you 40 seconds for each, and his trips pay half the points Paco's do.",
  suggestMario: "That was a hard set. Mario, Paco's twin brother, asks easier questions.",
  playMario: "Play Mario's mode",
  marioTag: "Mario's mode",

  // Endless mode: a new set of seven questions each round, with every trip open.
  // Screens: docs/endless-mode-screens.md.
  endless: {
    modeLegend: 'Choose how to play',
    daily: "Today's trip",
    dailyNote: 'Seven questions, the same for everyone',
    name: 'Endless mode',
    note: 'A new set of seven questions each round, with every trip open',
    start: (round) => `Start round ${round}`,
    resume: (round) => `Finish round ${round}`,
    progress: (round, i) => `Round ${round}, question ${i} of 7`,
    sheetHead: (round) => `Round ${round}`,
    passedMark: (mark, depth) => `You passed ${mark} at ${depth}.`,
    earlierHead: 'Earlier rounds',
    earlierRow: (round, trip) => `Round ${round}, ${trip}`,
    again: 'Play another round',
    changeTrip: 'Change trip',
    tripLegend: (round) => `Choose a trip for round ${round}`,
    leave: "Back to today's trip",
    repeats: 'You have played every set of questions. The sets start over from here.',
  },

  moveHeading: 'Play on another device',
  moveBody: 'To keep your points and trips on another phone or computer, open this link there.',
  copyLink: 'Copy link',
  close: 'Close',
  importHeading: 'Use the points from your other device?',
  importBody: (pts) => `This link has ${pts.toLocaleString('en-US')} ${pts === 1 ? 'point' : 'points'}. They replace the points and trips on this device.`,
  importYes: 'Use those points',
  importNo: "Keep this device's points",
  importBad: "This link didn't work. Copy it again from your other device.",
  noScene: 'The trip picture needs WebGL, which this browser has turned off. The game still works.',
};
if (typeof module !== 'undefined') module.exports = Copy;
