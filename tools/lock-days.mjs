// Locks the daily sets already played, so new or changed questions never
// reshuffle a day someone may have seen. Run it BEFORE changing the question
// pool: node tools/lock-days.mjs
// It records each day's question ids, through tomorrow (so no time zone sees
// a day change mid-day), in js/locked-days.js, keeping days already locked.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
global.Rarity = require('../js/rarity.js');
global.Data = require('../js/data.js');
global.LockedDays = require('../js/locked-days.js');
const P = require('../js/prompts.js');
const E = require('../js/engine.js');
const through = E.dayNumber() + 1;
const out = { paco: [], mario: [] };
for (const level of ['paco', 'mario']) for (let d = 1; d <= through; d++) out[level].push(P.forDay(d, level).map((q) => q.id));
const lines = ['/* Paco\'s Island: daily sets already played, locked by tools/lock-days.mjs.',
  '   Do not edit by hand. Day 1 is the first entry. Later days are built from the',
  '   question pool, carrying on from the last locked day. */', "'use strict';", 'const LockedDays = {'];
for (const level of ['paco', 'mario']) { lines.push(`  ${level}: [`); for (const ids of out[level]) lines.push('    ' + JSON.stringify(ids) + ','); lines.push('  ],'); }
lines.push('};', "if (typeof module !== 'undefined') module.exports = LockedDays;", '');
fs.writeFileSync(new URL('../js/locked-days.js', import.meta.url), lines.join('\n'));
console.log(`locked days 1 to ${through} for both levels`);
