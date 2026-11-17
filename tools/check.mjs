// Checks the answer lists and question pool. Run: node tools/check.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Data = require('../js/data.js');
const P = require('../js/prompts.js');
const E = require('../js/engine.js');
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL', m); };
const sizes = { countries: 193, states: 50, mexico: 32, elements: 118, nba: 30, nfl: 32, mlb: 30, nhl: 32, presidents: 40, capitals: 198, statecaps: 50, constellations: 88, greek: 24, nato: 26, bible: 56,
  nflcities: 30, nbacities: 29, mlbcities: 26, nhlcities: 31, worldcup: 8, ucl: 24, premier: 20, olympics: 23,
  bestpicture: 98, pixar: 31, bond: 25, princesses: 13, starwars: 9, friends: 6, avengers: 6, swift: 12, beatles: 22, thriller: 9,
  potter: 7, narnia: 7, austen: 6, shakespeare: 35, planets: 8, continents: 7, rainbow: 7, dwarfs: 7, reindeer: 9, chess: 6,
  wonders: 7, monopoly: 28, cluesuspects: 6, clueweapons: 6, cluerooms: 9, rubik: 6, poker: 10, bts: 7, bills: 7, henry: 6, olympians: 13 };
for (const [id, n] of Object.entries(sizes)) if (Data.UNIVERSES[id].items.length !== n) fail(`${id} has ${Data.UNIVERSES[id].items.length} items, expected ${n}`);
if (Data.LANDLOCKED.length !== 43) fail('landlocked list should have 43 UN members');
for (const id of Object.keys(sizes)) {
  const seen = new Map();
  for (const it of Data.UNIVERSES[id].items) for (const n of [it.name, ...it.aliases]) {
    const k = P.norm(n);
    if (seen.has(k) && seen.get(k) !== it.name) fail(`${id}: "${n}" points to both ${seen.get(k)} and ${it.name}`);
    seen.set(k, it.name);
  }
}
for (const id of Object.keys(sizes)) for (const it of Data.UNIVERSES[id].items) if (typeof it.fam !== 'number') fail(`${id}: ${it.name} has no rarity score; run python3 tools/rarity.py`);
const ids = new Set();
for (const q of P.pool) {
  if (ids.has(q.id)) fail('duplicate question ' + q.id); ids.add(q.id);
  if (q.answers.length < 6) fail(`${q.id} has only ${q.answers.length} answers`);
  for (const a of q.answers) if (E.match(q, a.item.name).status !== 'ok') fail(`${q.id}: ${a.item.name} does not match itself`);
}
for (const d of P.DAYS) if (new Set(d.map((q) => q.universe)).size !== 7) fail('a day repeats a list');
for (const d of P.DAYS.slice(0, 60)) if (!d[0].opener || !d[1].opener) fail('a day does not open with two easy questions');
const cont = new Set(Object.values(Data.CONTINENT).flat());
for (const it of Data.UNIVERSES.countries.items) if (!cont.has(it.name)) fail(`${it.name} has no continent`);
if (new Set(Data.UNIVERSES.capitals.items.map((c) => c.country)).size !== 193) fail('a country is missing its capital');
for (let s = 1; s <= 200; s++) {
  const set = P.makeSet(s * 104729);
  if (new Set(set).size !== 7) fail('a random round repeats a question');
  if (set.filter((q) => ['nba', 'nfl', 'mlb', 'nhl', 'teams'].includes(q.universe)).length > 2) fail('a random round has more than two sports questions');
}
console.log(`${P.pool.length} questions, ${P.pool.filter((q) => q.opener).length} openers, ${bad} problems`);
process.exit(bad ? 1 : 0);
