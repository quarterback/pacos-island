/* Cloudflare Pages Function: counts answers across players.

   Needs a D1 database bound as DB (see schema.sql and README). Without the
   binding it answers 503 and the game falls back to estimated shares.

   GET  /api/answers?day=1&prompt=countries.landlocked
   POST /api/answers  { day, prompt, answer, player }
   Both return { total, counts: { answer: n } }. A player is counted once
   per question. */
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
const okDay = (d) => Number.isInteger(d) && d > 0 && d < 100000;
const okPrompt = (p) => typeof p === 'string' && p.length < 64 && /^[a-z]+\.[a-z0-9-]+$/.test(p);
const okText = (t) => typeof t === 'string' && t.length > 0 && t.length < 80;

async function counts(db, day, prompt) {
  const { results } = await db.prepare('SELECT answer, COUNT(*) AS n FROM picks WHERE day = ? AND prompt = ? GROUP BY answer').bind(day, prompt).all();
  const out = {}; let total = 0;
  for (const r of results) { out[r.answer] = r.n; total += r.n; }
  return { total, counts: out };
}

export async function onRequest({ request, env }) {
  if (!env.DB) return json({ error: 'Answer counting is off on this deployment.' }, 503);
  if (request.method === 'GET') {
    const u = new URL(request.url), day = Number(u.searchParams.get('day')), prompt = u.searchParams.get('prompt');
    if (!okDay(day) || !okPrompt(prompt)) return json({ error: 'Bad day or question id.' }, 400);
    return json(await counts(env.DB, day, prompt));
  }
  if (request.method === 'POST') {
    let b; try { b = await request.json(); } catch (e) { return json({ error: 'Send JSON.' }, 400); }
    if (!okDay(b.day) || !okPrompt(b.prompt) || !okText(b.answer) || !okText(b.player)) return json({ error: 'Missing or bad fields.' }, 400);
    await env.DB.prepare('INSERT OR IGNORE INTO picks (day, prompt, player, answer, at) VALUES (?, ?, ?, ?, ?)').bind(b.day, b.prompt, b.player, b.answer, Date.now()).run();
    return json(await counts(env.DB, b.day, b.prompt));
  }
  return json({ error: 'Use GET or POST.' }, 405);
}
