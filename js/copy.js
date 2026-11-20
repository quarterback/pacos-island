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
    'Rarer answers earn more points, up to 108,000.',
    'Your marks: 🐚 common, 🦀 uncommon, 🐢 rare, 🦎 a deep cut, 🥥 island time, 🌊 no answer.',
    'Answer in the first 5 seconds for the full speed bonus. It fades fast after 10 seconds.',
    'Vacation mode has no clock. Maria brings a drink or a plate from her café for every right answer.',
  ],
  tripLegend: 'Choose a trip',
  tripOpens: (n) => `Opens at ${n.toLocaleString('en-US')} points`,
  start: "Start today's trip",
  resume: "Finish today's trip",
  seeResults: "See today's results",
  home: 'Home',
  // Your scores: every finished day on this device
  scores: {
    link: 'Your scores',
    head: 'Your scores',
    back: 'Back',
    none: "Finish a day's trip and its score shows up here.",
    played: 'Days played',
    streak: 'Current streak',
    best: 'Best streak',
    bestDay: 'Best day',
    average: 'Average',
    lifetime: 'Lifetime points',
    days: (n) => `${n.toLocaleString('en-US')} ${n === 1 ? 'day' : 'days'}`,
    everyDay: 'Every day',
    mario: "Mario's mode",
    vacation: 'Vacation mode',
  },
  // iPhone Safari deletes a site's saved data after seven days without a visit
  keepTip: "Safari deletes saved scores after seven days without a visit. Add Paco's Island to your Home Screen to keep them.",
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
    deliver: (s) => `Tío wheeled you to ${s}`,
    market: (s) => `Paco walked you to ${s}`,
    fly: (s) => `Esmeralda flew you to ${s}`,
    dive: (s) => `Paco took you down ${s}`,
  },
  nextStop: (name, n) => `${n.toLocaleString('en-US')} ${n === 1 ? 'point' : 'points'} short of ${name}`,
  madeIt: { boat: 'Paco got you all the way to his island', walk: 'Paco walked you all the way to Cascada Ixtalita', atv: 'Paco drove you all the way to the upper waterfall', deliver: 'Tío wheeled you all the way to the michelada bar', market: 'Paco walked you all the way to the church steps', fly: "Esmeralda flew you all the way to her nest" },
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
  tripShort: { boat: 'boat trip', walk: 'walk', atv: 'ATV ride', deliver: 'deliveries', market: 'night market', fly: 'flight', dive: 'dive' },
  copyResult: 'Copy my result',
  // the benchmark: a field of simulated players on the same questions
  beat: (n) => `Better than ${n}% of simulated players`,
  beatShort: (n) => `better than ${n}%`,
  // the key to the marks, with that level's thresholds
  // Vacation mode has no clock, so no island time.
  markKey: (t, vacation) => ['🌊 No answer', `🐚 Under ${t[0]}`, `🦀 Under ${t[1]}`, `🐢 Under ${t[2]}`, `🦎 ${t[2]} and up`, ...(vacation ? [] : ['🥥 Island time'])],
  copied: 'Copied',
  copyFailed: 'Your browser blocked copying. Select the text above and copy it.',
  noAnswer: 'No answer',
  allHead: 'Right answers',
  // AP style times: 6 p.m., 6:30 a.m., noon, midnight.
  apTime: (d) => { const h = d.getHours(), m = d.getMinutes(); if (!m && h === 0) return 'midnight'; if (!m && h === 12) return 'noon'; return `${h % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`; },
  comeBack: (time) => `New questions at ${time} your time`,

  // Share marks, from no answer to a deep cut. Thresholds live in app.js (bucket).
  // Island time answers get the coconut; skips get the wave.
  marks: ['🌊', '🐚', '🦀', '🐢', '🦎'],
  islandMark: '🥥',
  markAhead: '🏝️',
  // Shared result, MapTap style: link and date, the row of marks, the score.
  share: (date, tag, marks, total) => `pacoisland.fun ${date}${tag ? `, ${tag}` : ''}\n${marks}\nFinal score: ${total}`,
  // AP style date: "Nov. 17," "March 3."
  apDate: (d) => `${['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'][d.getUTCMonth()]} ${d.getUTCDate()}`,

  // Levels. Mario is Paco's iguana twin brother and his rival on the island.
  level: {
    legend: 'Choose a level',
    paco: "Paco's mode",
    pacoNote: '25 seconds a question, full points',
    mario: "Mario's mode",
    marioNote: '40 seconds a question, half points',
    vacation: 'Vacation mode',
    vacationNote: 'No clock, easier questions',
  },
  // Vacation mode: its own daily set with no clock, the easiest questions and
  // points for rarity alone. Maria, who runs the café by the beach, hosts it
  // and brings a drink or a plate for every right answer. Its mark is the
  // hibiscus.
  vacation: {
    mark: '🌺',
    tag: '🌺 Vacation mode',
    intro: 'Maria runs the café by the beach. Have a drink and take your time. Points come only from how rare your answer is.',
    progress: (i) => `🌺 Question ${i} of 7`,
    maria: 'Maria',
    // Maria's lines when she brings a treat, in turn
    serve: [
      'Sit back. The next question can wait.',
      'Take all the time you need.',
      'No clock at my café.',
      'Put your feet up. You earned it.',
      'Enjoy the breeze, then the next one.',
      'Nobody rushes on vacation.',
      "Sip slow. I'll be right here.",
    ],
    // on Stumped, in place of Mario
    stumped: [
      'No worries. Have another sip.',
      'Even my regulars miss that one.',
      "Skip it. The view's the same either way.",
      "Next one's yours. I can tell.",
      'That one can wait for your next vacation.',
      'Questions come and go. The beach stays.',
    ],
    // the menu, in Spanish with a few words of English
    menu: {
      horchata: ['Horchata', 'Rice milk with cinnamon'],
      jamaica: ['Agua de jamaica', 'Iced hibiscus tea'],
      coco: ['Coco frío', 'A cold coconut with a straw'],
      limonada: ['Limonada', 'Fresh limeade'],
      cafe: ['Café de olla', 'Coffee spiced with cinnamon'],
      mango: ['Licuado de mango', 'A mango smoothie'],
      sandia: ['Agua de sandía', 'A watermelon cooler'],
      tacos: ['Tacos de pescado', 'Fish tacos'],
      ceviche: ['Ceviche', 'Shrimp in lime juice, with a tostada'],
      chilaquiles: ['Chilaquiles', 'Tortilla chips in red salsa with an egg'],
      zarandeado: ['Pescado zarandeado', 'Grilled snapper with lime'],
      conchas: ['Conchas', 'Sweet rolls with a sugar shell'],
      flan: ['Flan', 'Caramel custard'],
      elote: ['Elote', 'Grilled corn with chile and lime'],
      quesadilla: ['Quesadilla', 'Melted cheese in a warm tortilla'],
    },
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

  moveHeading: 'Back up your scores',
  moveBody: 'Save this link somewhere safe, or open it on another device. It brings your scores, points and trips.',
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
