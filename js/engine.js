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

  // minTypo: the shortest name that may match with a typo (parts use 6, so
  // "king" never reads as "Kong")
  function findIn(items, typed, minTypo = 4, exactOnly = false) {
    for (const it of items) if (allNames(it).some((n) => P.norm(n) === typed)) return { item: it, typo: false };
    if (exactOnly) return null;
    let best = null, bestD = 99, tie = false;
    for (const it of items) for (const n of allNames(it)) {
      const k = P.norm(n); if (k.length < minTypo) continue;
      const d = lev(typed, k);
      if (d <= allowed(k.length) && d < bestD) { best = it; bestD = d; tie = false; } else if (d === bestD && best && best !== it) tie = true;
    }
    return best && !tie ? { item: best, typo: true } : null;
  }

  // Answers never need their full name. A distinctive part counts:
  // "Pennsylvania" for Pennsylvania Avenue, "Golden Gun" for "The Man with
  // the Golden Gun," "Scary" for Scary Spice. A part is the front or the back
  // of the name, or the name without words every answer shares (such as
  // "avenue"). It needs four or more letters and must not be only small
  // words or only words the question itself uses. When a part fits two
  // answers, it counts for the more familiar one.
  //
  // Questions about people also take part of a name. "Aniston" counts for
  // "Name a famous Jennifer," "Will" for "Name a famous Smith" and "Lovelace"
  // for a famous scientist: the last name, or the name without the word the
  // question already gives. A people part shared by two answers counts for
  // neither.
  //
  // A part may drop the question's own words from the end of a name
  // ("Brooklyn" for Brooklyn Bridge) but not from the front, because that
  // makes another thing: "basketball" is not water basketball. Typing only
  // the question's own words never matches a part, and a real item typed in
  // full is that item, never part of another answer (see match).
  const SKIP_PART = new Set(['jr', 'sr', 'ii', 'iii', 'the', 'of', 'and', 'de', 'la', 'le', 'van', 'von', 'mr', 'mrs', 'ms', 'dr']);
  const SMALL = new Set([...SKIP_PART, 'a', 'an', 'in', 'on', 'to', 'for', 'with', 'at', 'by', 'from', 'or', 'is', 'it', 'its', 'my', 'your', 'our', 'no', 'not', 'as', 'up', 'out', 'we', 'you', 'me', 'be', 'all']);
  const partCache = new Map();
  function partNames(q) {
    if (partCache.has(q.id)) return partCache.get(q.id);
    const given = new Set(P.norm(q.text).split(' '));
    // the words the question names that every answer shares, such as "avenue"
    const shared = q.answers.reduce((acc, a) => { const ws = new Set(P.norm(a.item.name).split(' ')); return acc === null ? ws : new Set([...acc].filter((x) => ws.has(x))); }, null) || new Set();
    const drop = new Set([...shared].filter((x) => given.has(x) && x.length >= 3 && !SKIP_PART.has(x)));
    const people = q.shape === 'people';
    const owners = new Map();
    const add = (p, item) => { if (!owners.has(p)) owners.set(p, new Set()); owners.get(p).add(item); };
    for (const a of q.answers) for (const n of allNames(a.item)) {
      const w = P.norm(n).split(' ');
      if (w.length < 2) continue;
      if (people) {
        const rest = w.filter((x) => !given.has(x));
        const parts = [w[w.length - 1], w.slice(1).join(' '), rest.join(' ')];
        if (rest.length < w.length) parts.push(...rest);
        for (const p of parts) if (p.length >= 3 && !SKIP_PART.has(p) && p !== w.join(' ')) add(p, a.item);
        continue;
      }
      const parts = new Set();
      for (let k = 1; k < w.length; k++) {
        // the front of a name: drops words from the end, such as "bridge" in Brooklyn Bridge
        parts.add(w.slice(0, k).join(' '));
        // the back of a name, unless that drops the question's own word from the front:
        // "basketball" is not water basketball, "bread pudding" not chocolate bread pudding
        if (!w.slice(0, k).some((x) => given.has(x) && !drop.has(x) && !SMALL.has(x))) parts.add(w.slice(k).join(' '));
      }
      const kept = w.filter((x) => !drop.has(x));
      if (kept.length && kept.length < w.length) parts.add(kept.join(' '));
      for (const p of parts) {
        const pw = p.split(' ');
        if (p.replace(/ /g, '').length < 4) continue;
        if (pw.every((x) => SMALL.has(x)) || pw.every((x) => given.has(x) || SMALL.has(x))) continue;
        if (SMALL.has(pw[0]) && pw.length > 1 && SMALL.has(pw[pw.length - 1])) continue;
        add(p, a.item);
      }
    }
    const sh = people ? null : shares(q);
    const out = [];
    for (const [p, its] of owners) {
      if (its.size === 1) out.push({ name: p, aliases: [], of: [...its][0] });
      else if (!people) out.push({ name: p, aliases: [], of: [...its].sort((x, y) => sh[y.name] - sh[x.name])[0] });
    }
    partCache.set(q.id, out);
    return out;
  }

  // status: ok (on the list), off (real, but this question rules it out), no (not on any list)
  function match(q, input) {
    const typed = P.norm(input || '');
    if (!typed) return { status: 'empty' };
    const u = P.universe(q.universe);
    // Lists asked by last name also take a full name: "Abraham Lincoln."
    const tries = [typed];
    if (u.surname) { const w = typed.split(' '); for (let i = 1; i < w.length; i++) tries.push(w.slice(i).join(' ')); }
    const find = (items, exactOnly) => { for (const t of tries) { const h = findIn(items, t, 4, exactOnly); if (h) return h; } return null; };
    const answers = q.answers.map((a) => a.item);
    // 1. a right answer, exactly
    const exactHit = find(answers, true);
    if (exactHit) return { status: 'ok', item: exactHit.item, typo: false };
    // 2. a real item off this list, exactly: it is that item, never a typo or
    //    part of another answer ("Nigeria" is not Algeria; "basketball" is not
    //    water basketball)
    const exactOff = find(u.items, true);
    if (exactOff) return { status: 'off', item: exactOff.item };
    // 3. a right answer with a typo, then a part of one
    const hit = find(answers);
    if (hit) return { status: 'ok', item: hit.item, typo: hit.typo };
    // words the question itself uses ("chocolate," "water") are never a part
    const own = new Set(P.norm(q.text).split(' '));
    const part = typed.split(' ').every((x) => own.has(x)) ? null : findIn(partNames(q), typed, 6);
    if (part) return { status: 'ok', item: part.item.of, typo: part.typo };
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
  //   R  = 108,000 x e^(-(c / 0.231)^0.65)          rarity points
  // The speed bonus pays every right answer, common ones included, and
  // grows with rarity:
  //   f  = 1 through 5 seconds, then e^(-((t - 5) / 7)^3)
  //        (0.70 at 10 seconds, 0.05 at 15, near 0 by 20)
  //   speed = f x (8,100 + 0.25 x R)
  //   total = round(R + speed); rarity = round(R); speed = total - rarity
  // A rare answer given slowly still beats a common answer given fast.
  // Island time: after the clock runs out, a right answer earns a flat 2,700
  // with no rarity or speed points. Only a skip scores 0. The level's pay
  // applies to both. There is no whole-day multiplier. A question tops out
  // at 143,100 and a perfect day at 1,001,700.
  // Pinball scale: every point value is the original scale times POINTS, so
  // a perfect day comes to about a million (1,001,700) and real scores land
  // wherever they land. Change POINTS to rescale the whole game.
  const POINTS = 5.4, pt = (n) => Math.round(n * POINTS);
  const SECONDS = 25, RARITY_MAX = pt(20000), SCALE = 0.231, SHAPE = 0.65;
  const SPEED_FLAT = pt(1500), SPEED_SHARE = 0.25, HOLD = 5, FADE = 7, ISLAND = pt(500);
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
  // ---- the benchmark ----
  // A field of simulated players on one set of questions. Each gives an
  // answer as often as players would (its share), misses about one question
  // in eight and answers in 3 to 17 seconds. The field is seeded by its key,
  // so everyone's run on the same set is measured against the same players.
  const FIELD = 1000, MISS = 0.12, fields = new Map();
  function field(qs, level, key) {
    const k = `${key}|${level}`; if (fields.has(k)) return fields.get(k);
    let h = 2166136261; for (const ch of k) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    let st = h >>> 0; const rnd = () => { st = (Math.imul(st, 1664525) + 1013904223) >>> 0; return st / 4294967296; };
    const prepared = qs.map((q) => { const sh = shares(q); return q.answers.map((a) => ({ share: sh[a.item.name], c: commonness(sh, a.item.name).c })); });
    const out = [];
    for (let i = 0; i < FIELD; i++) {
      let total = 0;
      for (const opts of prepared) {
        if (rnd() < MISS) continue;
        let r = rnd(), pick = opts[opts.length - 1];
        for (const o of opts) { r -= o.share; if (r <= 0) { pick = o; break; } }
        total += score(pick.c, 3 + rnd() * 14, level).total;
      }
      out.push(total);
    }
    out.sort((x, y) => x - y);
    fields.set(k, out);
    return out;
  }
  // The share of the field a score beats, as a whole percent, 0 to 99.
  function beats(sorted, total) { let lo = 0, hi = sorted.length; while (lo < hi) { const m = (lo + hi) >> 1; if (sorted[m] < total) lo = m + 1; else hi = m; } return Math.min(99, Math.floor((lo / sorted.length) * 100)); }

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
      [0, 'the Ixtaluz pier'], [pt(7000), 'Peñas Cantoras'], [pt(13500), 'Boca Tamarilla'], [pt(20000), 'Caleta Pochota'], [pt(27000), 'Playa Ondarena'], [pt(35000), 'Pueblo Tilmeca'], [pt(44000), 'Playa Zinzuna'], [pt(54000), "Paco's Island"]] },
    walk: { id: 'walk', name: 'Walk to Cascada Ixtalita', opens: pt(50000), stops: [
      [0, 'the beach'], [pt(9000), 'the church plaza'], [pt(18000), 'the river bridge'], [pt(27000), 'the mural stairs'], [pt(36000), 'the cobblestone lane'], [pt(45000), 'the craft stalls'], [pt(54000), 'Cascada Ixtalita']] },
    atv: { id: 'atv', name: "ATV across Paco's Island", opens: pt(110000), stops: [
      [0, 'the beach'], [pt(11000), 'the village'], [pt(22500), 'the river'], [pt(33500), 'the waterfall'], [pt(44000), 'the jungle trail'], [pt(54000), 'the upper waterfall']] },
    // Deliveries, the market and the flight use the walk's spacing between stops.
    deliver: { id: 'deliver', name: 'Deliveries with Tío', opens: pt(150000), stops: [
      [0, 'the pier'], [pt(9000), 'the ice house'], [pt(18000), 'the corner store'], [pt(27000), 'the juice stand'], [pt(36000), 'the steep lane'], [pt(45000), 'the umbrella plaza'], [pt(54000), 'the michelada bar']] },
    market: { id: 'market', name: 'Night market in Pueblo Tilmeca', opens: pt(200000), stops: [
      [0, 'the bus stop'], [pt(9000), 'the taco stand'], [pt(18000), 'the empanada seller'], [pt(27000), 'the corner bar'], [pt(36000), 'the clothing shops'], [pt(45000), 'the souvenir shops'], [pt(54000), 'the church steps']] },
    fly: { id: 'fly', name: "Fly with Esmeralda", opens: pt(300000), stops: [
      [0, 'the Ixtaluz lighthouse'], [pt(9000), 'Peñas Cantoras'], [pt(18000), 'Boca Tamarilla'], [pt(27000), 'Playa Ondarena'], [pt(36000), 'Pueblo Tilmeca'], [pt(45000), "Paco's Island"], [pt(54000), "Esmeralda's nest"]] },
    dive: { id: 'dive', name: 'Dive into Bahía Ixtaluz', opens: pt(450000), marks: [
      [12, 'Reef at Peñas Cantoras'], [41, 'The old ferry wreck'], [60, 'Deep reef'], [300, 'Canyon wall'], [1400, 'Canyon floor']] },
  };
  const FULL_DAY = pt(66000);
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

  return { dayNumber, nextReset, POINTS, pt, field, beats, SECONDS, LEVELS, RARITY_MAX, ISLAND, score, islandScore, speedFactor, commonness, rarityPoints, match, shares, TRIPS, FULL_DAY, depth, reached, opened, nextTrip, lev };
})();
if (typeof module !== 'undefined') module.exports = Engine;
