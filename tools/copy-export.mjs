// Prints every line of player-facing text, one per line, for the editorial checks.
// Run: node tools/copy-export.mjs > /tmp/copy.txt
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Copy = require('../js/copy.js'), P = require('../js/prompts.js');
const sample = { tripOpens: [110000], progress: [3], secondsLeft: [12], off: ['Ohio'], typo: ['Oaxaca'], points: [12468], forRarity: [11298], forSpeed: [1094],
  nextStop: ['Playa Zinzuna', 2758], lifetime: [41242], hudDepth: ['120 meters'], hudNext: ['Playa Zinzuna'], hudAt: ['the Ixtaluz pier'], unlock: [68758, 'ATV ride'],
  unlocked: ['ATV ride'], allHead: [12], comeBack: ['6 a.m.'], importBody: [41242] };
const out = [];
const walk = (k, v) => {
  if (['marks', 'markAhead', 'share', 'count', 'apTime'].includes(k)) return;
  if (typeof v === 'string') out.push(v);
  else if (typeof v === 'function') out.push(v(...(sample[k] || ['the upper waterfall'])));
  else if (Array.isArray(v)) v.forEach((x) => walk(k, x));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([kk, x]) => walk(kk, x));
};
Object.entries(Copy).forEach(([k, v]) => walk(k, v));
const seen = new Set();
for (const q of P.pool) { const shape = q.text.replace(/\b[A-Z]\b/g, 'A'); if (!seen.has(shape)) { seen.add(shape); out.push(q.text); } }
console.log(out.join('\n'));
