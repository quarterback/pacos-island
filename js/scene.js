/* Paco's Island: the trip scene.

   A 480 x 240 Pixi stage, drawn at three times that size so each art
   pixel stays sharp when CSS fits the canvas to the page. The trip's
   strip from art.js scrolls behind Paco. Score drives his position: on the
   boat, the walk and the ATV it moves him along the stops, on the dive it
   takes him down. If WebGL is unavailable the scene stays hidden and the game still
   works. */
'use strict';
const Scene = (() => {
  const W = 480, H = 240, RES = 3;
  let app = null, ready = false, world, bg, rider, frames = [], dots = [];
  let trip = 'boat', target = 0, current = 0, lastFrameAt = 0, frame = 0;
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const strips = {};

  const tex = (cv) => new PIXI.Texture({ source: new PIXI.CanvasSource({ resource: cv, scaleMode: 'nearest' }) });
  const dot = (() => { let t = null; return () => { if (!t) { const c = document.createElement('canvas'); c.width = c.height = 6; const g = c.getContext('2d'); const gr = g.createRadialGradient(3, 3, 0.5, 3, 3, 3); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 6, 6); t = tex(c); } return t; }; })();

  async function init(el) {
    try {
      app = new PIXI.Application();
      await app.init({ width: W, height: H, background: '#84D0EE', antialias: false, resolution: RES, autoDensity: false, preference: 'webgl' });
      PIXI.TextureSource.defaultOptions.scaleMode = 'nearest';
      app.canvas.setAttribute('aria-hidden', 'true');
      el.appendChild(app.canvas);
      world = new PIXI.Container(); app.stage.addChild(world);
      app.ticker.add(tick);
      ready = true;
      setTrip(trip, true);
    } catch (e) { el.classList.add('no-scene'); ready = false; }
  }

  function setTrip(t, force) {
    if (!ready) { trip = t; return; }
    if (t === trip && !force && bg) return;
    trip = t;
    world.removeChildren();
    const STRIP = { boat: Art.coast, walk: Art.town, atv: Art.hill, market: Art.market, fly: Art.flight, dive: Art.deep };
    const RIDER = { boat: Art.boat, walk: Art.walker, atv: Art.atv, market: Art.walker, fly: Art.flier, dive: Art.diver };
    if (!strips[t]) strips[t] = tex(STRIP[t]());
    bg = new PIXI.Sprite(strips[t]); world.addChild(bg);
    frames = [0, 1].map((f) => tex(RIDER[t](f)));
    dots = Array.from({ length: t === 'boat' || t === 'dive' ? 14 : 0 }, () => { const s = new PIXI.Sprite(dot()); s.alpha = 0; world.addChild(s); return { s, life: 0 }; });
    rider = new PIXI.Sprite(frames[0]); world.addChild(rider);
    current = target; place(performance.now());
  }

  // where Paco is for a given score, in strip pixels
  function spot(score) {
    if (trip === 'dive') return { x: 160, y: Art.DEEP.yForScore(score) };
    const stops = Engine.TRIPS[trip].stops, geo = { boat: Art.COAST, walk: Art.TOWN, atv: Art.HILL, market: Art.MARKET, fly: Art.FLIGHT }[trip];
    let i = 0; while (i < stops.length - 1 && score >= stops[i + 1][0]) i++;
    const a = stops[i], b = stops[i + 1];
    const f = b ? (score - a[0]) / (b[0] - a[0]) : 0;
    const x = geo.stopX(i) + f * (b ? geo.stopX(i + 1) - geo.stopX(i) : 0);
    return { x, y: trip === 'boat' ? geo.horizon + 55 : geo.ground(x) };
  }

  function place(now) {
    const p = spot(current), moving = Math.abs(target - current) > 0.5;
    if (moving && now - lastFrameAt > 140) { frame ^= 1; lastFrameAt = now; rider.texture = frames[frame]; }
    const bob = reduced ? 0 : Math.round(Math.sin(now / 420));
    if (trip === 'boat') { rider.x = Math.round(p.x - 66); rider.y = Math.round(p.y - 49 + bob); }
    else if (trip === 'atv') { rider.x = Math.round(p.x - 59); rider.y = Math.round(p.y - 73); }
    else if (trip === 'walk' || trip === 'market') { rider.x = Math.round(p.x - 40); rider.y = Math.round(p.y - 43); }
    else if (trip === 'fly') { rider.x = Math.round(p.x - 44); rider.y = Math.round(p.y - 28 + (reduced ? 0 : Math.sin(now / 300) * 3)); }
    else { rider.x = Math.round(p.x - 43 + (reduced ? 0 : Math.sin(now / 900) * 10)); rider.y = Math.round(p.y - 24 + bob); }
    // camera
    const sw = bg.texture.width, sh = bg.texture.height;
    if (trip === 'dive') { world.x = -Math.round((sw - W) / 2); world.y = -Math.max(0, Math.min(sh - H, Math.round(p.y - 100))); }
    else {
      world.x = -Math.max(0, Math.min(sw - W, Math.round(p.x - 162)));
      world.y = trip === 'boat' ? 0 : -Math.max(0, Math.min(sh - H, Math.round(p.y - 175)));
    }
    // wake behind the boat, bubbles above the diver
    for (const d of dots) {
      if (d.life <= 0 && !reduced && (trip === 'dive' || moving) && Math.random() < 0.06) {
        d.life = 1;
        d.s.x = trip === 'boat' ? rider.x - 6 - Math.random() * 22 : rider.x + 70;
        d.s.y = trip === 'boat' ? rider.y + 48 + Math.random() * 5 : rider.y + 12;
      }
      if (d.life > 0) { d.life -= 0.02; d.s.alpha = d.life; if (trip === 'dive') d.s.y -= 0.5; else d.s.x -= 0.4; }
      else d.s.alpha = 0;
    }
  }

  function tick() {
    const now = performance.now();
    if (reduced) current = target;
    else current += (target - current) * 0.05;
    if (Math.abs(target - current) < 0.3) current = target;
    place(now);
  }

  function score(s, instant) { target = s; if (instant || reduced) current = s; }
  // Redraw the rider, after Art.setRider switches between Paco and Mario.
  function refresh() { if (ready) setTrip(trip, true); }
  return { init, setTrip, score, refresh, get ready() { return ready; } };
})();
