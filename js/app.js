/* Paco's Island: screens and saved progress.

   Progress lives in this browser under one anonymous player id. "Move my
   progress" puts the whole record in a link so it can be opened on
   another device. Scores come from fixed familiarity scores, so the game
   needs no server.

   Test mode adds endless mode: a new set of seven each round, with every
   trip open, saved apart from the daily game. Each round adds to lifetime
   points. Set TEST_MODE to false to hide it. Screens:
   docs/endless-mode-screens.md. */
'use strict';
(() => {
  const $ = (id) => document.getElementById(id);
  const KEY = 'pacos-island.v2';
  const day = Engine.dayNumber();
  const TEST_MODE = true;
  let mode = 'daily', picking = false, questions = [];

  // ---- saved progress ----
  const fresh = () => ({ v: 2, id: (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)), lifetime: 0, trip: 'boat', days: {} });
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 2) return s; } catch (e) { /* storage blocked or empty */ } return fresh(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: progress lasts this visit */ } }
  let state = load();

  // ---- the day's set and endless rounds ----
  // Every record keeps its question ids. Records from before the question
  // pool changed have none; their points stay in lifetime and the records go.
  // Levels: Paco's mode, or Mario's easier mode. Each daily level has its
  // own set and record; endless rounds keep the level they were played at.
  const newRecord = (qids, trip, level) => ({ trip, level, qids, answers: [], started: {}, done: false, counted: false });
  const levelOf = (rec) => (rec && rec.level === 'mario' ? 'mario' : 'paco');
  const secondsFor = (rec) => Engine.LEVELS[levelOf(rec)].seconds;
  const dayKey = () => (state.level === 'mario' ? `${day}m` : String(day));
  function tidy() {
    const ok = (r) => r.qids && r.qids.every((id) => Prompts.get(id));
    for (const k of Object.keys(state.days)) if (!ok(state.days[k])) delete state.days[k];
    state.endless ||= { round: 0, rounds: {}, seen: [], repeated: false };
    for (const k of Object.keys(state.endless.rounds)) if (!ok(state.endless.rounds[k])) delete state.endless.rounds[k];
    if (state.endless.round && !state.endless.rounds[state.endless.round]) state.endless.round = 0;
  }
  tidy();
  // Saves from when the easier level was briefly called Carlos's mode
  if (state.level === 'carlos') state.level = 'mario';
  for (const [k, r] of Object.entries(state.days)) { if (r.level === 'carlos') r.level = 'mario'; if (k.endsWith('c')) { state.days[k.slice(0, -1) + 'm'] = r; delete state.days[k]; } }
  for (const r of Object.values(state.endless.rounds)) if (r.level === 'carlos') r.level = 'mario';
  state.level ||= 'paco';
  Art.setRider(state.level);
  if (TEST_MODE && state.mode === 'endless') mode = 'endless';
  const E = () => state.endless;
  const roundRec = () => E().rounds[E().round] || null;
  const roundDone = () => !roundRec() || roundRec().done;
  function today() {
    let rec;
    if (mode === 'endless') { if (!roundRec()) newRound(state.trip); rec = roundRec(); }
    else rec = (state.days[dayKey()] ||= newRecord(Prompts.forDay(day, state.level).map((q) => q.id), state.trip, state.level));
    questions = rec.qids.map((id) => Prompts.get(id));
    return rec;
  }
  // A new round takes questions the player has not seen in endless mode
  // first, then the ones seen longest ago, and skips today's daily set. Lists
  // from the round before sit out when they can.
  function newRound(trip) {
    const e = E();
    const today = new Set(Prompts.forDay(day, state.level).map((q) => q.id));
    const prev = e.rounds[e.round];
    const lastLists = new Set(prev ? prev.qids.map((id) => Prompts.get(id)).filter(Boolean).flatMap((q) => [q.universe, 's:' + Prompts.subjectOf(q)]) : []);
    const lastSeen = new Map(); e.seen.forEach((id, i) => lastSeen.set(id, Math.floor(i / 7)));
    const rounds = Math.ceil(e.seen.length / 7);
    const ageOf = (id) => (today.has(id) ? 0 : lastSeen.has(id) ? rounds - lastSeen.get(id) : Infinity);
    // In Paco's mode, new players, the first rounds and the round after a
    // rough one get the starter climb, which holds off the hard question.
    const rough = prev && dayScore(prev) < 12000;
    const shape = state.level === 'paco' && (state.lifetime < 50000 || e.round < 3 || rough) ? 'starter' : state.level;
    const set = Prompts.makeSet((Date.now() + e.round * 7919) % 2147483647, null, shape, ageOf, lastLists).map((q) => q.id);
    if (!e.warned && set.some((id) => lastSeen.has(id))) { e.repeated = true; e.warned = true; }
    e.round++; e.rounds[e.round] = newRecord(set, trip, state.level); e.seen.push(...set); if (e.seen.length > 1400) e.seen = e.seen.slice(-1400);
    for (const k of Object.keys(e.rounds)) if (Number(k) < e.round - 30) delete e.rounds[k];
    save();
  }
  const dayScore = (rec) => rec.answers.reduce((s, a) => s + (a.points || 0), 0);
  const bucket = (pts) => (!pts ? 0 : pts < 5000 ? 1 : pts < 12000 ? 2 : pts < 20000 ? 3 : 4);
  // An answer's mark: island time answers get their own, skips get the wave.
  const markKey = (a) => (a.island ? 'island' : String(bucket(a.points)));
  const markOf = (a) => (a.island ? Copy.islandMark : Copy.marks[bucket(a.points)]);
  const fmt = (n) => n.toLocaleString('en-US');
  const clockText = (secs) => { const s = Math.round(secs); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el, to) {
    if (reduced) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 900;
    const step = (now) => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(to * e)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // ---- the score over the scene ----
  function tripBar(rec) {
    const score = dayScore(rec), r = Engine.reached(rec.trip, score);
    $('hud').hidden = false;
    $('tripScore').textContent = fmt(score);
    $('tripWhere').textContent = rec.trip === 'dive' ? Copy.hudDepth(r.label) : r.next ? Copy.hudNext(r.next.label) : Copy.hudAt(r.label);
    Scene.setTrip(rec.trip); Scene.score(score);
  }

  // ---- title ----
  function showTitle() {
    $('titleHead').textContent = Copy.title;
    $('intro').textContent = state.level === 'mario' ? Copy.marioIntro : Copy.intro;
    $('howHead').textContent = Copy.howHeading;
    $('howList').innerHTML = ''; for (const line of Copy.how) { const li = document.createElement('li'); li.textContent = line; $('howList').append(li); }
    $('credit').textContent = Copy.credit;
    const endless = mode === 'endless';
    const rec = endless ? (roundDone() ? null : roundRec()) : state.days[dayKey()];
    // level: Paco's mode or Mario's mode, locked once a set is under way
    $('levels').hidden = picking;
    $('levelLegend').textContent = Copy.level.legend;
    $('levelPaco').textContent = Copy.level.paco; $('levelPacoNote').textContent = Copy.level.pacoNote;
    $('levelMario').textContent = Copy.level.mario; $('levelMarioNote').textContent = Copy.level.marioNote;
    for (const lv of ['paco', 'mario']) { const r = $('level-' + lv); r.checked = state.level === lv; r.disabled = !!(rec && rec.answers.length && !rec.done); }
    const nextN = E().round + (roundDone() ? 1 : 0);
    $('tripLegend').textContent = picking ? Copy.endless.tripLegend(nextN) : Copy.tripLegend;
    for (const id of ['titleHead', 'intro', 'how', 'credit']) $(id).hidden = picking;
    $('modes').hidden = !TEST_MODE || picking;
    $('modeLegend').textContent = Copy.endless.modeLegend;
    $('modeDaily').textContent = Copy.endless.daily; $('modeDailyNote').textContent = Copy.endless.dailyNote;
    $('modeEndless').textContent = Copy.endless.name; $('modeEndlessNote').textContent = Copy.endless.note;
    $('mode-daily').checked = !endless; $('mode-endless').checked = endless;
    $('repeatNote').textContent = endless && E().repeated ? Copy.endless.repeats : ''; $('repeatNote').hidden = !$('repeatNote').textContent;
    if (endless && E().repeated) { E().repeated = false; save(); }
    $('leaveBtn').hidden = !picking; $('leaveBtn').textContent = Copy.endless.leave;
    const open = endless ? Object.keys(Engine.TRIPS) : Engine.opened(state.lifetime);
    const box = $('trips'); box.querySelectorAll('.trip').forEach((n) => n.remove());
    for (const t of Object.values(Engine.TRIPS)) {
      const row = document.createElement('div'); row.className = 'trip' + (open.includes(t.id) ? '' : ' locked');
      const inp = document.createElement('input'); inp.type = 'radio'; inp.name = 'trip'; inp.id = 'trip-' + t.id; inp.value = t.id;
      inp.disabled = !open.includes(t.id) || !!(rec && rec.answers.length);
      inp.checked = (rec ? rec.trip : state.trip) === t.id;
      inp.addEventListener('change', () => { state.trip = t.id; save(); Scene.setTrip(t.id); Scene.score(0, true); });
      const img = document.createElement('img'); img.alt = ''; img.src = Art.icon(t.id);
      const lab = document.createElement('label'); lab.htmlFor = inp.id; lab.textContent = t.name;
      row.append(inp, img, lab);
      if (!open.includes(t.id)) { const s = document.createElement('span'); s.className = 'lock'; s.textContent = Copy.tripOpens(t.opens); row.append(s); }
      box.append(row);
    }
    $('startBtn').textContent = endless ? (rec && rec.answers.length ? Copy.endless.resume(E().round) : Copy.endless.start(nextN))
      : rec && rec.done ? Copy.seeResults : rec && rec.answers.length ? Copy.resume : Copy.start;
    $('hud').hidden = true;
    Scene.setTrip(rec ? rec.trip : state.trip); Scene.score(rec ? dayScore(rec) : 0, true);
    swap('title');
  }
  function setLevel(lv) {
    state.level = lv; save(); Art.setRider(lv); Scene.refresh(); showTitle();
  }
  for (const lv of ['paco', 'mario']) $('level-' + lv).addEventListener('change', () => setLevel(lv));
  $('suggestBtn').addEventListener('click', () => { picking = false; setLevel('mario'); });
  $('startBtn').addEventListener('click', () => {
    if (mode === 'endless' && roundDone()) newRound(state.trip);
    picking = false;
    const rec = today();
    if (!rec.answers.length) { rec.trip = state.trip; save(); }
    if (rec.done) showEnd(); else showQuestion();
  });

  for (const m of ['daily', 'endless']) $('mode-' + m).addEventListener('change', () => { mode = m; state.mode = m; save(); showTitle(); });
  function toDaily() { mode = 'daily'; state.mode = 'daily'; picking = false; save(); showTitle(); }
  $('leaveBtn').addEventListener('click', toDaily);
  $('leaveEndBtn').addEventListener('click', toDaily);
  // Play another round: keep the trip just played.
  $('againBtn').addEventListener('click', () => {
    const trip = today().trip; mode = 'endless'; state.mode = 'endless'; picking = false;
    state.trip = trip; newRound(trip); showQuestion();
  });
  $('changeTripBtn').addEventListener('click', () => { mode = 'endless'; state.mode = 'endless'; picking = true; save(); showTitle(); });

  function swap(id) { for (const s of ['title', 'play', 'end']) $(s).hidden = s !== id; window.scrollTo(0, 0); }

  // ---- a question ----
  let timer = null, current = null;
  function squares(rec, at) {
    const ol = $('squares'); ol.innerHTML = '';
    for (let i = 0; i < 7; i++) { const li = document.createElement('li'); if (i < rec.answers.length) { li.dataset.b = markKey(rec.answers[i]); li.textContent = markOf(rec.answers[i]); } else li.textContent = Copy.markAhead; if (i === at) li.className = 'now'; ol.append(li); }
  }
  function showQuestion() {
    const rec = today(), i = rec.answers.length;
    if (i >= 7) return finish();
    const q = questions[i]; current = { q, i };
    swap('play'); tripBar(rec); squares(rec, i);
    $('qCount').textContent = mode === 'endless' ? Copy.endless.progress(E().round, i + 1) : Copy.progress(i + 1);
    $('qText').textContent = q.text;
    $('answerLabel').textContent = Copy.answerLabel;
    $('answerBtn').textContent = Copy.answer;
    $('answerForm').hidden = false; $('answerInput').value = ''; $('answerInput').disabled = false; $('answerBtn').disabled = false;
    $('note').textContent = ''; $('note').className = 'note';
    $('result').hidden = true; $('clock').hidden = false; $('clock').classList.remove('island'); $('skipBtn').hidden = true;
    if (!rec.started[i]) { rec.started[i] = Date.now(); save(); }
    runClock(rec.started[i], secondsFor(rec));
    $('answerInput').focus();
  }
  function runClock(startedAt, SECONDS) {
    clearInterval(timer);
    const draw = () => {
      const left = Math.max(0, SECONDS - (Date.now() - startedAt) / 1000);
      $('clockFill').style.width = (left / SECONDS * 100) + '%';
      $('clockNum').textContent = Math.ceil(left);
      $('clock').classList.toggle('low', left <= 5);
      if (Math.ceil(left) === 10 && !$('clock').dataset.said) { $('clock').dataset.said = '1'; $('note').textContent = Copy.secondsLeft(10); }
      if (left <= 0) { clearInterval(timer); timeUp(); }
    };
    delete $('clock').dataset.said;
    draw(); timer = setInterval(draw, 100);
  }
  function lock() { $('answerInput').disabled = true; $('answerBtn').disabled = true; clearInterval(timer); $('clock').hidden = true; $('answerForm').hidden = true; $('skipBtn').hidden = true; }
  // When the clock runs out the question stays open in island time: no
  // clock, guessing goes on, a right answer earns a flat few points, and
  // Skip moves on with none. A reload in island time comes back to it,
  // since the start time is saved.
  function timeUp() {
    const rec = today(); if (rec.answers.length !== current.i) return;
    current.island = true;
    $('clock').classList.add('island'); $('clock').classList.remove('low');
    $('clockFill').style.width = '0%'; $('clockNum').textContent = Copy.islandTime;
    $('note').className = 'note'; $('note').textContent = Copy.islandNote;
    $('skipBtn').textContent = Copy.skip; $('skipBtn').hidden = false;
  }
  const elapsed = (rec, i) => (Date.now() - rec.started[i]) / 1000;
  $('skipBtn').addEventListener('click', () => {
    if (!current) return;
    const rec = today(); if (rec.answers.length !== current.i) return;
    lock();
    rec.answers.push({ pid: current.q.id, name: null, skip: true, points: 0, rarity: 0, speed: 0, secs: elapsed(rec, current.i) }); save();
    $('note').className = 'note'; $('note').textContent = '';
    after(rec);
  });
  $('answerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!current || $('answerInput').disabled) return;
    const m = Engine.match(current.q, $('answerInput').value);
    const note = $('note');
    if (m.status === 'empty') { note.className = 'note bad'; note.textContent = Copy.empty; return; }
    if (m.status === 'no') { note.className = 'note bad'; note.textContent = Copy.wrong; $('answerInput').select(); return; }
    if (m.status === 'off') { note.className = 'note bad'; note.textContent = Copy.off(m.item.name); $('answerInput').select(); return; }
    const rec = today(); if (rec.answers.length !== current.i) return;
    // Once the clock has run out, the answer counts in island time, timed in full.
    const island = !!current.island, secs = island ? elapsed(rec, current.i) : Math.min(secondsFor(rec), elapsed(rec, current.i));
    lock();
    note.className = 'note good'; note.textContent = m.typo ? Copy.typo(m.item.name) : '';
    const how = Engine.commonness(Engine.shares(current.q), m.item.name);
    const sc = island ? Engine.islandScore(levelOf(rec)) : Engine.score(how.c, secs, levelOf(rec));
    rec.answers.push({ pid: current.q.id, name: m.item.name, ...(island ? { island: true } : {}), points: sc.total, rarity: sc.rarity, speed: sc.speed, secs }); save();
    $('resultName').textContent = m.item.name;
    countUp($('resultPts'), sc.total);
    $('resultRarity').textContent = island ? Copy.islandTime : Copy.forRarity(sc.rarity);
    $('resultSpeed').textContent = island ? '' : Copy.forSpeed(sc.speed);
    $('resultSay').textContent = `${m.item.name}. ${Copy.points(sc.total)}.`;
    after(rec);
  });
  function after(rec) {
    $('result').hidden = false;
    const last = rec.answers[rec.answers.length - 1];
    if (!last.name) { const none = last.skip ? Copy.skipped : Copy.noAnswer; $('resultName').textContent = none; $('resultPts').textContent = '0'; $('resultRarity').textContent = ''; $('resultSpeed').textContent = ''; $('resultSay').textContent = none; }
    $('nextBtn').textContent = rec.answers.length >= 7 ? Copy.finish : Copy.next;
    squares(rec, -1); tripBar(rec);
    $('nextBtn').focus();
  }
  $('nextBtn').addEventListener('click', () => (today().answers.length >= 7 ? finish() : showQuestion()));

  // ---- the end of the day ----
  function finish() {
    const rec = today();
    rec.done = true;
    if (!rec.counted) { rec.counted = true; state.lifetime += dayScore(rec); }
    save(); showEnd();
  }
  function showEnd() {
    const rec = today(), score = dayScore(rec), r = Engine.reached(rec.trip, score);
    swap('end'); tripBar(rec);
    // Mario takes the trip in his mode
    const who = (line) => (levelOf(rec) === 'mario' ? line.replace(/^Paco/, 'Mario') : line);
    const headline = who(rec.trip !== 'dive' && !r.next ? Copy.madeIt[rec.trip] : Copy.where[rec.trip](r.label));
    $('endHead').textContent = headline;
    const endless = mode === 'endless';
    // On an endless dive, name the deepest mark passed ("the canyon wall").
    const mark = endless && rec.trip === 'dive' ? [...Engine.TRIPS.dive.marks].reverse().find((m) => r.depth >= m[0]) : null;
    $('endNext').textContent = mark ? Copy.endless.passedMark('the ' + mark[1].replace(/^The /, '').replace(/^./, (c) => c.toLowerCase()), `${fmt(mark[0])} meters`)
      : rec.trip !== 'dive' && r.next ? Copy.nextStop(r.next.label, r.next.need) : '';
    // the score sheet, World Six style: every line adds up to the total
    $('sheetHead').textContent = endless ? Copy.endless.sheetHead(E().round) : Copy.sheetHead; $('sheetHint').textContent = Copy.sheetHint;
    const sheet = $('sheet'); sheet.innerHTML = '';
    let rarity = 0, speed = 0, island = 0, secs = 0;
    questions.forEach((q, i) => {
      const a = rec.answers[i] || { name: null, points: 0, rarity: 0, speed: 0, secs: secondsFor(rec) };
      rarity += a.rarity || 0; speed += a.speed || 0; secs += a.secs || 0; if (a.island) island += a.points || 0;
      // one row per question: the answer and its points, opening to the question and every right answer
      const li = document.createElement('li'), det = document.createElement('details'), sum = document.createElement('summary');
      const sq = document.createElement('span'); sq.className = 'sq'; sq.dataset.b = markKey(a); sq.textContent = markOf(a);
      const nm = document.createElement('span'); nm.className = 'name' + (a.name ? '' : ' none'); nm.textContent = a.name || (a.skip ? Copy.skipped : Copy.noAnswer);
      const pt = document.createElement('span'); pt.className = 'pts'; pt.textContent = fmt(a.points || 0);
      const ca = document.createElement('span'); ca.className = 'caret'; ca.setAttribute('aria-hidden', 'true');
      sum.append(sq, nm, pt, ca);
      if (a.name) { const sp = document.createElement('span'); sp.className = 'split'; sp.textContent = a.island ? Copy.islandTime : `${Copy.forRarity(a.rarity)} ${Copy.forSpeed(a.speed)}`; sum.append(sp); }
      const more = document.createElement('div'); more.className = 'more';
      const pq = document.createElement('p'); pq.className = 'a-q'; pq.textContent = q.text;
      const ph = document.createElement('p'); ph.className = 'a-head'; ph.textContent = Copy.allHead(q.answers.length);
      const all = document.createElement('ul'); all.className = 'all';
      const sh = Engine.shares(q);
      [...q.answers].sort((x, y) => sh[y.item.name] - sh[x.item.name] || x.item.name.localeCompare(y.item.name)).forEach((x) => {
        const row = document.createElement('li'); if (x.item.name === a.name) row.className = 'mine';
        const n = document.createElement('span'); n.textContent = x.names[0] !== x.item.name ? `${x.item.name} (${x.names[0]})` : x.item.name;
        const c = document.createElement('span'); c.className = 'pct'; c.textContent = fmt(Math.round(Engine.rarityPoints(Engine.commonness(sh, x.item.name).c)));
        row.append(n, c); all.append(row);
      });
      more.append(pq, ph, all); det.append(sum, more); li.append(det); sheet.append(li);
    });
    $('rarityLabel').textContent = Copy.rarityTotal; $('rarityTotal').textContent = fmt(rarity);
    $('speedLabel').textContent = Copy.speedTotal; $('speedTotal').textContent = '+' + fmt(speed);
    // Island time points get their own line, so the lines still add up.
    $('islandRow').hidden = !island; $('islandLabel').textContent = Copy.islandTime; $('islandTotal').textContent = '+' + fmt(island);
    $('totalLabel').textContent = Copy.total; countUp($('grandTotal'), score);
    $('timeLabel').textContent = Copy.time; $('timeTotal').textContent = clockText(secs);
    $('endLifetime').textContent = endless ? '' : Copy.lifetime(state.lifetime);
    const before = state.lifetime - score, nt = Engine.nextTrip(state.lifetime), justOpened = Object.values(Engine.TRIPS).find((t) => t.opens > before && t.opens <= state.lifetime);
    $('endUnlock').textContent = endless ? '' : justOpened ? Copy.unlocked(Copy.tripShort[justOpened.id]) : nt ? Copy.unlock(nt.opens - state.lifetime, Copy.tripShort[nt.id]) : '';
    // Endless rounds end on the round buttons; the daily end keeps sharing,
    // and in test mode also offers another round.
    $('roundActions').hidden = !TEST_MODE;
    $('againBtn').textContent = Copy.endless.again; $('changeTripBtn').textContent = Copy.endless.changeTrip; $('leaveEndBtn').textContent = Copy.endless.leave;
    $('changeTripBtn').hidden = !endless; $('leaveEndBtn').hidden = !endless;
    $('againBtn').classList.toggle('primary', endless); $('againBtn').classList.toggle('quiet', !endless);
    $('share').hidden = endless;
    // A rough set in Paco's mode suggests Mario's easier one: under 12,000
    // points, or three or more questions with no answer in time (skipped
    // or answered in island time).
    const rough = levelOf(rec) === 'paco' && (score < 12000 || rec.answers.filter((x) => !x.name || x.island).length >= 3);
    $('suggest').hidden = !rough; $('suggestText').textContent = Copy.suggestMario; $('suggestBtn').textContent = Copy.playMario;
    // Earlier rounds: one line per finished round before this one, newest
    // first, never added up. Left out after round 1.
    const earlier = endless ? Object.keys(E().rounds).map(Number).filter((n) => n < E().round && E().rounds[n].done).sort((x, y) => y - x) : [];
    $('earlier').hidden = !earlier.length; $('earlierHead').textContent = Copy.endless.earlierHead;
    $('earlierList').innerHTML = '';
    for (const n of earlier) {
      const er = E().rounds[n], li = document.createElement('li');
      const a = document.createElement('span'); a.textContent = Copy.endless.earlierRow(n, Copy.tripShort[er.trip]);
      const b = document.createElement('span'); b.className = 'pts'; b.textContent = fmt(dayScore(er));
      li.append(a, b); $('earlierList').append(li);
    }
    const marks = rec.answers.map(markOf).join('');
    $('shareText').textContent = Copy.share(Copy.apDate(new Date(Date.UTC(2026, 10, 15 + day))), levelOf(rec) === 'mario', marks, fmt(score));
    $('copyBtn').textContent = Copy.copyResult; $('moveBtn').textContent = Copy.moveHeading; $('copyNote').textContent = '';
    $('comeBack').textContent = endless ? '' : Copy.comeBack(Copy.apTime(Engine.nextReset()));
    $('endHead').focus();
  }
  $('copyBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('shareText').textContent); $('copyNote').textContent = Copy.copied; }
    catch (e) { $('copyNote').textContent = Copy.copyFailed; }
  });

  // ---- moving progress between devices ----
  const pack = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unpack = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
  $('moveBtn').addEventListener('click', () => {
    $('moveHead').textContent = Copy.moveHeading; $('moveBody').textContent = Copy.moveBody;
    $('copyLinkBtn').textContent = Copy.copyLink; $('closeMove').textContent = Copy.close; $('moveNote').textContent = '';
    $('moveLink').value = `${location.origin}${location.pathname}#move=${pack(state)}`;
    $('moveDialog').showModal();
  });
  $('copyLinkBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('moveLink').value); $('moveNote').textContent = Copy.copied; }
    catch (e) { $('moveLink').select(); $('moveNote').textContent = Copy.copyFailed; }
  });
  $('closeMove').addEventListener('click', () => $('moveDialog').close());

  function checkImport() {
    const m = location.hash.match(/^#move=(.+)$/); if (!m) return;
    history.replaceState(null, '', location.pathname);
    let incoming = null; try { incoming = unpack(m[1]); } catch (e) { /* bad link */ }
    $('importHead').textContent = Copy.importHeading;
    if (!incoming || incoming.v !== 2) { $('importBody').textContent = Copy.importBad; $('importYes').hidden = true; $('importNo').textContent = Copy.close; $('importDialog').showModal(); return; }
    $('importBody').textContent = Copy.importBody(incoming.lifetime || 0);
    $('importYes').textContent = Copy.importYes; $('importNo').textContent = Copy.importNo;
    $('importYes').onclick = () => { state = incoming; tidy(); mode = 'daily'; picking = false; save(); $('importDialog').close(); showTitle(); };
    $('importDialog').showModal();
  }
  $('importNo').addEventListener('click', () => $('importDialog').close());

  // ---- start ----
  Scene.init($('scene')).then(() => { if (!Scene.ready) { const p = document.createElement('p'); p.className = 'note'; p.style.padding = '0 20px'; p.textContent = Copy.noScene; $('scene').after(p); } });
  showTitle();
  checkImport();
  window.PacoDebug = { state: () => state, day, questions: () => questions };
  // the service worker keeps the game working offline once it has loaded
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
