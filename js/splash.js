/* Paco's Island: the title screen's moving scene.

   The boat trip's coast pans slowly behind Paco's boat, and every so often
   Esmeralda flies across carrying Paco's twin. Each frame is drawn at the
   art's own size (240 pixels tall) and then scaled up whole, so the title
   keeps one pixel scale. Above the strip its top row of sky is stretched
   to the top of the screen, and below it the sea's color fills the rest.
   With reduced motion the scene holds still. */
'use strict';
const Splash = (() => {
  const H = 240, PAN = 7, FLY_EVERY = 16000, FLY_FOR = 8000;
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cv = null, g = null, off = null, og = null, strip = null, boats = [], fliers = [], raf = 0, t0 = 0, seaBottom = '';

  function frames(level) {
    // Paco rides the boat in his mode and Mario in Mario's; the other twin flies.
    const twin = level === 'mario' ? 'paco' : 'mario', rider = level === 'mario' ? 'mario' : 'paco';
    Art.setRider(rider); boats = [Art.boat(0), Art.boat(1)];
    Art.setRider(twin); fliers = [Art.flier(0), Art.flier(1)];
    Art.setRider(rider);
  }

  function draw(now) {
    const cw = cv.width, ch = cv.height;
    // scale so the strip shows about 280 art pixels across a phone, more on wider screens
    const s = Math.max(1, Math.min(cw / 280, ch / (H * 1.15)));
    const vw = Math.ceil(cw / s), bandTop = Math.round(ch * 0.06), bandH = Math.round(H * s);
    if (!off || off.width !== vw) { off = document.createElement('canvas'); off.width = vw; off.height = H; og = off.getContext('2d'); }
    // the first frame's clock can read a little before t0
    const t = reduced ? 0 : Math.max(0, now - t0) / 1000;
    const span = Art.COAST.w - vw, travel = (t * PAN) % (span * 2), x = Math.round(travel < span ? travel : span * 2 - travel);
    og.clearRect(0, 0, vw, H);
    og.drawImage(strip, x, 0, vw, H, 0, 0, vw, H);
    // the boat holds a third of the way across, bobbing; its two frames trade places
    const bob = reduced ? 0 : Math.round(Math.sin(t * 2.2));
    const b = boats[reduced ? 0 : Math.floor(t * 3) % 2];
    // on wide screens the title panel sits in the middle, so the boat sails in the open water to its left
    const css = cv.clientWidth || cw, dpr = cw / css;
    const boatX = css > 760 ? ((css - 560) / 4) * dpr / s : vw * 0.3;
    og.drawImage(b, Math.round(Math.max(b.width / 2 + 4, boatX) - b.width / 2), Art.COAST.horizon + 55 - 49 + bob);
    // Esmeralda crosses now and then, flapping
    if (!reduced) {
      const phase = Math.max(0, now - t0) % FLY_EVERY;
      if (phase < FLY_FOR) {
        const f = fliers[Math.floor(now / 220) % 2], p = phase / FLY_FOR;
        og.drawImage(f, Math.round(-f.width + p * (vw + f.width * 2)), Math.round(26 + Math.sin(p * Math.PI * 2) * 8));
      }
    } else og.drawImage(fliers[0], Math.round(vw * 0.62), 30);
    g.imageSmoothingEnabled = false;
    g.drawImage(strip, x, 0, vw, 1, 0, 0, cw, bandTop + 1);
    g.drawImage(off, 0, 0, vw, H, 0, bandTop, vw * s, bandH);
    g.fillStyle = seaBottom; g.fillRect(0, bandTop + bandH - 1, cw, ch - bandTop - bandH + 1);
    if (!reduced) raf = requestAnimationFrame(draw);
  }

  function fit() { if (!cv) return; cv.width = Math.ceil(cv.clientWidth * Math.min(2, devicePixelRatio || 1)); cv.height = Math.ceil(cv.clientHeight * Math.min(2, devicePixelRatio || 1)); if (reduced) draw(performance.now()); }

  function start(canvas, level) {
    cv = canvas; g = cv.getContext('2d');
    if (!strip) {
      strip = Art.coast();
      // the sea color at the strip's bottom fills the screen below it
      const px = (y0) => { const d = strip.getContext('2d').getImageData(4, y0, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})`; };
      seaBottom = px(H - 1);
    }
    frames(level);
    fit(); addEventListener('resize', fit);
    t0 = performance.now();
    cancelAnimationFrame(raf);
    if (reduced) draw(t0); else raf = requestAnimationFrame(draw);
  }

  function stop() { cancelAnimationFrame(raf); removeEventListener('resize', fit); }

  return { start, stop };
})();
if (typeof module !== 'undefined') module.exports = Splash;
