/* Paco's Island: questions.

   A question is one closed list cut by one rule. The rule is checked
   against every real name an item has, so "Ivory Coast" counts for a
   question about the letter Y even though the display name has none.

   The pool is built once from the lists in data.js. A fixed shuffle
   turns it into a run of days with seven questions each, no list used
   twice in a day and at most two sports questions a day. */
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
    if (!teamMap.has(k)) teamMap.set(k, { name: k, aliases: [], names: [k], tier: it.tier, leagues: [] });
    const t = teamMap.get(k); t.leagues.push(lg); t.tier = Math.min(t.tier, it.tier);
    for (const a of it.aliases) if (!t.aliases.includes(a)) t.aliases.push(a);
  }
  const TEAMS = { id: 'teams', items: [...teamMap.values()], short: 'team nickname' };

  const FIELD = { countries: 'name', states: 'name', mexico: 'name', elements: 'name', nba: 'nickname', nfl: 'nickname', mlb: 'nickname', nhl: 'nickname', presidents: 'last name' };
  const LEAD = {
    countries: 'Name a UN member state whose name',
    states: 'Name a US state whose name',
    mexico: 'Name a Mexican state whose name',
    elements: 'Name a chemical element whose name',
    nba: 'Name an NBA team whose nickname',
    nfl: 'Name an NFL team whose nickname',
    mlb: 'Name an MLB team whose nickname',
    nhl: 'Name an NHL team whose nickname',
    presidents: 'Name a US president whose last name',
  };
  const TAIL = { mexico: ' Mexico City counts.', elements: ' Use the US spelling.' };
  const SPORTS = new Set(['nba', 'nfl', 'mlb', 'nhl', 'teams']);

  const RULES = [];
  for (const L of 'abcdefghijklmnopqrstuvwxyz') {
    const U = L.toUpperCase();
    RULES.push({ key: 'has-' + L, says: `has the letter ${U} in it`, test: (n) => letters(n).includes(L) });
    RULES.push({ key: 'starts-' + L, says: `starts with ${U}`, test: (n) => letters(n).startsWith(L) });
    RULES.push({ key: 'ends-' + L, says: `ends with ${U}`, test: (n) => letters(n).endsWith(L) });
  }
  for (const L of 'aeiou') RULES.push({ key: 'lacks-' + L, says: `has no letter ${L.toUpperCase()} in it`, test: (n) => !letters(n).includes(L) });
  for (const n of [4, 5, 6]) RULES.push({ key: 'max-' + n, says: `has ${n} letters or fewer`, test: (s) => letters(s).length <= n });
  for (const n of [11, 12]) RULES.push({ key: 'min-' + n, says: `has ${n} letters or more`, test: (s) => letters(s).length >= n });
  RULES.push({ key: 'words', says: 'is more than one word', test: (s) => words(s).length > 1 });
  RULES.push({ key: 'same-ends', says: 'starts and ends with the same letter', test: (s) => { const l = letters(s); return l.length > 1 && l[0] === l[l.length - 1]; } });
  RULES.push({ key: 'double', says: 'has a double letter in it, like the LL in Illinois', test: (s) => /(.)\1/.test(letters(s)) });

  // Build the answer set: each item that qualifies, with the names that do.
  function cut(universe, test) {
    const out = [];
    for (const it of universe.items) {
      const ok = it.names.filter((n) => test(n, it));
      if (ok.length) out.push({ item: it, names: ok });
    }
    return out;
  }

  const MIN = 6, MAX = 55;
  const pool = [];
  for (const uid of Object.keys(LEAD)) {
    const u = D.UNIVERSES[uid];
    for (const r of RULES) {
      const answers = cut(u, r.test);
      if (answers.length < MIN || answers.length > MAX || answers.length > u.items.length * 0.6) continue;
      if (r.key === 'double' && uid !== 'states') continue; // the example names a state
      pool.push({ id: `${uid}.${r.key}`, universe: uid, text: `${LEAD[uid]} ${r.says}.${TAIL[uid] || ''}`, answers });
    }
  }

  // Questions written by hand, each a real list rather than a letter rule.
  const byName = (u, names) => (n, it) => names.includes(it.name);
  const handmade = [
    { id: 'countries.landlocked', universe: 'countries', text: 'Name a UN member state with no coastline. Countries on the Caspian Sea count as having no coastline.', test: byName(D.UNIVERSES.countries, D.LANDLOCKED) },
    { id: 'countries.stan', universe: 'countries', text: 'Name a UN member state whose name ends in "stan."', test: (n) => letters(n).endsWith('stan') },
    { id: 'mexico.pacific', universe: 'mexico', text: 'Name a Mexican state on the Pacific coast. The Gulf of California counts.', test: byName(D.UNIVERSES.mexico, D.MX_PACIFIC) },
    { id: 'teams.shared', universe: 'teams', text: 'Name a team nickname used by two different leagues among the NBA, NFL, MLB and NHL.', test: (n, it) => it.leagues.length > 1 },
    { id: 'teams.birds', universe: 'teams', text: 'Name an NBA, NFL, MLB or NHL team named after a bird.', test: (n, it) => ['Hawks', 'Pelicans', 'Cardinals', 'Falcons', 'Ravens', 'Eagles', 'Seahawks', 'Blue Jays', 'Orioles', 'Penguins', 'Ducks'].includes(it.name) },
    { id: 'teams.weather', universe: 'teams', text: 'Name an NBA, NFL, MLB or NHL team named after weather or something you see in the night or day sky.', test: (n, it) => ['Thunder', 'Heat', 'Suns', 'Hurricanes', 'Lightning', 'Stars'].includes(it.name) },
  ];
  const UNI = { ...D.UNIVERSES, teams: TEAMS };
  for (const h of handmade) pool.push({ id: h.id, universe: h.universe, text: h.text, answers: cut(UNI[h.universe], h.test) });

  // ---- the schedule ----
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(list, seed) { const a = list.slice(), r = rng(seed); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  const DAYS = [];
  {
    let left = shuffle(pool, 20261117);
    while (left.length >= 7) {
      const day = [], used = new Set(); let sports = 0;
      for (const q of left) {
        if (day.length === 7) break;
        if (used.has(q.universe)) continue;
        if (SPORTS.has(q.universe) && sports === 2) continue;
        day.push(q); used.add(q.universe); if (SPORTS.has(q.universe)) sports++;
      }
      if (day.length < 7) break;
      DAYS.push(day);
      const ids = new Set(day.map((q) => q.id));
      left = left.filter((q) => !ids.has(q.id));
    }
  }

  const forDay = (n) => DAYS[(n - 1) % DAYS.length];
  const universe = (id) => UNI[id];
  return { pool, DAYS, forDay, universe, norm, letters };
})();
if (typeof module !== 'undefined') module.exports = Prompts;
