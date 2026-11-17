/* Paco's Island: pixel art, drawn in code.

   Paco, his boat, his ATV and his dive gear are painted pixel by pixel.
   Each trip has one long background strip: the coast of Bahía Ixtaluz from
   the Ixtaluz pier to Paco's Island, the climb from the island's beach to
   the upper waterfall, and the water from the surface to the canyon floor.
   Every place is fictional. scene.js
   turns these canvases into Pixi textures and scales them up with no
   smoothing. */
'use strict';
const Art = (() => {
  const C = {
    sky: '#8ED8EE', skyHi: '#B9E9F5', cloud: '#F4FBFD', sun: '#FFC43A', sunHi: '#FFE08A',
    hill1: '#2F8F5B', hill2: '#237A4C', hill3: '#1A6340', leaf: '#4FAE5E', palm: '#2E8F3E', trunk: '#8A5A2B',
    sand: '#F2D48F', sandDk: '#D9B26A', rock: '#8C7B6B', rockDk: '#5E5248', rockHi: '#B3A390',
    sea1: '#2BB6C6', sea2: '#1497AB', sea3: '#0B7A8E', foam: '#F4FBFD',
    wall: '#F6F0E4', roof: '#D2553A', roofDk: '#A63E2A', door: '#6A3B22', pink: '#E0237A', pinkHi: '#F25C9B', gold: '#FFC43A',
    ink: '#0D2340', white: '#FFFFFF',
    green: '#79C83E', greenDk: '#3F8F2A', greenLt: '#BDE66E', crest: '#F28C28', eye: '#0D2340',
    hat: '#E9C25B', hatDk: '#C99A33', hull: '#F7F7F2', hullDk: '#C9D3D6', stripe: '#1C5FA8', motor: '#3B4048',
    atv: '#E0352B', atvDk: '#A3241D', tire: '#1E2328', metal: '#9AA4AC',
    mask: '#FFC43A', glass: '#7FE0F0', tank: '#C7CDD3', fin: '#E0237A',
    deep1: '#0A6A80', deep2: '#08566B', deep3: '#064456', deep4: '#04303F', deep5: '#03202B', coral1: '#F2725C', coral2: '#E0237A', coral3: '#FFB13B', kelp: '#3FA86A',
    water: '#BFF0F7', waterDk: '#7FD3E6', mud: '#6B5A3E', dirt: '#B98A52', dirtDk: '#8F6638', river: '#3CB9D0',
  };

  // tiny deterministic noise so hills and waves look hand placed
  const noise = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; };
  const px = (g, x, y, c, w = 1, h = 1) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), w, h); };

  // ---- sprites ---------------------------------------------------------
  // Paco faces right. 26 x 14. Keys: y hat, d hat shade, m hat band,
  // G body, g shade, L belly, o crest, W eye white, K pupil, D dewlap.
  const PACO = [
    '..................yyyy....',
    '.................yyyyyy...',
    '.................mmmmmm...',
    '...............ydyyyyyyyd.',
    '................GGGGGGGG..',
    '.........o.o.o.oGGGWKGGGG.',
    '........oGGGGGGGGGGGGGGGGG',
    '.......GGGGGGGGGGGGGLLLGG.',
    '..gg..GGGGGGGGGGGGGDDDD...',
    'gggGGGGGLLLLLLLLLGGGDD....',
    '...gggGGLLLLLLLLLGG.......',
    '......GGG...GG...GG.......',
    '.....gGG...gGG..gGG.......',
    '..........................',
  ];
  const PACO_KEY = { y: C.hat, d: C.hatDk, m: C.pink, G: C.green, g: C.greenDk, L: C.greenLt, o: C.crest, W: C.white, K: C.eye, D: '#A9DB4A' };
  function grid(g, rows, key, ox, oy, flip) {
    rows.forEach((r, y) => [...r].forEach((ch, x) => { if (key[ch]) px(g, ox + (flip ? r.length - 1 - x : x), oy + y, key[ch]); }));
  }

  function paco(frame = 0) {
    const [c, g] = canvas(26, 14);
    const rows = PACO.slice();
    if (frame === 1) { rows[11] = '......GG....GGG..GGG......'; rows[12] = '.....gG.....gG...gG.......'; }
    grid(g, rows, PACO_KEY, 0, 0);
    return c;
  }

  // Paco in a panga. 44 x 20.
  function boat(frame = 0) {
    const [c, g] = canvas(44, 20);
    // Paco sits near the bow; only his top half shows above the side
    const p = paco(0);
    g.drawImage(p, 0, 0, 26, 9, 18, 2 + (frame ? 1 : 0), 26, 9);
    // hull
    const top = 10;
    for (let x = 2; x <= 40; x++) {
      const rise = x > 34 ? x - 34 : 0;
      px(g, x, top - rise, C.hull, 1, 1 + rise);
    }
    for (let y = 0; y < 6; y++) {
      const x0 = 3 + Math.floor(y / 2), x1 = 40 - y * 2;
      px(g, x0, top + 1 + y, y < 2 ? C.hull : C.hullDk, x1 - x0, 1);
    }
    px(g, 4, top + 2, C.stripe, 33, 1);
    px(g, 3, top, C.hullDk, 34, 1);
    // outboard motor at the stern
    px(g, 0, top - 4, C.motor, 3, 5); px(g, 1, top + 1, C.motor, 1, 6); px(g, 0, top + 6, C.motor, 3, 1);
    return c;
  }

  // Paco on a red ATV. 40 x 26.
  function atv(frame = 0) {
    const [c, g] = canvas(40, 26);
    const p = paco(0);
    g.drawImage(p, 0, 0, 26, 11, 8, 1 + (frame ? 1 : 0), 26, 11);
    // body
    px(g, 5, 12, C.atv, 30, 4); px(g, 3, 13, C.atvDk, 2, 3); px(g, 35, 13, C.atvDk, 3, 3);
    px(g, 8, 11, C.atvDk, 12, 1); px(g, 26, 10, C.atv, 8, 2);
    px(g, 30, 6, C.metal, 1, 5); px(g, 28, 6, C.metal, 5, 1); // handlebar
    px(g, 37, 12, C.gold, 2, 2); // headlight
    // wheels
    for (const wx of [9, 30]) {
      const spin = frame ? 1 : 0;
      for (let y = -4; y <= 4; y++) for (let x = -4; x <= 4; x++) {
        const r = x * x + y * y;
        if (r <= 20) px(g, wx + x, 20 + y, r <= 4 ? C.metal : C.tire);
      }
      px(g, wx - 4 + spin * 2, 20, C.tire, 1, 1);
    }
    return c;
  }

  // Paco diving: mask, tank, pink fins. 34 x 16.
  function diver(frame = 0) {
    const [c, g] = canvas(34, 16);
    const rows = PACO.slice(4).map((r) => r);
    const key = { ...PACO_KEY, W: C.glass, K: C.ink };
    grid(g, rows, key, 4, 2);
    // mask frame and strap
    px(g, 22, 6, C.mask, 4, 1); px(g, 22, 7, C.mask, 1, 1); px(g, 25, 7, C.mask, 1, 1); px(g, 17, 6, C.ink, 5, 1);
    // tank on the back
    px(g, 11, 3, C.tank, 8, 3); px(g, 11, 2, C.metal, 2, 1);
    // fins behind the back feet
    const kick = frame ? 1 : 0;
    px(g, 6, 13 - kick, C.fin, 4, 2); px(g, 2, 12 + kick, C.fin, 4, 2);
    return c;
  }

  // ---- shared scenery --------------------------------------------------
  function palm(g, x, y, h = 16) {
    for (let i = 0; i < h; i++) px(g, x + Math.round(Math.sin(i / 5) * 1.5), y - i, C.trunk);
    const tx = x + Math.round(Math.sin(h / 5) * 1.5), ty = y - h;
    for (const [dx, dy] of [[-6, 2], [-4, 1], [-2, 0], [0, 0], [2, 0], [4, 1], [6, 2], [-5, 3], [5, 3], [-7, 4], [7, 4]]) px(g, tx + dx, ty + dy, C.palm, 2, 1);
    px(g, tx - 1, ty - 1, C.palm, 3, 1); px(g, tx, ty + 1, C.trunk, 1, 1);
  }
  function house(g, x, y, w = 8, h = 6, roof = C.roof) {
    px(g, x, y - h, C.wall, w, h); px(g, x - 1, y - h - 2, roof, w + 2, 2); px(g, x, y - h - 3, roof, w, 1);
    px(g, x + Math.floor(w / 2) - 1, y - 3, C.door, 2, 3); if (w > 7) px(g, x + 1, y - h + 2, C.ink, 1, 1);
  }
  function palapa(g, x, y) { px(g, x, y - 5, C.trunk, 1, 5); px(g, x - 4, y - 7, C.hatDk, 9, 1); px(g, x - 3, y - 8, C.hat, 7, 1); px(g, x - 1, y - 9, C.hat, 3, 1); }
  function cloud(g, x, y, w) { px(g, x, y, C.cloud, w, 2); px(g, x + 2, y - 2, C.cloud, w - 5, 2); px(g, x + 4, y - 3, C.cloud, Math.max(2, w - 10), 1); }
  function sky(g, w, h) {
    const bands = [C.sky, '#9BDDF0', '#A8E2F2', C.skyHi];
    const bh = Math.ceil(h / bands.length);
    bands.forEach((b, i) => px(g, 0, i * bh, b, w, bh));
  }

  // ---- the coast: the Ixtaluz pier to Paco's Island -----------------------
  // Stops sit at even spacing; the boat travels between them.
  const COAST = { w: 1560, h: 160, horizon: 94, stopX: (i) => 70 + i * 200 };
  function coast() {
    const { w, h, horizon } = COAST;
    const [c, g] = canvas(w, h); const r = noise(7);
    sky(g, w, horizon);
    px(g, 120, 18, C.sun, 14, 14); px(g, 118, 20, C.sun, 18, 10); px(g, 122, 16, C.sun, 10, 18); px(g, 123, 19, C.sunHi, 4, 4);
    for (let x = 30; x < w; x += 140 + Math.floor(r() * 90)) cloud(g, x, 14 + Math.floor(r() * 26), 14 + Math.floor(r() * 12));
    // three layers of jungle hills
    const ridge = (base, amp, col, seed) => { const n = noise(seed); let y = base; for (let x = 0; x < w; x++) { y += (n() - 0.5) * 2.2; y = Math.max(base - amp, Math.min(base + 4, y)); px(g, x, Math.round(y), col, 1, horizon - Math.round(y)); } };
    ridge(52, 22, C.hill3, 11); ridge(64, 16, C.hill2, 12); ridge(76, 10, C.hill1, 13);
    for (let i = 0; i < 400; i++) px(g, Math.floor(r() * w), 60 + Math.floor(r() * 30), C.leaf, 2, 1);
    // sea in three bands with foam
    const bands = [[horizon, 10, C.sea1], [horizon + 10, 24, C.sea2], [horizon + 34, h - horizon - 34, C.sea3]];
    for (const [y, hh, col] of bands) px(g, 0, y, col, w, hh);
    for (let i = 0; i < 260; i++) px(g, Math.floor(r() * w), horizon + 3 + Math.floor(r() * (h - horizon - 6)), C.foam, 2 + Math.floor(r() * 3), 1);
    // shoreline: a sand strip along the foot of the hills
    px(g, 0, horizon - 3, C.sand, w, 3);

    const S = COAST.stopX;
    // Puerto Ixtaluz: town, the pier and a striped lighthouse at its end
    for (let i = 0; i < 9; i++) house(g, S(0) - 64 + i * 10, horizon - 3, 8, 5 + (i % 3) * 2, i % 2 ? C.roof : C.roofDk);
    px(g, S(0) - 6, horizon - 2, C.rockHi, 34, 2); for (let x = S(0) - 4; x < S(0) + 28; x += 6) px(g, x, horizon, C.rockDk, 1, 6);
    for (let y = 0; y < 22; y++) px(g, S(0) + 22 + Math.floor(y / 8), horizon - 4 - y, Math.floor(y / 4) % 2 ? C.pink : C.white, 6 - Math.floor(y / 8) * 2, 1);
    px(g, S(0) + 23, horizon - 29, C.gold, 4, 3); px(g, S(0) + 22, horizon - 30, C.motor, 6, 1);
    palm(g, S(0) - 70, horizon - 3, 14);
    // Peñas Cantoras: rounded granite islets, the big one with an arch through it
    const ax = S(1);
    const islet = (cx, wd, ht, arch) => {
      for (let y = 0; y < ht; y++) {
        const half = Math.round(wd / 2 * Math.sqrt(1 - Math.pow(y / ht, 2)));
        for (let x = -half; x <= half; x++) {
          if (arch && y < ht * 0.45 && Math.abs(x) < wd * 0.16 * Math.sqrt(1 - y / (ht * 0.45))) continue;
          const lit = x < -half + 2 || y > ht - 3;
          px(g, cx + x, horizon + 4 - y, lit ? C.rockHi : (x + y) % 7 === 0 ? C.rockDk : C.rock);
        }
      }
      for (let x = -half0(wd); x <= half0(wd); x += 3) px(g, cx + x, horizon + 4, C.foam, 2, 1);
    };
    const half0 = (wd) => Math.round(wd / 2);
    islet(ax - 18, 14, 14, false); islet(ax + 2, 26, 28, true); islet(ax + 22, 12, 11, false);
    for (const [bx, by] of [[ax - 2, 30], [ax + 6, 33], [ax + 14, 29]]) { px(g, bx, horizon - by, C.white, 1, 1); px(g, bx + 1, horizon - by - 1, C.white, 1, 1); px(g, bx + 2, horizon - by, C.white, 1, 1); }
    // Boca Tamarilla: village at a river mouth, pangas on the beach
    for (let i = 0; i < 5; i++) house(g, S(2) - 26 + i * 11, horizon - 3, 8, 5 + (i % 2) * 2);
    px(g, S(2) + 30, horizon - 4, C.river, 6, 4);
    for (let i = 0; i < 3; i++) { px(g, S(2) - 20 + i * 14, horizon + 2, C.hull, 8, 2); px(g, S(2) - 19 + i * 14, horizon + 3, C.stripe, 6, 1); }
    // Caleta Pochota: a small cove between cliffs
    for (const side of [-1, 1]) for (let y = 0; y < 16; y++) px(g, S(3) + side * 14 - (side < 0 ? 8 : 0), horizon - y, y % 3 ? C.rock : C.rockDk, 8, 1);
    px(g, S(3) - 6, horizon - 3, C.sand, 12, 3); palm(g, S(3), horizon - 3, 12);
    // Playa Ondarena: a long beach with palapas
    px(g, S(4) - 40, horizon - 5, C.sand, 80, 5);
    for (let i = 0; i < 5; i++) palapa(g, S(4) - 30 + i * 15, horizon - 4);
    palm(g, S(4) + 38, horizon - 5, 18);
    // Pueblo Tilmeca: a few houses and palms
    for (let i = 0; i < 3; i++) house(g, S(5) - 18 + i * 13, horizon - 3, 9, 6, i === 1 ? C.pink : C.roof);
    palm(g, S(5) + 26, horizon - 3, 15); palm(g, S(5) - 26, horizon - 3, 13);
    // Playa Zinzuna: a quiet beach under palms
    px(g, S(6) - 24, horizon - 4, C.sand, 48, 4);
    for (let i = 0; i < 4; i++) palm(g, S(6) - 18 + i * 12, horizon - 4, 12 + (i % 2) * 5);
    // Paco's Island: the cove, palapas on the beach and houses up the hill
    px(g, S(7) - 60, horizon - 6, C.sand, 120, 6);
    for (let i = 0; i < 6; i++) palapa(g, S(7) - 50 + i * 18, horizon - 5);
    for (let i = 0; i < 8; i++) house(g, S(7) - 56 + i * 15, horizon - 14 - (i % 3) * 8, 8, 5, i % 3 === 1 ? C.pink : C.roof);
    for (let i = 0; i < 5; i++) palm(g, S(7) - 64 + i * 30, horizon - 6, 14 + (i % 2) * 6);
    // white water taxi dock posts at each stop
    for (let i = 1; i < 8; i++) { px(g, S(i) + 30, horizon - 1, C.rockDk, 1, 6); px(g, S(i) + 26, horizon - 1, C.dirt, 8, 1); }
    return c;
  }

  // ---- Paco's Island on land: beach to the upper waterfall ---------------
  const HILL = { w: 1260, h: 160, stopX: (i) => 70 + i * 220, ground: (x) => Math.round(136 - Math.min(1, x / 1180) * 70) };
  function hill() {
    const { w, h, ground } = HILL; const S = HILL.stopX;
    const [c, g] = canvas(w, h); const r = noise(21);
    sky(g, w, h);
    for (let x = 60; x < w; x += 160 + Math.floor(r() * 80)) cloud(g, x, 12 + Math.floor(r() * 20), 16);
    // the jungle behind the path
    let y = 40; for (let x = 0; x < w; x++) { y += (r() - 0.5) * 2; y = Math.max(22, Math.min(54, y)); px(g, x, Math.round(y), C.hill2, 1, h); }
    for (let i = 0; i < 700; i++) px(g, Math.floor(r() * w), 30 + Math.floor(r() * 100), r() > 0.5 ? C.leaf : C.hill1, 2, 2);
    // sea at the left edge
    px(g, 0, 128, C.sea1, 60, 32); px(g, 0, 140, C.sea2, 60, 20);
    // the path, sand first then dirt
    for (let x = 0; x < w; x++) { const gy = ground(x); px(g, x, gy, x < S(0) + 60 ? C.sand : C.dirt, 1, h - gy); px(g, x, gy, x < S(0) + 60 ? C.sandDk : C.dirtDk, 1, 1); }
    for (let x = S(0) + 60; x < w; x += 2) if (r() > 0.4) px(g, x, ground(x) - 1, C.leaf, 1, 1 + Math.floor(r() * 2));
    for (let i = 0; i < 260; i++) { const x = Math.floor(r() * w), gy = ground(x); px(g, x, gy + 4 + Math.floor(r() * (h - gy - 6)), x < S(0) + 60 ? C.sandDk : C.dirtDk, 2, 1); }
    for (let i = 0; i < 30; i++) { const x = S(0) + 80 + Math.floor(r() * (w - S(0) - 100)); px(g, x, ground(x) - 2, C.rock, 3, 2); }
    for (let i = 0; i < 4; i++) palapa(g, S(0) - 30 + i * 18, ground(S(0) - 30 + i * 18));
    palm(g, S(0) + 40, ground(S(0) + 40), 18);
    // the village
    for (let i = 0; i < 5; i++) { const hx = S(1) - 40 + i * 18; house(g, hx, ground(hx) - 1, 10, 7, i % 2 ? C.pink : C.roof); }
    // the river crossing
    const rx = S(2);
    for (let x = rx - 10; x < rx + 10; x++) px(g, x, ground(x) - 1, C.river, 1, 4);
    for (let yy = 30; yy < ground(rx) - 1; yy++) px(g, rx - 3 + Math.round(Math.sin(yy / 6) * 3), yy, C.river, 5, 1);
    // the waterfall: a cliff, falling water and a pool
    const wfall = (x, top, bottom, wide) => {
      px(g, x - wide - 8, top, C.rockDk, wide * 2 + 16, bottom - top);
      for (let yy = top; yy < bottom; yy++) px(g, x - wide, yy, yy % 3 ? C.water : C.white, wide * 2, 1);
      px(g, x - wide - 6, bottom - 2, C.waterDk, wide * 2 + 12, 4);
      for (let i = 0; i < 12; i++) px(g, x - wide - 4 + Math.floor(r() * (wide * 2 + 8)), bottom - 4 + Math.floor(r() * 3), C.white, 2, 1);
    };
    wfall(S(3) + 20, 20, ground(S(3) + 20) - 2, 5);
    for (let i = 0; i < 6; i++) palm(g, S(4) - 50 + i * 20, ground(S(4) - 50 + i * 20), 10 + (i % 3) * 4);
    wfall(S(5) + 30, 4, ground(S(5) + 30) - 2, 8);
    return c;
  }

  // ---- under the bay: surface to the canyon floor -----------------------
  // y on this strip is linear in score, so the depth labels are placed
  // with the same curve the engine uses.
  const DEEP = { w: 320, h: 1060, surface: 40, bottom: 1020 };
  DEEP.yForScore = (s) => DEEP.surface + (DEEP.bottom - DEEP.surface) * Math.min(1, s / 840);
  DEEP.yForDepth = (d) => DEEP.yForScore(840 * Math.sqrt(d / 1400));
  function deep() {
    const { w, h, surface, bottom } = DEEP;
    const [c, g] = canvas(w, h); const r = noise(31);
    sky(g, w, surface);
    const cols = [C.sea1, C.sea2, C.sea3, C.deep1, C.deep2, C.deep3, C.deep4, C.deep5];
    const span = (h - surface) / cols.length;
    cols.forEach((col, i) => px(g, 0, surface + Math.round(i * span), col, w, Math.ceil(span) + 1));
    for (let x = 0; x < w; x += 3) px(g, x, surface, C.foam, 2, 1);
    // Peñas Cantoras rising out of the water on the right
    for (let yy = surface - 26; yy < DEEP.yForDepth(40); yy++) { const wd = 36 + Math.round(Math.sin(yy / 9) * 4) + Math.max(0, (yy - surface) / 3); px(g, w - wd, yy, yy % 5 ? C.rock : C.rockDk, wd, 1); }
    // reef: coral on the rock and the sand shelf
    const reefY = DEEP.yForDepth(12);
    for (let i = 0; i < 40; i++) { const cx = w - 60 + Math.floor(r() * 30), cy = reefY - 10 + Math.floor(r() * 20); px(g, cx, cy, [C.coral1, C.coral2, C.coral3][i % 3], 3, 2 + Math.floor(r() * 3)); }
    // the old ferry wreck
    const wy = DEEP.yForDepth(41);
    px(g, 40, wy, C.rockDk, 90, 10); px(g, 44, wy - 6, C.rock, 40, 6); px(g, 60, wy - 14, C.rock, 8, 8);
    for (let x = 46; x < 128; x += 9) px(g, x, wy + 3, C.deep3, 3, 3);
    // deep reef
    const dy = DEEP.yForDepth(60);
    for (let i = 0; i < 30; i++) px(g, 10 + Math.floor(r() * 120), dy + Math.floor(r() * 18), [C.coral1, C.kelp, C.coral3][i % 3], 2, 4 + Math.floor(r() * 4));
    // canyon walls closing in below 300 m
    const cy0 = DEEP.yForDepth(300);
    for (let yy = cy0; yy < h; yy++) { const t = (yy - cy0) / (h - cy0); const lw = Math.round(10 + t * 90 + Math.sin(yy / 13) * 5); px(g, 0, yy, C.deep4, lw, 1); px(g, w - lw - 10, yy, C.deep4, lw + 10, 1); }
    px(g, 0, bottom, C.mud, w, h - bottom);
    // fish and bubbles
    for (let i = 0; i < 40; i++) { const fx = Math.floor(r() * (w - 40)) + 10, fy = surface + 20 + Math.floor(r() * (bottom - surface - 60)); const col = fy < 300 ? [C.gold, C.pinkHi, C.white][i % 3] : '#5FC9D8'; px(g, fx, fy, col, 4, 2); px(g, fx - 2, fy, col, 1, 2); }
    return c;
  }

  return { C, paco, boat, atv, diver, coast, hill, deep, COAST, HILL, DEEP };
})();
