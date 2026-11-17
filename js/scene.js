/* Paco's Island: the trip scene.

   A 384 x 192 Pixi stage, scaled up in CSS with no smoothing. The trip's
   strip from art.js scrolls behind Paco. Score drives his position: on the
   boat and the ATV it moves him along the stops, on the dive it takes him
   down. If WebGL is unavailable the scene stays hidden and the game still
   works. */
'use strict';
const Scene = (() => {
  const W = 384, H = 192;
  let app = null, ready = false, world, bg, rider, frames = [], dots = [];
  let trip = 'boat', target = 0, current = 0, lastFrameAt = 0, frame = 0;
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const strips = {};

  const tex = (cv) => new PIXI.Texture({ source: new PIXI.CanvasSource({ resource: cv, scaleMode: 'nearest' }) });
  const dot = (() => { let t = null; return () => { if (!t) { const c = document.createElement('canvas'); c.width = c.height = 2; const g = c.getContext('2d'); g.fillStyle = '#F4FBFD'; g.fillRect(0, 0, 2, 2); t = tex(c); } return t; }; })();

  async function init(el) {
    try {
      app = new PIXI.Application();
      await app.init({ width: W, height: H, background: '#8ED8EE', antialias: false, resolution: 1, preference: 'webgl' });
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
    if (!strips[t]) strips[t] = tex(t === 'boat' ? Art.coast() : t === 'atv' ? Art.hill() : Art.deep());
    bg = new PIXI.Sprite(strips[t]); world.addChild(bg);
    frames = [0, 1].map((f) => tex(t === 'boat' ? Art.boat(f) : t === 'atv' ? Art.atv(f) : Art.diver(f)));
    dots = Array.from({ length: t === 'atv' ? 0 : 14 }, () => { const s = new PIXI.Sprite(dot()); s.alpha = 0; world.addChild(s); return { s, life: 0 }; });
    rider = new PIXI.Sprite(frames[0]); world.addChild(rider);
    current = target; place(performance.now());
  }

  // where Paco is for a given score, in strip pixels
  function spot(score) {
    if (trip === 'dive') return { x: 128, y: Art.DEEP.yForScore(score) };
    const stops = Engine.TRIPS[trip].stops, geo = trip === 'boat' ? Art.COAST : Art.HILL;
    let i = 0; while (i < stops.length - 1 && score >= stops[i + 1][0]) i++;
    const a = stops[i], b = stops[i + 1];
    const f = b ? (score - a[0]) / (b[0] - a[0]) : 0;
    const x = geo.stopX(i) + f * (b ? geo.stopX(i + 1) - geo.stopX(i) : 0);
    return { x, y: trip === 'boat' ? geo.horizon + 44 : geo.ground(x) };
  }

  function place(now) {
    const p = spot(current), moving = Math.abs(target - current) > 0.5;
    if (moving && now - lastFrameAt > 140) { frame ^= 1; lastFrameAt = now; rider.texture = frames[frame]; }
    const bob = reduced ? 0 : Math.round(Math.sin(now / 420));
    if (trip === 'boat') { rider.x = Math.round(p.x - 52); rider.y = Math.round(p.y - 38 + bob); }
    else if (trip === 'atv') { rider.x = Math.round(p.x - 46); rider.y = Math.round(p.y - 57); }
    else { rider.x = Math.round(p.x - 33 + (reduced ? 0 : Math.sin(now / 900) * 8)); rider.y = Math.round(p.y - 18 + bob); }
    // camera
    const sw = bg.texture.width, sh = bg.texture.height;
    if (trip === 'dive') { world.x = -Math.round((sw - W) / 2); world.y = -Math.max(0, Math.min(sh - H, Math.round(p.y - 80))); }
    else {
      world.x = -Math.max(0, Math.min(sw - W, Math.round(p.x - 130)));
      world.y = trip === 'boat' ? 0 : -Math.max(0, Math.min(sh - H, Math.round(p.y - 140)));
    }
    // wake behind the boat, bubbles above the diver
    for (const d of dots) {
      if (d.life <= 0 && !reduced && (trip === 'dive' || moving) && Math.random() < 0.06) {
        d.life = 1;
        d.s.x = trip === 'boat' ? rider.x - 4 - Math.random() * 16 : rider.x + 52;
        d.s.y = trip === 'boat' ? rider.y + 38 + Math.random() * 4 : rider.y + 8;
      }
      if (d.life > 0) { d.life -= 0.02; d.s.alpha = d.life; if (trip === 'dive') d.s.y -= 0.4; else d.s.x -= 0.3; }
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
  return { init, setTrip, score, get ready() { return ready; } };
})();
