/* Paco's Island: the art, drawn in code.

   The scene is 480 x 240 pixels in a 32 bit style: smooth gradients, soft
   edges, glow around lights and see through water. Everything is painted
   with canvas shapes and gradients, then handed to scene.js as textures.
   Paco, his boat, his ATV and his dive gear get a soft dark rim so they
   read against the scenery. Each trip has one long background strip: the
   coast of Bahía Ixtaluz from the Ixtaluz pier to Paco's Island, the walk
   through the island's village to Cascada Ixtalita, the climb from the
   island's beach to the upper waterfall, and the water
   from the surface to the canyon floor. Every place is fictional. */
'use strict';
const Art = (() => {
  const C = {
    ink: '#0D2340', white: '#FFFFFF', foam: '#F4FBFD',
    sky: ['#3FA9E6', '#5DBBEA', '#84D0EE', '#ADE3F2', '#D6F3F1', '#F4FBE9'],
    sea: ['#86E5DC', '#43CBD2', '#22AEC4', '#1390AC', '#0C7396', '#0A587E', '#0B4168'],
    far: ['#A9D9C6', '#7CC0AA', '#62AD9B'], mid: ['#7CCB73', '#3E9E63', '#267A55'], near: ['#8FD552', '#34954B', '#155643'],
    leafHi: '#C4EC6B', leaf: '#5CB84C', leafDk: '#0F3F3C',
    sand: ['#FFF0BF', '#F6DC98', '#E4BE74'], dirt: ['#D7A871', '#B98A52', '#8F6638', '#5E4530'],
    rock: ['#F6E7C6', '#D9C2A0', '#B39A84', '#8A7474', '#62546A', '#43405E'],
    wall: ['#FFFFFF', '#F6F0E4', '#D8D2D0'], roof: ['#F0825A', '#D2553A', '#A63E2A'], pink: ['#FF9CC4', '#F0478F', '#C21A68'],
    wood: ['#E7B06A', '#B98A52', '#8F6638', '#5E4530'], straw: ['#FDEBA8', '#E9C25B', '#C99A33', '#9A6F2A'],
    green: ['#C8EE6A', '#8ED04A', '#6BBE3C', '#3B8E38', '#1D5B3C'], belly: ['#F1F9B8', '#C9EC7C', '#93C955'], crest: ['#FFC25A', '#F28C28', '#C9621E'],
    hull: ['#FFFFFF', '#EEF2F1', '#C9D5DB', '#93A7B8'], stripe: '#1C5FA8', stripe2: '#E0352B', motor: ['#7C8794', '#4A515C', '#22262C'],
    atv: ['#F9856F', '#E0352B', '#A3241D'], tire: ['#3A4048', '#1E2328', '#0E1114'], rim: ['#E3E8EC', '#AEB7BE', '#6B7480'], lamp: '#FFE08A',
    mask: ['#FFE08A', '#FFC43A', '#C98F12'], tank: ['#F2F5F7', '#C3CCD3', '#7F8B95'], fin: ['#FF8DB8', '#E0237A', '#A3165A'],
    water: ['#F4FDFF', '#CFF4FA', '#8FD9E9', '#46BFD4'], sun: ['#FFF8D2', '#FFE58F', '#FFC43A'],
    deep: ['#43CBD2', '#22AEC4', '#1390AC', '#0C7396', '#095A7A', '#06425E', '#042C44', '#021A2C'],
    coral: ['#F2725C', '#F0478F', '#FFC43A', '#FF9CC4', '#B77BE0'],
    // Mario, Paco's twin: the same build in teal
    mario: ['#B8F0E6', '#6FD3C8', '#3FB3AE', '#1E7F89', '#0E4E5E'],
  };
  let rider = 'paco';
  const setRider = (who) => { rider = who === 'mario' ? 'mario' : 'paco'; };
  const TAU = Math.PI * 2;
  const noise = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
  const rgba = (hex, a) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;
  const stops = (gr, list) => { list.forEach((s, i) => (Array.isArray(s) ? gr.addColorStop(s[0], s[1]) : gr.addColorStop(list.length > 1 ? i / (list.length - 1) : 0, s))); return gr; };
  const lin = (g, x0, y0, x1, y1, list) => stops(g.createLinearGradient(x0, y0, x1, y1), list);
  const rad = (g, x, y, r0, r1, list) => stops(g.createRadialGradient(x, y, r0, x, y, r1), list);
  const ell = (g, cx, cy, rx, ry, fill, rot = 0) => { g.beginPath(); g.ellipse(cx, cy, Math.max(0.01, rx), Math.max(0.01, ry), rot, 0, TAU); g.fillStyle = fill; g.fill(); };
  const poly = (g, pts, fill) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } };
  const line = (g, pts, col, w = 1, cap = 'round') => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.strokeStyle = col; g.lineWidth = w; g.lineCap = cap; g.lineJoin = 'round'; g.stroke(); };
  const box = (g, x, y, w, h, r, fill) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); g.fillStyle = fill; g.fill(); };
  // a soft dark rim around a finished sprite
  function rim(c) {
    const [o, g] = canvas(c.width + 2, c.height + 2), [t, tg] = canvas(c.width, c.height);
    tg.drawImage(c, 0, 0); tg.globalCompositeOperation = 'source-in'; tg.fillStyle = C.ink; tg.fillRect(0, 0, c.width, c.height);
    g.globalAlpha = 0.5; for (const [dx, dy] of [[0, 1], [2, 1], [1, 0], [1, 2]]) g.drawImage(t, dx, dy);
    g.globalAlpha = 1; g.drawImage(c, 1, 1);
    return o;
  }

  // ---- Paco ------------------------------------------------------------
  // He faces right and fits a 76 x 44 box. pose: stand or swim. frame 0
  // or 1 moves his legs.
  function drawPaco(g, ox, oy, pose = 'stand', f = 0, hat = true) {
    const swim = pose === 'swim', G = rider === 'mario' ? C.mario : C.green, r = noise(3);
    g.save(); g.translate(ox, oy);
    const wag = swim && f ? 2 : 0;
    g.beginPath(); g.moveTo(1, 35 + wag); g.quadraticCurveTo(14, 27 + wag * 0.4, 27, 23.5); g.lineTo(30, 33); g.quadraticCurveTo(15, 35.5 + wag * 0.4, 1, 35 + wag); g.closePath();
    g.fillStyle = lin(g, 0, 24, 0, 37, [G[1], G[3]]); g.fill();
    g.save(); g.clip(); g.fillStyle = rgba(G[4], 0.5); for (let x = 3; x < 26; x += 6) g.fillRect(x, 18, 2.6, 22); g.restore();
    if (!swim) { box(g, 27 + f * 1.5, 30, 4.6, 10, 2, G[4]); box(g, 47 - f * 1.5, 30, 4.6, 10, 2, G[4]); }
    ell(g, 35, 27, 15.5, 7.6, lin(g, 0, 19, 0, 35, [G[0], G[1], [0.55, G[2]], G[3]]));
    g.save(); g.beginPath(); g.ellipse(35, 27, 15.5, 7.6, 0, 0, TAU); g.clip();
    ell(g, 34, 33, 12.5, 3.8, lin(g, 0, 29, 0, 36, C.belly));
    for (let i = 0; i < 60; i++) ell(g, 21 + r() * 28, 21 + r() * 9, 0.7, 0.5, rgba(G[4], 0.2));
    g.restore();
    for (let x = 23; x <= 50; x += 3.4) { const by = 27 - 7.6 * Math.sqrt(Math.max(0, 1 - ((x - 35) / 15.5) ** 2)) + 0.8; poly(g, [[x - 1.7, by + 0.6], [x + 1.7, by + 0.6], [x + 0.7, by - 3.6]], lin(g, x - 2, 0, x + 2, 0, C.crest)); }
    ell(g, 50, 22.5, 7, 6.4, lin(g, 0, 16, 0, 29, [G[1], G[2], G[3]]));
    ell(g, 54.5, 28.5, 4.4, 5.2, lin(g, 0, 23, 0, 34, ['#E9F7A8', '#B5E35C', '#86C23F']));
    const head = lin(g, 0, 12, 0, 25, [G[0], G[1], G[3]]);
    ell(g, 57, 18.5, 8.6, 6.2, head); ell(g, 65, 20, 6, 4.4, head);
    ell(g, 62.5, 23, 6.6, 1.8, rgba('#E9F7A8', 0.75));
    g.beginPath(); g.moveTo(58.5, 22.3); g.quadraticCurveTo(64, 23.4, 70.4, 21.2); g.strokeStyle = G[4]; g.lineWidth = 0.9; g.lineCap = 'round'; g.stroke();
    ell(g, 69.3, 18.5, 0.6, 0.5, G[4]);
    ell(g, 61.2, 21, 2.2, 1.2, rgba('#F59BB8', 0.75));
    ell(g, 59.5, 16.6, 2.7, 2.7, C.white); ell(g, 60.2, 16.8, 1.5, 1.7, C.ink); ell(g, 59.6, 16, 0.6, 0.6, C.white);
    g.beginPath(); g.arc(59.5, 16.6, 2.7, Math.PI * 1.05, Math.PI * 1.95); g.strokeStyle = G[4]; g.lineWidth = 0.8; g.stroke();
    ell(g, 33, 21.6, 9, 1.4, rgba('#FFFFFF', 0.22));
    const leg = lin(g, 0, 29, 0, 41, [G[1], G[3]]);
    if (swim) { ell(g, 21 - f * 2, 33.5, 6.5, 2.4, leg, 0.25); ell(g, 44 + f * 2, 34, 5.8, 2.2, leg, -0.2); }
    else { box(g, 22 - f * 1.5, 29, 5.4, 11, 2.4, leg); box(g, 20.5 - f * 1.5, 38.4, 9.6, 3.2, 1.5, leg); box(g, 42 + f * 1.5, 29, 5.2, 11, 2.4, leg); box(g, 41 + f * 1.5, 38.4, 9.6, 3.2, 1.5, leg); }
    if (hat && rider === 'mario') {
      // Mario wears an orange bandana with white dots, knotted at the back
      const band = lin(g, 0, 6, 0, 15, ['#FFC25A', '#F28C28', '#C9621E']);
      g.beginPath(); g.ellipse(57.5, 14, 8, 7.6, 0, Math.PI, 0); g.closePath(); g.fillStyle = band; g.fill();
      for (const [dx, dy] of [[-4, -3], [0, -5.5], [4, -3], [-1, -1.2], [3.5, -0.8]]) ell(g, 57.5 + dx, 14 + dy, 0.9, 0.9, rgba('#FFFFFF', 0.85));
      poly(g, [[50, 12.4], [44.5, 9.6], [45.4, 13.8]], band); poly(g, [[50, 13.4], [45, 16.2], [47.6, 17.4]], band);
      ell(g, 50.2, 12.9, 1.6, 1.6, '#C9621E'); ell(g, 55, 8.8, 1.8, 0.9, rgba('#FFFFFF', 0.35));
    } else if (hat) {
      const straw = lin(g, 44, 0, 70, 0, [C.straw[0], C.straw[1], C.straw[2]]);
      ell(g, 57, 14.4, 9, 1.2, rgba(C.ink, 0.18));
      ell(g, 57, 12.6, 13, 2.5, straw);
      g.beginPath(); g.ellipse(57, 12, 6.8, 7.6, 0, Math.PI, 0); g.closePath(); g.fillStyle = straw; g.fill();
      g.save(); g.clip();
      g.fillStyle = lin(g, 50, 0, 64, 0, C.pink); g.fillRect(49, 8.6, 16, 2.7);
      g.strokeStyle = rgba(C.straw[3], 0.3); g.lineWidth = 0.5; for (let y = 5.5; y < 8.6; y += 1.1) { g.beginPath(); g.moveTo(50, y); g.lineTo(64, y); g.stroke(); }
      g.restore();
      ell(g, 54.5, 6.5, 1.8, 1, rgba('#FFFFFF', 0.35));
    }
    g.restore();
  }
  // scale above 1 draws Paco larger and sharp, without the rim, for the app icon
  function paco(pose = 'stand', frame = 0, scale = 1) { const [c, g] = canvas(76 * scale, 44 * scale); g.scale(scale, scale); drawPaco(g, 0, 0, pose, frame); return scale === 1 ? rim(c) : c; }

  // Mario on his own, whatever the current rider, for the Stumped card.
  function mario(scale = 1) { const was = rider; rider = 'mario'; const c = paco('stand', 0, scale); rider = was; return c; }

  // ---- Esmeralda --------------------------------------------------------
  // Esmeralda, a great green macaw, on a perch facing left toward Mario. 40 x 52.
  function drawParrot(g) {
    const G = ['#D6F26A', '#9BD43C', '#6DB52E', '#3F8A2A', '#22562A'], B = ['#9EE6F0', '#3FB6D8', '#1E7FB0'];
    // tail: long, green above with blue at the tip
    poly(g, [[25, 33], [31, 33], [38, 51], [33, 52]], lin(g, 0, 33, 0, 52, [G[2], G[3], [0.7, B[1]], B[2]]));
    // body
    ell(g, 20, 29, 9.5, 13.5, lin(g, 0, 16, 0, 43, [G[0], G[1], [0.6, G[2]], G[3]]), -0.18);
    // wing, its flight feathers blue
    g.save(); g.beginPath(); g.ellipse(25, 30, 7, 12.5, -0.22, 0, TAU); g.closePath();
    g.fillStyle = lin(g, 0, 18, 0, 43, [G[1], G[2], G[3]]); g.fill(); g.clip();
    g.fillStyle = lin(g, 0, 34, 0, 44, [B[0], B[1], B[2]]); g.fillRect(16, 35, 18, 12);
    for (let y = 24; y < 44; y += 3.2) line(g, [[19, y], [31, y + 2.4]], rgba(G[4], 0.35), 0.6);
    g.restore();
    // feet on the perch
    for (const x of [16.5, 22.5]) { line(g, [[x, 41], [x - 1.4, 45.5]], '#5E6670', 1.6); line(g, [[x, 41], [x + 1.6, 45.5]], '#5E6670', 1.6); }
    box(g, 0, 44.5, 40, 3.4, 1.7, lin(g, 0, 44, 0, 48, C.wood));
    // head
    ell(g, 16, 13, 8.4, 7.8, lin(g, 0, 5, 0, 21, [G[0], G[1], G[2]]));
    ell(g, 10.5, 8.2, 4.6, 3.2, lin(g, 0, 5, 0, 11, ['#FF6A4D', '#E8221C', '#B5121A']), -0.3); // red forehead
    ell(g, 13.2, 14.2, 4.3, 4.3, lin(g, 0, 10, 0, 19, ['#FAD3DD', '#E7A9BC'])); // bare pink face
    for (let i = 0; i < 4; i++) line(g, [[10.5, 12.4 + i * 1.3], [15.6, 12.9 + i * 1.2]], rgba(C.ink, 0.45), 0.35);
    ell(g, 14.3, 12.4, 1.5, 1.5, '#FFF4C7'); ell(g, 14.1, 12.4, 0.9, 1, C.ink); ell(g, 13.8, 12, 0.35, 0.35, C.white);
    // hooked beak, dark grey
    g.beginPath(); g.moveTo(10, 10.2); g.quadraticCurveTo(3, 10.6, 3.6, 18.6); g.quadraticCurveTo(6, 15.6, 9.6, 17); g.closePath();
    g.fillStyle = lin(g, 3, 10, 10, 18, ['#6E7680', '#3A4048', '#1E2328']); g.fill();
    g.beginPath(); g.moveTo(9.8, 16.4); g.quadraticCurveTo(6.4, 17, 6.8, 19.4); g.quadraticCurveTo(9.5, 19.4, 11, 17.4); g.closePath(); g.fillStyle = '#2A2F36'; g.fill();
    ell(g, 6.2, 11.6, 1.6, 0.7, rgba('#FFFFFF', 0.3), -0.4);
  }
  function parrot(scale = 1) { const [c, g] = canvas(40 * scale, 52 * scale); g.scale(scale, scale); drawParrot(g); return c; }

  // Paco in a panga with an outboard motor. 132 x 60.
  function boat(frame = 0) {
    const [c, g] = canvas(130, 58);
    g.save(); g.beginPath(); g.rect(0, 0, 130, 31); g.clip(); drawPaco(g, 38, -3 + (frame ? 1 : 0)); g.restore();
    g.beginPath(); g.moveTo(9, 30); g.lineTo(107, 30); g.quadraticCurveTo(119, 27, 127, 16); g.quadraticCurveTo(124, 38, 102, 50); g.lineTo(20, 50); g.quadraticCurveTo(12, 47, 9, 30); g.closePath();
    g.fillStyle = lin(g, 0, 18, 0, 51, [C.hull[0], [0.45, C.hull[1]], [0.8, C.hull[2]], C.hull[3]]); g.fill();
    g.save(); g.clip();
    g.fillStyle = C.stripe; g.fillRect(0, 36, 130, 2.6); g.fillStyle = C.stripe2; g.fillRect(0, 40.2, 130, 1.5);
    g.strokeStyle = rgba(C.hull[3], 0.5); g.lineWidth = 0.6; for (const x of [34, 58, 82]) { g.beginPath(); g.moveTo(x, 42); g.lineTo(x + 2, 50); g.stroke(); }
    ell(g, 112, 27, 12, 5, rgba('#FFFFFF', 0.5));
    g.restore();
    g.beginPath(); g.moveTo(9, 30.6); g.lineTo(107, 30.6); g.quadraticCurveTo(119, 27.6, 126.6, 16.8); g.strokeStyle = lin(g, 0, 29, 0, 33, [C.wood[0], C.wood[2]]); g.lineWidth = 2.6; g.lineCap = 'round'; g.stroke();
    box(g, 0, 19, 11, 13, 2.5, lin(g, 0, 19, 11, 32, C.motor)); g.fillStyle = C.stripe2; g.fillRect(1, 22, 9, 1.8); ell(g, 3.6, 21, 2, 0.8, rgba('#FFFFFF', 0.3));
    box(g, 4, 32, 3.6, 19, 1, C.motor[1]); box(g, 1, 49.5, 9.5, 3, 1.4, C.motor[2]); box(g, 10.5, 24.5, 7, 2, 1, C.motor[2]);
    const o = rim(c), og = o.getContext('2d'), r = noise(41 + frame);
    ell(og, 62, 54.5, 52, 3.2, rgba(C.sea[6], 0.3));
    for (let x = 14; x < 108; x += 5) ell(og, x + r() * 3, 51.6 + r() * 1.2, 2.2 + r() * 2.4, 0.9, rgba('#FFFFFF', 0.55 + r() * 0.4));
    return o;
  }

  // Paco on a red ATV. 118 x 78.
  function atv(frame = 0) {
    const [c, g] = canvas(116, 76), spin = frame ? 0.22 : 0;
    const wheel = (wx, wy) => {
      ell(g, wx, wy, 14, 14, rad(g, wx - 3, wy - 4, 2, 15, C.tire));
      for (let a = 0; a < 14; a++) { const t = a / 14 * TAU + spin; line(g, [[wx + Math.cos(t) * 11.6, wy + Math.sin(t) * 11.6], [wx + Math.cos(t) * 13.8, wy + Math.sin(t) * 13.8]], '#4A515C', 2.2, 'butt'); }
      ell(g, wx, wy, 6.6, 6.6, rad(g, wx - 2, wy - 2, 0.5, 7, C.rim));
      for (let a = 0; a < 5; a++) { const t = a / 5 * TAU + spin * 3; line(g, [[wx, wy], [wx + Math.cos(t) * 5.6, wy + Math.sin(t) * 5.6]], C.rim[2], 1); }
      ell(g, wx, wy, 2.2, 2.2, C.motor[1]);
    };
    line(g, [[4, 38], [4, 31], [22, 31]], C.rim[1], 2.2);
    g.save(); g.beginPath(); g.rect(0, 0, 116, 38); g.clip(); drawPaco(g, 16, -1 + (frame ? 1 : 0)); g.restore();
    wheel(24, 58); wheel(91, 58);
    const red = lin(g, 0, 34, 0, 50, C.atv);
    box(g, 5, 37, 38, 7, 3.4, red); box(g, 71, 37, 40, 7, 3.4, red); box(g, 25, 39, 64, 11, 4, red);
    ell(g, 63, 38, 11, 4.6, red);
    box(g, 27, 34, 34, 6, 3, lin(g, 0, 34, 0, 40, ['#4A515C', C.tire[1]]));
    ell(g, 40, 35.4, 12, 1, rgba('#FFFFFF', 0.25)); ell(g, 56, 40.6, 26, 1, rgba('#FFFFFF', 0.3));
    line(g, [[78, 38], [74.5, 21]], C.rim[1], 2.4); line(g, [[68, 21.4], [82, 20]], C.rim[2], 2.8); line(g, [[80, 20.2], [83.5, 19.8]], C.tire[1], 3.6);
    ell(g, 108, 41, 9, 7, rad(g, 108, 41, 0.5, 9, [rgba(C.lamp, 0.8), rgba(C.lamp, 0)])); ell(g, 108, 41, 3.2, 3, rad(g, 107, 40, 0.3, 3.4, [C.white, C.lamp]));
    line(g, [[110, 46], [113, 49]], C.rim[2], 2); box(g, 46, 50, 22, 2.4, 1, C.tire[1]);
    return rim(c);
  }

  // Paco diving: mask, tank and pink fins. 86 x 52.
  function diver(frame = 0) {
    const [c, g] = canvas(84, 50), k = frame ? 1 : 0;
    const fin = lin(g, 0, 28, 0, 44, C.fin);
    poly(g, [[22, 36], [8 - k, 30 + k * 4], [3 - k, 40 + k * 3], [20, 40]], fin);
    poly(g, [[46, 37], [34 + k, 34 - k * 2], [30 + k, 43 - k], [45, 41]], fin);
    drawPaco(g, 4, 4, 'swim', frame, false);
    box(g, 26, 14, 24, 8, 4, lin(g, 0, 14, 0, 22, C.tank)); box(g, 23, 16.4, 4, 3.2, 1.2, C.tank[2]); ell(g, 38, 15.6, 9, 0.9, rgba('#FFFFFF', 0.6));
    line(g, [[50, 19], [58, 24], [64, 26.4]], C.ink, 1.3);
    line(g, [[50, 20], [60, 19.6]], C.ink, 1.6);
    box(g, 59.4, 16.4, 9.4, 8.4, 2.4, lin(g, 0, 16, 0, 25, C.mask)); box(g, 60.8, 17.8, 6.6, 5.6, 1.6, lin(g, 60, 17, 68, 24, ['#E6FBFF', '#9FE6F2', '#5CC4DA']));
    ell(g, 64.4, 20.8, 1.3, 1.5, C.ink); ell(g, 63.9, 20.2, 0.5, 0.5, C.white);
    return rim(c);
  }

  // small pictures for the trip list on the title screen, 96 x 56
  function icon(trip) {
    const [c, g] = canvas(96, 56);
    if (trip === 'boat') { g.fillStyle = lin(g, 0, 0, 0, 32, [C.sky[1], C.sky[4]]); g.fillRect(0, 0, 96, 32); g.fillStyle = lin(g, 0, 32, 0, 56, [C.sea[1], C.sea[4]]); g.fillRect(0, 32, 96, 24); g.drawImage(boat(0), 2, 9, 92, 42); }
    else if (trip === 'walk') {
      g.fillStyle = lin(g, 0, 0, 0, 44, [C.sky[1], C.sky[4]]); g.fillRect(0, 0, 96, 44);
      g.fillStyle = lin(g, 0, 10, 0, 44, C.mid); g.beginPath(); g.moveTo(0, 44); g.quadraticCurveTo(30, 14, 60, 22); g.quadraticCurveTo(80, 26, 96, 12); g.lineTo(96, 44); g.closePath(); g.fill();
      g.fillStyle = lin(g, 0, 4, 0, 40, [C.water[0], C.water[2]]); g.fillRect(80, 6, 7, 38);
      g.fillStyle = lin(g, 0, 42, 0, 56, [C.rock[1], C.rock[3]]); g.fillRect(0, 43, 96, 13);
      for (let x = 2; x < 96; x += 6) ell(g, x + (x % 12 ? 2 : 0), 47 + (x % 12 ? 0 : 4), 2.4, 1.3, rgba('#FFFFFF', 0.35));
      g.drawImage(walker(0), 12, 3, 66, 40);
    }
    else if (trip === 'atv') { g.fillStyle = lin(g, 0, 0, 0, 48, [C.near[0], C.near[1], C.near[2]]); g.fillRect(0, 0, 96, 48); g.fillStyle = lin(g, 0, 46, 0, 56, [C.dirt[0], C.dirt[2]]); g.fillRect(0, 47, 96, 9); g.drawImage(atv(0), 10, 0, 76, 50); }
    else { g.fillStyle = lin(g, 0, 0, 0, 56, [C.deep[2], C.deep[5]]); g.fillRect(0, 0, 96, 56); g.drawImage(diver(0), 8, 6, 72, 43); for (const [x, y, s] of [[80, 16, 2], [84, 9, 1.5], [82, 3, 1]]) ell(g, x, y, s, s, rgba('#FFFFFF', 0.7)); }
    return c.toDataURL();
  }

  // ---- scenery ---------------------------------------------------------
  function skyFill(g, w, h) { g.fillStyle = lin(g, 0, 0, 0, h, C.sky); g.fillRect(0, 0, w, h); }
  function sun(g, x, y) { ell(g, x, y, 95, 95, rad(g, x, y, 10, 95, [rgba('#FFF4BE', 0.6), rgba('#FFF4BE', 0)])); ell(g, x, y, 17, 17, rad(g, x - 3, y - 3, 1, 18, C.sun)); }
  function cloud(g, x, y, s) {
    const puffs = [[-22, 2, 8], [-11, -3, 11], [2, -7, 14], [16, -3, 11], [27, 2, 7]];
    for (const [dx, dy, r] of puffs) ell(g, x + dx * s, y + dy * s + 3 * s, r * s, r * s * 0.8, rgba('#A7D2EA', 0.55));
    for (const [dx, dy, r] of puffs) ell(g, x + dx * s, y + dy * s, r * s, r * s * 0.85, rad(g, x + dx * s - 2, y + dy * s - 3 * s, 1, r * s * 1.1, ['#FFFFFF', '#EAF6FB']));
  }
  const ridgeY = (x, base, amp, f, ph) => base - amp * (0.5 + 0.5 * (0.55 * Math.sin(x * f + ph) + 0.3 * Math.sin(x * f * 2.3 + ph * 1.7) + 0.15 * Math.sin(x * f * 5.1 + ph * 0.6)));
  function range(g, w, foot, base, amp, f, ph, cols) {
    g.beginPath(); g.moveTo(0, foot); for (let x = 0; x <= w; x += 4) g.lineTo(x, ridgeY(x, base, amp, f, ph)); g.lineTo(w, foot); g.closePath();
    g.fillStyle = lin(g, 0, base - amp, 0, foot, cols); g.fill();
  }
  // treetops: a dark base, a lit side and a highlight, many times over
  function canopy(g, r, x0, x1, top, foot, step, size, a = 1) {
    for (let x = x0; x < x1; x += step * (0.6 + r() * 0.8)) {
      const t = top(x), cy = t + 3 + r() * Math.max(2, foot(x) - t - 8), rr = size * (0.6 + r() * 0.7);
      ell(g, x, cy, rr, rr * 0.8, rgba(C.leafDk, 0.34 * a)); ell(g, x - rr * 0.15, cy - rr * 0.15, rr * 0.8, rr * 0.62, rgba(C.leaf, 0.5 * a)); ell(g, x - rr * 0.32, cy - rr * 0.36, rr * 0.42, rr * 0.3, rgba(C.leafHi, 0.55 * a));
    }
  }
  function palm(g, x, y, h = 36, lean = 1) {
    const tx = x + 7 * lean, ty = y - h;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 1 * lean, y - h * 0.5, tx, ty); g.strokeStyle = C.wood[3]; g.lineWidth = 4; g.lineCap = 'round'; g.stroke();
    g.beginPath(); g.moveTo(x - 0.8, y); g.quadraticCurveTo(x + 0.2 * lean, y - h * 0.5, tx - 0.8, ty); g.strokeStyle = C.wood[1]; g.lineWidth = 2; g.stroke();
    const fr = [[-21, 8, C.near[1]], [21, 8, C.near[2]], [-19, -3, C.near[1]], [19, -3, '#2E8F3E'], [-10, -12, C.leaf], [11, -12, '#2E8F3E'], [0, -15, C.leaf], [-22, 15, C.near[2]], [22, 15, C.near[2]]];
    for (const [dx, dy, col] of fr) {
      g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + dx * 0.55, ty + Math.min(dy, 0) - 9, tx + dx, ty + dy); g.quadraticCurveTo(tx + dx * 0.5, ty + Math.min(dy, 0) - 2, tx, ty + 2); g.closePath(); g.fillStyle = col; g.fill();
      g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(tx + dx * 0.55, ty + Math.min(dy, 0) - 9, tx + dx, ty + dy); g.strokeStyle = rgba(C.leafHi, 0.6); g.lineWidth = 0.8; g.stroke();
    }
    ell(g, tx + 1, ty + 3, 2, 2, C.wood[3]); ell(g, tx - 2, ty + 3.4, 1.8, 1.8, '#6B4420');
  }
  const HOUSE = [C.wall, ['#FFE3EA', '#F7B7C4', '#E592A6'], ['#D6F5EF', '#9BE0D6', '#6FC4B8'], ['#FFF2BD', '#FBE38F', '#E9C65E'], ['#E9F5FF', '#C9E7FA', '#9BCBE8']];
  function house(g, x, y, w, h, style = 0, roof = C.roof) {
    const wl = HOUSE[style % HOUSE.length];
    ell(g, x + w / 2, y, w * 0.62, 1.6, rgba(C.ink, 0.18));
    g.fillStyle = lin(g, x, 0, x + w, 0, [wl[0], [0.6, wl[1]], wl[2]]); g.fillRect(x, y - h, w, h);
    poly(g, [[x - 2.5, y - h], [x + w + 2.5, y - h], [x + w - 1, y - h - 7], [x + 1, y - h - 7]], lin(g, 0, y - h - 7, 0, y - h, roof));
    g.strokeStyle = rgba(roof[2], 0.5); g.lineWidth = 0.5; for (let i = 2; i < w; i += 3) { g.beginPath(); g.moveTo(x + i, y - h - 6.5); g.lineTo(x + i - 0.6, y - h - 0.5); g.stroke(); }
    g.fillStyle = rgba(C.ink, 0.12); g.fillRect(x, y - h, w, 1.4);
    box(g, x + w / 2 - 2.4, y - 8.5, 4.8, 8.5, 1.2, lin(g, 0, y - 9, 0, y, ['#8A5530', '#5E3B1A']));
    if (w >= 18) for (const wx of [x + 2.6, x + w - 7.4]) { g.fillStyle = lin(g, 0, y - h + 4, 0, y - h + 9, ['#9ED8EA', '#2B6E8F']); g.fillRect(wx, y - h + 4, 4.8, 5); g.fillStyle = rgba('#FFFFFF', 0.6); g.fillRect(wx, y - h + 4, 4.8, 0.9); }
  }
  function palapa(g, x, y) {
    line(g, [[x, y], [x, y - 14]], C.wood[2], 2.2, 'butt');
    poly(g, [[x - 18, y - 13], [x + 18, y - 13], [x + 3, y - 24], [x - 3, y - 24]], lin(g, x - 18, 0, x + 18, 0, [C.straw[0], C.straw[1], C.straw[2]]));
    g.strokeStyle = rgba(C.straw[3], 0.55); g.lineWidth = 0.6; for (let i = -16; i <= 16; i += 3) { g.beginPath(); g.moveTo(x + i * 0.2, y - 23); g.lineTo(x + i, y - 11.5); g.stroke(); }
  }
  function islet(g, cx, base, wd, ht, arch, seed) {
    const r = noise(seed);
    ell(g, cx, base + ht * 0.12, wd * 0.52, ht * 0.16, rgba(C.sea[6], 0.3));
    g.beginPath(); g.ellipse(cx, base, wd / 2, ht, 0, Math.PI, 0); g.closePath();
    if (arch) { g.moveTo(cx + wd * 0.17, base); g.ellipse(cx, base, wd * 0.17, ht * 0.46, 0, 0, Math.PI, true); g.closePath(); }
    g.fillStyle = lin(g, cx - wd / 2, base - ht, cx + wd / 2, base, [C.rock[0], [0.35, C.rock[2]], [0.75, C.rock[3]], C.rock[5]]); g.fill('evenodd');
    g.save(); g.clip('evenodd');
    for (let i = 0; i < ht / 3; i++) { const y = base - r() * ht; line(g, [[cx - wd / 2, y], [cx + wd / 2, y + (r() - 0.5) * 6]], rgba(i % 2 ? C.rock[5] : C.rock[0], 0.16), 0.8 + r()); }
    ell(g, cx - wd * 0.08, base - ht, wd * 0.34, ht * 0.14, rgba(C.leaf, 0.9)); ell(g, cx - wd * 0.14, base - ht, wd * 0.2, ht * 0.08, rgba(C.leafHi, 0.8));
    g.restore();
    for (let x = -wd / 2 - 2; x <= wd / 2 + 2; x += 4) ell(g, cx + x + r() * 2, base + r(), 2.6, 1, rgba('#FFFFFF', 0.85));
  }
  function bird(g, x, y) { g.beginPath(); g.moveTo(x - 4, y); g.quadraticCurveTo(x - 2, y - 3, x, y); g.quadraticCurveTo(x + 2, y - 3, x + 4, y); g.strokeStyle = C.white; g.lineWidth = 1; g.lineCap = 'round'; g.stroke(); }
  function panga(g, x, y, canopy) {
    poly(g, [[x, y], [x + 26, y], [x + 30, y - 4], [x + 24, y + 4.5], [x + 3, y + 4.5]], lin(g, 0, y - 2, 0, y + 5, [C.hull[0], C.hull[2]]));
    g.fillStyle = C.stripe; g.fillRect(x + 1.5, y + 1.4, 25, 1);
    if (canopy) { line(g, [[x + 6, y], [x + 6, y - 7]], C.rim[2], 0.8); line(g, [[x + 20, y], [x + 20, y - 7]], C.rim[2], 0.8); box(g, x + 3, y - 8.6, 20, 2.2, 1, canopy); }
  }
  function dock(g, x, y, len) {
    for (let px = x + 3; px < x + len; px += 9) { line(g, [[px, y], [px, y + 10]], C.wood[3], 2, 'butt'); line(g, [[px, y + 10], [px + 0.5, y + 16]], rgba(C.sea[6], 0.3), 2, 'butt'); }
    g.fillStyle = lin(g, 0, y - 3, 0, y + 0.6, [C.wood[0], C.wood[2]]); g.fillRect(x, y - 3, len, 3.6);
  }
  function seaFill(g, w, top, h, seed) {
    const r = noise(seed);
    g.fillStyle = lin(g, 0, top, 0, h, C.sea); g.fillRect(0, top, w, h - top);
    g.fillStyle = lin(g, 0, top, 0, top + 16, [rgba(C.near[2], 0.3), rgba(C.near[2], 0)]); g.fillRect(0, top, w, 16);
    for (let i = 0; i < w * 1.1; i++) {
      const t = r() ** 1.3, y = top + 3 + t * (h - top - 4), len = (2 + t * 9) * (0.5 + r()), lite = r() > 0.42;
      ell(g, r() * w, y, len, 0.5 + t * 0.7, lite ? rgba('#D9FBF2', 0.16 + r() * 0.3) : rgba(C.sea[6], 0.1 + r() * 0.16));
    }
    for (let x = 0; x < w; x += 5) ell(g, x + r() * 3, top + 0.6 + r(), 3 + r() * 2, 0.9, rgba('#FFFFFF', 0.75));
  }
  function rockMass(g, pts, x0, x1, seed) {
    const r = noise(seed), ys = pts.map((p) => p[1]), top = Math.min(...ys), bot = Math.max(...ys);
    poly(g, pts, lin(g, x0, top, x1, bot, [C.rock[0], [0.3, C.rock[2]], [0.7, C.rock[3]], C.rock[5]]));
    g.save(); g.clip();
    for (let i = 0; i < (bot - top) / 2.5; i++) { const y = top + r() * (bot - top); line(g, [[x0, y], [x1, y + (r() - 0.5) * 10]], rgba(i % 2 ? C.rock[5] : C.rock[0], 0.15), 0.8 + r() * 1.4); }
    g.restore();
  }

  // ---- the coast: the Ixtaluz pier to Paco's Island ----------------------
  const COAST = { w: 4000, h: 240, horizon: 140, stopX: (i) => 175 + i * 500 };
  function coast() {
    const { w, h, horizon: H } = COAST, S = COAST.stopX;
    const [c, g] = canvas(w, h); const r = noise(7);
    skyFill(g, w, H); sun(g, 262, 38);
    for (let x = 50; x < w; x += 260 + r() * 180) cloud(g, x, 24 + r() * 36, 0.8 + r() * 0.5);
    const beach = H - 6, top3 = (x) => ridgeY(x, 114, 18, 0.026, 4.0) + 2 * Math.sin(x * 0.45);
    range(g, w, beach, 70, 34, 0.0105, 0.6, C.far);
    g.fillStyle = lin(g, 0, 96, 0, beach, [rgba('#EAF8F1', 0), rgba('#EAF8F1', 0.55)]); g.fillRect(0, 96, w, beach - 96);
    range(g, w, beach, 96, 24, 0.017, 2.1, C.mid);
    canopy(g, r, 0, w, (x) => ridgeY(x, 96, 24, 0.017, 2.1), () => beach, 9, 8, 0.6);
    g.beginPath(); g.moveTo(0, beach); for (let x = 0; x <= w; x += 2) g.lineTo(x, top3(x)); g.lineTo(w, beach); g.closePath(); g.fillStyle = lin(g, 0, 96, 0, beach, C.near); g.fill();
    canopy(g, r, 0, w, top3, () => beach - 2, 6, 9);
    g.fillStyle = lin(g, 0, beach - 10, 0, beach, [rgba(C.leafDk, 0), rgba(C.leafDk, 0.45)]); g.fillRect(0, beach - 10, w, 10);
    g.fillStyle = lin(g, 0, beach - 1, 0, H + 1, C.sand); g.fillRect(0, beach - 1, w, 7);
    seaFill(g, w, H, h, 5);
    for (let i = 0; i < 130; i++) { const t = r(), y = H + 3 + t * 96; ell(g, 262 + (r() - 0.5) * (10 + t * 46), y, 1 + r() * 2.6, 0.7, rgba('#FFFBE0', 0.9 - t * 0.5)); }
    const sandAt = (x0, x1, th) => { g.beginPath(); g.moveTo(x0, H); g.quadraticCurveTo(x0 + 8, H - th, x0 + 20, H - th); g.lineTo(x1 - 20, H - th); g.quadraticCurveTo(x1 - 8, H - th, x1, H); g.closePath(); g.fillStyle = lin(g, 0, H - th, 0, H, C.sand); g.fill(); };
    // Puerto Ixtaluz: town, the pier and a striped lighthouse at its end
    for (let i = 0; i < 7; i++) house(g, S(0) - 168 + i * 25, beach - 16 - (i % 2) * 7, 19, 13 + (i % 3) * 3, i + 1, i % 3 ? C.roof : C.pink);
    for (let i = 0; i < 8; i++) house(g, S(0) - 172 + i * 24, beach, 20 + (i % 3) * 2, 15 + (i % 3) * 5, i, i % 2 ? C.roof : [C.roof[1], C.roof[2], '#7A2B2A']);
    palm(g, S(0) - 186, beach, 36); palm(g, S(0) + 22, beach, 30, -1);
    dock(g, S(0) - 14, H - 1, 92);
    const lx = S(0) + 68, lb = H - 4;
    g.beginPath(); g.moveTo(lx - 6.6, lb); g.lineTo(lx + 6.6, lb); g.lineTo(lx + 4, lb - 50); g.lineTo(lx - 4, lb - 50); g.closePath(); g.fillStyle = C.white; g.fill();
    g.save(); g.clip();
    g.fillStyle = C.pink[1]; for (let y = 0; y < 50; y += 16) g.fillRect(lx - 8, lb - y - 8, 16, 8);
    g.fillStyle = lin(g, lx - 7, 0, lx + 7, 0, [rgba('#FFFFFF', 0.35), [0.45, rgba('#FFFFFF', 0)], rgba(C.ink, 0.4)]); g.fillRect(lx - 8, lb - 52, 16, 54);
    g.restore();
    box(g, lx - 6, lb - 52.4, 12, 2.6, 1, C.motor[2]);
    ell(g, lx, lb - 57, 16, 16, rad(g, lx, lb - 57, 1, 16, [rgba(C.lamp, 0.75), rgba(C.lamp, 0)]));
    box(g, lx - 3.4, lb - 60.6, 6.8, 8.4, 1, lin(g, lx - 4, 0, lx + 4, 0, [C.sun[0], C.sun[2]])); poly(g, [[lx - 5, lb - 60.4], [lx + 5, lb - 60.4], [lx, lb - 66.5]], lin(g, lx - 5, 0, lx + 5, 0, C.roof));
    // Peñas Cantoras: rounded granite islets, the big one with an arch
    const ax = S(1) + 50;
    islet(g, ax - 46, H + 9, 32, 30, false, 21); islet(g, ax, H + 11, 60, 62, true, 22); islet(g, ax + 48, H + 9, 27, 24, false, 23);
    bird(g, ax - 14, H - 72); bird(g, ax + 9, H - 80); bird(g, ax + 28, H - 66); bird(g, ax - 60, H - 52);
    // Boca Tamarilla: village at a river mouth, pangas on the beach
    ell(g, S(2) + 108, H + 0.5, 15, 3, lin(g, 0, H - 3, 0, H + 4, [C.water[3], C.sea[0]]));
    for (let i = 0; i < 6; i++) house(g, S(2) - 76 + i * 27, beach - (i % 2) * 5, 22, 15 + (i % 2) * 7, i + 1);
    for (let i = 0; i < 3; i++) panga(g, S(2) - 62 + i * 40, H + 3.5, [C.stripe, C.stripe2, '#3FBFB0'][i]);
    // Caleta Pochota: a small cove between cliffs
    rockMass(g, [[S(3) - 72, H], [S(3) - 66, H - 34], [S(3) - 52, H - 44], [S(3) - 40, H - 36], [S(3) - 34, H]], S(3) - 72, S(3) - 34, 31);
    rockMass(g, [[S(3) + 36, H], [S(3) + 42, H - 38], [S(3) + 58, H - 46], [S(3) + 70, H - 30], [S(3) + 76, H]], S(3) + 36, S(3) + 76, 32);
    sandAt(S(3) - 40, S(3) + 42, 7); palm(g, S(3) - 10, H - 6, 32); palm(g, S(3) + 14, H - 6, 27, -1);
    // Playa Ondarena: a long beach with palapas
    sandAt(S(4) - 124, S(4) + 124, 11);
    for (let i = 0; i < 5; i++) palapa(g, S(4) - 82 + i * 40, H - 9);
    for (let i = 0; i < 7; i++) { const ux = S(4) - 100 + i * 33; line(g, [[ux, H - 5], [ux, H - 11]], C.wood[3], 0.8); g.beginPath(); g.arc(ux, H - 10, 5, Math.PI, 0); g.fillStyle = C.coral[i % 5]; g.fill(); }
    palm(g, S(4) + 112, H - 9, 42); palm(g, S(4) - 116, H - 9, 36, -1);
    // Pueblo Tilmeca: houses climbing the hill
    for (let i = 0; i < 5; i++) house(g, S(5) - 64 + i * 28, beach - (i % 2) * 15, 22, 17, i + 2, i === 2 ? C.pink : C.roof);
    palm(g, S(5) + 88, beach, 36); palm(g, S(5) - 84, beach, 31, -1);
    // Playa Zinzuna: a quiet beach under palms
    sandAt(S(6) - 84, S(6) + 84, 10);
    for (let i = 0; i < 5; i++) palm(g, S(6) - 60 + i * 30, H - 8, 28 + (i % 2) * 12, i % 2 ? -1 : 1);
    // Paco's Island: the cove, palapas on the beach and houses up the hill
    sandAt(S(7) - 176, S(7) + 176, 15);
    for (let i = 0; i < 8; i++) house(g, S(7) - 150 + i * 40, H - 36 - (i % 3) * 17, 22, 15, i, i % 3 === 1 ? C.pink : C.roof);
    for (let i = 0; i < 6; i++) palapa(g, S(7) - 136 + i * 50, H - 12);
    for (let i = 0; i < 6; i++) palm(g, S(7) - 172 + i * 70, H - 13, 34 + (i % 2) * 12, i % 2 ? -1 : 1);
    for (let i = 1; i < 8; i++) dock(g, S(i) + 74, H - 1, 26);
    return c;
  }

  // ---- Paco's Island on land: beach to the upper waterfall ---------------
  const HILL = { w: 3125, h: 325, stopX: (i) => 175 + i * 538, ground: (x) => Math.round(290 - Math.min(1, Math.max(0, x - 125) / 2812) * 175) };
  function hill() {
    const { w, h, ground } = HILL, S = HILL.stopX;
    const [c, g] = canvas(w, h); const r = noise(21);
    skyFill(g, w, h);
    for (let x = 80; x < w; x += 300 + r() * 130) cloud(g, x, ground(x) - 190 + r() * 40, 1 + r() * 0.4);
    const back = (x) => ground(x) - 120 + ridgeY(x, 0, 24, 0.012, 1.3), wall = (x) => ground(x) - 84 + ridgeY(x, 0, 20, 0.021, 3.1) + 3 * Math.sin(x * 0.31);
    const shape = (top, cols, drop) => { g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 3) g.lineTo(x, top(x)); g.lineTo(w, h); g.closePath(); g.fillStyle = lin(g, 0, 60, 0, h, cols); g.fill(); };
    shape(back, C.mid); canopy(g, r, 0, w, back, (x) => ground(x) - 60, 10, 10, 0.6);
    shape(wall, C.near); canopy(g, r, 0, w, wall, (x) => ground(x) - 6, 5, 12);
    for (let x = 0; x < w; x += 3) { g.fillStyle = lin(g, 0, ground(x) - 34, 0, ground(x), [rgba(C.leafDk, 0), rgba(C.leafDk, 0.7)]); g.fillRect(x, ground(x) - 34, 3, 34); }
    const sea0 = ground(0) - 12;
    g.fillStyle = lin(g, 0, sea0, 0, h, [C.sea[0], C.sea[2], C.sea[4]]); g.fillRect(0, sea0, 118, h - sea0);
    for (let i = 0; i < 60; i++) ell(g, r() * 112, sea0 + 2 + r() * 40, 2 + r() * 6, 0.8, rgba('#FFFFFF', 0.2 + r() * 0.3));
    const edge = S(0) + 138;
    for (const [x0, x1, cols] of [[0, edge, [C.sand[0], C.sand[1], C.sand[2], '#C79A58']], [edge, w, C.dirt]]) {
      g.beginPath(); g.moveTo(x0, h); for (let x = x0; x <= x1; x += 2) g.lineTo(x, ground(x)); g.lineTo(x1, h); g.closePath();
      g.save(); g.clip(); for (let x = x0; x < x1; x += 4) { g.fillStyle = lin(g, 0, ground(x), 0, ground(x) + 130, cols); g.fillRect(x, ground(x) - 1, 4, h); } g.restore();
    }
    for (let x = edge; x < edge + 70; x += 2) { g.fillStyle = rgba(C.sand[1], 0.9 * (1 - (x - edge) / 70)); g.fillRect(x, ground(x), 2, h); }
    for (let i = 0; i < 1500; i++) { const x = r() * w, gy = ground(x), d = 5 + r() * (h - gy - 6); ell(g, x, gy + d, 1.5 + r() * 3, 0.7, x < edge ? rgba('#C79A58', 0.4) : rgba(i % 3 ? C.dirt[3] : C.dirt[0], 0.3)); }
    for (let i = 0; i < 60; i++) { const x = edge + 40 + r() * (w - edge - 60), gy = ground(x) + 5 + r() * 60, s = 2 + r() * 4; ell(g, x, gy, s, s * 0.6, lin(g, 0, gy - s, 0, gy + s, [C.rock[1], C.rock[4]])); }
    for (let x = edge; x < w; x += 2.5) { const gy = ground(x); line(g, [[x, gy + 1], [x + (r() - 0.5) * 3, gy - 2 - r() * 5]], r() > 0.5 ? C.leaf : C.near[1], 1); }
    for (let x = 0; x < w; x += 4) { g.fillStyle = rgba('#FFFFFF', 0.25); g.fillRect(x, ground(x), 4, 1.2); }
    for (let i = 0; i < 4; i++) palapa(g, S(0) - 88 + i * 42, ground(S(0) - 88 + i * 42) + 1);
    palm(g, S(0) + 100, ground(S(0) + 100) + 1, 50);
    for (let i = 0; i < 5; i++) { const hx = S(1) - 112 + i * 50; house(g, hx, ground(hx + 12) + 2, 27, 22, i + 1, i % 2 ? C.pink : C.roof); }
    palm(g, S(1) + 150, ground(S(1) + 150) + 1, 44, -1);
    // the river, down through the jungle and across the trail
    const rx = S(2);
    const rt = Math.round(wall(rx)) + 16;
    g.beginPath(); for (let y = rt; y <= ground(rx); y += 4) g.lineTo(rx - 3 - (y - rt) * 0.07 + Math.sin(y / 11) * 5, y); for (let y = ground(rx); y >= rt; y -= 4) g.lineTo(rx + 3 + (y - rt) * 0.07 + Math.sin(y / 11) * 5, y); g.closePath();
    g.fillStyle = lin(g, 0, rt, 0, ground(rx), [C.water[2], C.water[3]]); g.fill();
    canopy(g, r, rx - 22, rx + 22, () => rt - 8, () => rt + 14, 5, 9);
    for (let y = rt + 10; y < ground(rx); y += 5) ell(g, rx + Math.sin(y / 11) * 5 + (r() - 0.5) * 5, y, 2.4, 0.7, rgba('#FFFFFF', 0.6));
    g.beginPath(); g.moveTo(rx - 34, ground(rx - 34)); g.quadraticCurveTo(rx, ground(rx) + 12, rx + 34, ground(rx + 34)); g.closePath(); g.fillStyle = lin(g, 0, ground(rx) - 4, 0, ground(rx) + 8, [C.water[2], C.water[3]]); g.fill();
    for (let i = 0; i < 5; i++) ell(g, rx - 24 + i * 12, ground(rx) + 2 + (i % 2), 4, 1.8, lin(g, 0, ground(rx), 0, ground(rx) + 4, [C.rock[0], C.rock[3]]));
    const fall = (x, top, wide, seed) => {
      const bottom = ground(x) - 2, cw = wide + 20;
      rockMass(g, [[x - cw, top], [x + cw, top], [x + cw + 16, bottom], [x - cw - 16, bottom]], x - cw - 16, x + cw + 16, seed);
      g.fillStyle = lin(g, x - wide, 0, x + wide, 0, [C.water[2], C.water[0], C.water[1], C.water[2]]); g.fillRect(x - wide, top, wide * 2, bottom - top);
      const q = noise(seed + 1);
      for (let i = 0; i < wide * 4; i++) { const sx = x - wide + q() * wide * 2, sy = top + q() * (bottom - top - 20); line(g, [[sx, sy], [sx, sy + 8 + q() * 22]], rgba('#FFFFFF', 0.35 + q() * 0.4), 0.8 + q(), 'butt'); }
      ell(g, x, bottom + 1, wide + 26, 5, lin(g, 0, bottom - 4, 0, bottom + 6, [C.water[2], C.water[3]]));
      ell(g, x, bottom - 6, wide + 22, 16, rad(g, x, bottom - 4, 2, wide + 22, [rgba('#FFFFFF', 0.85), rgba('#FFFFFF', 0)]));
      canopy(g, q, x - cw - 14, x + cw + 14, () => top - 6, () => top + 12, 7, 9);
    };
    fall(S(3) + 50, 12, 10, 51);
    for (let i = 0; i < 6; i++) palm(g, S(4) - 125 + i * 50, ground(S(4) - 125 + i * 50) + 1, 30 + (i % 3) * 10, i % 2 ? -1 : 1);
    fall(S(5) + 62, 0, 16, 61);
    return c;
  }

  // ---- Paco's Island on foot: the beach to Cascada Ixtalita --------------
  // A walk up from the village beach: past the church plaza, over the river
  // on a footbridge, up mural stairs and a cobblestone lane past craft
  // stalls, to a tall waterfall dropping into a rock pool.
  const TOWN = { w: 3600, h: 290, stopX: (i) => 175 + i * 520, ground: (x) => Math.round(262 - Math.pow(Math.min(1, Math.max(0, x - 320) / 3000), 1.15) * 112) };
  function walker(frame = 0) { return paco('stand', frame); }
  function donkey(g, x, y) {
    const coat = lin(g, 0, y - 30, 0, y - 10, ['#B7A796', '#8C7B6C', '#64574D']);
    for (const lx of [x - 10, x - 5, x + 8, x + 13]) box(g, lx, y - 15, 3, 15, 1.2, '#64574D');
    ell(g, x + 2, y - 20, 15, 8, coat); ell(g, x + 2, y - 15, 10, 3, rgba('#E9E1D5', 0.7));
    poly(g, [[x + 13, y - 24], [x + 19, y - 34], [x + 24, y - 31], [x + 18, y - 20]], coat);
    ell(g, x + 25, y - 31, 6, 4, coat); ell(g, x + 29, y - 30, 2.4, 2.4, '#D9CFC3');
    poly(g, [[x + 20, y - 35], [x + 19, y - 44], [x + 23, y - 36]], '#8C7B6C'); poly(g, [[x + 23, y - 35], [x + 25, y - 43], [x + 26, y - 35]], '#8C7B6C');
    ell(g, x + 24, y - 33, 0.9, 0.9, C.ink); line(g, [[x - 13, y - 22], [x - 17, y - 12]], '#64574D', 1.4);
  }
  function stall(g, x, y, cols, seed) {
    const r = noise(seed);
    for (const px of [x + 2, x + 40]) line(g, [[px, y], [px, y - 30]], C.wood[3], 2, 'butt');
    box(g, x, y - 12, 42, 4, 1, lin(g, 0, y - 12, 0, y - 8, [C.wood[0], C.wood[2]]));
    for (let i = 0; i < 7; i++) ell(g, x + 5 + i * 5.3, y - 14, 2.4, 2, C.coral[Math.floor(r() * 5)]);
    for (let i = 0; i < 4; i++) { const hx = x + 8 + i * 9; line(g, [[hx, y - 29], [hx, y - 25]], C.ink, 0.5); ell(g, hx, y - 23.5, 3.4, 1, C.straw[1]); ell(g, hx, y - 25, 2, 1.6, C.straw[0]); }
    for (let i = 0; i < 6; i++) poly(g, [[x - 3 + i * 8, y - 30], [x + 5 + i * 8, y - 30], [x + 4 + i * 8, y - 36], [x - 2 + i * 8, y - 36]], i % 2 ? '#FFFFFF' : cols);
    for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x + 1 + i * 8, y - 30, 4, 0, Math.PI); g.fillStyle = i % 2 ? '#FFFFFF' : cols; g.fill(); }
  }
  function town() {
    const { w, h, ground } = TOWN, S = TOWN.stopX;
    const [c, g] = canvas(w, h); const r = noise(77);
    skyFill(g, w, h); sun(g, 330, 44);
    for (let x = 90; x < w; x += 280 + r() * 160) cloud(g, x, ground(x) - 200 + r() * 34, 0.9 + r() * 0.4);
    const shape = (top, cols) => { g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 3) g.lineTo(x, top(x)); g.lineTo(w, h); g.closePath(); g.fillStyle = lin(g, 0, 60, 0, h, cols); g.fill(); };
    const back = (x) => ground(x) - 150 + ridgeY(x, 0, 30, 0.010, 0.7), mid = (x) => ground(x) - 92 + ridgeY(x, 0, 20, 0.019, 2.4) + 3 * Math.sin(x * 0.29);
    shape(back, C.far); canopy(g, r, 0, w, back, (x) => ground(x) - 90, 12, 10, 0.45);
    shape(mid, C.mid); canopy(g, r, 0, w, mid, (x) => ground(x) - 40, 7, 11, 0.8);
    // the sea and the beach at the start
    const s0 = ground(0) - 6;
    g.fillStyle = lin(g, 0, s0, 0, h, [C.sea[0], C.sea[2], C.sea[4]]); g.fillRect(0, s0, 92, h - s0);
    for (let i = 0; i < 40; i++) ell(g, r() * 88, s0 + 3 + r() * 24, 2 + r() * 5, 0.8, rgba('#FFFFFF', 0.25 + r() * 0.35));
    panga(g, 18, s0 + 6, C.stripe2); dock(g, 0, s0 - 1, 40);
    // houses up the hillside, two rows deep
    for (let x = S(0) + 150; x < S(5) + 160; x += 34 + r() * 22) {
      if (Math.abs(x - S(2)) < 60 || Math.abs(x - S(1)) < 70) continue;
      house(g, x, ground(x) - 30 - r() * 22, 20 + r() * 6, 14 + r() * 6, Math.floor(r() * 5), r() > 0.7 ? C.pink : C.roof);
    }
    for (let x = S(0) + 130; x < S(5) + 120; x += 46 + r() * 30) {
      if (Math.abs(x - S(2)) < 70 || Math.abs(x - S(1)) < 80 || Math.abs(x - S(3)) < 70) continue;
      house(g, x, ground(x) - 6, 26 + r() * 6, 18 + r() * 8, Math.floor(r() * 5), r() > 0.6 ? C.pink : C.roof);
      if (r() > 0.5) for (let i = 0; i < 9; i++) ell(g, x + r() * 24, ground(x) - 8 - r() * 16, 2.2, 1.8, rgba(C.pink[1], 0.85));
    }
    // the church on the plaza: a white nave and a bell tower with pink trim
    const cx = S(1) + 30, cy = ground(cx) - 4;
    g.fillStyle = lin(g, cx - 30, 0, cx + 30, 0, [C.wall[0], C.wall[1], C.wall[2]]); g.fillRect(cx - 26, cy - 36, 46, 36);
    poly(g, [[cx - 29, cy - 36], [cx + 23, cy - 36], [cx - 3, cy - 52]], lin(g, 0, cy - 52, 0, cy - 36, C.wall));
    box(g, cx - 9, cy - 18, 12, 18, 6, lin(g, 0, cy - 18, 0, cy, ['#8A5530', '#5E3B1A']));
    g.fillStyle = C.pink[1]; g.fillRect(cx - 26, cy - 38, 46, 2);
    const tx = cx + 24;
    g.fillStyle = lin(g, tx, 0, tx + 16, 0, [C.wall[0], C.wall[2]]); g.fillRect(tx, cy - 70, 16, 70);
    g.fillStyle = C.pink[1]; g.fillRect(tx - 1, cy - 50, 18, 2); g.fillRect(tx - 1, cy - 72, 18, 2);
    box(g, tx + 4, cy - 66, 8, 12, 4, '#3B5E7A'); ell(g, tx + 8, cy - 58, 2.6, 2.6, C.sun[2]);
    g.beginPath(); g.ellipse(tx + 8, cy - 72, 8, 7, 0, Math.PI, 0); g.closePath(); g.fillStyle = lin(g, 0, cy - 79, 0, cy - 72, [C.sun[0], C.sun[2]]); g.fill();
    line(g, [[tx + 8, cy - 79], [tx + 8, cy - 87]], C.ink, 1); line(g, [[tx + 5, cy - 84], [tx + 11, cy - 84]], C.ink, 1);
    for (let x = S(1) - 90; x < S(1) + 90; x += 6) { g.fillStyle = rgba(x % 12 ? '#F3E6CF' : '#E6D3B4', 0.9); g.fillRect(x, ground(x) - 1, 6, 4); }
    ell(g, S(1) - 52, ground(S(1) - 52) - 30, 20, 16, rgba(C.leafDk, 0.5)); ell(g, S(1) - 55, ground(S(1) - 52) - 33, 17, 13, C.leaf); ell(g, S(1) - 59, ground(S(1) - 52) - 38, 9, 7, C.leafHi);
    line(g, [[S(1) - 52, ground(S(1) - 52)], [S(1) - 52, ground(S(1) - 52) - 18]], C.wood[3], 3, 'butt');
    // the path: sand at the beach, then cobblestones
    const edge = S(0) + 120;
    g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 2) g.lineTo(x, ground(x)); g.lineTo(w, h); g.closePath();
    g.save(); g.clip();
    // a band of path, then a planted bank below it
    for (let x = 0; x < w; x += 4) {
      if (x < edge) { g.fillStyle = lin(g, 0, ground(x), 0, ground(x) + 60, C.sand); g.fillRect(x, ground(x) - 1, 4, h); continue; }
      g.fillStyle = lin(g, 0, ground(x), 0, ground(x) + 16, [C.dirt[0], C.dirt[1]]); g.fillRect(x, ground(x) - 1, 4, 18);
      g.fillStyle = lin(g, 0, ground(x) + 16, 0, ground(x) + 90, C.near); g.fillRect(x, ground(x) + 16, 4, h);
    }
    for (let i = 0; i < 1600; i++) { const x = edge + r() * (w - edge), gy = ground(x) + 2 + r() * 12; ell(g, x, gy, 2.6 + r() * 1.6, 1.4 + r() * 0.6, lin(g, 0, gy - 2, 0, gy + 2, [C.rock[0], C.rock[2]])); }
    for (let x = edge; x < w; x += 4) { g.fillStyle = rgba(C.rock[3], 0.6); g.fillRect(x, ground(x) + 15, 4, 2); }
    canopy(g, r, edge, w, (x) => ground(x) + 18, (x) => ground(x) + 60, 6, 9);
    g.restore();
    for (let x = edge; x < edge + 60; x += 2) { g.fillStyle = rgba(C.sand[1], 0.9 * (1 - (x - edge) / 60)); g.fillRect(x, ground(x), 2, 24); }
    for (let x = 0; x < w; x += 4) { g.fillStyle = rgba('#FFFFFF', 0.28); g.fillRect(x, ground(x), 4, 1.2); }
    for (let i = 0; i < 3; i++) palapa(g, S(0) - 70 + i * 44, ground(S(0) - 70 + i * 44) + 1);
    palm(g, S(0) + 96, ground(S(0) + 96) + 1, 46);
    // the river, down from the hills and under a footbridge
    const rx = S(2), rt = Math.round(mid(rx)) + 10, rg = ground(rx);
    g.beginPath(); for (let y = rt; y <= h; y += 4) g.lineTo(rx - 4 - (y - rt) * 0.12 + Math.sin(y / 13) * 4, y); for (let y = h; y >= rt; y -= 4) g.lineTo(rx + 4 + (y - rt) * 0.12 + Math.sin(y / 13) * 4, y); g.closePath();
    g.fillStyle = lin(g, 0, rt, 0, h, [C.water[2], C.water[3], C.sea[3]]); g.fill();
    for (let y = rt + 8; y < h; y += 5) ell(g, rx + Math.sin(y / 13) * 4 + (r() - 0.5) * 8, y, 2.6, 0.7, rgba('#FFFFFF', 0.6));
    canopy(g, r, rx - 30, rx + 30, () => rt - 10, () => rt + 12, 6, 9);
    g.beginPath(); g.moveTo(rx - 44, rg + 1); g.quadraticCurveTo(rx, rg - 12, rx + 44, rg + 1); g.lineTo(rx + 44, rg + 6); g.quadraticCurveTo(rx, rg - 6, rx - 44, rg + 6); g.closePath();
    g.fillStyle = lin(g, 0, rg - 12, 0, rg + 6, [C.wood[0], C.wood[2]]); g.fill();
    for (let x = rx - 40; x <= rx + 40; x += 8) { const by = rg - 12 * (1 - ((x - rx) / 44) ** 2); line(g, [[x, by + 1], [x, by - 9]], C.wood[3], 1.4, 'butt'); }
    g.beginPath(); for (let x = rx - 42; x <= rx + 42; x += 2) g.lineTo(x, rg - 9 - 12 * (1 - ((x - rx) / 44) ** 2)); g.strokeStyle = C.wood[2]; g.lineWidth = 1.6; g.stroke();
    // mural stairs: tiled steps in bright colors, and a mural on the wall
    const mx = S(3);
    const wallTop = ground(mx) - 46;
    g.fillStyle = lin(g, mx - 70, 0, mx + 70, 0, ['#FFF2BD', '#FBE38F']); g.fillRect(mx - 70, wallTop, 140, ground(mx) - wallTop);
    ell(g, mx - 40, wallTop + 20, 14, 14, rad(g, mx - 40, wallTop + 20, 2, 14, [C.sun[0], C.sun[2], '#F28C28']));
    for (let a = 0; a < 10; a++) { const t = a / 10 * TAU; line(g, [[mx - 40 + Math.cos(t) * 16, wallTop + 20 + Math.sin(t) * 16], [mx - 40 + Math.cos(t) * 21, wallTop + 20 + Math.sin(t) * 21]], '#F28C28', 2); }
    for (const [fx, fy, col] of [[mx + 4, wallTop + 16, C.coral[0]], [mx + 28, wallTop + 26, C.coral[4]], [mx + 50, wallTop + 14, '#22AEC4']]) { ell(g, fx, fy, 9, 5, col); poly(g, [[fx - 8, fy], [fx - 15, fy - 5], [fx - 15, fy + 5]], col); ell(g, fx + 4, fy - 1, 1.2, 1.2, C.ink); }
    for (let x = mx - 70; x < mx + 70; x += 7) { g.fillStyle = C.coral[Math.floor((x - mx) / 7 + 20) % 5]; g.fillRect(x, wallTop + 36, 7, 3); }
    for (let i = 0; i < 9; i++) { const sx = mx - 64 + i * 15, sy = ground(sx); g.fillStyle = C.coral[i % 5]; g.fillRect(sx, sy, 15, 3.4); g.fillStyle = rgba('#FFFFFF', 0.5); g.fillRect(sx, sy, 15, 0.9); }
    // a donkey tied by the lane, and bougainvillea over the walls
    donkey(g, S(4) - 40, ground(S(4) - 40) + 1); line(g, [[S(4) - 64, ground(S(4) - 64)], [S(4) - 64, ground(S(4) - 64) - 20]], C.wood[3], 2.4, 'butt');
    for (let i = 0; i < 40; i++) { const bx = S(4) + 20 + r() * 120; ell(g, bx, ground(bx) - 26 - r() * 14, 2.4, 2, rgba(C.pink[1 + (i % 2)], 0.9)); }
    // craft stalls along the last stretch
    stall(g, S(5) - 96, ground(S(5) - 96), C.pink[1], 91); stall(g, S(5) - 30, ground(S(5) - 30), '#22AEC4', 92); stall(g, S(5) + 36, ground(S(5) + 36), C.sun[2], 93);
    // Cascada Ixtalita: a tall fall off a jungle cliff into a rock pool
    const fx = S(6) + 110, ftop = 6, fbot = ground(fx) - 4, fw = 12;
    rockMass(g, [[fx - 70, ftop], [fx + 120, ftop], [fx + 140, fbot + 6], [fx - 96, fbot + 6]], fx - 96, fx + 140, 71);
    canopy(g, r, fx - 90, fx + 140, () => ftop - 4, () => ftop + 14, 6, 10);
    for (let y = ftop; y < fbot - 20; y += 9) { canopy(g, r, fx - 100 + (y - ftop) * 0.14, fx - 72 + (y - ftop) * 0.14, () => y, () => y + 6, 6, 8); canopy(g, r, fx + 112 + (y - ftop) * 0.12, fx + 140, () => y, () => y + 6, 6, 8); }
    g.fillStyle = lin(g, fx - fw, 0, fx + fw, 0, [C.water[2], C.water[0], C.water[1], C.water[2]]); g.fillRect(fx - fw, ftop + 4, fw * 2, fbot - ftop - 4);
    const q = noise(72);
    for (let i = 0; i < 90; i++) { const sx = fx - fw + q() * fw * 2, sy = ftop + 6 + q() * (fbot - ftop - 30); line(g, [[sx, sy], [sx, sy + 10 + q() * 26]], rgba('#FFFFFF', 0.35 + q() * 0.45), 0.8 + q(), 'butt'); }
    ell(g, fx, fbot + 4, 70, 9, lin(g, 0, fbot - 5, 0, fbot + 13, [C.water[2], C.water[3], C.sea[3]]));
    ell(g, fx, fbot - 6, fw + 30, 20, rad(g, fx, fbot - 4, 2, fw + 30, [rgba('#FFFFFF', 0.9), rgba('#FFFFFF', 0)]));
    for (let i = 0; i < 8; i++) { const bx = fx - 72 + i * 20; ell(g, bx, fbot + 9 + (i % 2) * 2, 6, 3, lin(g, 0, fbot + 6, 0, fbot + 12, [C.rock[0], C.rock[3]])); }
    for (let i = 0; i < 5; i++) palm(g, S(4) + 160 + i * 64, ground(S(4) + 160 + i * 64) + 1, 34 + (i % 2) * 10, i % 2 ? -1 : 1);
    return c;
  }

  // ---- under the bay: surface to the canyon floor -----------------------
  const DEEP = { w: 480, h: 1875, surface: 75, bottom: 1800 };
  const FULL = typeof Engine !== 'undefined' ? Engine.FULL_DAY : 66000;
  DEEP.yForScore = (s) => DEEP.surface + (DEEP.bottom - DEEP.surface) * Math.min(1, s / FULL);
  DEEP.yForDepth = (d) => DEEP.yForScore(FULL * Math.sqrt(d / 1400));
  function fish(g, x, y, col, size, left) {
    const d = left ? -1 : 1;
    poly(g, [[x - d * size * 0.45, y], [x - d * size * 0.95, y - size * 0.32], [x - d * size * 0.95, y + size * 0.32]], col);
    ell(g, x, y, size * 0.55, size * 0.26, lin(g, 0, y - size * 0.26, 0, y + size * 0.26, [rgba('#FFFFFF', 0.9), col, col]));
    ell(g, x, y, size * 0.55, size * 0.26, rgba(col, 0.55));
    ell(g, x + d * size * 0.32, y - size * 0.05, 0.8, 0.8, C.ink);
  }
  function kelp(g, x, y, hgt, ph, col) { g.beginPath(); g.moveTo(x, y); for (let i = 0; i <= hgt; i += 3) g.lineTo(x + Math.sin(i / 7 + ph) * 3.4, y - i); g.strokeStyle = col; g.lineWidth = 2.4; g.lineCap = 'round'; g.stroke(); }
  function coralAt(g, r, x, y, col) {
    if (r() > 0.5) { for (let k = -2; k <= 2; k++) line(g, [[x, y], [x + k * 2.6, y - 7 - r() * 6]], col, 1.8); }
    else { const s = 3 + r() * 3.5; ell(g, x, y - s * 0.6, s, s * 0.8, rad(g, x - 1, y - s, 0.5, s * 1.2, [rgba('#FFFFFF', 0.7), col])); ell(g, x, y - s * 0.6, s, s * 0.8, rgba(col, 0.5)); }
  }
  function deep() {
    const { w, h, surface, bottom } = DEEP;
    const [c, g] = canvas(w, h); const r = noise(31);
    skyFill(g, w, surface);
    g.fillStyle = lin(g, 0, surface, 0, h, C.deep); g.fillRect(0, surface, w, h - surface);
    for (let k = 0; k < 6; k++) { const x0 = 20 + k * 80 + r() * 20; poly(g, [[x0, surface], [x0 + 16 + r() * 14, surface], [x0 + 110, surface + 300], [x0 + 60, surface + 300]], lin(g, 0, surface, 0, surface + 300, [rgba('#E6FFFA', 0.28), rgba('#E6FFFA', 0)])); }
    for (let x = 0; x < w; x += 5) ell(g, x + r() * 3, surface + r(), 3.4, 1, rgba('#FFFFFF', 0.85));
    for (let i = 0; i < 80; i++) ell(g, r() * w, surface + 4 + r() * 30, 3 + r() * 8, 0.9, rgba('#E6FFFA', 0.25));
    // Peñas Cantoras from below, with the reef on its flank
    const foot = DEEP.yForDepth(45), side = [[w, surface - 50]];
    for (let y = surface - 50; y <= foot; y += 12) side.push([w - 70 - Math.sin(y / 14) * 8 - Math.max(0, (y - surface) / 2.4), y]);
    side.push([w - 190, foot + 12], [w - 120, foot + 40], [w, foot + 70]);
    rockMass(g, side, w - 230, w, 33);
    g.save(); poly(g, side); g.clip(); g.fillStyle = lin(g, 0, surface, 0, foot + 70, [rgba(C.deep[2], 0), rgba(C.deep[5], 0.7)]); g.fillRect(w - 240, surface, 240, foot + 70 - surface); g.restore();
    const reefY = DEEP.yForDepth(12);
    for (let i = 0; i < 70; i++) { const cy = reefY - 26 + r() * 60; coralAt(g, r, w - 96 - (cy - surface) / 2.4 + r() * 30, cy, C.coral[i % 5]); }
    // the old ferry wreck
    const wy = DEEP.yForDepth(41);
    poly(g, [[0, wy - 6], [40, wy], [262, wy + 1], [292, wy + 12], [268, wy + 26], [0, wy + 36]], lin(g, 0, wy - 6, 0, wy + 36, ['#4F7078', '#2C4A58', '#163444']));
    poly(g, [[48, wy - 22], [244, wy - 26], [256, wy - 12], [236, wy + 2], [70, wy + 2]], lin(g, 0, wy - 26, 0, wy + 2, ['#6E8A8C', '#3F5C66', '#24404E']));
    poly(g, [[90, wy - 24], [176, wy - 26], [172, wy - 46], [94, wy - 44]], lin(g, 0, wy - 46, 0, wy - 24, ['#86A3A0', '#4B6B72']));
    box(g, 122, wy - 68, 20, 24, 2, lin(g, 122, 0, 142, 0, ['#8FA9A4', '#4B6B72'])); line(g, [[132, wy - 68], [132, wy - 86]], '#4B6B72', 2);
    for (let x = 64; x < 240; x += 18) ell(g, x, wy - 11, 2.6, 2.6, rad(g, x, wy - 11, 0.2, 2.8, [C.deep[7], '#1B3440']));
    for (let x = 100; x < 170; x += 14) { g.fillStyle = rgba(C.deep[7], 0.7); g.fillRect(x, wy - 40, 8, 8); }
    for (let i = 0; i < 40; i++) ell(g, 52 + r() * 196, wy - 24 + r() * 24, 2 + r() * 5, 1 + r() * 2, rgba(i % 2 ? '#3FA86A' : '#C9621E', 0.3));
    for (let i = 0; i < 10; i++) kelp(g, 60 + i * 21, wy - 22 - (i > 1 && i < 6 ? 22 : 0), 22 + r() * 16, i, i % 2 ? '#3FA86A' : '#2A7D4C');
    // the deep reef
    const dy = DEEP.yForDepth(60);
    poly(g, [[0, dy + 8], [210, dy + 14], [276, dy + 24], [250, dy + 38], [0, dy + 46]], lin(g, 0, dy + 8, 0, dy + 46, ['#3F5C66', '#24404E', '#12303E']));
    for (let i = 0; i < 46; i++) { const x = 10 + r() * 240; if (i % 3) kelp(g, x, dy + 18, 10 + r() * 20, i, i % 2 ? '#3FA86A' : '#2A7D4C'); else coralAt(g, r, x, dy + 18, C.coral[i % 5]); }
    // the canyon walls, closing in
    const cy0 = DEEP.yForDepth(300);
    for (const sgn of [-1, 1]) {
      const pts = [[sgn < 0 ? 0 : w, cy0 - 30]];
      for (let y = cy0 - 30; y <= h; y += 14) { const t = Math.max(0, (y - cy0) / (h - cy0)); const lw = Math.min(1, (y - cy0 + 30) / 90) * (16 + t * 150 + Math.sin(y / 19 + sgn) * 9 + (sgn > 0 ? 16 : 0)); pts.push([sgn < 0 ? lw : w - lw, y]); }
      pts.push([sgn < 0 ? 0 : w, h]);
      poly(g, pts, lin(g, sgn < 0 ? 0 : w, 0, sgn < 0 ? 170 : w - 190, 0, ['#03202F', '#08384E']));
      g.beginPath(); pts.slice(1, -1).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.strokeStyle = rgba('#4FB4C8', 0.35); g.lineWidth = 1.6; g.stroke();
      g.save(); poly(g, pts); g.clip(); const q = noise(70 + sgn); for (let i = 0; i < 120; i++) { const y = cy0 + q() * (h - cy0); line(g, [[sgn < 0 ? 0 : w - 200, y], [sgn < 0 ? 200 : w, y + (q() - 0.5) * 12]], rgba(i % 2 ? '#000A14' : '#1A5870', 0.22), 1 + q() * 2); } g.restore();
    }
    g.fillStyle = lin(g, 0, bottom - 6, 0, h, ['#7A6648', '#5A4A33', '#3A2F22']); g.beginPath(); g.moveTo(0, h); for (let x = 0; x <= w; x += 8) g.lineTo(x, bottom + Math.sin(x / 23) * 3); g.lineTo(w, h); g.closePath(); g.fill();
    for (let i = 0; i < 70; i++) ell(g, r() * w, bottom + 6 + r() * 60, 2 + r() * 4, 0.9, rgba('#9A8460', 0.5));
    for (let i = 0; i < 50; i++) {
      const fy = surface + 40 + r() * (bottom - surface - 110), fx = 26 + r() * (w - 80);
      const col = fy < 620 ? [C.coral[2], C.coral[3], '#FFFFFF', C.coral[0]][i % 4] : fy < 1250 ? '#5FC9D8' : '#3E8FA0';
      fish(g, fx, fy, col, 9 + (i % 4) * 3, i % 2 === 0);
    }
    for (let i = 0; i < 110; i++) { const x = r() * w, y = 900 + r() * (bottom - 920), s = 2 + r() * 3; ell(g, x, y, s, s, rad(g, x, y, 0.2, s, [rgba('#8FF5F0', 0.75), rgba('#8FF5F0', 0)])); }
    return c;
  }

  return { C, setRider, paco, mario, parrot, boat, atv, diver, walker, icon, coast, hill, town, deep, COAST, HILL, TOWN, DEEP };
})();
