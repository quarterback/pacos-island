/* Paco's Island: pixel art, drawn in code.

   The scene is 384 x 192 pixels. Paco is built from shapes on a small
   grid, shaded by material (top edges lit, bottom edges shaded, scale
   dots) and then outlined. His boat, ATV and dive gear are drawn the same
   way. Each trip has one long background strip: the coast of Bahía
   Ixtaluz from the Ixtaluz pier to Paco's Island, the climb from the
   island's beach to the upper waterfall, and the water from the surface
   to the canyon floor. Every place is fictional. scene.js turns these
   canvases into Pixi textures and scales them with no smoothing. */
'use strict';
const Art = (() => {
  const C = {
    sky1: '#7FD0EC', sky2: '#93D9F0', sky3: '#A8E2F3', sky4: '#BDEAF5', cloud: '#FFFFFF', cloudSh: '#D6EEF6',
    sun: '#FFC43A', sunHi: '#FFE08A', sunRim: '#FFD866',
    far: '#5FA88A', farDk: '#4E957A', mid1: '#2F8F5B', mid2: '#267C4E', jung1: '#1E6E43', jung2: '#2A8A50', jung3: '#45A85C', jungHi: '#7CCB62',
    sand: '#F2D48F', sandHi: '#F8E3AE', sandDk: '#D9B26A', rock: '#8C7B6B', rockDk: '#5E5248', rockHi: '#B3A390', rockLit: '#C9BBA6',
    sea1: '#3CC2D2', sea2: '#22A9BC', sea3: '#1191A6', sea4: '#0B7A8E', foam: '#F4FBFD', glint: '#E3F8FC',
    wall: '#F6F0E4', wallSh: '#DDD3BF', roof: '#D2553A', roofDk: '#A63E2A', roofHi: '#E57A5C', door: '#6A3B22', win: '#2B6E8F', winHi: '#9ED8EA',
    pink: '#E0237A', pinkHi: '#F25C9B', teal: '#3FBFB0', yellow: '#F6CF4A', coral: '#F2725C',
    ink: '#0D2340', white: '#FFFFFF', trunk: '#8A5A2B', trunkDk: '#5E3B1A', palm: '#2E8F3E', palmHi: '#5DB84E', palmDk: '#1F6B2D', coco: '#6B4420',
    gOut: '#1C4719', gDk: '#3E8E2B', gMid: '#6DBE3A', gHi: '#9FDB52', belly: '#CDEE8A', crest: '#F28C28', crestDk: '#C4621A', dew: '#B5E35C', dewDk: '#86C23F', cheek: '#F59BB8',
    straw: '#EBC769', strawDk: '#C99A33', strawOut: '#7E5B1C',
    hull: '#F7F7F2', hullSh: '#D4DCDF', hullOut: '#56636B', stripe: '#1C5FA8', stripe2: '#E0352B', wood: '#A8743F', woodDk: '#7A5128', motor: '#2F353D', motorHi: '#5B6570',
    atv: '#E0352B', atvHi: '#F26A55', atvDk: '#A3241D', tire: '#1E2328', tread: '#3A4048', rim: '#AEB7BE', metal: '#8C969E', lamp: '#FFE08A',
    mask: '#FFC43A', maskDk: '#C98F12', glass: '#9FE6F2', tank: '#D3D9DE', tankDk: '#9AA4AC', fin: '#E0237A', finDk: '#A3165A',
    deep1: '#1191A6', deep2: '#0B7A8E', deep3: '#0A6A80', deep4: '#08566B', deep5: '#064456', deep6: '#04303F', deep7: '#03202B', ray: '#2BA9BC',
    mud: '#5A4A33', mudHi: '#7A6648', kelp: '#3FA86A', kelpDk: '#2A7D4C', water: '#CFF4FA', waterDk: '#8FD9E9', river: '#46BFD4', riverDk: '#2E9DB4',
    dirt: '#B98A52', dirtHi: '#CFA06A', dirtDk: '#8F6638', grass: '#5DB84E', grassDk: '#3E9440', fern: '#4FAE5E',
  };

  const noise = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; };
  const px = (g, x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };
  const disc = (g, cx, cy, r, c) => { for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); px(g, cx - w, cy + y, c, w * 2 + 1, 1); } };
  // a checkerboard step between two colors, for skies and water
  function dither(g, x, y, w, h, a, b) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(g, x + i, y + j, (i + j) % 2 ? a : b); }

  // ---- the sprite grid: materials, shading, outline --------------------
  // Each cell holds a material letter. paint() lights top edges, darkens
  // bottom edges and adds texture, then rings the shape with an outline.
  function Grid(w, h) { return { w, h, m: Array.from({ length: h }, () => Array(w).fill('')) }; }
  const put = (G, x, y, k) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < G.w && y < G.h) G.m[y][x] = k; };
  const at = (G, x, y) => (x >= 0 && y >= 0 && x < G.w && y < G.h ? G.m[y][x] : '');
  function ellipse(G, cx, cy, rx, ry, k) { for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) { const dx = (x - cx) / rx, dy = (y - cy) / ry; if (dx * dx + dy * dy <= 1) put(G, x, y, k); } }
  function rect(G, x, y, w, h, k) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(G, x + i, y + j, k); }
  const MAT = {
    G: { mid: C.gMid, hi: C.gHi, lo: C.gDk, tex: C.gDk, out: C.gOut },
    T: { mid: C.gMid, hi: C.gHi, lo: C.gDk, tex: C.gDk, out: C.gOut, band: C.gDk },
    B: { mid: C.belly, hi: C.belly, lo: C.dew, out: C.gOut },
    W: { mid: C.dew, hi: C.belly, lo: C.dewDk, out: C.gOut },
    O: { mid: C.crest, hi: C.yellow, lo: C.crestDk, out: C.crestDk },
    Y: { mid: C.straw, hi: '#F6DD94', lo: C.strawDk, tex: C.strawDk, out: C.strawOut },
    M: { mid: C.pink, hi: C.pinkHi, lo: C.pink, out: C.strawOut },
    K: { mid: C.mask, hi: '#FFE08A', lo: C.maskDk, out: C.maskDk },
    S: { mid: C.glass, hi: C.white, lo: C.glass, out: C.maskDk },
    N: { mid: C.tank, hi: C.white, lo: C.tankDk, out: '#5B6570' },
    F: { mid: C.fin, hi: C.pinkHi, lo: C.finDk, out: C.finDk },
  };
  function paint(G, g, ox = 0, oy = 0) {
    const fill = (k) => !!k;
    for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) {
      const k = G.m[y][x]; if (!fill(k)) continue;
      const m = MAT[k];
      let c = m.mid;
      const up = at(G, x, y - 1), dn = at(G, x, y + 1);
      if (!fill(up)) c = m.hi;
      else if (!fill(dn)) c = m.lo;
      if (m.tex && c === m.mid && (x * 3 + y * 5) % 7 === 0) c = m.tex;
      if (k === 'T' && Math.floor(x / 4) % 2 === 0 && c === m.mid) c = m.band;
      if (k === 'Y' && (x + y) % 2 === 0 && c === m.mid) c = m.tex;
      px(g, ox + x, oy + y, c);
    }
    for (let y = -1; y <= G.h; y++) for (let x = -1; x <= G.w; x++) {
      if (fill(at(G, x, y))) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = at(G, x + dx, y + dy); if (fill(n)) { px(g, ox + x, oy + y, MAT[n].out); break; } }
    }
  }

  // Paco faces right. pose: stand or swim. frame 0 or 1 moves the legs.
  function pacoGrid(pose = 'stand', frame = 0, hat = true) {
    const G = Grid(60, 34), f = frame ? 1 : 0, swim = pose === 'swim';
    for (let x = 1; x <= 20; x++) { const cy = 26 - x * 0.22 + Math.sin(x / 3.5) * 0.8 * (swim ? 1 : 0.6) + (swim && f ? Math.sin(x / 2) : 0); const t = 0.6 + x / 7; for (let y = Math.floor(cy - t); y <= Math.ceil(cy + t); y++) put(G, x, y, 'T'); }
    if (swim) rect(G, 14 - f * 2, 24, 6, 2, 'G'); else { rect(G, 18 + f, 24, 3, 6, 'G'); rect(G, 15 + f, 29, 7, 2, 'G'); }
    ellipse(G, 27, 21, 11.5, 5.6, 'G');
    ellipse(G, 26, 24.4, 9, 2.4, 'B');
    ellipse(G, 37, 18, 5.2, 4.8, 'G');
    if (swim) rect(G, 33 + f * 2, 24, 5, 2, 'G'); else { rect(G, 33 - f, 23, 3, 7, 'G'); rect(G, 32 - f, 29, 6, 2, 'G'); }
    ellipse(G, 41, 22, 3.6, 3.8, 'W');
    ellipse(G, 43, 15, 7, 4.8, 'G');
    ellipse(G, 49.5, 16, 4, 3.3, 'G');
    ellipse(G, 45.5, 18.6, 5.2, 1.6, 'B');
    for (let x = 19; x <= 41; x += 3) { const top = x < 33 ? 15.4 : x < 38 ? 13.2 : 10.4; put(G, x, top, 'O'); put(G, x, top - 1, 'O'); put(G, x + 1, top, 'O'); if (x % 2) put(G, x, top - 2, 'O'); }
    if (hat) { ellipse(G, 43, 6.5, 4.6, 3.4, 'Y'); rect(G, 39, 8, 9, 1, 'M'); ellipse(G, 43, 9.8, 9.5, 1.5, 'Y'); }
    return G;
  }
  function pacoDetails(g, ox, oy) {
    px(g, ox + 45, oy + 12, C.white, 3, 2); px(g, ox + 46, oy + 12, C.ink, 2, 2); px(g, ox + 46, oy + 12, C.white);
    px(g, ox + 51, oy + 14, C.gOut);
    for (let x = 43; x <= 52; x++) px(g, ox + x, oy + 17 - (x > 50 ? 1 : 0), C.gOut);
    px(g, ox + 47, oy + 16, C.cheek, 2, 1);
  }
  function paco(pose = 'stand', frame = 0) {
    const [c, g] = canvas(62, 36);
    paint(pacoGrid(pose, frame), g, 1, 1); pacoDetails(g, 1, 1);
    return c;
  }

  // Paco in a panga with an outboard motor. 104 x 46.
  function boat(frame = 0) {
    const [c, g] = canvas(104, 46);
    g.drawImage(paco('stand', 0), 0, 0, 62, 28, 34, -4 + (frame ? 1 : 0), 62, 28);
    const top = 24;
    px(g, 14, top, C.woodDk, 76, 2); px(g, 40, top - 1, C.wood, 16, 2);
    for (let x = 8; x <= 98; x++) {
      const rise = x > 84 ? Math.round((x - 84) * 0.55) : 0;
      const bottom = top + 16 - (x < 14 ? 14 - x : 0) - (x > 88 ? Math.round((x - 88) * 1.2) : 0);
      for (let y = top - rise; y <= bottom; y++) {
        let col = y <= top - rise + 1 ? C.white : y > bottom - 4 ? C.hullSh : C.hull;
        if (y === top + 5) col = C.stripe; if (y === top + 7) col = C.stripe2;
        px(g, x, y, col);
      }
      px(g, x, top - rise - 1, C.hullOut); px(g, x, bottom + 1, C.hullOut);
    }
    px(g, 7, top, C.hullOut, 1, 3);
    px(g, 1, top - 9, C.hullOut, 9, 1); px(g, 0, top - 8, C.motor, 10, 10); px(g, 1, top - 7, C.motorHi, 3, 6);
    px(g, 4, top + 2, C.motor, 3, 14); px(g, 2, top + 15, C.motor, 7, 2); px(g, 1, top + 17, C.motorHi, 2, 1); px(g, 7, top + 17, C.motorHi, 2, 1);
    return c;
  }

  // Paco on a red ATV. 92 x 60.
  function atv(frame = 0) {
    const [c, g] = canvas(92, 60);
    g.drawImage(paco('stand', 0), 0, 0, 62, 28, 16, 2 + (frame ? 1 : 0), 62, 28);
    const wheel = (wx, wy) => {
      disc(g, wx, wy, 11, C.tire);
      for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2 + (frame ? 0.2 : 0); px(g, wx + Math.round(Math.cos(t) * 10), wy + Math.round(Math.sin(t) * 10), C.tread, 2, 2); }
      disc(g, wx, wy, 5, C.rim); disc(g, wx, wy, 2, C.metal); px(g, wx - 3, wy - 3, C.white, 2, 1);
    };
    wheel(18, 46); wheel(72, 46);
    px(g, 4, 30, C.atvDk, 30, 4); px(g, 56, 30, C.atvDk, 32, 4); px(g, 6, 28, C.atv, 26, 3); px(g, 58, 28, C.atv, 28, 3);
    px(g, 6, 27, C.atvHi, 24, 1); px(g, 58, 27, C.atvHi, 26, 1);
    px(g, 20, 30, C.atv, 50, 8); px(g, 20, 30, C.atvHi, 50, 1); px(g, 22, 37, C.atvDk, 46, 2);
    px(g, 24, 26, C.ink, 26, 4);
    px(g, 64, 16, C.metal, 2, 12); px(g, 58, 15, C.metal, 12, 2); px(g, 57, 14, C.ink, 3, 3);
    px(g, 84, 30, C.lamp, 5, 4); px(g, 85, 31, C.white, 2, 1);
    px(g, 2, 24, C.metal, 16, 2); px(g, 2, 24, C.metal, 2, 6);
    return c;
  }

  // Paco diving: mask, tank and pink fins. 66 x 38.
  function diver(frame = 0) {
    const [c, g] = canvas(66, 38);
    const G = pacoGrid('swim', frame, false);
    ellipse(G, 26, 13.5, 8, 2.6, 'N');
    for (let y = 9; y <= 15; y++) for (let x = 43; x <= 50; x++) put(G, x, y, (y === 9 || y === 15 || x === 43 || x === 50) ? 'K' : 'S');
    rect(G, 2 - (frame ? 1 : 0), 23 + (frame ? 2 : 0), 7, 3, 'F');
    paint(G, g, 2, 2);
    px(g, 48, 13, C.ink, 2, 2); px(g, 48, 13, C.white);
    px(g, 39, 14, C.ink, 6, 1);
    return c;
  }

  // small pictures for the trip list on the title screen, 96 x 56
  function icon(trip) {
    const [c, g] = canvas(96, 56);
    if (trip === 'boat') { dither(g, 0, 0, 96, 30, C.sky2, C.sky3); px(g, 0, 30, C.sea2, 96, 26); dither(g, 0, 30, 96, 2, C.sea1, C.sea2); g.drawImage(boat(0), -6, 8); }
    else if (trip === 'atv') { dither(g, 0, 0, 96, 50, C.jung2, C.jung3); px(g, 0, 50, C.dirt, 96, 6); g.drawImage(atv(0), 2, -6); }
    else { dither(g, 0, 0, 96, 56, C.deep2, C.deep3); g.drawImage(diver(0), 16, 10); for (const [x, y] of [[80, 14], [84, 8], [82, 3]]) px(g, x, y, C.foam, 2, 2); }
    return c.toDataURL();
  }

  // ---- scenery ---------------------------------------------------------
  function sky(g, w, h) {
    const bands = [C.sky1, C.sky2, C.sky3, C.sky4], bh = Math.ceil(h / bands.length);
    bands.forEach((b, i) => { px(g, 0, i * bh, b, w, bh); if (i) dither(g, 0, i * bh - 1, w, 2, bands[i - 1], b); });
  }
  function sun(g, x, y) { disc(g, x, y, 15, C.sunRim); disc(g, x, y, 13, C.sun); disc(g, x - 4, y - 4, 4, C.sunHi); }
  function cloud(g, x, y, w) {
    const n = Math.max(3, Math.round(w / 9));
    for (let i = 0; i < n; i++) disc(g, x + i * 9, y + 3, 5, C.cloudSh);
    for (let i = 0; i < n; i++) disc(g, x + i * 9, y - (i % 2 ? 3 : 0) - (i === Math.floor(n / 2) ? 4 : 0), 6 + (i % 2), C.cloud);
    px(g, x - 5, y + 3, C.cloudSh, n * 9 + 2, 3);
  }
  function ridge(w, base, amp, seed) { const r = noise(seed); let y = base; const out = []; for (let x = 0; x < w; x++) { y += (r() - 0.5) * 2.4; y = Math.max(base - amp, Math.min(base + 6, y)); out.push(Math.round(y)); } return out; }
  function jungle(g, w, ground, seed) {
    const r = noise(seed);
    const far = ridge(w, ground - 54, 18, seed + 1);
    for (let x = 0; x < w; x++) { px(g, x, far[x], C.far, 1, ground - far[x]); if ((x * 13) % 29 === 0) px(g, x, far[x] + 2, C.farDk, 2, 2); }
    const mid = ridge(w, ground - 34, 12, seed + 2);
    for (let x = 0; x < w; x++) px(g, x, mid[x], C.mid1, 1, ground - mid[x]);
    for (let x = 0; x < w; x += 5 + Math.floor(r() * 5)) { const cy = mid[x] + 3, rr = 4 + Math.floor(r() * 4); disc(g, x, cy, rr, C.mid2); disc(g, x - 1, cy - 1, rr - 2, C.mid1); }
    for (let x = -6; x < w + 6; x += 7 + Math.floor(r() * 6)) {
      const cy = ground - 10 - Math.floor(r() * 12), rr = 6 + Math.floor(r() * 5);
      disc(g, x, cy, rr, C.jung1); disc(g, x - 1, cy - 1, rr - 1, C.jung2); disc(g, x - 2, cy - 3, Math.max(2, rr - 4), C.jung3);
      px(g, x - 3, cy - rr + 1, C.jungHi, 3, 1); px(g, x + 1, cy - rr + 3, C.jungHi, 2, 1);
    }
    px(g, 0, ground - 6, C.jung1, w, 6);
  }
  function palm(g, x, y, h = 30, lean = 1) {
    let tx = x, ty = y;
    for (let i = 0; i < h; i++) { tx = x + Math.round(Math.sin(i / 10) * 3 * lean); ty = y - i; px(g, tx, ty, C.trunk, 3, 1); if (i % 3 === 0) px(g, tx, ty, C.trunkDk, 3, 1); }
    for (const [dx, dy] of [[-16, 6], [-12, -2], [-6, -7], [4, -7], [11, -2], [16, 6], [-14, 10], [14, 10]]) {
      const ex = tx + 1 + dx, ey = ty + dy, mx = tx + 1 + dx * 0.5, my = ty + Math.min(dy, 0) - 4;
      for (let s = 0; s <= 10; s++) { const t = s / 10, qx = (1 - t) ** 2 * (tx + 1) + 2 * (1 - t) * t * mx + t * t * ex, qy = (1 - t) ** 2 * ty + 2 * (1 - t) * t * my + t * t * ey; px(g, qx, qy, s > 6 ? C.palmHi : C.palm, 2, 2); if (s % 2 === 0 && s > 2) px(g, qx, qy + 2, C.palmDk, 1, 2); }
    }
    disc(g, tx + 1, ty + 2, 2, C.coco); px(g, tx + 3, ty + 3, C.coco, 2, 2);
  }
  const HOUSE = [[C.wall, C.wallSh], ['#F7B7C4', '#E592A6'], ['#9BE0D6', '#6FC4B8'], ['#FBE38F', '#E9C65E'], ['#C9E7FA', '#9BCBE8']];
  function house(g, x, y, w, h, style = 0, roof = C.roof) {
    const [wall, sh] = HOUSE[style % HOUSE.length];
    px(g, x, y - h, wall, w, h); px(g, x + w - 3, y - h, sh, 3, h);
    for (let j = 0; j < 6; j++) px(g, x - 2 + Math.floor(j / 2), y - h - 6 + j, j % 2 ? C.roofDk : roof, w + 4 - Math.floor(j / 2) * 2, 1);
    px(g, x - 2, y - h - 1, C.roofDk, w + 4, 1);
    px(g, x + Math.floor(w / 2) - 2, y - 7, C.door, 4, 7); px(g, x + Math.floor(w / 2) - 2, y - 7, '#8A5530', 4, 1);
    if (w >= 16) for (const wx of [x + 2, x + w - 6]) { px(g, wx, y - h + 4, C.win, 4, 4); px(g, wx, y - h + 4, C.winHi, 2, 1); px(g, wx - 1, y - h + 8, C.wallSh, 6, 1); }
  }
  function palapa(g, x, y) {
    px(g, x, y - 12, C.trunk, 2, 12);
    for (let j = 0; j < 7; j++) px(g, x - 2 - j * 2, y - 19 + j, j % 2 ? C.strawDk : C.straw, 6 + j * 4, 1);
    px(g, x - 14, y - 12, C.strawDk, 30, 1);
    for (let i = -12; i <= 14; i += 3) px(g, x + i, y - 11, C.strawOut, 1, 2);
  }
  function rockIslet(g, cx, base, wd, ht, arch) {
    for (let y = 0; y < ht; y++) {
      const half = Math.round(wd / 2 * Math.sqrt(1 - Math.pow(y / ht, 2)));
      for (let x = -half; x <= half; x++) {
        if (arch && y < ht * 0.5 && Math.abs(x) < wd * 0.18 * Math.sqrt(1 - y / (ht * 0.5))) continue;
        let col = C.rock;
        if (x < -half + 3 || y > ht - 4) col = C.rockLit; else if (x > half - 4) col = C.rockDk; else if ((x * 7 + y * 3) % 11 === 0) col = C.rockHi; else if ((x + y * 5) % 13 === 0) col = C.rockDk;
        px(g, cx + x, base - y, col);
      }
    }
    for (let x = -wd / 2; x <= wd / 2; x += 4) px(g, cx + x, base + 1, C.foam, 3, 1);
  }
  const rockAt = (x, y) => { const v = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1; const n = v < 0 ? v + 1 : v; return n < 0.12 ? C.rockDk : n > 0.9 ? C.rockHi : C.rock; };
  function bird(g, x, y) { for (const [dx, dy] of [[0, 0], [1, -1], [2, 0], [3, -1], [4, 0]]) px(g, x + dx, y + dy, C.white); }
  function sea(g, w, h, top) {
    const r = noise(5);
    const bands = [[top, 14, C.sea1], [top + 14, 22, C.sea2], [top + 36, 26, C.sea3], [top + 62, h - top - 62, C.sea4]];
    bands.forEach(([y, hh, col], i) => { px(g, 0, y, col, w, hh); if (i) dither(g, 0, y - 1, w, 2, bands[i - 1][2], col); });
    for (let i = 0; i < w / 4; i++) { const y = top + 4 + Math.floor(r() * (h - top - 8)); px(g, Math.floor(r() * w), y, y < top + 30 ? C.glint : C.sea1, 3 + Math.floor(r() * 5), 1); }
    for (let x = 0; x < w; x += 2) px(g, x, top + (x % 12 < 6 ? 0 : 1), C.foam, 2, 1);
  }

  // ---- the coast: the Ixtaluz pier to Paco's Island ----------------------
  const COAST = { w: 3200, h: 192, horizon: 112, stopX: (i) => 140 + i * 400 };
  function coast() {
    const { w, h, horizon } = COAST, S = COAST.stopX;
    const [c, g] = canvas(w, h); const r = noise(7);
    sky(g, w, horizon);
    sun(g, 210, 30);
    for (let x = 40; x < w; x += 220 + Math.floor(r() * 140)) cloud(g, x, 18 + Math.floor(r() * 28), 26 + Math.floor(r() * 24));
    jungle(g, w, horizon - 4, 11);
    px(g, 0, horizon - 5, C.sand, w, 5); px(g, 0, horizon - 2, C.sandDk, w, 1);
    sea(g, w, h, horizon);
    // Puerto Ixtaluz: town, the pier and a striped lighthouse at its end
    for (let i = 0; i < 9; i++) house(g, S(0) - 130 + i * 20, horizon - 4, 16 + (i % 3) * 2, 12 + (i % 3) * 4, i, i % 2 ? C.roof : C.roofDk);
    palm(g, S(0) - 150, horizon - 4, 30); palm(g, S(0) - 44, horizon - 4, 26, -1);
    px(g, S(0) - 12, horizon - 3, C.wood, 70, 3); px(g, S(0) - 12, horizon - 3, '#C99A5E', 70, 1);
    for (let x = S(0) - 10; x < S(0) + 58; x += 8) px(g, x, horizon, C.woodDk, 2, 12);
    const lx = S(0) + 50;
    for (let y = 0; y < 40; y++) { const half = 5 - Math.floor(y / 14); px(g, lx - half, horizon - 4 - y, Math.floor(y / 6) % 2 ? C.pink : C.white, half * 2, 1); px(g, lx + half - 2, horizon - 4 - y, Math.floor(y / 6) % 2 ? '#A3165A' : C.hullSh, 2, 1); }
    px(g, lx - 4, horizon - 50, C.motor, 8, 2); px(g, lx - 3, horizon - 48, C.lamp, 6, 4); px(g, lx - 1, horizon - 54, C.motor, 2, 4); px(g, lx - 5, horizon - 44, C.motor, 10, 1);
    // Peñas Cantoras: rounded granite islets, the big one with an arch
    const ax = S(1) + 40;
    rockIslet(g, ax - 38, horizon + 8, 26, 26, false); rockIslet(g, ax, horizon + 10, 50, 54, true); rockIslet(g, ax + 40, horizon + 8, 22, 20, false);
    bird(g, ax - 10, horizon - 62); bird(g, ax + 8, horizon - 68); bird(g, ax + 22, horizon - 58);
    // Boca Tamarilla: village at a river mouth, pangas on the beach
    for (let i = 0; i < 6; i++) house(g, S(2) - 60 + i * 22, horizon - 4, 18, 12 + (i % 2) * 6, i + 1);
    for (let x = S(2) + 76; x < S(2) + 92; x++) px(g, x, horizon - 6, C.river, 1, 6);
    for (let i = 0; i < 3; i++) { const bx = S(2) - 50 + i * 30; px(g, bx, horizon + 2, C.hull, 18, 3); px(g, bx + 1, horizon + 5, C.hullSh, 16, 1); px(g, bx + 1, horizon + 3, C.stripe, 16, 1); }
    // Caleta Pochota: a small cove between cliffs
    for (const side of [-1, 1]) for (let y = 0; y < 32; y++) { const cw = 22 - Math.floor(y / 4), x0 = S(3) + side * 34 - (side < 0 ? cw : 0); for (let i = 0; i < cw; i++) px(g, x0 + i, horizon - y, i < 2 ? C.rockLit : rockAt(x0 + i, y)); }
    px(g, S(3) - 30, horizon - 6, C.sandHi, 60, 6); palm(g, S(3) - 6, horizon - 6, 26); palm(g, S(3) + 12, horizon - 6, 22, -1);
    // Playa Ondarena: a long beach with palapas
    px(g, S(4) - 90, horizon - 9, C.sandHi, 180, 9);
    for (let i = 0; i < 5; i++) palapa(g, S(4) - 66 + i * 32, horizon - 7);
    palm(g, S(4) + 92, horizon - 8, 34); palm(g, S(4) - 96, horizon - 8, 30, -1);
    // Pueblo Tilmeca: houses climbing the hill
    for (let i = 0; i < 5; i++) house(g, S(5) - 50 + i * 22, horizon - 4 - (i % 2) * 12, 18, 14, i + 2, i === 2 ? C.pink : C.roof);
    palm(g, S(5) + 70, horizon - 4, 30); palm(g, S(5) - 66, horizon - 4, 26, -1);
    // Playa Zinzuna: a quiet beach under palms
    px(g, S(6) - 60, horizon - 8, C.sandHi, 120, 8);
    for (let i = 0; i < 5; i++) palm(g, S(6) - 48 + i * 24, horizon - 7, 22 + (i % 2) * 10, i % 2 ? -1 : 1);
    // Paco's Island: the cove, palapas on the beach and houses up the hill
    px(g, S(7) - 130, horizon - 12, C.sandHi, 260, 12); px(g, S(7) - 130, horizon - 2, C.sandDk, 260, 1);
    for (let i = 0; i < 8; i++) house(g, S(7) - 120 + i * 32, horizon - 30 - (i % 3) * 14, 18, 12, i, i % 3 === 1 ? C.pink : C.roof);
    for (let i = 0; i < 6; i++) palapa(g, S(7) - 110 + i * 40, horizon - 10);
    for (let i = 0; i < 6; i++) palm(g, S(7) - 140 + i * 56, horizon - 11, 28 + (i % 2) * 10, i % 2 ? -1 : 1);
    // dock posts at each stop
    for (let i = 1; i < 8; i++) { px(g, S(i) + 60, horizon - 2, C.wood, 18, 2); for (let k = 0; k < 3; k++) px(g, S(i) + 61 + k * 7, horizon, C.woodDk, 2, 8); }
    return c;
  }

  // ---- Paco's Island on land: beach to the upper waterfall ---------------
  const HILL = { w: 2500, h: 260, stopX: (i) => 140 + i * 430, ground: (x) => Math.round(232 - Math.min(1, Math.max(0, x - 100) / 2250) * 140) };
  function hill() {
    const { w, h, ground } = HILL, S = HILL.stopX;
    const [c, g] = canvas(w, h); const r = noise(21);
    sky(g, w, h);
    for (let x = 60; x < w; x += 240 + Math.floor(r() * 100)) cloud(g, x, 16 + Math.floor(r() * 20), 30);
    const back = ridge(w, 0, 18, 23);
    for (let x = 0; x < w; x++) { const top = ground(x) - 78 + back[x]; px(g, x, top, C.mid2, 1, ground(x) - top); }
    for (let x = -8; x < w + 8; x += 6 + Math.floor(r() * 5)) {
      const gy = ground(Math.max(0, x)), cy = gy - 34 - Math.floor(r() * 44), rr = 9 + Math.floor(r() * 8);
      disc(g, x, cy, rr, C.jung1); disc(g, x - 1, cy - 1, rr - 2, C.jung2); disc(g, x - 3, cy - 4, Math.max(2, rr - 6), C.jung3); px(g, x - 4, cy - rr + 2, C.jungHi, 3, 1);
    }
    for (let x = 0; x < w; x++) px(g, x, ground(x) - 30, C.jung1, 1, 30);
    px(g, 0, ground(0) - 10, C.sea2, 90, h); dither(g, 0, ground(0) - 10, 90, 2, C.sea1, C.sea2); for (let x = 0; x < 90; x += 3) px(g, x, ground(0) - 10, C.foam, 2, 1);
    for (let x = 0; x < w; x++) {
      const gy = ground(x), beach = x < S(0) + 110;
      px(g, x, gy, beach ? C.sand : C.dirt, 1, h - gy); px(g, x, gy, beach ? C.sandHi : C.dirtHi, 1, 2);
      if (!beach && r() > 0.45) px(g, x, gy - 1 - Math.floor(r() * 3), r() > 0.5 ? C.grass : C.grassDk, 1, 2);
    }
    for (let i = 0; i < 700; i++) { const x = Math.floor(r() * w), gy = ground(x); px(g, x, gy + 6 + Math.floor(r() * (h - gy - 8)), x < S(0) + 110 ? C.sandDk : C.dirtDk, 2 + Math.floor(r() * 2), 1); }
    for (let i = 0; i < 40; i++) { const x = S(0) + 140 + Math.floor(r() * (w - S(0) - 180)); px(g, x, ground(x) + 4, C.rock, 5, 3); px(g, x, ground(x) + 4, C.rockLit, 2, 1); }
    for (let i = 0; i < 4; i++) palapa(g, S(0) - 70 + i * 34, ground(S(0) - 70 + i * 34));
    palm(g, S(0) + 80, ground(S(0) + 80), 40);
    for (let i = 0; i < 5; i++) { const hx = S(1) - 90 + i * 40; house(g, hx, ground(hx + 10) + 1, 22, 18, i + 1, i % 2 ? C.pink : C.roof); }
    const rx = S(2);
    for (let y = 20; y < ground(rx); y++) { const wob = Math.round(Math.sin(y / 9) * 4); px(g, rx - 6 + wob, y, C.river, 12, 1); if (y % 5 === 0) px(g, rx - 3 + wob, y, C.water, 4, 1); }
    for (let x = rx - 24; x < rx + 24; x++) { px(g, x, ground(x) - 1, C.river, 1, 6); if (x % 5 === 0) px(g, x, ground(x), C.water, 2, 1); }
    const fall = (x, top, wide) => {
      const bottom = ground(x) - 2;
      for (let y = top; y < bottom; y++) { const cw = wide + 14 + Math.floor((y - top) / 12); for (let i = -cw; i < cw; i++) px(g, x + i, y, i === -cw || i === -cw + 1 ? C.rockLit : i > cw - 4 ? C.rockDk : rockAt(x + i, y)); }
      for (let y = top; y < bottom; y++) for (let i = -wide; i < wide; i++) px(g, x + i, y, (i + y * 3) % 7 === 0 ? C.white : (i + y) % 5 === 0 ? C.waterDk : C.water);
      px(g, x - wide - 14, bottom - 3, C.waterDk, wide * 2 + 28, 6); px(g, x - wide - 10, bottom - 3, C.river, wide * 2 + 20, 2);
      for (let i = 0; i < 30; i++) px(g, x - wide - 8 + Math.floor(r() * (wide * 2 + 16)), bottom - 8 + Math.floor(r() * 6), C.white, 2, 1);
    };
    fall(S(3) + 40, 10, 8);
    for (let i = 0; i < 6; i++) palm(g, S(4) - 100 + i * 40, ground(S(4) - 100 + i * 40), 22 + (i % 3) * 8, i % 2 ? -1 : 1);
    fall(S(5) + 50, 0, 13);
    return c;
  }

  // ---- under the bay: surface to the canyon floor -----------------------
  const DEEP = { w: 384, h: 1500, surface: 60, bottom: 1440 };
  const FULL = typeof Engine !== 'undefined' ? Engine.FULL_DAY : 60000;
  DEEP.yForScore = (s) => DEEP.surface + (DEEP.bottom - DEEP.surface) * Math.min(1, s / FULL);
  DEEP.yForDepth = (d) => DEEP.yForScore(FULL * Math.sqrt(d / 1400));
  function fish(g, x, y, col, size, left) {
    const d = left ? -1 : 1;
    for (let i = 0; i < size; i++) { const half = Math.round(Math.sin(i / size * Math.PI) * size / 3); px(g, x + d * i, y - half, col, 1, half * 2 + 1); }
    px(g, x - d * 2, y - 2, col, 2, 5); px(g, x + d * (size - 3), y - 1, C.ink);
  }
  function deep() {
    const { w, h, surface, bottom } = DEEP;
    const [c, g] = canvas(w, h); const r = noise(31);
    sky(g, w, surface);
    const cols = [C.sea1, C.deep1, C.deep2, C.deep3, C.deep4, C.deep5, C.deep6, C.deep7];
    const span = (h - surface) / cols.length;
    cols.forEach((col, i) => { const y = surface + Math.round(i * span); px(g, 0, y, col, w, Math.ceil(span) + 1); if (i) dither(g, 0, y - 2, w, 4, cols[i - 1], col); });
    for (let x = 0; x < w; x += 2) px(g, x, surface + (x % 10 < 5 ? 0 : 1), C.foam, 2, 1);
    for (let k = 0; k < 5; k++) { const x0 = 30 + k * 80; for (let y = surface; y < surface + 160; y++) if ((y + k) % 2) px(g, x0 + (y - surface) * 0.4, y, C.ray, Math.max(1, 6 - Math.floor((y - surface) / 40)), 1); }
    const reefY = DEEP.yForDepth(12);
    for (let y = surface - 40; y < DEEP.yForDepth(45); y++) { const wd = Math.round(56 + Math.sin(y / 11) * 6 + Math.max(0, (y - surface) / 2.5)); for (let i = 0; i < wd; i++) px(g, w - wd + i, y, i < 2 ? C.rockLit : rockAt(i, y)); }
    for (let i = 0; i < 70; i++) {
      const cx = w - 110 + Math.floor(r() * 40), cy = reefY - 16 + Math.floor(r() * 32), col = [C.coral, C.pink, C.yellow, C.pinkHi][i % 4];
      if (i % 3 === 0) { for (let k = 0; k < 6; k++) px(g, cx + k - 3, cy - Math.abs(k - 3) - 2, col, 1, Math.abs(k - 3) + 2); } else disc(g, cx, cy, 2 + (i % 2), col);
    }
    const wy = DEEP.yForDepth(41);
    for (let x = 40; x < 200; x++) { const t = (x - 40) / 160; const hh = 18 - Math.round(Math.abs(t - 0.5) * 10); px(g, x, wy - hh, C.rockDk, 1, hh); }
    px(g, 70, wy - 34, C.rock, 70, 16); px(g, 96, wy - 52, C.rock, 18, 18); px(g, 70, wy - 34, C.rockHi, 70, 1);
    for (let x = 50; x < 196; x += 14) disc(g, x, wy - 9, 2, C.deep6);
    for (let i = 0; i < 8; i++) { const kx = 60 + i * 18; for (let y = 0; y < 22; y++) px(g, kx + Math.round(Math.sin(y / 4 + i) * 2), wy - 18 - y, y % 2 ? C.kelp : C.kelpDk, 2, 1); }
    const dy = DEEP.yForDepth(60);
    for (let i = 0; i < 40; i++) { const x = 10 + Math.floor(r() * 180), hgt = 6 + Math.floor(r() * 12); for (let y = 0; y < hgt; y++) px(g, x + Math.round(Math.sin(y / 3 + i)), dy + 14 - y, i % 3 ? C.kelp : C.coral, 2, 1); }
    const cy0 = DEEP.yForDepth(300);
    for (let y = Math.round(cy0); y < h; y++) { const t = (y - cy0) / (h - cy0); const lw = Math.round(14 + t * 120 + Math.sin(y / 15) * 7); px(g, 0, y, C.deep7, lw, 1); px(g, lw - 2, y, C.deep5, 2, 1); px(g, w - lw - 14, y, C.deep7, lw + 14, 1); px(g, w - lw - 14, y, C.deep5, 2, 1); }
    px(g, 0, bottom, C.mud, w, h - bottom); for (let i = 0; i < 60; i++) px(g, Math.floor(r() * w), bottom + 2 + Math.floor(r() * 50), C.mudHi, 3, 1);
    for (let i = 0; i < 46; i++) {
      const fy = surface + 30 + Math.floor(r() * (bottom - surface - 80)), fx = 20 + Math.floor(r() * (w - 60));
      const col = fy < 500 ? [C.yellow, C.pinkHi, C.white, C.coral][i % 4] : fy < 1000 ? '#5FC9D8' : '#3E8FA0';
      fish(g, fx, fy, col, 7 + (i % 4) * 2, i % 2 === 0);
    }
    return c;
  }

  return { C, paco, boat, atv, diver, icon, coast, hill, deep, COAST, HILL, DEEP };
})();
