/* Paco's Island: screens and saved progress.

   Progress lives in this browser under one anonymous player id. "Move my
   progress" puts the whole record in a link so it can be opened on
   another device. If the site has the /api/answers function (Cloudflare
   Pages with a D1 database), answers are counted across players; without
   it, shares come from the day one guess and the game still works. */
'use strict';
(() => {
  const $ = (id) => document.getElementById(id);
  const KEY = 'pacos-island.v1';
  const SECONDS = 25;
  const day = Engine.dayNumber();
  const questions = Prompts.forDay(day);

  // ---- saved progress ----
  const fresh = () => ({ v: 1, id: (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)), lifetime: 0, trip: 'boat', days: {} });
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) { /* storage blocked or empty */ } return fresh(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage blocked: progress lasts this visit */ } }
  let state = load();
  const today = () => (state.days[day] ||= { trip: state.trip, answers: [], started: {}, done: false, counted: false });
  const dayScore = (rec) => rec.answers.reduce((s, a) => s + (a.points || 0), 0);
  const bucket = (pts) => (pts == null || pts === 0 ? 0 : pts < 30 ? 1 : pts < 60 ? 2 : pts < 85 ? 3 : 4);

  // ---- answer counts across players (optional) ----
  async function api(method, params) {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 2000);
    try {
      const url = method === 'GET' ? `/api/answers?${new URLSearchParams(params)}` : '/api/answers';
      const res = await fetch(url, { method, signal: ctl.signal, headers: { 'content-type': 'application/json' }, body: method === 'POST' ? JSON.stringify(params) : undefined });
      if (!res.ok) return null;
      const data = await res.json();
      return data && typeof data.total === 'number' ? data : null;
    } catch (e) { return null; } finally { clearTimeout(t); }
  }

  // ---- the trip bar ----
  function tripBar(rec) {
    const score = dayScore(rec), r = Engine.reached(rec.trip, score);
    $('tripBar').hidden = false;
    $('tripScore').textContent = score;
    $('tripWhere').textContent = rec.trip === 'dive' ? `Depth ${r.label}` : r.next ? `Next stop: ${r.next.label}` : `At ${r.label}`;
    Scene.setTrip(rec.trip); Scene.score(score);
  }

  // ---- title ----
  function showTitle() {
    $('titleHead').textContent = Copy.title;
    $('intro').textContent = Copy.intro;
    $('tripLegend').textContent = Copy.tripLegend;
    $('howHead').textContent = Copy.howHeading;
    $('howList').innerHTML = ''; for (const line of Copy.how) { const li = document.createElement('li'); li.textContent = line; $('howList').append(li); }
    $('credit').textContent = Copy.credit;
    const rec = state.days[day];
    const open = Engine.opened(state.lifetime);
    const box = $('trips'); box.querySelectorAll('.trip').forEach((n) => n.remove());
    for (const t of Object.values(Engine.TRIPS)) {
      const row = document.createElement('div'); row.className = 'trip' + (open.includes(t.id) ? '' : ' locked');
      const inp = document.createElement('input'); inp.type = 'radio'; inp.name = 'trip'; inp.id = 'trip-' + t.id; inp.value = t.id;
      inp.disabled = !open.includes(t.id) || !!(rec && rec.answers.length);
      inp.checked = (rec ? rec.trip : state.trip) === t.id;
      inp.addEventListener('change', () => { state.trip = t.id; save(); Scene.setTrip(t.id); Scene.score(0, true); });
      const lab = document.createElement('label'); lab.htmlFor = inp.id; lab.textContent = t.name;
      row.append(inp, lab);
      if (!open.includes(t.id)) { const s = document.createElement('span'); s.className = 'lock'; s.textContent = Copy.tripOpens(t.opens); row.append(s); }
      box.append(row);
    }
    $('startBtn').textContent = rec && rec.done ? Copy.seeResults : rec && rec.answers.length ? Copy.resume : Copy.start;
    $('tripBar').hidden = true;
    Scene.setTrip(rec ? rec.trip : state.trip); Scene.score(rec ? dayScore(rec) : 0, true);
    swap('title');
  }
  $('startBtn').addEventListener('click', () => {
    const rec = today();
    if (!rec.answers.length) { rec.trip = state.trip; save(); }
    if (rec.done) showEnd(); else showQuestion();
  });

  function swap(id) { for (const s of ['title', 'play', 'end']) $(s).hidden = s !== id; window.scrollTo(0, 0); }

  // ---- a question ----
  let timer = null, current = null;
  function squares(rec, at) {
    const ol = $('squares'); ol.innerHTML = '';
    for (let i = 0; i < 7; i++) { const li = document.createElement('li'); if (i < rec.answers.length) li.dataset.b = bucket(rec.answers[i].points); if (i === at) li.className = 'now'; ol.append(li); }
  }
  function showQuestion() {
    const rec = today(), i = rec.answers.length;
    if (i >= 7) return finish();
    const q = questions[i]; current = { q, i };
    swap('play'); tripBar(rec); squares(rec, i);
    $('qCount').textContent = Copy.progress(i + 1);
    $('qText').textContent = q.text;
    $('answerLabel').textContent = Copy.answerLabel;
    $('answerBtn').textContent = Copy.answer;
    $('answerForm').hidden = false; $('answerInput').value = ''; $('answerInput').disabled = false; $('answerBtn').disabled = false;
    $('note').textContent = ''; $('note').className = 'note';
    $('result').hidden = true; $('clock').hidden = false;
    if (!rec.started[i]) { rec.started[i] = Date.now(); save(); }
    runClock(rec.started[i]);
    $('answerInput').focus();
  }
  function runClock(startedAt) {
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
  function lock() { $('answerInput').disabled = true; $('answerBtn').disabled = true; clearInterval(timer); $('clock').hidden = true; $('answerForm').hidden = true; }
  function timeUp() {
    const rec = today(); if (rec.answers.length !== current.i) return;
    lock();
    rec.answers.push({ pid: current.q.id, name: null, points: 0 }); save();
    $('note').className = 'note bad'; $('note').textContent = Copy.timeUp;
    after(rec);
  }
  $('answerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!current || $('answerInput').disabled) return;
    const m = Engine.match(current.q, $('answerInput').value);
    const note = $('note');
    if (m.status === 'empty') { note.className = 'note bad'; note.textContent = Copy.empty; return; }
    if (m.status === 'no') { note.className = 'note bad'; note.textContent = Copy.wrong; $('answerInput').select(); return; }
    if (m.status === 'off') { note.className = 'note bad'; note.textContent = Copy.off(m.item.name); $('answerInput').select(); return; }
    const rec = today(); if (rec.answers.length !== current.i) return;
    lock();
    note.className = 'note good'; note.textContent = m.typo ? Copy.typo(m.item.name) : '';
    const crowd = await api('POST', { day, prompt: current.q.id, answer: m.item.name, player: state.id });
    const sh = Engine.shares(current.q, crowd);
    const p = Engine.points(sh.shares, m.item.name);
    rec.answers.push({ pid: current.q.id, name: m.item.name, points: p.points, rarer: p.rarer }); save();
    $('resultName').textContent = m.item.name;
    $('resultPts').textContent = Copy.points(p.points);
    $('resultRarer').textContent = Copy.rarer(p.rarer);
    after(rec);
  });
  function after(rec) {
    $('result').hidden = false;
    if (!rec.answers[rec.answers.length - 1].name) { $('resultName').textContent = Copy.noAnswer; $('resultPts').textContent = Copy.points(0); $('resultRarer').textContent = ''; }
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
    $('endHead').textContent = Copy.where[rec.trip](r.label);
    $('endTotal').textContent = Copy.todayTotal(score, state.lifetime);
    $('endNext').textContent = rec.trip === 'dive' ? '' : r.next ? Copy.nextStop(r.next.label, r.next.need) : Copy.madeIt[rec.trip];
    const before = state.lifetime - score, nt = Engine.nextTrip(state.lifetime), justOpened = Object.values(Engine.TRIPS).find((t) => t.opens > before && t.opens <= state.lifetime);
    $('endUnlock').textContent = justOpened ? Copy.unlocked(Copy.tripShort[justOpened.id]) : nt ? Copy.unlock(nt.opens - state.lifetime, Copy.tripShort[nt.id]) : '';
    const sq = rec.answers.map((a) => ['⬜', '🟦', '🟩', '🟨', '🟥'][bucket(a.points)]).join('');
    $('shareText').textContent = Copy.share(day, Copy.where[rec.trip](r.label), score, sq);
    $('copyBtn').textContent = Copy.copyResult; $('moveBtn').textContent = Copy.moveHeading; $('copyNote').textContent = '';
    $('answersHead').textContent = Copy.yourAnswers;
    $('comeBack').textContent = Copy.comeBack;
    renderAnswers(rec);
    $('endHead').focus();
  }
  async function renderAnswers(rec) {
    const ol = $('answers'); ol.innerHTML = ''; let anyEstimate = false;
    const counts = await Promise.all(questions.map((q) => api('GET', { day, prompt: q.id })));
    questions.forEach((q, i) => {
      const mine = rec.answers[i] || { name: null, points: 0 };
      const sh = Engine.shares(q, counts[i]); if (sh.estimated) anyEstimate = true;
      const li = document.createElement('li');
      const pq = document.createElement('p'); pq.className = 'a-q'; pq.textContent = q.text;
      const pm = document.createElement('p'); pm.className = 'a-mine' + (mine.name ? '' : ' none');
      const nm = document.createElement('span'); nm.textContent = mine.name || Copy.noAnswer;
      const pt = document.createElement('span'); pt.className = 'pts'; pt.textContent = mine.points;
      pm.append(nm, pt);
      const det = document.createElement('details'); const sum = document.createElement('summary'); sum.textContent = `${Copy.everyAnswer} (${q.answers.length})`;
      const all = document.createElement('ul'); all.className = 'all';
      [...q.answers].sort((a, b) => sh.shares[b.item.name] - sh.shares[a.item.name] || a.item.name.localeCompare(b.item.name)).forEach((a) => {
        const row = document.createElement('li'); if (a.item.name === mine.name) row.className = 'mine';
        const n = document.createElement('span'); n.textContent = a.names[0] !== a.item.name ? `${a.item.name} (${a.names[0]})` : a.item.name;
        const c = document.createElement('span'); c.className = 'pct';
        const count = counts[i] && counts[i].counts ? counts[i].counts[a.item.name] || 0 : null;
        c.textContent = count === 0 ? Copy.nobody : Math.max(1, Math.round(sh.shares[a.item.name] * 100)) + '%';
        row.append(n, c); all.append(row);
      });
      det.append(sum, all); li.append(pq, pm, det); ol.append(li);
    });
    $('estNote').textContent = anyEstimate ? Copy.estimated : '';
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
    if (!incoming || incoming.v !== 1) { $('importBody').textContent = Copy.importBad; $('importYes').hidden = true; $('importNo').textContent = Copy.close; $('importDialog').showModal(); return; }
    $('importBody').textContent = Copy.importBody(incoming.lifetime || 0);
    $('importYes').textContent = Copy.importYes; $('importNo').textContent = Copy.importNo;
    $('importYes').onclick = () => { state = incoming; save(); $('importDialog').close(); showTitle(); };
    $('importDialog').showModal();
  }
  $('importNo').addEventListener('click', () => $('importDialog').close());

  // ---- start ----
  Scene.init($('scene')).then(() => { if (!Scene.ready) { const p = document.createElement('p'); p.className = 'note'; p.style.padding = '0 20px'; p.textContent = Copy.noScene; $('scene').after(p); } });
  showTitle();
  checkImport();
  window.PacoDebug = { state: () => state, day, questions };
})();
