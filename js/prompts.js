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
  const LEAGUES = ['nba', 'nfl', 'mlb', 'nhl', 'pwhl', 'nwsl', 'mlv'];
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
    nba: 'sports', nfl: 'sports', mlb: 'sports', nhl: 'sports', teams: 'sports', pwhl: 'sports', nwsl: 'sports', mlv: 'sports',
    elements: 'science', constellations: 'science',
    presidents: 'history', bible: 'books', greek: 'words', nato: 'words',
    nflcities: 'sports', nbacities: 'sports', mlbcities: 'sports', nhlcities: 'sports', worldcup: 'sports', ucl: 'sports', premier: 'sports', olympics: 'sports',
    bestpicture: 'movies', pixar: 'movies', bond: 'movies', princesses: 'movies', starwars: 'movies', friends: 'tv', avengers: 'movies', dwarfs: 'movies',
    swift: 'music', beatles: 'music', thriller: 'music', bts: 'music',
    potter: 'books', narnia: 'books', austen: 'books', shakespeare: 'books',
    planets: 'basics', continents: 'basics', rainbow: 'basics', reindeer: 'basics',
    chess: 'games', monopoly: 'games', cluesuspects: 'games', clueweapons: 'games', cluerooms: 'games', rubik: 'games', poker: 'games',
    wonders: 'history', henry: 'history', olympians: 'history', bills: 'history',
    housewives: 'tv', kardashians: 'tv', sharks: 'tv', idol: 'tv',
    tools: 'home', pasta: 'food', citrus: 'food', cheese: 'food', wine: 'drink',
    dahl: 'books', littlehouse: 'books', dickens: 'books', bronte: 'books', littlewomen: 'books', bennets: 'books', hungergames: 'books',
    spice: 'music', destinys: 'music', lloydwebber: 'stage', soundofmusic: 'stage', grease: 'stage',
    bridgerton: 'tv', peanuts: 'tv', oz: 'movies', tudors: 'history', birthstones: 'style',
    herbs: 'food', spices: 'food', apples: 'food', squash: 'food', starbucks: 'drink',
  };
  // Subjects are picked evenly, so a round reads like a mixed quiz night.
  // Sports, geography and science each have many lists and letter questions,
  // so they come up a little less often than the rest.
  const SUBJECT_WEIGHT = { sports: 0.6, geo: 0.8, science: 0.6, words: 0.5 };
  // A round never asks two questions on the same subject.
  const subjectOf = (q) => q.subject || SUBJECT[q.universe];
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
    pasta: 'Name a kind of pasta whose name',
    cheese: 'Name a cheese whose name',
    tools: 'Name a tool whose name',
    wine: 'Name a wine grape whose name',
    spices: 'Name a spice whose name',
    apples: 'Name an apple whose name',
    birthstones: 'Name a birthstone whose name',
  };
  // Notes after a question. None of them may name a right answer.
  const TAIL = {};

  const RULES = [];
  for (const L of 'abcdefghijklmnopqrstuvwxyz') {
    const U = L.toUpperCase();
    RULES.push({ key: 'has-' + L, says: `has the letter ${U} in it`, test: (n) => letters(n).includes(L) });
    RULES.push({ key: 'starts-' + L, says: `starts with ${U}`, test: (n) => letters(n).startsWith(L) });
  }
  // Only the plain letter rules. Letter questions are a twist in a round,
  // never its backbone; see docs/QUESTION-WRITING.md.

  // Build the answer set: each item that qualifies, with the names that do.
  function cut(universe, test) {
    const out = [];
    for (const it of universe.items) {
      const ok = it.names.filter((n) => test(n, it));
      if (ok.length) out.push({ item: it, names: ok });
    }
    return out;
  }

  const MIN = 6, MAX = 55, WHOLE_MAX = 100;
  const pool = [];
  // A whole list question can have as few as five answers (the Spice Girls).
  // Hand-written questions like "Name a bird" may run to 400 answers: the
  // more real answers a list takes, the fewer good guesses it turns away.
  const add = (q) => { if (q.answers.length >= (q.kind === 'list' ? 5 : MIN) && q.answers.length <= (q.angle ? 400 : q.kind === 'list' ? WHOLE_MAX : MAX)) pool.push(q); };

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
    ['nwsl.all', 'nwsl', "Name a National Women's Soccer League (NWSL) team.", () => true],
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
    ['teams.birds', 'teams', 'Name a pro team named after a bird.', byNames(['Hawks', 'Pelicans', 'Cardinals', 'Falcons', 'Ravens', 'Eagles', 'Seahawks', 'Blue Jays', 'Orioles', 'Penguins', 'Ducks', 'Goldeneyes'])],
    ['teams.weather', 'teams', 'Name a pro team named after the weather or the sky.', byNames(['Thunder', 'Heat', 'Suns', 'Hurricanes', 'Lightning', 'Stars', 'Frost', 'Supernovas'])],
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
    ['housewives.all', 'housewives', 'Name a "Real Housewives" city.', () => true],
    ['kardashians.all', 'kardashians', 'Name a Kardashian or Jenner.', () => true],
    ['sharks.all', 'sharks', 'Name a "Shark Tank" shark.', () => true],
    ['idol.all', 'idol', 'Name an "American Idol" judge.', () => true],
    ['tools.all', 'tools', 'Name a tool in a toolbox.', () => true],
    ['pasta.all', 'pasta', 'Name a kind of pasta.', () => true],
    ['citrus.all', 'citrus', 'Name a citrus fruit.', () => true],
    ['cheese.all', 'cheese', 'Name a cheese.', () => true],
    ['wine.all', 'wine', 'Name a wine grape.', () => true],
    ['countries.coffee', 'countries', 'Name a country that grows coffee.', byNames(D.COMMODITY.coffee), 'drink'],
    ['countries.tea', 'countries', 'Name a country that grows tea.', byNames(D.COMMODITY.tea), 'drink'],
    ['countries.opec', 'countries', 'Name a country in the Organization of the Petroleum Exporting Countries (OPEC).', byNames(D.COMMODITY.opec), 'money'],
    ['elements.precious', 'elements', 'Name a precious metal.', byNames(D.ELEMENT_LISTS.precious), 'money'],
    ['dahl.all', 'dahl', 'Name a Roald Dahl book.', () => true],
    ['littlehouse.all', 'littlehouse', 'Name a "Little House" book.', () => true],
    ['dickens.all', 'dickens', 'Name a Charles Dickens novel.', () => true],
    ['bronte.all', 'bronte', 'Name a novel by one of the Brontë sisters.', () => true],
    ['littlewomen.all', 'littlewomen', 'Name a character in "Little Women."', () => true],
    ['bennets.all', 'bennets', 'Name a Bennet sister from "Pride and Prejudice."', () => true],
    ['hungergames.all', 'hungergames', 'Name a Suzanne Collins book.', () => true],
    ['spice.all', 'spice', 'Name a Spice Girl.', () => true],
    ['destinys.all', 'destinys', "Name a member of Destiny's Child.", () => true],
    ['lloydwebber.all', 'lloydwebber', 'Name an Andrew Lloyd Webber musical.', () => true],
    ['soundofmusic.all', 'soundofmusic', 'Name a song from "The Sound of Music."', () => true],
    ['grease.all', 'grease', 'Name a song from "Grease."', () => true],
    ['bridgerton.all', 'bridgerton', 'Name a Bridgerton sibling.', () => true],
    ['peanuts.all', 'peanuts', 'Name a "Peanuts" character.', () => true],
    ['oz.all', 'oz', 'Name a character in "The Wizard of Oz."', () => true],
    ['tudors.all', 'tudors', 'Name a Tudor monarch.', () => true],
    ['birthstones.all', 'birthstones', 'Name a birthstone.', () => true],
    ['herbs.all', 'herbs', 'Name a cooking herb.', () => true],
    ['spices.all', 'spices', 'Name a spice.', () => true],
    ['apples.all', 'apples', 'Name a kind of apple.', () => true],
    ['squash.all', 'squash', 'Name a kind of squash.', () => true],
    ['starbucks.all', 'starbucks', 'Name a Starbucks drink size.', () => true],
  ];
  for (const [id, universe, text, test, subject] of lists) add({ id, universe, kind: 'list', text, subject, answers: cut(UNI[universe], test) });
  // Angled questions: a trait, a word, a person, a place, a time, an everyday
  // moment or a crossover. Each has its own answer list in data.js.
  for (const g of D.ANGLES) add({ id: `a_${g.id}.all`, universe: 'a_' + g.id, kind: 'list', angle: true, shape: g.shape, text: g.text, subject: g.subject, answers: cut(UNI['a_' + g.id], () => true) });

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
    'reindeer.all', 'chess.all', 'monopoly.all', 'cluesuspects.all', 'clueweapons.all', 'rubik.all', 'poker.all', 'olympians.all', 'bills.all',
    'bible.nt', 'states.canada', 'states.great-lakes', 'states.mississippi', 'presidents.democrat', 'presidents.republican', 'premier.all',
    'cluerooms.all', 'teams.birds', 'countries.borders-germany', 'countries.borders-china', 'capitals.northAmerica',
    'kardashians.all', 'idol.all', 'tools.all', 'pasta.all', 'citrus.all', 'cheese.all', 'wine.all', 'countries.coffee', 'countries.tea',
    'dahl.all', 'littlehouse.all', 'littlewomen.all', 'hungergames.all', 'spice.all', 'destinys.all', 'lloydwebber.all', 'soundofmusic.all',
    'grease.all', 'bridgerton.all', 'peanuts.all', 'oz.all', 'birthstones.all', 'herbs.all', 'spices.all', 'apples.all', 'squash.all',
    'starbucks.all', 'bennets.all', 'housewives.all']);
  const EVERYDAY = new Set(['countries', 'states', 'nba', 'nfl', 'mlb', 'nhl', 'presidents', 'capitals', 'nflcities', 'nbacities', 'mlbcities', 'nhlcities']);
  // Only simple letter rules open a set: starts with a letter, or has one.
  const simple = (q) => /\.(starts|has)-[a-z]$/.test(q.id);
  for (const q of pool) q.opener = OPENERS.has(q.id) || (q.angle && q.ease >= 10);
  // Letter questions stay as a rare twist: only "starts with" and only on
  // lists people can run through in their head (countries, capitals, states,
  // presidents, elements, team nicknames). Song, movie, food and other title
  // lists are asked whole. The rest stay in the pool so old rounds still
  // load, but no new round deals them.
  const LETTER_LISTS = new Set(['countries', 'capitals', 'states', 'statecaps', 'presidents', 'elements', 'nba', 'nfl', 'mlb', 'nhl']);
  for (const q of pool) if (q.kind === 'letter' && !(LETTER_LISTS.has(q.universe) && /\.starts-[a-z]$/.test(q.id))) q.retired = true;
  // What kind of question each one is, so a round can vary its rhythm.
  for (const q of pool) q.shape ||= q.kind === 'letter' ? 'letter' : 'category';

  // ---- sets of seven ----
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(list, r) { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // Each question comes from a different list and a different subject.
  // Paco's mode climbs slowly: two openers, an easy one, three medium, one
  // hard. New players in endless mode get the starter climb, which holds off
  // the hard question. Mario's mode, the easier level, runs two openers and
  // five easy ones.
  const SHAPES = {
    paco: ['opener', 'opener', 'gentle', 'medium', 'medium', 'medium', 'hard'],
    starter: ['opener', 'opener', 'gentle', 'gentle', 'medium', 'medium', 'medium'],
    mario: ['opener', 'opener', 'gentle', 'gentle', 'gentle', 'gentle', 'gentle'],
    // Vacation mode, easier than Mario's: all seven from the easiest questions.
    vacation: ['opener', 'opener', 'opener', 'opener', 'opener', 'opener', 'opener'],
  };
  const live = pool.filter((q) => !q.retired);
  const byLevel = { opener: live.filter((q) => q.opener), easy: [], medium: [], hard: [] };
  for (const q of live) if (!q.opener) byLevel[q.level].push(q);
  // Mario skips letter counting and "has no letter" rules.
  // Gentle slots use openers only once the other easy ones run out, so the
  // openers last.
  byLevel.gentle = byLevel.easy.filter((q) => q.kind === 'list' || simple(q));
  // A slot borrows from a nearby level before it repeats a question.
  // Mario's sets reach for the milder medium questions before a repeat.
  byLevel.mild = live.filter((q) => !q.opener && q.level === 'medium' && (q.kind === 'list' || simple(q)));
  const BORROW = { opener: ['opener', 'gentle'], gentle: ['gentle', 'opener', 'mild'], medium: ['medium', 'hard', 'gentle', 'opener'], hard: ['hard', 'medium', 'gentle', 'opener'] };
  byLevel.medium.push(...byLevel.easy);
  // ageOf(id): how many days or rounds since the player saw a question,
  // Infinity if never. A set takes unseen questions first, then the ones seen
  // longest ago, and never one seen in the last 30 if it can help it. Lists in
  // lastLists sit out when they can.
  const AGES = [Infinity, 180, 120, 90, 60, 30, 1];
  function makeSet(seed, avoid = new Set(), level = 'paco', ageOf = null, lastLists = new Set()) {
    const age = ageOf || ((id) => (avoid && avoid.has(id) ? 0 : Infinity));
    // lastLists can also hold subjects as "s:food": yesterday's subjects rest
    // first, then yesterday's lists.
    const fresh = (q) => !lastLists.has(q.universe) && !lastLists.has('s:' + subjectOf(q));
    const rests = [fresh, (q) => !lastLists.has(q.universe), () => true];
    // Letter questions are a twist, so a round holds at most one, and none
    // for new players or in Mario's mode.
    const LETTER_MAX = { paco: 1, starter: 0, mario: 0, vacation: 0 }[level] ?? 1;
    // No more than two questions of one kind in a round (three plain
    // category questions).
    const SHAPE_MAX = { category: 3, letter: LETTER_MAX };
    const TRICKY_MAX = { paco: 1, starter: 0, mario: 0, vacation: 0 }[level] ?? 1;
    const tricky = (q) => q.kind === 'letter' && !simple(q);
    // The order of preference: unseen questions within the letter limit,
    // then the slot's own level before a nearby one, then resting yesterday's
    // subjects and lists.

    const shape = SHAPES[level] || SHAPES.paco;
    const r = rng(seed);
    const lists = new Set(), subjects = {}, shapes = {}; let letterCount = 0, trickyCount = 0;
    const set = [];
    for (const level of shape) {
      const fits = (q, strict) => !lists.has(q.universe) && !subjects[subjectOf(q)]
        && !(strict && q.kind === 'letter' && letterCount >= LETTER_MAX) && !(strict && tricky(q) && trickyCount >= TRICKY_MAX)
        && !(strict && (shapes[q.shape] || 0) >= (SHAPE_MAX[q.shape] ?? 2)) && !set.includes(q);
      let pick = null;
      const tries = [];
      // A question seen three months ago may come back before the letter limit
      // gives way; anything more recent waits until the limit has given way.
      const phases = [[true, AGES.filter((t) => t >= 90)], [false, AGES.filter((t) => t >= 90)], [true, [60, 30, 1, 0]], [false, [60, 30, 1, 0]]];
      for (const [strict, ages] of phases) for (const t of ages) for (const lv of BORROW[level]) for (const rest of rests) tries.push({ strict, t, lv, rest });
      for (const { strict, t, lv, rest } of tries) {
        {
          const cands = byLevel[lv].filter((q) => fits(q, strict) && age(q.id) >= t && rest(q));
          // Pick a subject first, then a list in it weighted by the square
          // root of how many questions it has, then a question from it, so
          // big lists like countries don't crowd out small ones.
          const subs = [...new Set(cands.map(subjectOf))];
          if (subs.length) {
            const choose = (items, weight) => { const w = items.map(weight); let x = r() * w.reduce((a, b) => a + b, 0), i = 0; while (x > w[i] && i < w.length - 1) { x -= w[i]; i++; } return items[i]; };
            const sub = choose(subs, (k) => SUBJECT_WEIGHT[k] || 1);
            const inSub = cands.filter((q) => subjectOf(q) === sub);
            const lists = [...new Set(inSub.map((q) => q.universe))];
            const inList = (u) => inSub.filter((q) => q.universe === u);
            const qs = inList(choose(lists, (u) => Math.sqrt(inList(u).length) * (LIST_WEIGHT[u] || 1)));
            pick = qs[Math.floor(r() * qs.length)];
          }
          if (pick) break;
        }
        if (pick) break;
      }
      if (!pick) pick = shuffle(live, r).find((q) => !set.includes(q) && !lists.has(q.universe) && !subjects[subjectOf(q)]) || shuffle(live, r).find((q) => !set.includes(q));
      set.push(pick); lists.add(pick.universe);
      subjects[subjectOf(pick)] = (subjects[subjectOf(pick)] || 0) + 1;
      if (pick.kind === 'letter') letterCount++;
      if (tricky(pick)) trickyCount++;
      shapes[pick.shape] = (shapes[pick.shape] || 0) + 1;
    }
    return set;
  }

  // Daily sets: a fixed run built ahead. Unseen questions come first, then
  // the ones seen longest ago. A list in yesterday's set sits out today if it
  // can.
  // Days already played are locked in js/locked-days.js (tools/lock-days.mjs),
  // so adding or changing questions never reshuffles a day someone has seen.
  // Later days carry on from the last locked one.
  const LOCKED = typeof LockedDays !== 'undefined' ? LockedDays : require('./locked-days.js');
  const buildDays = (level, seed) => {
    const days = [], lastDay = new Map();
    for (const ids of LOCKED[level] || []) {
      const set = ids.map((id) => pool.find((q) => q.id === id));
      if (set.some((q) => !q)) break;
      set.forEach((q) => lastDay.set(q.id, days.length)); days.push(set);
    }
    for (let d = days.length; d < 365; d++) {
      const last = new Set(days.length ? days[days.length - 1].flatMap((q) => [q.universe, 's:' + subjectOf(q)]) : []);
      const set = makeSet(seed + d * 7919, null, level, (id) => (lastDay.has(id) ? d - lastDay.get(id) : Infinity), last);
      days.push(set); set.forEach((q) => lastDay.set(q.id, d));
    }
    return days;
  };
  const DAYS = buildDays('paco', 20261117), MARIO_DAYS = buildDays('mario', 20261118), VACATION_DAYS = buildDays('vacation', 20261120);

  const byId = new Map(pool.map((q) => [q.id, q]));
  const forDay = (n, level = 'paco') => ({ mario: MARIO_DAYS, vacation: VACATION_DAYS }[level] || DAYS)[(n - 1) % DAYS.length];
  const get = (id) => byId.get(id);
  const universe = (id) => UNI[id];
  return { pool, DAYS, MARIO_DAYS, VACATION_DAYS, forDay, makeSet, get, universe, norm, letters, subjectOf };
})();
if (typeof module !== 'undefined') module.exports = Prompts;
