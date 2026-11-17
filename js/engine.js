/* Paco's Island: rules.

   A day runs from 06:00 UTC to 06:00 UTC (midnight at UTC-6, all year).
   Day 1 is November 16, 2026.

   Scoring: every accepted answer has a share, the part of today's answers
   that were that answer. Before players arrive, shares come from the
   tier guess in data.js. Real counts take over as they come in, blended
   with the guess so one early player can't swing a share.

   Points: see the scoring block below. */
'use strict';
const Engine = (() => {
  const P = typeof Prompts !== 'undefined' ? Prompts : require('./prompts.js');

  // ---- days ----
  const DAY_ONE = Date.UTC(2026, 10, 16, 6);
  const DAY_MS = 864e5;
  const dayNumber = (now = new Date()) => Math.max(1, Math.floor((now.getTime() - DAY_ONE) / DAY_MS) + 1);
  const nextReset = (now = new Date()) => new Date(DAY_ONE + dayNumber(now) * DAY_MS);

  // ---- matching ----
  function lev(a, b) {
    if (a === b) return 0;
    const v = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = v[0]; v[0] = i;
      for (let j = 1; j <= b.length; j++) { const t = v[j]; v[j] = Math.min(v[j] + 1, v[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t; }
    }
    return v[b.length];
  }
  const allNames = (item) => [item.name, ...item.aliases];
  const allowed = (len) => (len < 4 ? 0 : len <= 6 ? 1 : 2);

  function findIn(items, typed) {
    for (const it of items) if (allNames(it).some((n) => P.norm(n) === typed)) return { item: it, typo: false };
    let best = null, bestD = 99, tie = false;
    for (const it of items) for (const n of allNames(it)) {
      const k = P.norm(n); if (k.length < 4) continue;
      const d = lev(typed, k);
      if (d <= allowed(k.length) && d < bestD) { best = it; bestD = d; tie = false; } else if (d === bestD && best && best !== it) tie = true;
    }
    return best && !tie ? { item: best, typo: true } : null;
  }

  // status: ok (on the list), off (real, but this question rules it out), no (not on any list)
  function match(q, input) {
    const typed = P.norm(input || '');
    if (!typed) return { status: 'empty' };
    const hit = findIn(q.answers.map((a) => a.item), typed);
    if (hit) return { status: 'ok', item: hit.item, typo: hit.typo };
    const u = P.universe(q.universe);
    const near = findIn(u.items, typed);
    if (near) return { status: 'off', item: near.item };
    return { status: 'no' };
  }

  // ---- scoring ----
  const WEIGHT = { 1: 40, 2: 15, 3: 6, 4: 2, 5: 0.7 };
  const BLEND = 20, SETTLED = 30;
  function guessShares(q) {
    const w = q.answers.map((a) => WEIGHT[a.item.tier]);
    const sum = w.reduce((x, y) => x + y, 0);
    const out = {}; q.answers.forEach((a, i) => { out[a.item.name] = w[i] / sum; });
    return out;
  }
  function shares(q, crowd) {
    const guess = guessShares(q);
    const total = crowd && crowd.total ? crowd.total : 0;
    if (!total) return { shares: guess, total: 0, estimated: true };
    const out = {};
    for (const a of q.answers) { const n = a.item.name; out[n] = ((crowd.counts[n] || 0) + BLEND * guess[n]) / (total + BLEND); }
    return { shares: out, total, estimated: total < SETTLED };
  }
  // Scoring follows World Six (quarterback/worldy-bug, SCORING.md), with
  // rarity in place of distance.
  //   c  = how common your answer was: the share of today's answers that
  //        were yours or more common (1 for the most common, near 0 for
  //        an answer almost nobody gave)
  //   R  = 20,000 x e^(-(c / 0.231)^0.65)           rarity points
  //   q  = R / 20,000
  //   b  = 1.5 x q^3 x e^(-t / 10)                  speed factor, t in seconds
  //   total = round(R x (1 + b)); rarity = round(R); speed = total - rarity
  // A rare answer makes speed worth more. A fast, common answer earns
  // almost no bonus. There is no whole-day multiplier.
  const SECONDS = 25, RARITY_MAX = 20000, SCALE = 0.231, SHAPE = 0.65, SPEED_MAX = 1.5, TAU = 10;
  const rarityPoints = (c) => RARITY_MAX * Math.exp(-Math.pow(Math.max(0, c) / SCALE, SHAPE));
  function score(c, seconds) {
    const R = rarityPoints(c), q = R / RARITY_MAX;
    const b = SPEED_MAX * q ** 3 * Math.exp(-Math.max(0, seconds) / TAU);
    const total = Math.round(R * (1 + b)), rarity = Math.round(R);
    return { total, rarity, speed: total - rarity };
  }
  function commonness(sh, name) {
    const mine = sh[name]; let more = 0;
    for (const k in sh) if (sh[k] > mine + 1e-9) more += sh[k];
    return { c: 1 - more, rarer: Math.min(99, Math.round(more * 100)) };
  }

  // ---- trips ----
  // Stops are day scores. They were set by simulating players across the
  // question pool: a typical day reaches Playa Ondarena or Pueblo Tilmeca,
  // and about one day in ten reaches the island.
  const TRIPS = {
    boat: { id: 'boat', name: "Boat to Paco's Island", opens: 0, stops: [
      [0, 'the Ixtaluz pier'], [6000, 'Peñas Cantoras'], [12000, 'Boca Tamarilla'], [18000, 'Caleta Pochota'], [24000, 'Playa Ondarena'], [31000, 'Pueblo Tilmeca'], [39000, 'Playa Zinzuna'], [48000, "Paco's Island"]] },
    atv: { id: 'atv', name: "ATV across Paco's Island", opens: 100000, stops: [
      [0, 'the beach'], [10000, 'the village'], [20000, 'the river'], [30000, 'the waterfall'], [39000, 'the jungle trail'], [48000, 'the upper waterfall']] },
    dive: { id: 'dive', name: 'Dive into Bahía Ixtaluz', opens: 400000, marks: [
      [12, 'Reef at Peñas Cantoras'], [41, 'The old ferry wreck'], [60, 'Deep reef'], [300, 'Canyon wall'], [1400, 'Canyon floor']] },
  };
  const FULL_DAY = 60000;
  const depth = (s) => Math.round(1400 * Math.pow(Math.min(s, FULL_DAY) / FULL_DAY, 2));
  function reached(trip, score) {
    if (trip === 'dive') return { label: depth(score).toLocaleString('en-US') + ' m', depth: depth(score) };
    const stops = TRIPS[trip].stops; let at = stops[0];
    for (const s of stops) if (score >= s[0]) at = s;
    const i = stops.indexOf(at), next = stops[i + 1] || null;
    return { label: at[1], index: i, next: next ? { label: next[1], need: next[0] - score } : null };
  }
  const opened = (lifetime) => Object.values(TRIPS).filter((t) => lifetime >= t.opens).map((t) => t.id);
  const nextTrip = (lifetime) => Object.values(TRIPS).find((t) => lifetime < t.opens) || null;

  return { dayNumber, nextReset, SECONDS, RARITY_MAX, score, commonness, rarityPoints, match, shares, guessShares, TRIPS, FULL_DAY, depth, reached, opened, nextTrip, lev };
})();
if (typeof module !== 'undefined') module.exports = Engine;
