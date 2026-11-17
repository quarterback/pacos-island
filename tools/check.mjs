// Checks the answer lists and question pool. Run: node tools/check.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Data = require('../js/data.js');
const P = require('../js/prompts.js');
const E = require('../js/engine.js');
let bad = 0;
const fail = (m) => { bad++; console.log('FAIL', m); };
const sizes = { countries: 193, states: 50, mexico: 32, elements: 118, nba: 30, nfl: 32, mlb: 30, nhl: 32, presidents: 40 };
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
const ids = new Set();
for (const q of P.pool) {
  if (ids.has(q.id)) fail('duplicate question ' + q.id); ids.add(q.id);
  if (q.answers.length < 6) fail(`${q.id} has only ${q.answers.length} answers`);
  for (const a of q.answers) if (E.match(q, a.item.name).status !== 'ok') fail(`${q.id}: ${a.item.name} does not match itself`);
}
for (const d of P.DAYS) if (new Set(d.map((q) => q.universe)).size !== 7) fail('a day repeats a list');
console.log(`${P.pool.length} questions, ${P.DAYS.length} days before repeats, ${bad} problems`);
process.exit(bad ? 1 : 0);
