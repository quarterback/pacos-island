// Prints every line of player-facing text, one per line, for the editorial checks.
// Run: node tools/copy-export.mjs > /tmp/copy.txt
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Copy = require('../js/copy.js'), P = require('../js/prompts.js');
const sample = { tripOpens: [110000], progress: [3], secondsLeft: [12], off: ['Ohio'], typo: ['Oaxaca'], points: [12468], forRarity: [11298], forSpeed: [1094],
  nextStop: ['Playa Zinzuna', 2758], lifetime: [41242], hudDepth: ['120 meters'], hudNext: ['Playa Zinzuna'], hudAt: ['the Ixtaluz pier'], unlock: [68758, 'ATV ride'],
  unlocked: ['ATV ride'], comeBack: ['6 a.m.'], importBody: [41242], markKey: [['27,000', '64,800', '108,000']], beat: [73], beatShort: [73],
  'endless.start': [3], 'endless.resume': [3], 'endless.progress': [3, 4], 'endless.sheetHead': [3], 'endless.passedMark': ['the canyon wall', '300 meters'], 'endless.tripLegend': [5], 'endless.earlierRow': [2, 'dive'], 'vacation.progress': [3], 'endless.shareTag': [5], where: ['the hammocks'] };
const out = [];
const walk = (k, v, path = k) => {
  if (['marks', 'islandMark', 'markAhead', 'share', 'apTime', 'apDate'].includes(k)) return;
  if (typeof v === 'string') out.push(v);
  else if (typeof v === 'function') out.push(v(...(sample[path] || sample[k] || ['the upper waterfall'])));
  else if (Array.isArray(v)) v.forEach((x) => walk(k, x));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([kk, x]) => walk(kk, x, `${path}.${kk}`));
};
Object.entries(Copy).forEach(([k, v]) => walk(k, v));
const seen = new Set();
for (const q of P.pool) { const shape = q.text.replace(/\b[A-Z]\b/g, 'A'); if (!seen.has(shape)) { seen.add(shape); out.push(q.text); } }
console.log(out.join('\n'));
