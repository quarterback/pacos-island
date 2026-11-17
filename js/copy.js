/* Paco's Island: every line of player-facing text.

   Kept in one file so the editorial checks (prosekeep, plain-language-default,
   red-pen-editor) can read all of it. Functions build lines that carry
   numbers or names. */
'use strict';
const Copy = {
  title: "Paco’s Island",
  // The title screen
  splash: { line: 'The rarer your answer, the farther Paco takes you.', start: 'Start', how: 'How to play' },
  howHeading: 'How to play',
  how: [
    'Type a right answer before time runs out. Wrong guesses cost only time.',
    "When the clock runs out, it's island time. Keep guessing for a few points, or press Stumped.",
    'Rarer answers earn more points, up to 20,000.',
    'Answer in the first 5 seconds for the full speed bonus. It fades fast after 10 seconds.',
  ],
  tripLegend: 'Choose a trip',
  tripOpens: (n) => `Opens at ${n.toLocaleString('en-US')} points`,
  start: "Start today's trip",
  resume: "Finish today's trip",
  seeResults: "See today's results",
  home: 'Home',
  credit: 'A game by Ron Bronson',
  music: 'Music',

  progress: (i) => `Question ${i} of 7`,
  answerLabel: 'Your answer',
  answer: 'Answer',
  secondsLeft: (s) => `${s} seconds left`,
  empty: 'Type an answer first.',
  wrong: 'Not on the list. Try another.',
  off: (name) => `${name} is real, but it doesn't fit this question.`,
  typo: (name) => `Counted as ${name}`,
  // Island time: the clock has run out, the question stays open until a
  // right answer or Stumped.
  islandTime: 'Island time',
  islandNote: "Time's up. A right answer still earns a few points.",
  skipped: 'Stumped',
  points: (n) => `${n.toLocaleString('en-US')} points`,
  forRarity: (n) => `${n.toLocaleString('en-US')} rarity`,
  forSpeed: (n) => `+ ${n.toLocaleString('en-US')} speed`,
  next: 'Next question',
  // Stumped: skip a question. Mario and Esmeralda, a great green macaw, drop
  // in, always on the player's side. Each list plays through before any line
  // repeats.
  stumped: 'Stumped',
  parrot: 'Esmeralda',
  stumpedMario: [
    "I didn't know that one either.",
    "You'll get the next one, I'm sure.",
    'Maybe you just wanna head to the beach and skip this one?',
    'Even Paco would be stumped. Probably.',
    'That one was a tough shell to crack.',
    "No worries. The tide's turning.",
    'Shake it off like sand from your toes.',
    "Sun's still out. You're doing fine.",
    'Iguana tell you a secret: nobody knows that one.',
    'Hard questions make the best stories.',
    "Take a breath. The next one's yours.",
    'That question was rude, honestly.',
    "Even the fish didn't know.",
    "Skipping is smart. That's how I got this far.",
    "You're still my favorite passenger.",
  ],
  stumpedParrot: [
    "Squawk! You've got this!",
    'Wing it next time!',
    'No feather off your back!',
    'Polly wants a next question!',
    'Beach! Beach! Beach!',
    "You're one bright bird!",
    'Keep your beak up!',
    'Fly on, friend!',
    "Toucan play at that game! I'm a macaw, but still.",
    "Next one's yours! Squawk!",
    'Birds of a feather get stumped together!',
  ],
  finish: 'See where Paco got you',

  where: {
    boat: (s) => `Paco got you to ${s}`,
    walk: (s) => `Paco walked you to ${s}`,
    atv: (s) => `Paco drove you to ${s}`,
    market: (s) => `Paco walked you to ${s}`,
    fly: (s) => `Esmeralda flew you to ${s}`,
    dive: (s) => `Paco took you down ${s}`,
  },
  nextStop: (name, n) => `${n.toLocaleString('en-US')} ${n === 1 ? 'point' : 'points'} short of ${name}`,
  madeIt: { boat: 'Paco got you all the way to his island', walk: 'Paco walked you all the way to Cascada Ixtalita', atv: 'Paco drove you all the way to the upper waterfall', market: 'Paco walked you all the way to the church steps', fly: "Esmeralda flew you all the way to her nest" },
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
  tripShort: { boat: 'boat trip', walk: 'walk', atv: 'ATV ride', market: 'night market', fly: 'flight', dive: 'dive' },
  copyResult: 'Copy my result',
  copied: 'Copied',
  copyFailed: 'Your browser blocked copying. Select the text above and copy it.',
  noAnswer: 'No answer',
  allHead: 'Right answers',
  // AP style times: 6 p.m., 6:30 a.m., noon, midnight.
  apTime: (d) => { const h = d.getHours(), m = d.getMinutes(); if (!m && h === 0) return 'midnight'; if (!m && h === 12) return 'noon'; return `${h % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`; },
  comeBack: (time) => `New questions at ${time} your time`,

  // Share marks, from no answer to 20,000 points and up.
  // Island time answers get the coconut; skips get the wave.
  marks: ['🌊', '🐚', '🦀', '🐢', '🦎'],
  islandMark: '🥥',
  markAhead: '🏝️',
  // Shared result, MapTap style: link and date, the row of marks, the score.
  share: (date, mario, marks, total) => `pacoisland.fun ${date}${mario ? `, Mario's mode` : ''}\n${marks}\nFinal score: ${total}`,
  // AP style date: "Nov. 17," "March 3."
  apDate: (d) => `${['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'][d.getUTCMonth()]} ${d.getUTCDate()}`,

  // Levels. Mario is Paco's iguana twin brother and his rival on the island.
  level: {
    legend: 'Choose a level',
    paco: "Paco's mode",
    pacoNote: '25 seconds a question, full points',
    mario: "Mario's mode",
    marioNote: '40 seconds a question, half points',
  },
  marioIntro: "Mario is Paco's twin brother. His questions are easier.",
  suggestMario: "Mario's questions are easier.",
  playMario: "Play Mario's mode",
  marioTag: "Mario's mode",

  // Endless mode: a new set of seven questions each round, with every trip open.
  // Screens: docs/endless-mode-screens.md.
  endless: {
    modeLegend: 'Choose how to play',
    daily: "Today's trip",
    dailyNote: 'Same seven questions for everyone',
    name: 'Endless mode',
    note: 'New questions each round, all trips open',
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
  },

  moveHeading: 'Play on another device',
  moveBody: 'Open this link on your other device to bring your points and trips.',
  copyLink: 'Copy link',
  close: 'Close',
  importHeading: 'Use the points from your other device?',
  importBody: (pts) => `This link has ${pts.toLocaleString('en-US')} ${pts === 1 ? 'point' : 'points'}. They replace the points and trips on this device.`,
  importYes: 'Use those points',
  importNo: "Keep this device's points",
  importBad: "This link didn't work. Copy it again from your other device.",
  noScene: 'The picture needs WebGL, which is off in this browser. You can still play.',
};
if (typeof module !== 'undefined') module.exports = Copy;
