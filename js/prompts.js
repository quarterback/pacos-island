/* Paco's Island: questions.

   A question is one closed list, or a group inside it, cut by one rule. The
   rule is checked against every real name an item has, so "Ivory Coast"
   counts for a question about the letter Y even though the display name
   has none. Some questions ask for a whole group ("Name a country in South
   America") with no letter rule at all.

   Every question gets an ease score from how many of its answers most
   people know. A set of seven opens with two questions anyone can answer,
   then three medium and two hard ones, and mixes kinds and subjects. */
'use strict';
const Prompts = (() => {
  const D = typeof Data !== 'undefined' ? Data : require('./data.js');

  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/&/g, ' and ').replace(/['’.]/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/^the /, '');
  const letters = (s) => norm(s).replace(/[^a-z]/g, '');
  const words = (s) => norm(s).split(' ').filter(Boolean);

  // ---- the combined team list, for questions across leagues ----
  const LEAGUES = ['nba', 'nfl', 'mlb', 'nhl'];
  const teamMap = new Map();
  for (const lg of LEAGUES) for (const it of D.UNIVERSES[lg].items) {
    const k = it.name;
    if (!teamMap.has(k)) teamMap.set(k, { name: k, aliases: [], names: [k], tier: it.tier, fam: it.fam, leagues: [] });
    const t = teamMap.get(k); t.leagues.push(lg); t.tier = Math.min(t.tier, it.tier); t.fam = Math.max(t.fam, it.fam);
    for (const a of it.aliases) if (!t.aliases.includes(a)) t.aliases.push(a);
  }
  const TEAMS = { id: 'teams', items: [...teamMap.values()], short: 'team nickname' };
  const UNI = { ...D.UNIVERSES, teams: TEAMS };

  // Subjects, so a set doesn't lean on one kind of knowledge.
  const SUBJECT = {
    countries: 'geo', capitals: 'geo', states: 'geo', statecaps: 'geo', mexico: 'geo',
    nba: 'sports', nfl: 'sports', mlb: 'sports', nhl: 'sports', teams: 'sports',
    elements: 'science', constellations: 'science',
    presidents: 'history', bible: 'books', greek: 'words', nato: 'words',
    nflcities: 'sports', nbacities: 'sports', mlbcities: 'sports', nhlcities: 'sports', worldcup: 'sports', ucl: 'sports', premier: 'sports', olympics: 'sports',
    bestpicture: 'movies', pixar: 'movies', bond: 'movies', princesses: 'movies', starwars: 'movies', friends: 'movies', avengers: 'movies', dwarfs: 'movies',
    swift: 'music', beatles: 'music', thriller: 'music', bts: 'music',
    potter: 'books', narnia: 'books', austen: 'books', shakespeare: 'books',
    planets: 'basics', continents: 'basics', rainbow: 'basics', reindeer: 'basics',
    chess: 'games', monopoly: 'games', cluesuspects: 'games', clueweapons: 'games', cluerooms: 'games', rubik: 'games', poker: 'games',
    wonders: 'history', henry: 'history', olympians: 'history', bills: 'history',
  };
  const SUBJECT_MAX = { geo: 3, sports: 2, movies: 2, music: 2 };
  // Lists most players know little about come up less often.
  const LIST_WEIGHT = { mexico: 0.4, constellations: 0.6 };

  // How each list's letter questions begin.
  const LEAD = {
    countries: 'Name a country whose name',
    capitals: 'Name a world capital whose name',
    states: 'Name a U.S. state whose name',
    statecaps: 'Name a U.S. state capital whose name',
    mexico: 'Name a Mexican state whose name',
    elements: 'Name a chemical element whose name',
    nba: 'Name a National Basketball Association (NBA) team whose nickname',
    nfl: 'Name a National Football League (NFL) team whose nickname',
    mlb: 'Name a Major League Baseball (MLB) team whose nickname',
    nhl: 'Name a National Hockey League (NHL) team whose nickname',
    nflcities: 'Name a city with a National Football League (NFL) team whose name',
    nbacities: 'Name a city with a National Basketball Association (NBA) team whose name',
    mlbcities: 'Name a city with a Major League Baseball (MLB) team whose name',
    nhlcities: 'Name a city with a National Hockey League (NHL) team whose name',
    ucl: 'Name a Champions League winner whose name',
    premier: 'Name a Premier League club whose name',
    olympics: 'Name a Summer Olympics host city whose name',
    bestpicture: 'Name a best picture winner whose title',
    pixar: 'Name a Pixar movie whose title',
    bond: 'Name a James Bond movie whose title',
    princesses: 'Name a Disney princess whose name',
    beatles: 'Name a Beatles No. 1 hit whose title',
    shakespeare: 'Name a Shakespeare play whose title',
    monopoly: 'Name a Monopoly property whose name',
    olympians: 'Name a Greek god whose name',
    presidents: 'Name a U.S. president whose last name',
    constellations: 'Name a constellation whose name',
    greek: 'Name a Greek letter whose name',
    nato: 'Name a pilot\'s code word for a letter that',
    bible: 'Name a book of the Bible whose name',
  };
  // Notes after a question. None of them may name a right answer.
  const TAIL = {};

  const RULES = [];
  for (const L of 'abcdefghijklmnopqrstuvwxyz') {
    const U = L.toUpperCase();
    RULES.push({ key: 'has-' + L, says: `has the letter ${U} in it`, test: (n) => letters(n).includes(L) });
    RULES.push({ key: 'starts-' + L, says: `starts with ${U}`, test: (n) => letters(n).startsWith(L) });
    RULES.push({ key: 'ends-' + L, says: `ends with ${U}`, test: (n) => letters(n).endsWith(L) });
  }
  for (const L of 'aeiou') RULES.push({ key: 'lacks-' + L, says: `has no letter ${L.toUpperCase()} in it`, test: (n) => !letters(n).includes(L) });
  for (const n of [4, 5, 6]) RULES.push({ key: 'max-' + n, says: `has ${['four', 'five', 'six'][n - 4]} letters or fewer`, test: (s) => letters(s).length <= n });
  for (const n of [10, 11, 12]) RULES.push({ key: 'min-' + n, says: `has ${n} letters or more`, test: (s) => letters(s).length >= n });
  RULES.push({ key: 'words', says: 'is more than one word', test: (s) => words(s).length > 1 });
  RULES.push({ key: 'same-ends', says: 'starts and ends with the same letter', test: (s) => { const l = letters(s); return l.length > 1 && l[0] === l[l.length - 1]; } });
  RULES.push({ key: 'double', says: 'has the same letter twice in a row', test: (s) => /(.)\1/.test(letters(s)) });

  // Build the answer set: each item that qualifies, with the names that do.
  function cut(universe, test) {
    const out = [];
    for (const it of universe.items) {
      const ok = it.names.filter((n) => test(n, it));
      if (ok.length) out.push({ item: it, names: ok });
    }
    return out;
  }

  const MIN = 6, MAX = 55, WHOLE_MAX = 60;
  const pool = [];
  const add = (q) => { if (q.answers.length >= MIN && q.answers.length <= (q.kind === 'list' ? WHOLE_MAX : MAX)) pool.push(q); };

  // Letter questions on whole lists.
  for (const uid of Object.keys(LEAD)) {
    const u = UNI[uid];
    for (const r of RULES) {
      if (uid === 'nato' && r.key.startsWith('has-')) continue; // too close to spelling the alphabet
      const answers = cut(u, r.test);
      if (answers.length > u.items.length * 0.6) continue;
      add({ id: `${uid}.${r.key}`, universe: uid, kind: 'letter', text: `${LEAD[uid]} ${r.says}.${TAIL[uid] || ''}`, answers });
    }
  }

  // Groups inside a list: a whole group question, and letter questions on
  // groups big enough to cut.
  const byNames = (names) => (n, it) => names.includes(it.name);
  const CONT = { africa: 'Africa', europe: 'Europe', asia: 'Asia', northAmerica: 'North America', southAmerica: 'South America', oceania: 'Oceania' };
  const groups = [];
  for (const [k, place] of Object.entries(CONT)) {
    const names = D.CONTINENT[k];
    groups.push({ id: `countries.${k}`, universe: 'countries', test: byNames(names), whole: `Name a country in ${place}.`, lead: `Name a country in ${place} whose name`, note: '' });
    groups.push({ id: `capitals.${k}`, universe: 'capitals', test: (n, it) => names.includes(it.country), whole: `Name a capital city in ${place}.`, lead: `Name a capital city in ${place} whose name`, note: '' });
  }
  const REGION_NAME = { northeast: 'the Northeast', midwest: 'the Midwest', south: 'the South', west: 'the West' };
  for (const [k, names] of Object.entries(D.REGION)) groups.push({ id: `states.${k}`, universe: 'states', test: byNames(names), whole: `Name a state in ${REGION_NAME[k]}.` });
  groups.push({ id: 'bible.nt', universe: 'bible', test: byNames(D.NEW_TESTAMENT), whole: 'Name a book of the New Testament.' });
  groups.push({ id: 'bible.ot', universe: 'bible', test: (n, it) => !D.NEW_TESTAMENT.includes(it.name), whole: 'Name a book of the Old Testament.' });

  for (const g of groups) {
    const all = cut(UNI[g.universe], g.test);
    add({ id: g.id, universe: g.universe, kind: 'list', text: g.whole, answers: all });
    if (!g.lead) continue;
    for (const r of RULES) {
      const answers = cut(UNI[g.universe], (n, it) => g.test(n, it) && r.test(n, it));
      if (answers.length > all.length * 0.6) continue;
      add({ id: `${g.id}.${r.key}`, universe: g.universe, kind: 'letter', text: `${g.lead} ${r.says}.${g.note || ''}`, answers });
    }
  }

  // Whole lists and hand made lists.
  const BORDERS = {
    china: ['Afghanistan', 'Bhutan', 'India', 'Kazakhstan', 'North Korea', 'Kyrgyzstan', 'Laos', 'Mongolia', 'Myanmar', 'Nepal', 'Pakistan', 'Russia', 'Tajikistan', 'Vietnam'],
    russia: ['Norway', 'Finland', 'Estonia', 'Latvia', 'Lithuania', 'Poland', 'Belarus', 'Ukraine', 'Georgia', 'Azerbaijan', 'Kazakhstan', 'China', 'Mongolia', 'North Korea'],
    germany: ['Denmark', 'Poland', 'Czechia', 'Austria', 'Switzerland', 'France', 'Luxembourg', 'Belgium', 'Netherlands'],
    brazil: ['Argentina', 'Bolivia', 'Colombia', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'],
  };
  const lists = [
    ['countries.landlocked', 'countries', 'Name a landlocked country.', byNames(D.LANDLOCKED)],
    ['countries.stan', 'countries', 'Name a country whose name ends in "stan."', (n) => letters(n).endsWith('stan')],
    ['countries.borders-china', 'countries', 'Name a country that borders China.', byNames(BORDERS.china)],
    ['countries.borders-russia', 'countries', 'Name a country that borders Russia.', byNames(BORDERS.russia)],
    ['countries.borders-germany', 'countries', 'Name a country that borders Germany.', byNames(BORDERS.germany)],
    ['countries.borders-brazil', 'countries', 'Name a country that borders Brazil.', byNames(BORDERS.brazil)],
    ['states.all', 'states', 'Name a U.S. state.', () => true],
    ['states.canada', 'states', 'Name a state that borders Canada.', byNames(D.STATE_LISTS.canada)],
    ['states.mississippi', 'states', 'Name a state on the river that runs past New Orleans.', byNames(D.STATE_LISTS.mississippi)],
    ['states.colonies', 'states', 'Name one of the 13 original colonies.', byNames(D.STATE_LISTS.colonies)],
    ['states.atlantic', 'states', 'Name a state on the Atlantic coast.', byNames(D.STATE_LISTS.atlantic)],
    ['states.great-lakes', 'states', 'Name a state on the Great Lakes.', byNames(D.STATE_LISTS.greatLakes)],
    ['statecaps.all', 'statecaps', 'Name a U.S. state capital.', () => true],
    ['mexico.all', 'mexico', 'Name a Mexican state.', () => true],
    ['mexico.pacific', 'mexico', 'Name a Mexican state on the Pacific coast.', byNames(D.MX_PACIFIC)],
    ['nba.all', 'nba', 'Name a National Basketball Association (NBA) team.', () => true],
    ['nfl.all', 'nfl', 'Name a National Football League (NFL) team.', () => true],
    ['mlb.all', 'mlb', 'Name a Major League Baseball (MLB) team.', () => true],
    ['nhl.all', 'nhl', 'Name a National Hockey League (NHL) team.', () => true],
    ['nflcities.all', 'nflcities', 'Name a city with a National Football League (NFL) team.', () => true],
    ['nbacities.all', 'nbacities', 'Name a city with a National Basketball Association (NBA) team.', () => true],
    ['mlbcities.all', 'mlbcities', 'Name a city with a Major League Baseball (MLB) team.', () => true],
    ['nhlcities.all', 'nhlcities', 'Name a city with a National Hockey League (NHL) team.', () => true],
    ['worldcup.all', 'worldcup', "Name a country that has won the men's World Cup.", () => true],
    ['ucl.all', 'ucl', 'Name a soccer club that has won the Champions League.', () => true],
    ['premier.all', 'premier', 'Name a Premier League club.', () => true],
    ['olympics.all', 'olympics', 'Name a city that has hosted the Summer Olympics.', () => true],
    ['bestpicture.since-1990', 'bestpicture', 'Name a best picture winner since 1990.', byNames(D.BEST_PICTURE_RECENT)],
    ['pixar.all', 'pixar', 'Name a Pixar movie.', () => true],
    ['pixar.toy-story', 'pixar', 'Name a Pixar movie outside the "Toy Story" series.', (n, it) => !it.name.startsWith('Toy Story')],
    ['bond.all', 'bond', 'Name a James Bond movie.', () => true],
    ['princesses.all', 'princesses', 'Name a Disney princess.', () => true],
    ['starwars.all', 'starwars', 'Name a "Star Wars" movie.', () => true],
    ['friends.all', 'friends', 'Name a main character on "Friends."', () => true],
    ['avengers.all', 'avengers', 'Name one of the original Avengers.', () => true],
    ['dwarfs.all', 'dwarfs', 'Name one of the Seven Dwarfs.', () => true],
    ['swift.all', 'swift', 'Name a Taylor Swift album.', (n, it) => it.name !== 'Taylor Swift'],
    ['beatles.all', 'beatles', 'Name a Beatles No. 1 hit.', () => true],
    ['thriller.all', 'thriller', "Name a song on Michael Jackson's best-selling album.", () => true],
    ['bts.all', 'bts', 'Name a member of the K-pop group BTS.', () => true],
    ['potter.all', 'potter', 'Name a "Harry Potter" book.', () => true],
    ['narnia.all', 'narnia', 'Name a Narnia book.', () => true],
    ['austen.all', 'austen', 'Name a Jane Austen novel.', () => true],
    ['shakespeare.all', 'shakespeare', 'Name a Shakespeare play.', () => true],
    ['planets.all', 'planets', 'Name a planet.', () => true],
    ['continents.all', 'continents', 'Name a continent.', () => true],
    ['rainbow.all', 'rainbow', 'Name a color of the rainbow.', () => true],
    ['reindeer.all', 'reindeer', "Name one of Santa's reindeer.", () => true],
    ['chess.all', 'chess', 'Name a chess piece.', () => true],
    ['monopoly.all', 'monopoly', 'Name a Monopoly property.', () => true],
    ['monopoly.avenue', 'monopoly', 'Name a Monopoly property whose name ends in "Avenue."', (n, it) => it.name.endsWith('Avenue')],
    ['cluesuspects.all', 'cluesuspects', 'Name a suspect in Clue.', () => true],
    ['clueweapons.all', 'clueweapons', 'Name a weapon in Clue.', () => true],
    ['cluerooms.all', 'cluerooms', 'Name a room in Clue.', () => true],
    ['rubik.all', 'rubik', "Name a color on a Rubik's Cube.", () => true],
    ['poker.all', 'poker', 'Name a poker hand.', () => true],
    ['wonders.all', 'wonders', 'Name an ancient wonder of the world.', () => true],
    ['henry.all', 'henry', "Name one of Henry VIII's wives.", () => true],
    ['olympians.all', 'olympians', 'Name a Greek god.', () => true],
    ['bills.all', 'bills', 'Name a face on U.S. paper money.', () => true],
    ['teams.shared', 'teams', 'Name a team nickname used in two sports.', (n, it) => it.leagues.length > 1],
    ['teams.birds', 'teams', 'Name a pro team named after a bird.', byNames(['Hawks', 'Pelicans', 'Cardinals', 'Falcons', 'Ravens', 'Eagles', 'Seahawks', 'Blue Jays', 'Orioles', 'Penguins', 'Ducks'])],
    ['teams.weather', 'teams', 'Name a pro team named after the weather or the sky.', byNames(['Thunder', 'Heat', 'Suns', 'Hurricanes', 'Lightning', 'Stars'])],
    ['teams.california', 'teams', 'Name a pro team from California.', byNames(D.TEAM_PLACES.california)],
    ['teams.texas', 'teams', 'Name a pro team from Texas.', byNames(D.TEAM_PLACES.texas)],
    ['teams.florida', 'teams', 'Name a pro team from Florida.', byNames(D.TEAM_PLACES.florida)],
    ['teams.new-york', 'teams', 'Name a pro team from New York State.', byNames(D.TEAM_PLACES.newYork)],
    ['teams.canada', 'teams', 'Name a pro team from Canada.', byNames(D.TEAM_PLACES.canada)],
    ['teams.pennsylvania', 'teams', 'Name a pro team from Pennsylvania.', byNames(D.TEAM_PLACES.pennsylvania)],
    ['presidents.all', 'presidents', 'Name a U.S. president.', () => true],
    ['presidents.democrat', 'presidents', 'Name a Democratic president.', byNames(D.PARTY.democrat)],
    ['presidents.republican', 'presidents', 'Name a Republican president.', byNames(D.PARTY.republican)],
    ['presidents.since-1950', 'presidents', 'Name a president since 1950.', byNames(D.PRES_LISTS.since1950)],
    ['presidents.1800s', 'presidents', 'Name a president from the 1800s.', byNames(D.PRES_LISTS.the1800s)],
    ['elements.first-20', 'elements', 'Name one of the first 20 elements.', (n, it) => it.z <= 20],
    ['elements.first-10', 'elements', 'Name one of the first 10 elements.', (n, it) => it.z <= 10],
    ['elements.one-letter', 'elements', 'Name an element with a one-letter symbol.', (n, it) => it.symbol.length === 1],
    ['elements.odd-symbol', 'elements', 'Name an element whose symbol starts with a different letter.', (n, it) => it.symbol[0].toLowerCase() !== letters(it.name)[0]],
    ['elements.noble', 'elements', 'Name a noble gas.', byNames(D.ELEMENT_LISTS.noble)],
    ['elements.halogens', 'elements', 'Name a halogen.', byNames(D.ELEMENT_LISTS.halogens)],
    ['elements.alkali', 'elements', 'Name an alkali metal.', byNames(D.ELEMENT_LISTS.alkali)],
    ['elements.over-100', 'elements', 'Name an element numbered over 100.', (n, it) => it.z > 100],
    ['constellations.zodiac', 'constellations', 'Name a sign of the zodiac.', byNames(D.ZODIAC)],
    ['greek.all', 'greek', 'Name a letter of the Greek alphabet.', () => true],
    ['nato.all', 'nato', "Name a pilot's code word for a letter.", () => true],
    ['bible.all', 'bible', 'Name a book of the Bible.', () => true],
  ];
  for (const [id, universe, text, test] of lists) add({ id, universe, kind: 'list', text, answers: cut(UNI[universe], test) });

  // ---- how easy a question is ----
  // Each answer counts toward ease by how familiar it is: fully at a score of
  // 4.8 or more (Canada, Lakers), a quarter at 4.0, nothing under 3.2.
  // Questions almost nobody could answer are dropped.
  const known = (fam) => Math.pow(Math.min(1, Math.max(0, (fam - 3.2) / 1.6)), 2);
  for (const q of pool) {
    q.ease = q.answers.reduce((s, a) => s + known(a.item.fam), 0);
    q.level = q.ease >= 3 ? 'easy' : q.ease >= 1.5 ? 'medium' : 'hard';
  }
  for (let i = pool.length - 1; i >= 0; i--) if (pool[i].ease < 0.1) pool.splice(i, 1);

  // Openers: questions anyone can answer without special knowledge. Whole
  // lists everyone knows, and easy letter questions on the most familiar
  // lists.
  const OPENERS = new Set(['states.all', 'nba.all', 'nfl.all', 'mlb.all', 'nhl.all', 'presidents.all', 'presidents.since-1950',
    'countries.europe', 'countries.southAmerica', 'countries.africa', 'countries.asia', 'countries.northAmerica',
    'capitals.europe', 'states.atlantic', 'states.colonies', 'states.west', 'states.south', 'states.midwest', 'states.northeast',
    'constellations.zodiac', 'teams.california', 'teams.texas', 'teams.florida', 'teams.new-york', 'teams.canada', 'teams.pennsylvania',
    'greek.all', 'nato.all', 'bible.all', 'statecaps.all',
    'nflcities.all', 'nbacities.all', 'mlbcities.all', 'nhlcities.all', 'worldcup.all', 'olympics.all', 'bestpicture.since-1990',
    'pixar.all', 'pixar.toy-story', 'bond.all', 'princesses.all', 'starwars.all', 'friends.all', 'avengers.all', 'dwarfs.all',
    'swift.all', 'beatles.all', 'thriller.all', 'potter.all', 'shakespeare.all', 'planets.all', 'continents.all', 'rainbow.all',
    'reindeer.all', 'chess.all', 'monopoly.all', 'cluesuspects.all', 'clueweapons.all', 'rubik.all', 'poker.all', 'olympians.all', 'bills.all']);
  const EVERYDAY = new Set(['countries', 'states', 'nba', 'nfl', 'presidents', 'capitals', 'nflcities', 'nbacities']);
  // Only simple letter rules open a set: starts with a letter, or has one.
  const simple = (q) => /\.(starts|has)-[a-z]$/.test(q.id);
  for (const q of pool) q.opener = OPENERS.has(q.id) || (q.kind === 'letter' && EVERYDAY.has(q.universe) && simple(q) && q.ease >= 4);

  // ---- sets of seven ----
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(list, r) { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // Two openers, three medium, two hard. Each question comes from a different
  // list, no subject takes more than its share, and at most three of the
  // seven are letter questions.
  // Mario's mode, the easier level, runs two openers and five easy ones.
  const SHAPE = ['opener', 'opener', 'medium', 'medium', 'medium', 'hard', 'hard'];
  const MARIO_SHAPE = ['opener', 'opener', 'gentle', 'gentle', 'gentle', 'gentle', 'gentle'];
  const byLevel = { opener: pool.filter((q) => q.opener), easy: [], medium: [], hard: [] };
  for (const q of pool) if (!q.opener) byLevel[q.level].push(q);
  // Mario skips letter counting and "has no letter" rules.
  byLevel.gentle = [...byLevel.easy.filter((q) => q.kind === 'list' || simple(q)), ...byLevel.opener];
  byLevel.medium.push(...byLevel.easy);
  function makeSet(seed, avoid = new Set(), level = 'paco') {
    const shape = level === 'mario' ? MARIO_SHAPE : SHAPE;
    const r = rng(seed);
    const lists = new Set(), subjects = {}; let letterCount = 0;
    const set = [];
    for (const level of shape) {
      const fits = (q, strict) => !lists.has(q.universe) && (subjects[SUBJECT[q.universe]] || 0) < (SUBJECT_MAX[SUBJECT[q.universe]] || 1) + (strict || SUBJECT[q.universe] === 'sports' ? 0 : 1)
        && !(q.kind === 'letter' && letterCount >= 3 && strict) && !set.includes(q);
      let pick = null;
      for (const fresh of [true, false]) {
        for (const strict of [true, false]) {
          const cands = byLevel[level].filter((q) => fits(q, strict) && (!fresh || !avoid.has(q.id)));
          // Pick a list first, weighted by the square root of how many
          // questions it has, then a question from it, so big lists like
          // countries don't crowd out small ones.
          const lists = [...new Set(cands.map((q) => q.universe))];
          if (lists.length) {
            const inList = (u) => cands.filter((q) => q.universe === u);
            const w = lists.map((u) => Math.sqrt(inList(u).length) * (LIST_WEIGHT[u] || 1));
            let x = r() * w.reduce((a, b) => a + b, 0), i = 0;
            while (x > w[i] && i < w.length - 1) { x -= w[i]; i++; }
            const qs = inList(lists[i]); pick = qs[Math.floor(r() * qs.length)];
          }
          if (pick) break;
        }
        if (pick) break;
      }
      if (!pick) pick = shuffle(pool, r).find((q) => !set.includes(q) && !lists.has(q.universe)) || shuffle(pool, r).find((q) => !set.includes(q));
      set.push(pick); lists.add(pick.universe);
      subjects[SUBJECT[pick.universe]] = (subjects[SUBJECT[pick.universe]] || 0) + 1;
      if (pick.kind === 'letter') letterCount++;
    }
    return set;
  }

  // Daily sets: a fixed run built ahead, each day avoiding the questions of
  // the 30 days before it.
  const buildDays = (level, seed) => {
    const days = [], recent = [];
    for (let d = 0; d < 365; d++) {
      const set = makeSet(seed + d * 7919, new Set(recent.flat()), level);
      days.push(set); recent.push(set.map((q) => q.id)); if (recent.length > 30) recent.shift();
    }
    return days;
  };
  const DAYS = buildDays('paco', 20261117), MARIO_DAYS = buildDays('mario', 20261118);

  const byId = new Map(pool.map((q) => [q.id, q]));
  const forDay = (n, level = 'paco') => (level === 'mario' ? MARIO_DAYS : DAYS)[(n - 1) % DAYS.length];
  const get = (id) => byId.get(id);
  const universe = (id) => UNI[id];
  return { pool, DAYS, MARIO_DAYS, forDay, makeSet, get, universe, norm, letters };
})();
if (typeof module !== 'undefined') module.exports = Prompts;
