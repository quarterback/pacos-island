/* Paco's Island: rules.

   A day runs from 06:00 UTC to 06:00 UTC (midnight at UTC-6, all year).
   Day 1 is November 16, 2026.

   Scoring: every answer has a fixed familiarity score (js/rarity.js). On a
   question, an answer's share is its weight over the weights of all the
   right answers, so the same answer always scores the same. No player
   counts are needed.

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
    const u = P.universe(q.universe);
    // Lists asked by last name also take a full name: "Abraham Lincoln."
    const tries = [typed];
    if (u.surname) { const w = typed.split(' '); for (let i = 1; i < w.length; i++) tries.push(w.slice(i).join(' ')); }
    const find = (items) => { for (const t of tries) { const h = findIn(items, t); if (h) return h; } return null; };
    const hit = find(q.answers.map((a) => a.item));
    if (hit) return { status: 'ok', item: hit.item, typo: hit.typo };
    const near = find(u.items);
    if (near) return { status: 'off', item: near.item };
    return { status: 'no' };
  }

  // ---- scoring ----
  // weight = 10^(fam / 2): one tier more familiar is about 2.5 times the weight.
  const weight = (item) => Math.pow(10, item.fam / 2);
  function shares(q) {
    const w = q.answers.map((a) => weight(a.item));
    const sum = w.reduce((x, y) => x + y, 0);
    const out = {}; q.answers.forEach((a, i) => { out[a.item.name] = w[i] / sum; });
    return out;
  }
  // Rarity follows World Six (quarterback/worldy-bug, SCORING.md), with
  // rarity in place of distance.
  //   c  = how common your answer is: the shares of the right answers as
  //        familiar as yours or more (1 for the most familiar, near 0 for
  //        the least familiar on a long list)
  //   R  = 20,000 x e^(-(c / 0.231)^0.65)           rarity points
  // The speed bonus pays every right answer, common ones included, and
  // grows with rarity:
  //   f  = 1 through 5 seconds, then e^(-((t - 5) / 7)^3)
  //        (0.70 at 10 seconds, 0.05 at 15, near 0 by 20)
  //   speed = f x (1,500 + 0.25 x R)
  //   total = round(R + speed); rarity = round(R); speed = total - rarity
  // A rare answer given slowly still beats a common answer given fast.
  // Island time: after the clock runs out, a right answer earns a flat 500
  // with no rarity or speed points. Only a skip scores 0. The level's pay
  // applies to both. There is no whole-day multiplier.
  const SECONDS = 25, RARITY_MAX = 20000, SCALE = 0.231, SHAPE = 0.65;
  const SPEED_FLAT = 1500, SPEED_SHARE = 0.25, HOLD = 5, FADE = 7, ISLAND = 500;
  const rarityPoints = (c) => RARITY_MAX * Math.exp(-Math.pow(Math.max(0, c) / SCALE, SHAPE));
  const speedFactor = (seconds) => { const t = Math.max(0, seconds - HOLD) / FADE; return Math.exp(-t * t * t); };
  // Levels. Mario's mode, the easier one, gives more time and pays half.
  const LEVELS = { paco: { seconds: SECONDS, pay: 1 }, mario: { seconds: 40, pay: 0.5 } };
  function score(c, seconds, level = 'paco') {
    const R = rarityPoints(c), pay = LEVELS[level].pay;
    const bonus = speedFactor(seconds) * (SPEED_FLAT + SPEED_SHARE * R);
    const total = Math.round((R + bonus) * pay), rarity = Math.round(R * pay);
    return { total, rarity, speed: total - rarity };
  }
  const islandScore = (level = 'paco') => ({ total: Math.round(ISLAND * LEVELS[level].pay), rarity: 0, speed: 0 });
  function commonness(sh, name) {
    const mine = sh[name]; let more = 0;
    for (const k in sh) if (sh[k] > mine + 1e-9) more += sh[k];
    return { c: 1 - more };
  }

  // ---- trips ----
  // Stops are day scores. They were set by simulating players across the
  // question pool: a typical day reaches Playa Ondarena or Pueblo Tilmeca,
  // and about one day in ten reaches the island.
  const TRIPS = {
    boat: { id: 'boat', name: "Boat to Paco's Island", opens: 0, stops: [
      [0, 'the Ixtaluz pier'], [7000, 'Peñas Cantoras'], [13500, 'Boca Tamarilla'], [20000, 'Caleta Pochota'], [27000, 'Playa Ondarena'], [35000, 'Pueblo Tilmeca'], [44000, 'Playa Zinzuna'], [54000, "Paco's Island"]] },
    walk: { id: 'walk', name: 'Walk to Cascada Ixtalita', opens: 50000, stops: [
      [0, 'the beach'], [9000, 'the church plaza'], [18000, 'the river bridge'], [27000, 'the mural stairs'], [36000, 'the cobblestone lane'], [45000, 'the craft stalls'], [54000, 'Cascada Ixtalita']] },
    atv: { id: 'atv', name: "ATV across Paco's Island", opens: 110000, stops: [
      [0, 'the beach'], [11000, 'the village'], [22500, 'the river'], [33500, 'the waterfall'], [44000, 'the jungle trail'], [54000, 'the upper waterfall']] },
    dive: { id: 'dive', name: 'Dive into Bahía Ixtaluz', opens: 450000, marks: [
      [12, 'Reef at Peñas Cantoras'], [41, 'The old ferry wreck'], [60, 'Deep reef'], [300, 'Canyon wall'], [1400, 'Canyon floor']] },
  };
  const FULL_DAY = 66000;
  const depth = (s) => Math.round(1400 * Math.pow(Math.min(s, FULL_DAY) / FULL_DAY, 2));
  function reached(trip, score) {
    if (trip === 'dive') return { label: depth(score).toLocaleString('en-US') + (depth(score) === 1 ? ' meter' : ' meters'), depth: depth(score) };
    const stops = TRIPS[trip].stops; let at = stops[0];
    for (const s of stops) if (score >= s[0]) at = s;
    const i = stops.indexOf(at), next = stops[i + 1] || null;
    return { label: at[1], index: i, next: next ? { label: next[1], need: next[0] - score } : null };
  }
  const opened = (lifetime) => Object.values(TRIPS).filter((t) => lifetime >= t.opens).map((t) => t.id);
  const nextTrip = (lifetime) => Object.values(TRIPS).find((t) => lifetime < t.opens) || null;

  return { dayNumber, nextReset, SECONDS, LEVELS, RARITY_MAX, ISLAND, score, islandScore, speedFactor, commonness, rarityPoints, match, shares, TRIPS, FULL_DAY, depth, reached, opened, nextTrip, lev };
})();
if (typeof module !== 'undefined') module.exports = Engine;
