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
    else if (trip === 'fly') { g.fillStyle = lin(g, 0, 0, 0, 56, ['#3FA9E6', '#84D0EE', '#D6F3F1']); g.fillRect(0, 0, 96, 56); cloud(g, 20, 44, 0.5); cloud(g, 80, 14, 0.4); g.drawImage(flier(0), 8, 2, 80, 52); }
    else if (trip === 'market') {
      g.fillStyle = lin(g, 0, 0, 0, 56, ['#08142F', '#1D3A6E']); g.fillRect(0, 0, 96, 56);
      for (const [sx, sy] of [[8, 6], [30, 3], [70, 5], [88, 10], [52, 9]]) ell(g, sx, sy, 0.7, 0.7, '#FFFFFF');
      facade(g, -4, 50, 52, 46, ['#8C6E7A', '#7A5E6C', '#664E5C'], '#1E6F86'); facade(g, 48, 50, 52, 46, ['#8C8466', '#7A7356', '#665F46'], '#8E2E5C');
      for (const wx of [13, 65]) { ell(g, wx, 22, 12, 12, rad(g, wx, 22, 0, 12, [rgba('#FFC86B', 0.45), rgba('#FFC86B', 0)])); box(g, wx - 9, 12, 18, 20, 3, lin(g, 0, 12, 0, 32, ['#FFF1C2', '#E8963A'])); }
      g.beginPath(); g.moveTo(-4, 4); g.quadraticCurveTo(48, 16, 100, 4); g.strokeStyle = rgba('#FFFFFF', 0.4); g.lineWidth = 0.6; g.stroke();
      for (let t = 0.05; t < 1; t += 0.1) { const bx = -4 + 104 * t, by = 4 + 24 * t * (1 - t); ell(g, bx, by, 4, 4, rad(g, bx, by, 0, 4, [rgba('#FFE9A8', 0.6), rgba('#FFE9A8', 0)])); ell(g, bx, by, 1.1, 1.1, '#FFF6D6'); }
      g.fillStyle = lin(g, 0, 48, 0, 56, ['#6E6452', '#57503F']); g.fillRect(0, 48, 96, 8);
      g.drawImage(walker(0), 14, 10, 66, 40);
    }
    else if (trip === 'cafe') { g.fillStyle = lin(g, 0, 0, 0, 30, [C.sky[1], C.sky[4]]); g.fillRect(0, 0, 96, 30); g.fillStyle = lin(g, 0, 30, 0, 40, [C.sea[1], C.sea[3]]); g.fillRect(0, 30, 96, 10); g.fillStyle = lin(g, 0, 40, 0, 56, [C.sand[0], C.sand[2]]); g.fillRect(0, 40, 96, 16); g.save(); g.translate(56, 2); g.scale(0.6, 0.6); drawMaria(g); g.restore(); g.drawImage(treat('jamaica', 0.6), 6, 18); }
    else if (trip === 'deliver') { g.fillStyle = lin(g, 0, 0, 0, 56, [C.sky[1], C.sky[4]]); g.fillRect(0, 0, 96, 56); g.fillStyle = lin(g, 0, 46, 0, 56, ['#D9C7A8', '#A08B6A']); g.fillRect(0, 46, 96, 10); g.drawImage(tio(0), 2, 4, 92, 59); }
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
  // The welcome sign where the walk leaves the beach: painted planks on two
  // posts, "Bienvenidos a Isla de Paco" on top, welcome in four more
  // languages, and an arrow plank up the path. x is its center, base the
  // ground. About 70 x 94.
  function welcomeSign(g, x, base) {
    for (const px of [x - 24, x + 24]) { g.fillStyle = lin(g, px - 2, 0, px + 2, 0, C.wood); g.fillRect(px - 2, base - 92, 4, 92); }
    // (the planks below are drawn over the posts)
    const plank = (y0, ph, w0, col, cut = true) => {
      g.beginPath(); g.moveTo(x - w0 / 2 + (cut ? 3 : 0), y0); g.lineTo(x + w0 / 2 - (cut ? 3 : 0), y0); g.lineTo(x + w0 / 2, y0 + 3); g.lineTo(x + w0 / 2, y0 + ph - 3); g.lineTo(x + w0 / 2 - (cut ? 3 : 0), y0 + ph); g.lineTo(x - w0 / 2 + (cut ? 3 : 0), y0 + ph); g.lineTo(x - w0 / 2, y0 + ph - 3); g.lineTo(x - w0 / 2, y0 + 3); g.closePath();
      g.fillStyle = col; g.fill(); g.strokeStyle = rgba(C.ink, 0.25); g.lineWidth = 0.5; g.stroke();
      g.fillStyle = rgba('#FFFFFF', 0.18); g.fillRect(x - w0 / 2 + 2, y0 + 1, w0 - 4, 1);
    };
    const say = (text, y0, font, fill, edge) => { g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.strokeStyle = edge; g.lineWidth = 1.6; g.strokeText(text, x, y0); g.fillStyle = fill; g.fillText(text, x, y0); };
    const top = base - 94;
    plank(top, 24, 70, '#E9F4FA');
    say('Bienvenidos', top + 8, 'italic bold 10px Georgia, serif', '#3F8FD2', '#F7B7C4');
    say('a Isla de Paco', top + 18, 'bold 7.5px Georgia, serif', '#C21A68', '#FFFFFF');
    const rows = [['Bienvenue', '#3F9A3E', '#FFC2D8'], ['Willkommen', '#FFE58F', '#C21A1A'], ['Welcome', '#B5124F', '#D6F27A'], ['Benvenuto', '#F4FBE9', '#137FA0']];
    rows.forEach(([word, col, ink], k) => { const y0 = top + 26 + k * 12; plank(y0, 11, 64, col); say(word, y0 + 6, 'bold 8.5px Georgia, serif', ink, rgba(C.ink, col === '#FFE58F' || col === '#F4FBE9' ? 0.15 : 0.55)); });
    // the arrow plank, pointing left, up the path
    const ay = top + 76;
    g.beginPath(); g.moveTo(x - 38, ay + 6); g.lineTo(x - 28, ay - 1); g.lineTo(x - 28, ay + 1); g.lineTo(x + 33, ay + 1); g.lineTo(x + 33, ay + 11); g.lineTo(x - 28, ay + 11); g.lineTo(x - 28, ay + 13); g.closePath();
    g.fillStyle = '#F07AA6'; g.fill(); g.strokeStyle = rgba(C.ink, 0.25); g.lineWidth = 0.5; g.stroke();
    g.font = 'italic bold 6.5px Georgia, serif'; g.textAlign = 'left'; g.textBaseline = 'middle'; g.fillStyle = '#FFE58F'; g.fillText('Cascada · Pueblo', x - 23, ay + 6.4);
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
    welcomeSign(g, S(0) + 78, ground(S(0) + 78) + 1);
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
  // ---- Esmeralda's flight: over the bay to her nest ---------------------
  // Esmeralda carries the rider high over the coast from the boat trip,
  // which is drawn at half size below, and lands at her nest in a ceiba
  // tree on Paco's Island. The strip is 2400 x 240.
  const FLIGHT = {
    w: 2400, h: 240,
    // the boat trip's places, halved, then the nest
    stopX: (i) => [121, 362, 587, 1087, 1337, 1837, 2150][i],
    ground: (x) => Math.round(84 + 14 * Math.sin(x / 170) - Math.max(0, x - 1950) * 0.02),
  };
  // Esmeralda in flight, facing right, with the rider on her back. 86 x 56.
  function flier(frame = 0) {
    const [c, g] = canvas(86, 56);
    const G = ['#D6F26A', '#9BD43C', '#6DB52E', '#3F8A2A', '#22562A'], B = ['#9EE6F0', '#3FB6D8', '#1E7FB0'];
    const up = frame === 0;
    const wing = (near) => {
      const tip = up ? [[30, 2], [44, 0]] : [[26, 52], [46, 50]];
      g.beginPath(); g.moveTo(40, 27); g.lineTo(tip[0][0], tip[0][1]); g.quadraticCurveTo(38, up ? 6 : 46, tip[1][0], tip[1][1]); g.lineTo(52, 27); g.closePath();
      g.fillStyle = lin(g, 0, up ? 2 : 52, 0, 27, near ? [B[1], [0.45, G[2]], G[1]] : [B[2], [0.45, G[3]], G[2]]); g.fill();
      for (let k = 0; k < 4; k++) line(g, [[42 + k * 2.4, 27], [32 + k * 3.4, up ? 6 : 48]], rgba(G[4], 0.3), 0.6);
    };
    g.save(); g.translate(0, 0);
    wing(false);
    // tail: long, red with a blue tip, as on the great green macaw
    poly(g, [[30, 27], [30, 31], [2, 40], [4, 34]], lin(g, 2, 0, 30, 0, [B[1], [0.35, '#E8221C'], G[2]]));
    ell(g, 44, 29, 17, 7.5, lin(g, 0, 21, 0, 37, [G[0], G[1], G[2], G[3]]));
    ell(g, 63, 23, 8, 7, lin(g, 0, 16, 0, 30, [G[0], G[1], G[2]]));
    ell(g, 68.5, 18, 4.2, 3, lin(g, 0, 15, 0, 21, ['#FF6A4D', '#E8221C']), 0.3);
    ell(g, 66, 24, 3.6, 3.6, lin(g, 0, 20, 0, 28, ['#FAD3DD', '#E7A9BC']));
    for (let i = 0; i < 3; i++) line(g, [[63.5, 22.6 + i * 1.3], [68.4, 23 + i * 1.2]], rgba(C.ink, 0.45), 0.35);
    ell(g, 65, 21.4, 1.4, 1.4, '#FFF4C7'); ell(g, 65.3, 21.4, 0.85, 0.95, C.ink);
    g.beginPath(); g.moveTo(69.5, 19.5); g.quadraticCurveTo(78, 19.6, 77, 28.4); g.quadraticCurveTo(74.6, 25.6, 70, 27); g.closePath();
    g.fillStyle = lin(g, 70, 19, 77, 28, ['#6E7680', '#3A4048', '#1E2328']); g.fill();
    // the rider, small, on her back
    g.save(); g.translate(26, 4); g.scale(0.42, 0.42); drawPaco(g, 0, 0, 'stand', 0); g.restore();
    wing(true);
    g.restore();
    return rim(c);
  }
  function nestTree(g, x, base) {
    // a ceiba: a straight pale trunk, buttress roots and a flat wide crown
    poly(g, [[x - 16, base], [x - 5, base - 26], [x - 5, base - 118], [x + 5, base - 118], [x + 5, base - 26], [x + 16, base]], lin(g, x - 16, 0, x + 16, 0, ['#D9D2C4', '#B9B0A0', '#8E8576']));
    for (const [bx, by, rx] of [[x - 34, base - 124, 26], [x, base - 132, 34], [x + 34, base - 124, 26], [x - 14, base - 140, 22], [x + 18, base - 142, 22]]) { ell(g, bx, by + 3, rx, 9, rgba(C.leafDk, 0.5)); ell(g, bx, by, rx, 8, lin(g, 0, by - 8, 0, by + 8, [C.leafHi, C.leaf, '#3B8E38'])); }
    // the nest on top
    ell(g, x + 2, base - 150, 15, 6, lin(g, 0, base - 156, 0, base - 144, C.straw));
    for (let i = 0; i < 9; i++) line(g, [[x - 11 + i * 3, base - 153], [x - 8 + i * 3, base - 146]], rgba(C.straw[3], 0.7), 0.7);
  }
  function flight() {
    const { w, h } = FLIGHT, S = FLIGHT.stopX;
    const [c, g] = canvas(w, h); const r = noise(41);
    const skyGrad = () => lin(g, 0, 0, 0, h, ['#2F98DE', '#4FB2E8', '#7FCBEE', '#B4E3F2', '#DDF3F1']);
    g.fillStyle = skyGrad(); g.fillRect(0, 0, w, h);
    sun(g, 300, 40);
    // the coast far below: the boat trip's strip, from its hills down, at half size
    const coastCanvas = coast(), sy = 26, top = h - (COAST.h - sy) / 2;
    g.drawImage(coastCanvas, 0, sy, COAST.w, COAST.h - sy, 0, top, COAST.w / 2, (COAST.h - sy) / 2);
    // fade the far end of the coast into the sky, so it has no hard edge
    g.fillStyle = skyGrad();
    for (let x = COAST.w / 2 - 90; x < COAST.w / 2; x += 2) { g.globalAlpha = (x - COAST.w / 2 + 90) / 90; g.fillRect(x, top - 2, 2, 60); }
    g.globalAlpha = 1;
    // open sea past the end of the coast, under Paco's Island
    g.fillStyle = lin(g, 0, top + 57, 0, h, [C.sea[1], C.sea[3], C.sea[5]]); g.fillRect(COAST.w / 2 - 2, top + 57, w, h - top - 57);
    // haze that fades in from the sky, so the ground reads as far below
    g.fillStyle = lin(g, 0, top, 0, h, [rgba('#DDF3F1', 0), [0.3, rgba('#DDF3F1', 0.45)], rgba('#DDF3F1', 0.12)]); g.fillRect(0, top, w, h - top);
    // Paco's Island rises at the end, with the ceiba and the nest
    g.beginPath(); g.moveTo(1880, h); g.quadraticCurveTo(1960, 150, 2150, 158); g.quadraticCurveTo(2300, 162, w, 180); g.lineTo(w, h); g.closePath();
    g.fillStyle = lin(g, 0, 150, 0, h, C.near); g.fill();
    canopy(g, r, 1920, w, (x) => 158 + Math.abs(x - 2150) * 0.12, () => h, 7, 9);
    nestTree(g, S(6), 228);
    // clouds at flying height, some in front of the ground
    for (let x = 60; x < w; x += 210 + r() * 160) cloud(g, x, 40 + r() * 70, 0.7 + r() * 0.7);
    for (let i = 0; i < 18; i++) bird(g, 100 + r() * (w - 200), 120 + r() * 40);
    return c;
  }

  // ---- the night market in Pueblo Tilmeca -------------------------------
  // A market street at night, seen close up: places to eat all along it,
  // a taco cart, a girl selling empanadas, a corner bar and other bars,
  // clothing and souvenir shops, papel picado and strings of bulbs
  // overhead, and the church at the end. The street is drawn on its own
  // layer, darkened to moonlight and laid over a starry sky, then lit. The
  // shops have a layer of their own so their goods show inside the light:
  // outsides in moonlight, then lit insides, then what stands out front.
  // 3600 x 240.
  const MARKET = { w: 3600, h: 240, stopX: (i) => 175 + i * 520, ground: () => 214 };
  const PAPEL = ['#F0478F', '#FFC43A', '#22AEC4', '#8ED04A', '#F28C28', '#B77BE0'];
  function facade(g, x, y, w, h, wall, trim, lights) {
    g.fillStyle = lin(g, x, 0, x + w, 0, [wall[0], [0.6, wall[1]], wall[2]]); g.fillRect(x, y - h, w, h);
    g.fillStyle = trim; g.fillRect(x - 2, y - h - 5, w + 4, 6); g.fillRect(x, y - 8, w, 3);
    const doors = Math.max(1, Math.floor(w / 44));
    for (let i = 0; i < doors; i++) {
      const dx = x + (w / doors) * (i + 0.5);
      box(g, dx - 9, y - 36, 18, 36, 9, lin(g, 0, y - 36, 0, y, ['#8A5530', '#5E3B1A']));
      box(g, dx - 9, y - h + 12, 18, 20, 3, lin(g, 0, y - h + 12, 0, y - h + 32, ['#9ED8EA', '#2B6E8F']));
      if (lights) { lights.push(['window', dx - 9, y - h + 12, 18, 20]); if ((x + i) % 3 !== 1) lights.push(['door', dx - 9, y - 36, 18, 36]); }
      for (const sx of [dx - 15, dx + 9]) { g.fillStyle = trim; g.fillRect(sx, y - h + 12, 6, 20); }
      for (let k = 0; k < 4; k++) ell(g, dx - 7 + k * 4.6, y - h + 33, 2.4, 2, PAPEL[(k + i) % PAPEL.length]);
    }
  }
  function papelPicado(g, x0, x1, y, seed) {
    const r = noise(seed);
    g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo((x0 + x1) / 2, y + 12, x1, y); g.strokeStyle = rgba(C.ink, 0.5); g.lineWidth = 0.6; g.stroke();
    for (let x = x0 + 6; x < x1 - 8; x += 13) {
      const t = (x - x0) / (x1 - x0), fy = y + 12 * 4 * t * (1 - t) * 0.5 + 1, col = PAPEL[Math.floor(r() * PAPEL.length)];
      g.beginPath(); g.moveTo(x, fy); g.lineTo(x + 10, fy); g.lineTo(x + 10, fy + 11); for (let k = 4; k >= 0; k--) g.lineTo(x + k * 2.5, fy + (k % 2 ? 9 : 12)); g.closePath();
      g.fillStyle = rgba(col, 0.92); g.fill();
      ell(g, x + 5, fy + 5, 1.6, 1.6, rgba('#FFFFFF', 0.55));
    }
  }
  function market() {
    const { w, h } = MARKET, S = MARKET.stopX, y = MARKET.ground();
    const [c, sky] = canvas(w, h); const r = noise(55);
    sky.fillStyle = lin(sky, 0, 0, 0, h, ['#08142F', '#102350', '#1D3A6E', '#2E5585']); sky.fillRect(0, 0, w, h);
    for (let k = 0; k < 520; k++) { const sx = r() * w, sy2 = r() * 120, sr = r() < 0.08 ? 1.1 : 0.55; ell(sky, sx, sy2, sr, sr, rgba('#FFFFFF', 0.45 + r() * 0.5)); }
    ell(sky, 420, 40, 60, 60, rad(sky, 420, 40, 8, 60, [rgba('#E9F1FF', 0.35), rgba('#E9F1FF', 0)]));
    ell(sky, 420, 40, 13, 13, rad(sky, 416, 36, 1, 14, ['#FFFFFF', '#E3EAF5', '#BCC9DC']));
    ell(sky, 424, 37, 2.6, 2.2, rgba('#9FB0C8', 0.5)); ell(sky, 416, 45, 1.8, 1.6, rgba('#9FB0C8', 0.45));
    const [d, g] = canvas(w, h), lights = [];
    // hills behind the town
    g.beginPath(); g.moveTo(0, 120); for (let x = 0; x <= w; x += 4) g.lineTo(x, ridgeY(x, 96, 30, 0.006, 1.3)); g.lineTo(w, 140); g.lineTo(0, 140); g.closePath(); g.fillStyle = lin(g, 0, 60, 0, 140, C.far); g.fill();
    // a row of shopfronts the length of the street
    const walls = [HOUSE[1], HOUSE[2], HOUSE[3], HOUSE[4], C.wall, ['#FFD9B8', '#F8B98A', '#E3965E']];
    const trims = ['#22AEC4', '#F0478F', '#3B8E38', '#F28C28', '#1C5FA8', '#C21A68'];
    let i = 0;
    for (let x = 0; x < S(6) - 120; i++) {
      const fw = 70 + Math.floor(r() * 50), fh = 96 + Math.floor(r() * 30);
      facade(g, x, y - 18, fw, fh, walls[i % walls.length], trims[(i * 2) % trims.length], lights);
      x += fw;
    }
    // papel picado strung across the street, all the way along
    for (let x = 0; x < S(6) - 100; x += 140) papelPicado(g, x, x + 140, 30 + (x / 140 % 2) * 6, 60 + x);
    // the street: a sidewalk, then plaza tiles
    g.fillStyle = lin(g, 0, y - 18, 0, y, ['#E9DCC4', '#D7C6A6']); g.fillRect(0, y - 18, w, 18);
    g.fillStyle = lin(g, 0, y, 0, h, ['#E6D3B4', '#CDB591', '#B39A74']); g.fillRect(0, y, w, h - y);
    for (let x = 0; x < w; x += 12) for (let ty = y + 2; ty < h; ty += 8) { g.fillStyle = rgba(((x / 12 + (ty - y) / 8) % 2) ? '#FFFFFF' : C.ink, 0.07); g.fillRect(x + ((ty - y) / 8 % 2) * 6, ty, 11, 7); }
    // the bus stop: a sign, a bench and a small bus
    line(g, [[S(0) + 40, y], [S(0) + 40, y - 44]], C.motor[1], 2); box(g, S(0) + 32, y - 54, 16, 12, 2, '#1C5FA8'); ell(g, S(0) + 40, y - 48, 3.4, 3.4, '#FFFFFF');
    box(g, S(0) - 30, y - 12, 44, 4, 1, C.wood[1]); line(g, [[S(0) - 26, y - 8], [S(0) - 26, y]], C.wood[3], 2); line(g, [[S(0) + 10, y - 8], [S(0) + 10, y]], C.wood[3], 2);
    box(g, S(0) - 160, y - 48, 96, 40, 8, lin(g, 0, y - 48, 0, y - 8, ['#FFE08A', '#FFC43A', '#C98F12']));
    for (let k = 0; k < 5; k++) box(g, S(0) - 152 + k * 17, y - 42, 13, 12, 2, lin(g, 0, y - 42, 0, y - 30, ['#9ED8EA', '#2B6E8F']));
    g.fillStyle = C.stripe2; g.fillRect(S(0) - 160, y - 24, 96, 3);
    for (const wx of [S(0) - 140, S(0) - 86]) { ell(g, wx, y - 6, 7, 7, lin(g, 0, y - 13, 0, y + 1, C.tire)); ell(g, wx, y - 6, 3, 3, C.rim[1]); }
    // the taco stand: a cart with an umbrella and steam
    const tx = S(1);
    box(g, tx - 30, y - 30, 60, 22, 3, lin(g, 0, y - 30, 0, y - 8, ['#FFFFFF', '#E8EEF2']));
    g.fillStyle = C.stripe2; g.fillRect(tx - 30, y - 24, 60, 4); box(g, tx - 34, y - 33, 68, 4, 1, C.motor[1]);
    for (const wx of [tx - 20, tx + 20]) { ell(g, wx, y - 6, 6, 6, lin(g, 0, y - 12, 0, y, C.tire)); ell(g, wx, y - 6, 2.4, 2.4, C.rim[1]); }
    line(g, [[tx, y - 33], [tx, y - 76]], C.motor[1], 1.6);
    g.beginPath(); g.moveTo(tx - 40, y - 70); g.quadraticCurveTo(tx, y - 92, tx + 40, y - 70); g.closePath(); g.fillStyle = lin(g, tx - 40, 0, tx + 40, 0, ['#E0352B', '#FFFFFF', '#3B8E38']); g.fill();
    for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(tx - 10 + k * 10, y - 36); g.bezierCurveTo(tx - 16 + k * 10, y - 44, tx - 4 + k * 10, y - 50, tx - 10 + k * 10, y - 58); g.strokeStyle = rgba('#FFFFFF', 0.7); g.lineWidth = 1.2; g.stroke(); }
    // the shops: places to eat all along the street, bars, the corner bar,
    // clothing and souvenir shops. Each is [x, width, kind].
    const shops = [
      [270, 96, 'eat'], [420, 92, 'eat'],
      [830, 100, 'eat'], [1000, 94, 'bar'], [1320, 96, 'eat'],
      [S(3) - 72, 144, 'corner'], [1890, 92, 'eat'], [2040, 96, 'bar'],
      [S(4) - 130, 100, 'clothes'], [S(4) - 20, 104, 'clothes'], [2440, 92, 'eat'],
      [S(5) - 140, 104, 'souvenir'], [S(5) - 26, 110, 'souvenir'], [2960, 96, 'eat'],
    ];
    // the empanada seller's table
    const ex = S(2);
    // the church at the end of the street, up a few steps
    const cx = S(6);
    for (let k = 0; k < 4; k++) { g.fillStyle = lin(g, 0, y - k * 5 - 5, 0, y - k * 5, [C.wall[0], C.wall[2]]); g.fillRect(cx - 70 + k * 6, y - k * 5 - 5, 140 - k * 12, 5); }
    const cy = y - 20;
    g.fillStyle = lin(g, cx - 56, 0, cx + 56, 0, [C.wall[0], C.wall[1], C.wall[2]]); g.fillRect(cx - 52, cy - 100, 104, 100);
    poly(g, [[cx - 56, cy - 100], [cx + 56, cy - 100], [cx, cy - 136]], lin(g, 0, cy - 136, 0, cy - 100, C.wall));
    g.fillStyle = C.pink[1]; g.fillRect(cx - 52, cy - 102, 104, 3);
    box(g, cx - 16, cy - 46, 32, 46, 16, lin(g, 0, cy - 46, 0, cy, ['#8A5530', '#5E3B1A']));
    ell(g, cx, cy - 76, 11, 11, lin(g, 0, cy - 87, 0, cy - 65, ['#FFE08A', '#F0478F', '#22AEC4']));
    for (const bx of [cx - 82, cx + 58]) {
      g.fillStyle = lin(g, bx, 0, bx + 24, 0, [C.wall[0], C.wall[2]]); g.fillRect(bx, cy - 150, 24, 150);
      box(g, bx + 6, cy - 140, 12, 18, 6, '#3B5E7A'); ell(g, bx + 12, cy - 128, 3.4, 3.4, C.sun[2]);
      g.beginPath(); g.ellipse(bx + 12, cy - 150, 12, 11, 0, Math.PI, 0); g.closePath(); g.fillStyle = lin(g, 0, cy - 161, 0, cy - 150, [C.sun[0], C.sun[2]]); g.fill();
      line(g, [[bx + 12, cy - 161], [bx + 12, cy - 172]], C.ink, 1.2); line(g, [[bx + 8, cy - 168], [bx + 16, cy - 168]], C.ink, 1.2);
    }
    papelPicado(g, cx - 82, cx + 82, cy - 116, 999);
    palm(g, cx - 120, y - 2, 52); palm(g, cx + 120, y - 2, 48, -1);
    // street lamps at the curb, where no shop stands
    const inShop = (x0, x1) => shops.some(([sx, sw]) => x0 < sx + sw && x1 > sx) || (x1 > ex - 30 && x0 < ex + 50);
    const lamps = [];
    for (let lx = S(0) + 200; lx < S(6) - 160; lx += 210) { if (inShop(lx - 8, lx + 8) || Math.abs(lx - tx) < 50) continue; line(g, [[lx, y - 18], [lx, y - 86]], '#2A3440', 2.4); box(g, lx - 5, y - 96, 10, 11, 2, '#2A3440'); lamps.push(lx); }

    // moonlight: darken everything on the street layer, then lay it on the sky
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = rgba('#0B1A3A', 0.58); g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'source-over';
    sky.drawImage(d, 0, 0);

    // the lights
    const pool = (x0, y0, rx, ry, a) => { sky.save(); sky.translate(x0, y0); sky.scale(1, ry / rx); ell(sky, 0, 0, rx, rx, rad(sky, 0, 0, 0, rx, [rgba('#FFC86B', a), rgba('#FFC86B', 0)])); sky.restore(); };
    const L = sky, warm = (x0, y0, rr, a = 0.5) => ell(L, x0, y0, rr, rr, rad(L, x0, y0, 0, rr, [rgba('#FFC86B', a), rgba('#FFC86B', 0)]));
    const shopTop = y - 82, hidden = (lx, lw, ly, lh) => ly + lh > shopTop && inShop(lx, lx + lw);
    for (const [kind, lx, ly, lw, lh] of lights) {
      if (lx + lw > cx - 84 || hidden(lx, lw, ly, lh)) continue; // behind the church's tower or a shop
      warm(lx + lw / 2, ly + lh / 2, kind === 'door' ? 26 : 20, kind === 'door' ? 0.3 : 0.35);
      box(L, lx, ly, lw, lh, kind === 'door' ? 9 : 3, lin(L, 0, ly, 0, ly + lh, ['#FFF1C2', '#FFC86B', '#E8963A']));
      if (kind === 'window') { L.fillStyle = rgba('#7A4A1E', 0.55); L.fillRect(lx + lw / 2 - 0.6, ly, 1.2, lh); L.fillRect(lx, ly + lh / 2 - 0.6, lw, 1.2); }
    }
    // strings of bulbs along the papel picado
    const bulb = (bx, by, rr = 6) => { ell(L, bx, by, rr, rr, rad(L, bx, by, 0, rr, [rgba('#FFE9A8', 0.55), rgba('#FFE9A8', 0)])); ell(L, bx, by, 1.4, 1.4, '#FFF6D6'); };
    const bulbs = (x0, x1, y0) => { for (let t = 0.04; t < 1; t += 0.072) bulb(x0 + (x1 - x0) * t, y0 + 24 * t * (1 - t) - 1); };
    for (let x = 0; x < S(6) - 100; x += 140) bulbs(x, x + 140, 30 + (x / 140 % 2) * 6);
    bulbs(cx - 82, cx + 82, cy - 116);
    // the taco cart's bulb under the umbrella
    warm(tx, y - 62, 40, 0.45); ell(L, tx, y - 66, 2.2, 2.6, '#FFF1C2'); pool(tx, y + 4, 48, 9, 0.3);
    // street lamps
    for (const lx of lamps) { warm(lx, y - 90, 46, 0.45); ell(L, lx, y - 90, 3, 3.6, '#FFF6D6'); pool(lx, y + 4, 52, 10, 0.3); }
    // light from every shop and the empanada lamp, thrown on the street
    for (const [sx, sw] of shops) pool(sx + sw / 2, y - 4, sw * 0.7, 16, 0.32);
    pool(ex + 8, y - 4, 52, 14, 0.32);
    // the bus's headlights and lit windows
    for (let k = 0; k < 5; k++) box(L, S(0) - 152 + k * 17, y - 42, 13, 12, 2, lin(L, 0, y - 42, 0, y - 30, ['#FFF1C2', '#FFC86B']));
    warm(S(0) - 64, y - 16, 20, 0.6); ell(L, S(0) - 66, y - 16, 2.4, 2.4, '#FFF6D6');
    // the church: lit doors, a glowing rose window and lights in the towers
    warm(cx, cy - 40, 60, 0.3);
    box(L, cx - 16, cy - 46, 32, 46, 16, lin(L, 0, cy - 46, 0, cy, ['#FFF1C2', '#FFC86B', '#E8963A']));
    warm(cx, cy - 76, 22, 0.5); ell(L, cx, cy - 76, 11, 11, lin(L, 0, cy - 87, 0, cy - 65, ['#FFE08A', '#FF7AB0', '#5FD3E8']));
    for (const bx of [cx - 82, cx + 58]) { warm(bx + 12, cy - 131, 18, 0.45); box(L, bx + 6, cy - 140, 12, 18, 6, lin(L, 0, cy - 140, 0, cy - 122, ['#FFF1C2', '#FFC86B'])); }

    // ---- the shops, on their own layer: outsides in moonlight, then lit
    // insides with their goods, then what stands out front in the shop light
    const [sl, u] = canvas(w, h);
    const SHOPWALL = [['#F4E3C8', '#E2C9A2'], ['#CFE9E4', '#A9D3CB'], ['#F7D1D9', '#E6AAB9'], ['#FFF0B8', '#EFD68A'], ['#D9E6F5', '#B6CBE6']];
    const BOTTLE = ['#3B8E38', '#C98F12', '#E8EEF2', '#7A2B2A', '#22AEC4', '#F28C28'];
    shops.forEach(([x, sw, kind], k) => {
      const wall = SHOPWALL[k % SHOPWALL.length], awn = PAPEL[(k * 2 + 1) % PAPEL.length], awnLight = '#FFF4DC';
      u.fillStyle = lin(u, x, 0, x + sw, 0, [wall[0], wall[1]]); u.fillRect(x, shopTop, sw, y - 18 - shopTop);
      if (kind === 'corner') { poly(u, [[x + sw, shopTop - 6], [x + sw + 18, shopTop + 4], [x + sw + 18, y - 14], [x + sw, y - 18]], lin(u, x + sw, 0, x + sw + 18, 0, [wall[1], '#9C8A70'])); }
      // the awning, striped, with a scalloped edge
      for (let sx = x - 4; sx < x + sw + 4; sx += 8) { poly(u, [[sx, shopTop - 2], [sx + 8, shopTop - 2], [sx + 9, shopTop + 10], [sx + 1, shopTop + 10]], ((sx - x) / 8) % 2 ? awnLight : awn); u.beginPath(); u.arc(sx + 5, shopTop + 10, 4, 0, Math.PI); u.fillStyle = ((sx - x) / 8) % 2 ? awnLight : awn; u.fill(); }
      box(u, x + sw / 2 - 20, shopTop - 14, 40, 11, 2, kind === 'bar' || kind === 'corner' ? '#7A2B2A' : '#1E6F86');
    });
    u.globalCompositeOperation = 'source-atop'; u.fillStyle = rgba('#0B1A3A', 0.36); u.fillRect(0, 0, w, h); u.globalCompositeOperation = 'source-over';
    const glowsAfter = [];
    shops.forEach(([x, sw, kind], k) => {
      const ox = x + 6, ow = sw - 12, top = shopTop + 14, bot = y - 18, rr = noise(900 + k);
      u.fillStyle = lin(u, 0, top, 0, bot, ['#FFE7B0', '#F6B860', '#C9822F']); u.fillRect(ox, top, ow, bot - top);
      glowsAfter.push([x + sw / 2, top + 6]);
      if (kind === 'eat') {
        box(u, ox + 4, top + 4, 18, 13, 1, '#2B2F33'); for (let m = 0; m < 4; m++) line(u, [[ox + 7, top + 7 + m * 2.6], [ox + 18, top + 7 + m * 2.6]], rgba('#FFFFFF', 0.7), 0.6);
        line(u, [[ox + 26, top + 12], [ox + ow - 4, top + 12]], C.wood[3], 1.4);
        for (let m = 0; ox + 30 + m * 9 < ox + ow - 4; m++) ell(u, ox + 30 + m * 9, top + 8.5, 3.4, 3.2, ['#B9592E', '#FFFFFF', '#3B8E38'][m % 3]);
        box(u, ox + 3, bot - 18, ow - 6, 18, 1, lin(u, 0, bot - 18, 0, bot, ['#FFFFFF', '#C9D5DB']));
        for (let m = 0; m < ow - 8; m += 6) { u.fillStyle = PAPEL[(m / 6 + k) % PAPEL.length]; u.fillRect(ox + 4 + m, bot - 16, 5, 3); }
        ell(u, ox + ow / 2, bot - 21, 9, 3, '#3A4048');
        for (let m = 0; m < 2; m++) { u.beginPath(); u.moveTo(ox + ow / 2 - 3 + m * 6, bot - 24); u.bezierCurveTo(ox + ow / 2 - 7 + m * 6, bot - 30, ox + ow / 2 + 1 + m * 6, bot - 34, ox + ow / 2 - 3 + m * 6, bot - 40); u.strokeStyle = rgba('#FFFFFF', 0.75); u.lineWidth = 1; u.stroke(); }
      } else if (kind === 'bar' || kind === 'corner') {
        for (const sy2 of [top + 14, top + 28]) { line(u, [[ox + 3, sy2], [ox + ow - 3, sy2]], '#5E3B1A', 1.6); for (let bx = ox + 6; bx < ox + ow - 6; bx += 5) { const col = BOTTLE[Math.floor(rr() * BOTTLE.length)], bh = 7 + rr() * 3; u.fillStyle = col; u.fillRect(bx, sy2 - bh, 3, bh); u.fillRect(bx + 0.8, sy2 - bh - 3, 1.4, 3); } }
        box(u, ox + 2, bot - 16, ow - 4, 16, 1, lin(u, 0, bot - 16, 0, bot, ['#8A5530', '#5E3B1A']));
        line(u, [[ox + 2, bot - 16], [ox + ow - 2, bot - 16]], '#C9822F', 1.4);
      } else if (kind === 'clothes') {
        for (const sy2 of [top + 14, top + 30]) { line(u, [[ox + 3, sy2], [ox + ow - 3, sy2]], '#5E3B1A', 1.4); for (let bx = ox + 5; bx < ox + ow - 10; bx += 12) for (let m = 0; m < 3; m++) { u.fillStyle = PAPEL[Math.floor(rr() * PAPEL.length)]; u.fillRect(bx, sy2 - 3 - m * 3, 10, 2.6); } }
      } else {
        for (const sy2 of [top + 14, top + 30]) { line(u, [[ox + 3, sy2], [ox + ow - 3, sy2]], '#5E3B1A', 1.4); for (let bx = ox + 7; bx < ox + ow - 6; bx += 10) { if (rr() < 0.5) { ell(u, bx, sy2 - 5, 3.6, 4.6, PAPEL[Math.floor(rr() * PAPEL.length)]); ell(u, bx - 1.4, sy2 - 6, 0.9, 0.7, '#2B2F33'); ell(u, bx + 1.4, sy2 - 6, 0.9, 0.7, '#2B2F33'); } else { ell(u, bx, sy2 - 4, 3.4, 4, lin(u, 0, sy2 - 8, 0, sy2, ['#E58A55', '#8A3F1E'])); } } }
      }
    });
    // what stands out front, in the shop light
    const chair = (cx2, col) => { line(u, [[cx2, y - 18], [cx2, y - 32]], col, 1.4); line(u, [[cx2 + 6, y - 18], [cx2 + 6, y - 26]], col, 1.4); box(u, cx2, y - 27, 7, 2, 0.8, col); };
    shops.forEach(([x, sw, kind], k) => {
      const mid = x + sw / 2;
      if (kind === 'eat') {
        for (const [tx2, col] of [[x + sw * 0.28, '#E0352B'], [x + sw * 0.72, '#FFFFFF']]) { chair(tx2 - 14, col); chair(tx2 + 8, col); line(u, [[tx2, y - 18], [tx2, y - 30]], col, 1.6); box(u, tx2 - 10, y - 32, 20, 3, 1, col); ell(u, tx2 - 3, y - 34, 2.4, 1.2, '#FFF1C2'); }
        poly(u, [[x + sw - 4, y - 18], [x + sw + 2, y - 44], [x + sw + 8, y - 18]], C.wood[2]); box(u, x + sw - 3, y - 42, 10, 16, 1, '#2B2F33');
      } else if (kind === 'bar' || kind === 'corner') {
        for (let m = 0; m < (kind === 'corner' ? 4 : 2); m++) { const sx = x + 16 + m * (sw - 32) / Math.max(1, (kind === 'corner' ? 3 : 1)); line(u, [[sx - 4, y - 18], [sx, y - 34]], '#2A3440', 1.2); line(u, [[sx + 4, y - 18], [sx, y - 34]], '#2A3440', 1.2); ell(u, sx, y - 35, 5, 1.8, '#C21A68'); }
        if (kind === 'corner') { line(u, [[x + sw + 6, shopTop - 4], [x + sw + 6, shopTop - 22]], '#2A3440', 1.4); ell(u, x + sw + 6, shopTop - 30, 9, 9, '#7A2B2A'); poly(u, [[x + sw + 1, shopTop - 34], [x + sw + 11, shopTop - 34], [x + sw + 6, shopTop - 29]], '#FFE9A8'); line(u, [[x + sw + 6, shopTop - 29], [x + sw + 6, shopTop - 25]], '#FFE9A8', 0.8); line(u, [[x + sw + 3, shopTop - 25], [x + sw + 9, shopTop - 25]], '#FFE9A8', 0.8); glowsAfter.push([x + sw + 6, shopTop - 30]); }
      } else if (kind === 'clothes') {
        line(u, [[x + 6, y - 18], [x + 6, y - 64]], '#2A3440', 1.4); line(u, [[x + sw - 6, y - 18], [x + sw - 6, y - 64]], '#2A3440', 1.4); line(u, [[x + 6, y - 62], [x + sw - 6, y - 62]], '#2A3440', 1.4);
        for (let hx = x + 12, m = 0; hx < x + sw - 12; hx += 13, m++) {
          if (m % 2) { poly(u, [[hx - 4, y - 60], [hx + 4, y - 60], [hx + 8, y - 30], [hx - 8, y - 30]], '#FFFFFF'); for (let q = 0; q < 6; q++) ell(u, hx - 5 + q * 2, y - 36 + (q % 2) * 2, 1.1, 1.1, PAPEL[(q + m) % PAPEL.length]); }
          else { const col = PAPEL[(m + k) % PAPEL.length]; poly(u, [[hx - 5, y - 60], [hx + 5, y - 60], [hx + 8, y - 56], [hx + 5, y - 54], [hx + 5, y - 40], [hx - 5, y - 40], [hx - 5, y - 54], [hx - 8, y - 56]], col); }
        }
        for (let m = 0; m < 3; m++) { ell(u, x + 20 + m * 22, y - 66, 9, 2.2, C.straw[1]); ell(u, x + 20 + m * 22, y - 68, 4.4, 3, C.straw[0]); }
      } else {
        line(u, [[x + 4, y - 18], [x + 4, y - 66]], C.wood[3], 2); line(u, [[x + sw - 4, y - 18], [x + sw - 4, y - 66]], C.wood[3], 2);
        for (let m = 0; m < 6; m++) { u.beginPath(); u.moveTo(x + 4, y - 62 + m * 2); u.quadraticCurveTo(mid, y - 30 + m * 2, x + sw - 4, y - 62 + m * 2); u.strokeStyle = PAPEL[(m + k) % PAPEL.length]; u.lineWidth = 2; u.stroke(); }
        for (let m = 0; m < 4; m++) ell(u, x + 14, y - 22 - m * 3, 10, 2.4, C.straw[m % 2]);
        for (let m = 0; m < 3; m++) { const px = x + sw - 18 - m * 12; ell(u, px, y - 24, 5, 6, lin(u, 0, y - 30, 0, y - 18, ['#E58A55', '#8A3F1E'])); }
      }
    });
    // the empanada seller: a girl behind a small table with a tray and a basket
    const gx = ex - 6;
    poly(u, [[gx - 6, y - 60], [gx + 6, y - 60], [gx + 10, y - 26], [gx - 10, y - 26]], lin(u, 0, y - 60, 0, y - 26, ['#F0478F', '#C21A68']));
    poly(u, [[gx - 4, y - 50], [gx + 4, y - 50], [gx + 6, y - 28], [gx - 6, y - 28]], rgba('#FFFFFF', 0.9));
    line(u, [[gx - 5, y - 58], [gx + 2, y - 44], [gx + 14, y - 40]], '#B8794E', 2.6); line(u, [[gx + 5, y - 58], [gx + 10, y - 46], [gx + 16, y - 40]], '#B8794E', 2.6);
    box(u, gx - 1.6, y - 64, 3.2, 5, 1, '#B8794E');
    ell(u, gx, y - 68, 5.6, 6.2, '#B8794E');
    u.beginPath(); u.ellipse(gx - 0.6, y - 70, 6.2, 5.4, 0, Math.PI, 0); u.closePath(); u.fillStyle = '#2B1A12'; u.fill();
    ell(u, gx - 5, y - 68, 2.2, 4, '#2B1A12'); line(u, [[gx - 5.4, y - 64], [gx - 7, y - 50]], '#2B1A12', 2.2); ell(u, gx - 7, y - 49, 1.4, 1.4, '#F0478F');
    ell(u, gx + 4, y - 74, 2, 2, '#FFC43A'); ell(u, gx + 4, y - 74, 0.8, 0.8, '#F28C28');
    ell(u, gx + 2.2, y - 68.6, 0.7, 0.8, C.ink); u.beginPath(); u.arc(gx + 2.6, y - 65.6, 1.6, 0.2, Math.PI - 0.6); u.strokeStyle = '#6A2E1A'; u.lineWidth = 0.6; u.stroke();
    box(u, ex - 8, y - 38, 44, 4, 1, lin(u, 0, y - 38, 0, y - 34, ['#FFFFFF', '#E8EEF2']));
    u.fillStyle = '#FFFFFF'; u.fillRect(ex - 8, y - 34, 44, 16); for (let m = 0; m < 5; m++) { u.fillStyle = PAPEL[m]; u.fillRect(ex - 8, y - 32 + m * 3, 44, 1.4); }
    box(u, ex - 2, y - 41, 24, 3, 1, '#C9D5DB');
    for (let m = 0; m < 5; m++) { const mx2 = ex + 1 + m * 4.4; u.beginPath(); u.arc(mx2, y - 40, 3, Math.PI, 0); u.closePath(); u.fillStyle = lin(u, 0, y - 43, 0, y - 40, ['#F6C66A', '#D98E2F']); u.fill(); }
    ell(u, ex + 30, y - 41, 7, 3.6, lin(u, 0, y - 45, 0, y - 37, C.straw)); ell(u, ex + 30, y - 43, 5, 1.6, '#F0478F');
    line(u, [[ex + 40, y - 18], [ex + 40, y - 58]], '#2A3440', 1.4); glowsAfter.push([ex + 40, y - 60]);
    sky.drawImage(sl, 0, 0);
    for (const [gx2, gy2] of glowsAfter) { warm(gx2, gy2, 22, 0.4); ell(L, gx2, gy2, 1.8, 2.2, '#FFF6D6'); }
    for (const [x, sw] of shops) for (let bx = x; bx <= x + sw; bx += 9) bulb(bx, shopTop + 13, 4);
    return c;
  }

  // ---- Maria's café ------------------------------------------------------
  // Maria runs the café by the beach and hosts vacation mode. She stands
  // facing right, holding out a tray. 52 x 86.
  function drawMaria(g) {
    const skin = ['#C98B62', '#A86F48', '#7E5034'];
    // skirt and apron
    poly(g, [[12, 50], [36, 50], [44, 84], [4, 84]], lin(g, 0, 50, 0, 84, ['#2FB3A3', '#1E8579']));
    for (let k = 0; k < 6; k++) { g.fillStyle = ['#F0478F', '#FFD65A', '#F28C28'][k % 3]; g.fillRect(6 + k * 6.4, 78, 4, 2.4); }
    poly(g, [[15, 50], [33, 50], [36, 76], [12, 76]], lin(g, 0, 50, 0, 76, ['#FFFFFF', '#EDE7DA']));
    line(g, [[13, 51], [35, 51]], '#F0478F', 1.4);
    box(g, 11, 82, 8, 3, 1, '#5E3B1A'); box(g, 27, 82, 8, 3, 1, '#5E3B1A');
    // blouse with embroidery at the neck
    poly(g, [[13, 30], [35, 30], [37, 51], [11, 51]], lin(g, 0, 30, 0, 51, ['#FFFFFF', '#F1EEE6']));
    for (let k = 0; k < 7; k++) ell(g, 16 + k * 2.6, 31.5 + Math.sin(k) * 0.8, 1.1, 1.1, ['#F0478F', '#3B9E58', '#FFD65A', '#22AEC4'][k % 4]);
    // the back arm at her side, the front arm holding out the tray
    line(g, [[14, 32], [11, 46]], skin[1], 4);
    poly(g, [[31, 31], [38, 32], [40, 38], [33, 39]], '#F6F2EA');
    line(g, [[37, 37], [48, 36]], skin[0], 3.6);
    ell(g, 48, 34.6, 3, 2.4, skin[0]);
    ell(g, 46, 33, 8, 1.6, lin(g, 0, 31, 0, 35, ['#E3E8EC', '#9AA6B0']));
    // head: dark hair in a bun with a hibiscus, gold earrings and a smile
    ell(g, 24, 20, 8.4, 9, lin(g, 0, 12, 0, 29, skin));
    g.beginPath(); g.ellipse(23, 17, 9, 7.4, 0, Math.PI * 1.02, Math.PI * 2.05); g.closePath(); g.fillStyle = '#2E1E16'; g.fill();
    ell(g, 16.6, 20, 2.6, 6, '#2E1E16'); ell(g, 17, 9.6, 5.4, 4.6, '#3A2618');
    for (let k = 0; k < 5; k++) { const t = k / 5 * TAU; ell(g, 13 + Math.cos(t) * 2.6, 11 + Math.sin(t) * 2.6, 2.2, 1.6, '#E0352B'); } ell(g, 13, 11, 1.2, 1.2, '#FFD65A');
    ell(g, 28.4, 19, 1, 1.1, C.ink); line(g, [[26.6, 16.6], [29.6, 16.4]], '#2E1E16', 0.8);
    g.beginPath(); g.arc(28.6, 22.6, 2.2, 0.15 * Math.PI, 0.85 * Math.PI); g.strokeStyle = '#8A2B2A'; g.lineWidth = 0.9; g.stroke();
    ell(g, 30.6, 21.4, 1.6, 1, rgba('#F0478F', 0.35)); ell(g, 20, 24.4, 1.2, 1.6, '#FFD65A');
    line(g, [[22, 28], [26, 28]], skin[2], 2.6);
  }
  function maria(scale = 1) { const [c, g] = canvas(52 * scale, 86 * scale); g.scale(scale, scale); drawMaria(g); return c; }

  // Maria's menu: drinks and plates, each drawn on a 64 x 56 card.
  const glass = (g, x, y, w, h, liquid, top = 0.18) => {
    poly(g, [[x, y], [x + w, y], [x + w - 3, y + h], [x + 3, y + h]], rgba('#E9F7FC', 0.55));
    poly(g, [[x + 1.4, y + h * top], [x + w - 1.4, y + h * top], [x + w - 3.6, y + h - 1.6], [x + 3.6, y + h - 1.6]], liquid);
    line(g, [[x + 3.4, y + 3], [x + 5, y + h - 4]], rgba('#FFFFFF', 0.7), 1.2);
    ell(g, x + w / 2, y + h, w / 2 - 3, 1.6, rgba('#7FB6D0', 0.5));
  };
  const plate = (g, cx, cy, rx = 27) => { ell(g, cx, cy + 2, rx, rx * 0.36, rgba(C.ink, 0.18)); ell(g, cx, cy, rx, rx * 0.36, lin(g, 0, cy - 10, 0, cy + 10, ['#FFFFFF', '#DCE3E8'])); ell(g, cx, cy, rx * 0.72, rx * 0.25, '#F4F7F9'); };
  const straw = (g, x0, y0, x1, y1, col = '#F0478F') => { line(g, [[x0, y0], [x1, y1]], col, 1.8); line(g, [[x0, y0], [x1, y1]], rgba('#FFFFFF', 0.5), 0.6); };
  const MENU_ART = {
    horchata: (g) => { glass(g, 20, 12, 24, 38, lin(g, 0, 18, 0, 50, ['#FFFDF6', '#EFE3CF'])); for (let k = 0; k < 6; k++) ell(g, 25 + k * 3, 19.4 + (k % 2), 1, 0.7, '#B07A45'); line(g, [[38, 6], [36, 24]], '#8A5530', 2.2); straw(g, 27, 4, 29, 24); },
    jamaica: (g) => { glass(g, 20, 12, 24, 38, lin(g, 0, 18, 0, 50, ['#D63A5E', '#8E1838'])); for (let k = 0; k < 3; k++) box(g, 24 + k * 6, 22 + k * 5, 5, 5, 1, rgba('#FFFFFF', 0.45)); for (let k = 0; k < 5; k++) { const t = k / 5 * TAU; ell(g, 44 + Math.cos(t) * 3.4, 12 + Math.sin(t) * 3.4, 3.2, 2.4, '#E0352B'); } ell(g, 44, 12, 1.4, 1.4, '#FFD65A'); straw(g, 28, 4, 30, 24, '#22AEC4'); },
    coco: (g) => { ell(g, 32, 34, 18, 16, lin(g, 0, 18, 0, 50, ['#8ED04A', '#3B8E38', '#1D5B3C'])); ell(g, 32, 21, 9, 3.6, '#F4F7E8'); ell(g, 26, 30, 4, 6, rgba('#FFFFFF', 0.25)); straw(g, 34, 4, 33, 22, '#FFD65A'); for (let k = 0; k < 5; k++) { const t = k / 5 * TAU; ell(g, 22 + Math.cos(t) * 2.6, 20 + Math.sin(t) * 2.6, 2.4, 1.8, '#F0478F'); } ell(g, 22, 20, 1, 1, '#FFD65A'); },
    limonada: (g) => { glass(g, 20, 12, 24, 38, lin(g, 0, 18, 0, 50, ['#D9F59A', '#A7D84A'])); for (let k = 0; k < 3; k++) box(g, 24 + k * 6, 20 + k * 6, 5, 5, 1, rgba('#FFFFFF', 0.5)); g.beginPath(); g.arc(44, 12, 7, 0, TAU); g.fillStyle = '#6BBE3C'; g.fill(); g.beginPath(); g.arc(44, 12, 5.4, 0, TAU); g.fillStyle = '#E2F7A8'; g.fill(); for (let k = 0; k < 6; k++) { const t = k / 6 * TAU; line(g, [[44, 12], [44 + Math.cos(t) * 5, 12 + Math.sin(t) * 5]], '#9BD43C', 0.7); } straw(g, 28, 4, 30, 24); },
    cafe: (g) => { box(g, 18, 22, 26, 26, 6, lin(g, 18, 0, 44, 0, ['#D2804A', '#A85A2E', '#7A3E1E'])); g.beginPath(); g.arc(46, 34, 6, -1.3, 1.3); g.strokeStyle = '#A85A2E'; g.lineWidth = 3; g.stroke(); ell(g, 31, 23, 11, 2.6, '#4A2A16'); for (let k = 0; k < 4; k++) ell(g, 22 + k * 6, 34, 1.4, 1.4, '#FFD65A'); for (const sx of [26, 33]) line(g, [[sx, 18], [sx - 2, 12], [sx + 1, 6]], rgba('#FFFFFF', 0.6), 1.2); line(g, [[38, 10], [42, 24]], '#8A5530', 2.2); },
    mango: (g) => { glass(g, 20, 12, 24, 38, lin(g, 0, 18, 0, 50, ['#FFC25A', '#F28C28']), 0.08); ell(g, 32, 13, 11, 3, '#FFD65A'); poly(g, [[40, 4], [50, 10], [42, 15]], '#F7B733'); ell(g, 44, 10, 4, 3, '#F28C28'); straw(g, 27, 2, 29, 20, '#3B9E58'); },
    sandia: (g) => { glass(g, 20, 12, 24, 38, lin(g, 0, 18, 0, 50, ['#FF8DA1', '#E0476B'])); g.beginPath(); g.moveTo(36, 12); g.arc(44, 12, 9, 0, Math.PI); g.closePath(); g.fillStyle = '#3B8E38'; g.fill(); g.beginPath(); g.moveTo(37.6, 12); g.arc(44, 12, 7.2, 0, Math.PI); g.closePath(); g.fillStyle = '#F2546E'; g.fill(); for (const [dx, dy] of [[-3, 3], [0, 5], [3, 3]]) ell(g, 44 + dx, 12 + dy, 0.8, 1.1, '#2A1A16'); straw(g, 27, 4, 29, 24); },
    tacos: (g) => { plate(g, 32, 40); for (const [x, t] of [[22, -0.15], [40, 0.15]]) { g.save(); g.translate(x, 34); g.rotate(t); g.beginPath(); g.ellipse(0, 0, 11, 9, 0, Math.PI, 0); g.closePath(); g.fillStyle = '#F2D38A'; g.fill(); ell(g, 0, -1, 9, 3, '#8ED04A'); ell(g, -3, -3, 3, 2, '#F6E3B8'); ell(g, 3, -3, 3, 2, '#F6E3B8'); ell(g, 0, -4, 2, 1.2, '#E0352B'); g.restore(); } ell(g, 48, 42, 4, 2.6, '#6BBE3C'); },
    ceviche: (g) => { ell(g, 32, 42, 20, 6, rgba(C.ink, 0.18)); g.beginPath(); g.ellipse(32, 30, 18, 6, 0, 0, Math.PI); g.lineTo(22, 44); g.lineTo(42, 44); g.closePath(); g.fillStyle = rgba('#E9F7FC', 0.7); g.fill(); ell(g, 32, 30, 18, 6, '#F3E9D2'); for (let k = 0; k < 9; k++) ell(g, 20 + k * 3, 29 + (k % 3) - 1, 2, 1.6, ['#F28C6A', '#8ED04A', '#E0352B', '#FFFFFF'][k % 4]); poly(g, [[38, 27], [52, 10], [56, 22]], '#F2C46A'); for (let k = 0; k < 4; k++) ell(g, 46 + k * 2, 18 + (k % 2) * 2, 0.8, 0.8, '#C9952E'); ell(g, 14, 42, 4.4, 2.6, '#6BBE3C'); },
    chilaquiles: (g) => { plate(g, 32, 40); for (let k = 0; k < 10; k++) poly(g, [[16 + k * 3.4, 38], [20 + k * 3.4, 30 + (k % 3) * 2], [23 + k * 3.4, 39]], k % 2 ? '#E0632B' : '#C9452A'); ell(g, 32, 33, 7, 4.4, '#FFFFFF'); ell(g, 33, 32.4, 2.8, 2.2, '#FFC43A'); for (let k = 0; k < 6; k++) ell(g, 20 + k * 5, 37 - (k % 2), 1.4, 0.9, '#FFFDF6'); },
    zarandeado: (g) => { plate(g, 32, 40, 29); g.beginPath(); g.ellipse(30, 36, 18, 6.4, 0, 0, TAU); g.fillStyle = lin(g, 0, 30, 0, 42, ['#E8813A', '#B5502A']); g.fill(); poly(g, [[46, 36], [55, 30], [55, 42]], '#B5502A'); ell(g, 15, 35, 1.2, 1.2, C.ink); for (let k = 0; k < 4; k++) line(g, [[20 + k * 6, 32], [24 + k * 6, 40]], rgba('#5E2A16', 0.6), 1.2); ell(g, 12, 42, 4, 2.6, '#6BBE3C'); },
    conchas: (g) => { plate(g, 32, 42); for (const [x, y, col] of [[22, 34, '#F7C6D9'], [42, 34, '#FFFDF6'], [32, 28, '#E7B06A']]) { ell(g, x, y + 3, 10, 6, '#D99A4E'); g.beginPath(); g.ellipse(x, y + 2, 10, 7, 0, Math.PI, 0); g.closePath(); g.fillStyle = col; g.fill(); for (let k = -1; k <= 1; k++) line(g, [[x + k * 4, y - 3], [x + k * 5, y + 2]], rgba('#9A6F2A', 0.4), 0.7); } },
    flan: (g) => { plate(g, 32, 42); g.beginPath(); g.moveTo(20, 40); g.lineTo(23, 24); g.lineTo(41, 24); g.lineTo(44, 40); g.closePath(); g.fillStyle = lin(g, 0, 24, 0, 40, ['#FFE08A', '#F2BC2E']); g.fill(); ell(g, 32, 24, 9, 2.6, '#9A4A16'); line(g, [[25, 25], [24, 32]], '#9A4A16', 1.6); line(g, [[38, 25], [40, 34]], '#9A4A16', 1.4); ell(g, 32, 42, 14, 2.4, rgba('#9A4A16', 0.6)); ell(g, 30, 22, 2, 1.2, '#E0352B'); },
    elote: (g) => { plate(g, 32, 42); g.save(); g.translate(32, 32); g.rotate(-0.5); ell(g, 0, 0, 18, 6.4, '#F7C83A'); for (let k = -15; k <= 15; k += 3) for (const dy of [-3, 0, 3]) ell(g, k, dy, 1.2, 1.2, '#FFE08A'); for (let k = 0; k < 9; k++) ell(g, -14 + k * 3.4, (k % 3) - 1, 1, 0.8, '#E0352B'); ell(g, 0, -1, 14, 2, rgba('#FFFFFF', 0.5)); line(g, [[18, 0], [26, 0]], C.wood[1], 2.4); g.restore(); },
    quesadilla: (g) => { plate(g, 32, 42); g.beginPath(); g.moveTo(14, 38); g.arc(32, 38, 18, Math.PI, 0); g.closePath(); g.fillStyle = lin(g, 0, 20, 0, 38, ['#F6D58E', '#E2B45A']); g.fill(); for (let k = 0; k < 7; k++) ell(g, 20 + k * 4, 30 + (k % 2) * 4, 1.6, 1.2, '#B5782E'); ell(g, 24, 38, 4, 1.6, '#FFE58F'); ell(g, 40, 38, 4, 1.4, '#FFE58F'); ell(g, 50, 40, 4, 2.6, '#6BBE3C'); },
  };
  // ---- vacation mode's lane: a stroll down the beach to Maria's café ----
  // 3600 x 240, flat: a boardwalk across the sand with the bay behind it.
  const CAFE = { w: 3600, h: 240, stopX: (i) => 175 + i * 520, ground: () => 214 };
  function cafeLane() {
    const { w, h } = CAFE, S = CAFE.stopX, gy = 214;
    const [c, g] = canvas(w, h); const r = noise(57);
    skyFill(g, w, h); sun(g, 520, 46);
    for (let x = 60; x < w; x += 260 + r() * 200) cloud(g, x, 22 + r() * 30, 0.7 + r() * 0.5);
    // a far headland and the bay
    g.beginPath(); g.moveTo(0, 128); for (let x = 0; x <= w; x += 4) g.lineTo(x, ridgeY(x, 112, 16, 0.004, 1.3)); g.lineTo(w, 132); g.lineTo(0, 132); g.closePath(); g.fillStyle = lin(g, 0, 90, 0, 132, C.far); g.fill();
    g.fillStyle = lin(g, 0, 130, 0, 176, [C.sea[1], C.sea[2], C.sea[3]]); g.fillRect(0, 130, w, 46);
    for (let k = 0; k < 420; k++) ell(g, r() * w, 134 + r() * 38, 2 + r() * 6, 0.8, rgba('#FFFFFF', 0.25 + r() * 0.4));
    for (let x = 0; x < w; x += 6) ell(g, x, 175 + Math.sin(x / 23) * 1.4, 5, 1.6, rgba(C.foam, 0.85));
    // sand, with shells
    g.fillStyle = lin(g, 0, 174, 0, h, [C.sand[0], C.sand[1], C.sand[2]]); g.fillRect(0, 176, w, h - 176);
    for (let k = 0; k < 900; k++) ell(g, r() * w, 180 + r() * 58, 0.8 + r() * 1.2, 0.6, rgba(r() > 0.5 ? '#FFFFFF' : '#C9A060', 0.5));
    for (let k = 0; k < 40; k++) ell(g, r() * w, 182 + r() * 20, 1.6, 1.2, ['#FFB7C9', '#FFFFFF', '#F6DC98'][k % 3]);
    // the boardwalk
    box(g, 0, gy - 6, w, 10, 1, lin(g, 0, gy - 6, 0, gy + 4, [C.wood[0], C.wood[1]]));
    for (let x = 0; x < w; x += 7) { g.fillStyle = rgba(C.wood[3], 0.5); g.fillRect(x, gy - 6, 0.8, 10); }
    g.fillStyle = rgba(C.wood[3], 0.6); g.fillRect(0, gy + 4, w, 1.4);
    // beach life between the stops: umbrellas and towels, sandcastles,
    // surfboards, a panga pulled up on the sand; boats and pelicans on the bay
    for (let x = 300; x < w - 260; x += 170 + r() * 90) ell(g, x, 144 + r() * 14, 5 + r() * 4, 1.6, rgba('#FFFFFF', 0.9)), line(g, [[x, 142], [x, 130 + r() * 4]], '#FFFFFF', 0.8);
    for (let k = 0; k < 14; k++) { const bx = r() * w, by = 40 + r() * 50; line(g, [[bx - 5, by], [bx, by - 2.4], [bx + 5, by]], rgba(C.ink, 0.6), 0.9); }
    const busy = (x) => [0, 1, 2, 3, 4, 5, 6].some((k) => Math.abs(x - S(k)) < 110);
    let kind = 0;
    for (let x = 120; x < w - 60; x += 110 + r() * 70) {
      if (busy(x)) continue;
      const k = kind++ % 4, by = 190 + r() * 6;
      if (k === 0) { line(g, [[x, by + 6], [x + 3, by - 30]], '#E3E8EC', 1.2); g.beginPath(); g.moveTo(x - 20, by - 24); g.quadraticCurveTo(x + 3, by - 44, x + 26, by - 24); g.closePath(); g.fillStyle = ['#F0478F', '#22AEC4', '#FFD65A', '#F28C28'][Math.floor(r() * 4)]; g.fill(); box(g, x - 16, by + 2, 26, 8, 1, ['#FFFFFF', '#F28C28', '#3B9E58'][Math.floor(r() * 3)]); }
      else if (k === 1) { box(g, x - 10, by - 4, 20, 10, 1, C.sand[2]); box(g, x - 6, by - 12, 12, 8, 1, C.sand[1]); for (const tx3 of [x - 10, x - 2, x + 6]) box(g, tx3, by - 7, 4, 3, 0.5, C.sand[2]); line(g, [[x, by - 12], [x, by - 22]], C.wood[3], 0.8); poly(g, [[x, by - 22], [x + 7, by - 20], [x, by - 18]], '#E0352B'); }
      else if (k === 2) { for (const [dx, col] of [[-6, '#22AEC4'], [4, '#F28C28']]) { g.save(); g.translate(x + dx, by + 4); g.rotate(dx * 0.02); ell(g, 0, -16, 4, 18, col); line(g, [[0, -32], [0, 0]], rgba('#FFFFFF', 0.7), 0.8); g.restore(); } }
      else panga(g, x - 30, by - 4, C.stripe);
    }
    // the beach path: a palm and a hand-painted arrow to the café
    palm(g, S(0) - 60, gy - 8, 60, 1); arrowSign(g, S(0) + 40, gy - 34, 'CAFE', '#F0478F', '#FFF4D6', 1); line(g, [[S(0) + 34, gy - 28], [S(0) + 34, gy - 6]], C.wood[2], 2);
    // the hammocks, slung between two palms
    const hx = S(1);
    palm(g, hx - 40, gy - 8, 64, -1); palm(g, hx + 40, gy - 8, 64, 1);
    g.beginPath(); g.moveTo(hx - 36, gy - 50); g.quadraticCurveTo(hx, gy - 14, hx + 36, gy - 50); g.quadraticCurveTo(hx, gy - 24, hx - 36, gy - 50); g.closePath(); g.fillStyle = lin(g, hx - 36, 0, hx + 36, 0, ['#F0478F', '#FFD65A', '#22AEC4', '#F28C28']); g.fill();
    for (const [x0, x1] of [[hx - 36, hx - 30], [hx + 30, hx + 36]]) line(g, [[x0, gy - 50], [x1, gy - 46]], '#8F6638', 0.8);
    // the coconut stand: a cart under an umbrella
    const kx = S(2);
    line(g, [[kx, gy - 6], [kx, gy - 56]], '#E3E8EC', 1.4);
    g.beginPath(); g.moveTo(kx - 30, gy - 50); g.quadraticCurveTo(kx, gy - 70, kx + 30, gy - 50); g.closePath(); g.fillStyle = '#E0352B'; g.fill(); for (let k = -24; k < 30; k += 12) { g.beginPath(); g.moveTo(kx, gy - 62); g.lineTo(kx + k, gy - 51); g.lineTo(kx + k + 6, gy - 51); g.closePath(); g.fillStyle = '#FFFFFF'; g.fill(); }
    box(g, kx - 22, gy - 26, 44, 18, 2, lin(g, 0, gy - 26, 0, gy - 8, ['#4F92DD', '#2E66AD'])); ell(g, kx - 14, gy - 4, 4, 4, '#3A4048'); ell(g, kx + 14, gy - 4, 4, 4, '#3A4048');
    for (let k = 0; k < 7; k++) ell(g, kx - 16 + (k % 4) * 10 + (k > 3 ? 5 : 0), gy - 30 - (k > 3 ? 7 : 0), 5, 4.4, lin(g, 0, gy - 40, 0, gy - 26, ['#8ED04A', '#3B8E38']));
    // the tide pools: dark rocks at the water's edge, a starfish and a crab
    const tx = S(3);
    for (const [dx, rw] of [[-46, 18], [-16, 26], [22, 20], [50, 14]]) { ell(g, tx + dx, gy - 26, rw, 9, lin(g, 0, gy - 34, 0, gy - 18, [C.rock[3], C.rock[5]])); ell(g, tx + dx - 2, gy - 28, rw * 0.5, 3, rgba(C.sea[1], 0.85)); }
    for (let k = 0; k < 5; k++) { const t = k / 5 * TAU - Math.PI / 2; line(g, [[tx - 18, gy - 22], [tx - 18 + Math.cos(t) * 5, gy - 22 + Math.sin(t) * 5]], '#F28C28', 2.2); }
    ell(g, tx + 26, gy - 16, 4, 2.6, '#E0352B'); for (const s2 of [-1, 1]) { line(g, [[tx + 26 + s2 * 3, gy - 17], [tx + 26 + s2 * 6, gy - 20]], '#E0352B', 1); line(g, [[tx + 26 + s2 * 3, gy - 15], [tx + 26 + s2 * 6, gy - 13]], '#E0352B', 0.8); }
    // the volleyball net
    const vx = S(4);
    for (const px of [vx - 44, vx + 44]) line(g, [[px, gy - 6], [px, gy - 56]], '#E3E8EC', 2);
    g.fillStyle = rgba('#FFFFFF', 0.55); for (let y = gy - 54; y < gy - 34; y += 4) g.fillRect(vx - 44, y, 88, 0.6); for (let x = vx - 44; x < vx + 44; x += 4) g.fillRect(x, gy - 54, 0.6, 20);
    g.fillStyle = '#FFFFFF'; g.fillRect(vx - 44, gy - 56, 88, 2.4);
    ell(g, vx + 22, gy - 74, 5, 5, '#FFFFFF'); line(g, [[vx + 18, gy - 74], [vx + 26, gy - 74]], '#22AEC4', 1); line(g, [[vx + 22, gy - 78], [vx + 22, gy - 70]], '#FFD65A', 1);
    // the shady palms, with beach chairs and towels
    const px2 = S(5);
    for (const [dx, hh, lean] of [[-50, 70, -1], [-14, 82, 1], [30, 64, 1], [62, 74, -1]]) palm(g, px2 + dx, gy - 8, hh, lean);
    for (const [dx, col] of [[-34, '#22AEC4'], [10, '#F0478F']]) { poly(g, [[px2 + dx, gy - 8], [px2 + dx + 22, gy - 8], [px2 + dx + 26, gy - 22], [px2 + dx + 4, gy - 12]], col); line(g, [[px2 + dx + 2, gy - 8], [px2 + dx + 2, gy - 2]], C.wood[2], 1.2); line(g, [[px2 + dx + 22, gy - 8], [px2 + dx + 22, gy - 2]], C.wood[2], 1.2); }
    // Maria's café: a palapa roof over a counter, a menu board, tables and Maria herself
    const mx = S(6);
    for (const pp of [mx - 70, mx + 70]) line(g, [[pp, gy - 6], [pp, gy - 84]], C.wood[3], 3);
    poly(g, [[mx - 96, gy - 80], [mx + 96, gy - 80], [mx + 40, gy - 116], [mx - 40, gy - 116]], lin(g, 0, gy - 116, 0, gy - 80, [C.straw[1], C.straw[2], C.straw[3]]));
    for (let k = mx - 94; k < mx + 94; k += 3) line(g, [[k, gy - 81], [k + (r() - 0.5) * 3, gy - 74 - r() * 4]], C.straw[3], 0.9);
    box(g, mx - 34, gy - 98, 68, 14, 2, '#F0478F'); letters(g, 'CAFE MARIA', mx, gy - 94.6, '#FFF4D6', 1.2);
    g.save(); g.translate(mx - 42, gy - 62); g.scale(0.62, 0.62); drawMaria(g); g.restore();
    box(g, mx - 60, gy - 40, 76, 32, 2, lin(g, 0, gy - 40, 0, gy - 8, ['#2FB3A3', '#1E8579'])); box(g, mx - 64, gy - 44, 84, 6, 1, C.wood[1]);
    for (let k = 0; k < 6; k++) ell(g, mx - 54 + k * 12, gy - 24, 2.4, 2.4, ['#F0478F', '#FFD65A', '#22AEC4'][k % 3]);
    for (let k = 0; k < 4; k++) { box(g, mx - 52 + k * 7, gy - 52, 5, 8, 1, rgba('#E9F7FC', 0.75)); g.fillStyle = ['#D63A5E', '#FFFDF6', '#FFC25A', '#A7D84A'][k]; g.fillRect(mx - 51 + k * 7, gy - 49, 3, 4.6); }
    box(g, mx + 26, gy - 58, 26, 34, 2, '#22272C'); for (let k = 0; k < 6; k++) line(g, [[mx + 30, gy - 52 + k * 5], [mx + 46 - (k % 3) * 4, gy - 52 + k * 5]], rgba('#FFFFFF', 0.8), 0.8); line(g, [[mx + 30, gy - 24], [mx + 28, gy - 6]], C.wood[2], 1.6); line(g, [[mx + 48, gy - 24], [mx + 50, gy - 6]], C.wood[2], 1.6);
    for (const tx2 of [mx + 92, mx + 150]) { line(g, [[tx2, gy - 6], [tx2, gy - 44]], '#E3E8EC', 1.2); g.beginPath(); g.moveTo(tx2 - 24, gy - 38); g.quadraticCurveTo(tx2, gy - 54, tx2 + 24, gy - 38); g.closePath(); g.fillStyle = tx2 > mx + 100 ? '#22AEC4' : '#FFD65A'; g.fill(); box(g, tx2 - 12, gy - 20, 24, 3, 1, '#FFFFFF'); line(g, [[tx2, gy - 17], [tx2, gy - 6]], '#FFFFFF', 1.2); }
    palm(g, mx + 200, gy - 8, 76, -1);
    return c;
  }

  // the menu as it's printed: drinks, then plates
  const DRINKS = ['horchata', 'jamaica', 'coco', 'limonada', 'cafe', 'mango', 'sandia'];
  const PLATES = ['tacos', 'ceviche', 'chilaquiles', 'zarandeado', 'conchas', 'flan', 'elote', 'quesadilla'];
  function treat(id, scale = 1) { const [c, g] = canvas(64 * scale, 56 * scale); g.scale(scale, scale); MENU_ART[id](g); return c; }

  // ---- deliveries with Tío ----------------------------------------------
  // Tío, an older, strong man, pushes his wheelbarrow of supplies from the
  // pier up through town to the cantina, with the rider sitting on top.
  // The street climbs a hill between the bakery and the restaurant terrace.
  // 3600 x 240.
  const DELIVER = {
    w: 3600, h: 240, stopX: (i) => 175 + i * 520,
    ground: (x) => { const a = 175 + 3 * 520 + 80, b = 175 + 4 * 520 + 60, t = Math.min(1, Math.max(0, (x - a) / (b - a))); return Math.round(214 - 30 * t * t * (3 - 2 * t)); },
  };
  // Tío pushing the wheelbarrow, facing right. 116 x 74; the wheel and his
  // boots touch the bottom row. frame 0 or 1 moves his legs.
  function drawTio(g, f) {
    const skin = ['#B98057', '#9A6440', '#6E4528'], shirt = ['#7FA8C9', '#5B86AD', '#3E6489'], pants = ['#4A515C', '#2E333B'];
    // legs, striding
    const step = f ? 5 : -5;
    for (const [hip, foot, shade] of [[30, 30 - step, pants[1]], [34, 36 + step, pants[0]]]) {
      g.beginPath(); g.moveTo(hip - 4, 44); g.lineTo(hip + 4, 44); g.lineTo(foot + 3, 70); g.lineTo(foot - 3, 70); g.closePath(); g.fillStyle = shade; g.fill();
      box(g, foot - 4, 68, 11, 6, 2, '#3A2A1A');
    }
    // body, leaning into the handles
    poly(g, [[22, 22], [38, 18], [44, 44], [26, 46]], lin(g, 22, 0, 44, 0, shirt));
    line(g, [[30, 21], [35, 45]], rgba('#FFFFFF', 0.25), 0.8);
    // arms, sleeves rolled, reaching the handles
    poly(g, [[34, 22], [41, 21], [47, 30], [42, 32]], shirt[1]);
    line(g, [[44, 31], [58, 40]], skin[1], 4.6); line(g, [[40, 30], [55, 42]], skin[2], 4.2);
    ell(g, 59, 40.5, 3, 2.6, skin[1]);
    // head: grey hair, a white moustache and a cap
    ell(g, 33, 12, 7, 7.6, lin(g, 0, 5, 0, 20, skin));
    ell(g, 28, 13, 2.4, 3.6, '#C9C6C0'); ell(g, 38.5, 11.4, 1.6, 1.8, skin[0]);
    ell(g, 37.4, 15.6, 3.6, 1.6, '#F2F0EA'); ell(g, 36.6, 10.6, 0.8, 0.9, C.ink);
    line(g, [[34.4, 8.6], [38.4, 8.8]], '#E9E6DE', 0.9);
    g.beginPath(); g.ellipse(32.4, 7.4, 7.6, 5, 0, Math.PI, 0); g.closePath(); g.fillStyle = lin(g, 0, 2, 0, 8, ['#E0352B', '#A3241D']); g.fill();
    poly(g, [[37, 6.6], [45, 7.4], [44.6, 9], [36.6, 8.6]], '#A3241D');
  }
  function drawBarrow(g) {
    // handles back to Tío's hands, the tray, the wheel and the stand
    line(g, [[58, 40], [80, 46]], C.wood[3], 2.4); line(g, [[58, 42], [80, 49]], C.wood[2], 2);
    poly(g, [[70, 42], [112, 40], [104, 58], [76, 58]], lin(g, 0, 40, 0, 58, ['#4FAE5A', '#3B8E38', '#24622A']));
    poly(g, [[70, 42], [112, 40], [111, 43], [71, 45]], '#6CC777');
    line(g, [[80, 58], [77, 70]], '#2E333B', 1.8);
    ell(g, 102, 64, 8, 8, lin(g, 0, 56, 0, 72, C.tire)); ell(g, 102, 64, 3, 3, C.rim[1]);
  }
  function drawLoad(g, withRider) {
    // a crate of bottles, a sack of ice and a red gas canister
    box(g, 74, 28, 18, 14, 1.5, lin(g, 0, 28, 0, 42, [C.wood[0], C.wood[2]]));
    for (let k = 0; k < 5; k++) { g.fillStyle = ['#3B8E38', '#C98F12', '#7A2B2A', '#3B8E38', '#C98F12'][k]; g.fillRect(76 + k * 3.2, 22, 2.2, 7); g.fillRect(76.6 + k * 3.2, 19.6, 1, 2.6); }
    ell(g, 99, 34, 9, 8, lin(g, 0, 26, 0, 42, ['#FFFFFF', '#D9EEF6', '#A9D3E6']));
    line(g, [[95, 27], [99, 30], [103, 27]], rgba('#7FB6D0', 0.8), 0.8);
    box(g, 106, 24, 7, 17, 3, lin(g, 106, 0, 113, 0, ['#F9856F', '#E0352B', '#A3241D'])); box(g, 108, 21, 3, 4, 1, '#4A515C');
    if (withRider) { g.save(); g.translate(72, 1); g.scale(0.5, 0.5); drawPaco(g, 0, 0, 'stand', 0); g.restore(); }
  }
  // Shop-sign letters, 5 pixels tall, one pixel apart. Most are 3 wide; N is 4 and M is 5.
  const GLYPH = { A: '010101111101101', C: '011100100100011', D: '110101101101110', E: '111100110100111', H: '101101111101101',
    I: '111010010010111', L: '100100100100111', N: '10011101101110011001', O: '010101101101010', P: '110101110100100', R: '110101110101101', T: '111010010010010',
    M: '1000111011101011000110001', F: '111100110100100', ' ': '000000000000000', S: '011100010001110', Y: '101101010010010', J: '001001001101010', U: '101101101101111', G: '011100101101011' };
  function letters(g, text, cx, y, color, size = 1) {
    const cols = (ch) => GLYPH[ch].length / 5, w = ([...text].reduce((a, ch) => a + cols(ch) + 1, 0) - 1) * size;
    let x = Math.round(cx - w / 2);
    g.fillStyle = color;
    for (const ch of text) { const b = GLYPH[ch], n = cols(ch); for (let k = 0; k < b.length; k++) if (b[k] === '1') g.fillRect(x + (k % n) * size, y + Math.floor(k / n) * size, size, size); x += (n + 1) * size; }
  }
  // ---- pieces of the delivery town, drawn from the owner's trip photos ----
  const PLASTER = { white: ['#FFFFFF', '#F1EEE6', '#D6D0C4'], ochre: ['#FFD65A', '#F2BC2E', '#D39A1A'], teal: ['#A6EBDA', '#74D5BF', '#45AE98'],
    peach: ['#F6D2AE', '#E8B48A', '#C9905F'], concrete: ['#E4E0D6', '#CBC5B8', '#A9A295'], blue: ['#8DC0F2', '#4F92DD', '#2E66AD'] };
  const STONES = ['#B9AE9C', '#8C8174', '#A89A88', '#6E655B', '#CFC4B2'];
  // rough river stones set in mortar, as under the walls in town
  function stoneBase(g, r, x, y, w, hh) {
    g.save(); g.beginPath(); g.rect(x, y - hh, w, hh); g.clip();
    g.fillStyle = '#5B534B'; g.fillRect(x, y - hh, w, hh);
    for (let k = 0; k < (w * hh) / 10; k++) ell(g, x + r() * w, y - hh + r() * hh, 2.6 + r() * 2.2, 1.8 + r() * 1.3, STONES[Math.floor(r() * STONES.length)]);
    g.restore();
  }
  function bulbs(g, x0, x1, y) {
    g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo((x0 + x1) / 2, y + 8, x1, y); g.strokeStyle = '#2A3440'; g.lineWidth = 0.6; g.stroke();
    for (let x = x0 + 8; x < x1 - 4; x += 14) { const t = (x - x0) / (x1 - x0), yy = y + 8 * 2 * t * (1 - t) * 2; line(g, [[x, yy], [x, yy + 3]], '#2A3440', 0.5); ell(g, x, yy + 4.6, 1.6, 2, '#FFF6D6'); }
  }
  // a plastered house: a concrete roof slab or a tile edge, wooden doors,
  // barred or shuttered windows, sometimes an iron balcony and a stone base
  function casa(g, r, x, y, w, h, wall, o) {
    g.fillStyle = lin(g, x, 0, x + w, 0, [wall[0], [0.55, wall[1]], wall[2]]); g.fillRect(x, y - h, w, h);
    if (o.base) stoneBase(g, r, x, y, w, 15);
    if (o.tile) { g.fillStyle = C.roof[2]; g.fillRect(x - 3, y - h - 3, w + 6, 4); for (let k = -2; k < w + 4; k += 5) ell(g, x + k, y - h - 4, 3, 2.6, C.roof[(k / 5) & 1]); }
    else { box(g, x - 4, y - h - 4, w + 8, 6, 1, '#ECE7DD'); g.fillStyle = '#B9B2A6'; g.fillRect(x - 4, y - h + 1, w + 8, 1.4); }
    const n = Math.max(1, Math.floor(w / 46));
    for (let i = 0; i < n; i++) {
      const dx = x + (w / n) * (i + 0.5);
      if (o.mural) continue;
      box(g, dx - 8, y - 31, 16, 31, 1, lin(g, 0, y - 31, 0, y, ['#8A5530', '#5E3B1A']));
      line(g, [[dx, y - 30], [dx, y]], rgba('#2E1B0C', 0.6), 0.6);
      const wy = y - h + 14;
      if ((i + (o.seed || 0)) % 2) { box(g, dx - 8, wy, 16, 17, 1, '#34424C'); for (let k = 1; k < 5; k++) g.fillRect(dx - 8 + k * 3.2, wy, 0.8, 17); g.fillStyle = '#1E262C'; g.fillRect(dx - 8, wy + 8, 16, 0.8); }
      else { box(g, dx - 8, wy, 16, 17, 1, C.wood[2]); for (let k = 2; k < 17; k += 3) { g.fillStyle = C.wood[3]; g.fillRect(dx - 7, wy + k, 14, 1); } g.fillRect(dx - 0.4, wy, 0.8, 17); }
    }
    if (o.balcony) {
      const by = y - h + 38; box(g, x - 2, by, w + 4, 4, 1, '#E4DFD4'); g.fillStyle = '#9E978A'; g.fillRect(x - 2, by + 3, w + 4, 1.2);
      g.fillStyle = '#1E262C'; g.fillRect(x, by - 11, w, 1.2); for (let k = x + 1; k < x + w; k += 3.4) g.fillRect(k, by - 11, 0.8, 11);
    }
    if (o.bulbs) bulbs(g, x + 2, x + w - 2, y - h + 6);
  }
  function bananaPlant(g, x, y, s = 1) {
    line(g, [[x, y], [x + 1, y - 26 * s]], '#6E8B3D', 3 * s);
    for (const [ang, len] of [[-2.5, 26], [-1.9, 30], [-1.2, 28], [-0.6, 24], [-3.0, 20]]) {
      g.save(); g.translate(x + 1, y - 26 * s); g.rotate(ang); ell(g, len * s * 0.5, 0, len * s * 0.5, 5 * s, lin(g, 0, -5, 0, 5, [C.leafHi, C.leaf, '#2E7D3A'])); line(g, [[0, 0], [len * s, 0]], rgba('#E9F7B8', 0.6), 0.6); g.restore();
    }
  }
  // a white block wall on a stone base, with jungle growing behind it
  function compound(g, r, x, y, w) {
    canopy(g, r, x - 10, x + w + 10, () => y - 110, () => y - 40, 8, 14, 1);
    if (r() > 0.4) palm(g, x + w * (0.2 + r() * 0.6), y - 40, 64 + r() * 20, r() > 0.5 ? 1 : -1); else bananaPlant(g, x + w / 2, y - 40, 1.3);
    stoneBase(g, r, x, y, w, 18);
    g.fillStyle = lin(g, 0, y - 46, 0, y - 18, ['#FBF8EF', '#E3DED2']); g.fillRect(x, y - 46, w, 28);
    g.fillStyle = rgba('#9E978A', 0.7);
    for (let row = 0; row < 4; row++) { const yy = y - 46 + row * 7; g.fillRect(x, yy, w, 0.7); for (let k = (row % 2) * 7; k < w; k += 14) g.fillRect(x + k, yy, 0.7, 7); }
  }
  // a hand-painted arrow sign; dir is 1 for right, -1 for left
  function arrowSign(g, x, y, text, bg, fg, dir) {
    const tw = text.length * 4 * 1.2 + 4, hw = tw / 2 + 4;
    poly(g, [[x - hw * dir, y - 6], [x + (hw - 5) * dir, y - 6], [x + (hw + 1) * dir, y], [x + (hw - 5) * dir, y + 6], [x - hw * dir, y + 6]], bg);
    letters(g, text, x - dir * 1, y - 3, fg, 1.2);
  }
  // a mule with sacks on a pack saddle, walking left
  function mule(g, x, y) {
    const coat = ['#A85B30', '#8A4622', '#6B3418'];
    for (const [hx, fx, col] of [[x + 12, x + 15, coat[2]], [x - 10, x - 14, coat[2]], [x + 9, x + 7, coat[1]], [x - 13, x - 10, coat[1]]]) { line(g, [[hx, y - 22], [fx, y - 3]], col, 3.2); box(g, fx - 2, y - 4, 4.4, 4, 1, '#2A2018'); }
    line(g, [[x + 18, y - 30], [x + 22, y - 13]], coat[2], 1.6);
    ell(g, x, y - 28, 19, 9.5, lin(g, 0, y - 38, 0, y - 18, [coat[0], coat[1], coat[2]]));
    poly(g, [[x - 13, y - 33], [x - 23, y - 47], [x - 16, y - 50], [x - 6, y - 35]], coat[1]);
    ell(g, x - 26, y - 46, 7.5, 4.6, coat[1]); ell(g, x - 32, y - 44, 3.6, 3.4, '#5A2E16'); ell(g, x - 24.5, y - 48, 0.9, 0.9, C.ink);
    poly(g, [[x - 21, y - 49], [x - 22, y - 60], [x - 18.5, y - 50]], coat[2]); poly(g, [[x - 18, y - 49], [x - 16, y - 59], [x - 15.5, y - 49]], coat[1]);
    line(g, [[x - 30, y - 47], [x - 20, y - 44], [x - 30, y - 41]], '#7C8794', 0.8);
    box(g, x - 9, y - 38, 18, 5, 2, '#5E4530');
    box(g, x - 17, y - 52, 15, 17, 3, lin(g, 0, y - 52, 0, y - 35, ['#FFFFFF', '#E3DED2'])); box(g, x + 1, y - 50, 15, 16, 3, lin(g, 0, y - 50, 0, y - 34, ['#F6F2EA', '#D9D3C6']));
    line(g, [[x - 17, y - 40], [x + 16, y - 40]], C.wood[2], 0.8);
  }
  // an umbrella hung open from a wire over the plaza
  function hungUmbrella(g, x, y, col, s = 1) {
    line(g, [[x, y - 7 * s], [x, y + 9 * s]], '#3A2A1A', 0.7);
    g.beginPath(); g.ellipse(x, y, 10 * s, 6.5 * s, 0, Math.PI, 0); g.closePath(); g.fillStyle = lin(g, 0, y - 6.5 * s, 0, y, [col[0], col[1]]); g.fill();
    for (let k = -2; k <= 2; k++) line(g, [[x, y - 6.5 * s], [x + k * 4.4 * s, y]], rgba(col[2], 0.55), 0.5);
    for (let k = -10; k < 10; k += 4) ell(g, x + (k + 2) * s, y + 0.4, 2 * s, 1 * s, col[1]);
    g.beginPath(); g.arc(x - 1.2 * s, y + 9 * s, 1.2 * s, 0, Math.PI); g.strokeStyle = col[2]; g.lineWidth = 0.8; g.stroke();
  }
  function cafeTable(g, x, y) {
    for (const cx of [x - 9, x + 9]) { line(g, [[cx - 3, y], [cx - 3, y - 8]], '#1E262C', 0.9); line(g, [[cx + 3, y], [cx + 3, y - 8]], '#1E262C', 0.9); g.fillStyle = '#1E262C'; g.fillRect(cx - 3.5, y - 8, 7, 1.4); g.fillRect(cx + (cx < x ? -3.5 : 2.5), y - 15, 1.2, 7); }
    box(g, x - 8, y - 13, 16, 3, 0.5, '#6B4A2E'); line(g, [[x - 6, y - 10], [x - 6, y]], '#4A321E', 1.4); line(g, [[x + 6, y - 10], [x + 6, y]], '#4A321E', 1.4);
    ell(g, x, y - 15, 1.6, 1.8, '#C9905F'); ell(g, x, y - 17, 1.6, 1.2, '#B77BE0');
  }
  function crates(g, x, y, n) {
    for (let k = 0; k < n; k++) { const cy = y - 9 - k * 8.5 + (k === n - 1 ? 0 : 0); box(g, x + (k % 2) * 2, cy, 20, 8.5, 1, '#22272C'); g.fillStyle = '#3A424A'; for (let m = 2; m < 20; m += 3) g.fillRect(x + (k % 2) * 2 + m, cy + 1.5, 1.2, 5.5); }
  }
  function tio(frame = 0) {
    const [c, g] = canvas(116, 74);
    drawTio(g, frame); drawBarrow(g); drawLoad(g, true);
    return rim(c);
  }
  function deliveries() {
    const { w, h, ground } = DELIVER, S = DELIVER.stopX;
    const [c, g] = canvas(w, h); const r = noise(31);
    skyFill(g, w, h); sun(g, 300, 40);
    for (let x = 80; x < w; x += 290 + r() * 170) cloud(g, x, 24 + r() * 26, 0.8 + r() * 0.4);
    // green hills close behind town, thick with jungle
    g.beginPath(); g.moveTo(0, 130); for (let x = 0; x <= w; x += 4) g.lineTo(x, ridgeY(x, 72, 34, 0.006, 2.2)); g.lineTo(w, 150); g.lineTo(0, 150); g.closePath(); g.fillStyle = lin(g, 0, 40, 0, 150, C.mid); g.fill();
    canopy(g, r, 0, w, (x) => ridgeY(x, 78, 30, 0.006, 2.2), () => 150, 7, 11, 1);
    // the bay and the pier at the start, a panga being unloaded
    const sea0 = ground(0) - 4;
    g.fillStyle = lin(g, 0, sea0 - 40, 0, h, [C.sea[0], C.sea[2], C.sea[4]]); g.fillRect(0, sea0 - 40, S(0) + 112, h);
    for (let k = 0; k < 60; k++) ell(g, r() * (S(0) + 100), sea0 - 36 + r() * 60, 2 + r() * 5, 0.8, rgba('#FFFFFF', 0.25 + r() * 0.35));
    panga(g, 40, sea0 - 14, C.stripe2);
    for (let k = 0; k < 3; k++) box(g, 28 + k * 12, sea0 - 30 - (k % 2) * 6, 10, 9, 1, lin(g, 0, sea0 - 30, 0, sea0 - 20, [C.wood[0], C.wood[2]]));
    // the town: plastered houses, with block walls and jungle between some of them
    const order = ['white', 'ochre', 'peach', 'teal', 'concrete', 'white', 'blue', 'ochre'];
    const busy = (x0, x1) => [1, 2, 3, 5, 6].some((k) => x1 > S(k) - 90 && x0 < S(k) + 90);
    let i = 0;
    for (let x = S(0) + 110; x < w - 20; i++) {
      const fw = 64 + Math.floor(r() * 56), fy = ground(x + fw / 2) - 14;
      if (i % 4 === 2 && !busy(x, x + fw)) { compound(g, r, x, fy, fw); x += fw; continue; }
      casa(g, r, x, fy, fw, 72 + Math.floor(r() * 40), PLASTER[order[i % order.length]], { base: r() < 0.5, tile: r() < 0.4, balcony: r() < 0.4, bulbs: r() < 0.3, seed: i });
      x += fw;
    }
    // the street: river stones following the hill
    g.beginPath(); g.moveTo(S(0) - 30, h); for (let x = S(0) - 30; x <= w; x += 2) g.lineTo(x, ground(x) - 14); g.lineTo(w, h); g.closePath();
    g.fillStyle = lin(g, 0, 180, 0, h, ['#9C968A', '#8A8478', '#757064']); g.fill();
    for (let k = 0; k < 2300; k++) { const x = S(0) - 30 + r() * (w - S(0) + 30), gy = ground(x) - 11 + r() * (h - ground(x) + 11), rx = 3 + r() * 2.4, ry = 1.9 + r() * 1.2; ell(g, x, gy + 0.8, rx, ry, rgba('#5B564D', 0.6)); ell(g, x, gy, rx, ry, ['#C9C3B6', '#AAA497', '#D8D3C8', '#9C968A', '#B7AE9C'][Math.floor(r() * 5)]); ell(g, x - rx * 0.3, gy - ry * 0.35, rx * 0.4, ry * 0.3, rgba('#FFFFFF', 0.35)); }
    dock(g, 0, sea0 - 2, S(0) + 10);
    // hand-painted arrows near the start: back to the beach, on to the waterfall
    arrowSign(g, S(0) + 150, ground(S(0) + 150) - 44, 'PLAYA', '#C0392B', '#FFF4D6', -1);
    arrowSign(g, S(0) + 150, ground(S(0) + 150) - 30, 'CASCADA', '#3B8E38', '#FFD65A', 1);
    // the ice house: a blue sign, a chest freezer and blocks of ice
    const ix = S(1);
    box(g, ix - 30, ground(ix) - 54, 60, 13, 2, '#1C5FA8'); letters(g, 'HIELO', ix, ground(ix) - 51, '#FFFFFF', 1.4);
    box(g, ix - 34, ground(ix) - 34, 40, 22, 3, lin(g, 0, ground(ix) - 34, 0, ground(ix) - 12, ['#FFFFFF', '#C9D5DB'])); box(g, ix - 34, ground(ix) - 36, 40, 4, 1, '#93A7B8');
    for (let k = 0; k < 4; k++) box(g, ix + 12 + (k % 2) * 11, ground(ix) - 22 - Math.floor(k / 2) * 10, 10, 9, 1.5, lin(g, 0, 0, 0, 1, ['#E9F7FC', '#A9D3E6']));
    // the corner store: an open front, shelves of goods and a red soda cooler
    const cx = S(2), cy = ground(cx) - 14;
    box(g, cx - 44, cy - 54, 64, 54, 2, '#5E3B1A'); box(g, cx - 40, cy - 70, 82, 13, 2, '#F6E3B8'); letters(g, 'TIENDA', cx + 1, cy - 67, '#A3241D', 1.4); g.fillStyle = lin(g, 0, cy - 50, 0, cy, ['#F6E3B8', '#E2C48A']); g.fillRect(cx - 40, cy - 50, 56, 50);
    for (const sy of [cy - 38, cy - 22]) { line(g, [[cx - 40, sy], [cx + 16, sy]], C.wood[3], 1.4); for (let k = 0; k < 9; k++) { g.fillStyle = PAPEL[(k + sy) % PAPEL.length]; g.fillRect(cx - 38 + k * 6, sy - 8, 4, 8); } }
    box(g, cx + 24, cy - 40, 18, 40, 3, lin(g, cx + 24, 0, cx + 42, 0, ['#F9856F', '#E0352B', '#A3241D'])); box(g, cx + 27, cy - 34, 12, 26, 2, rgba('#D9EEF6', 0.7));
    // the juice stand: a blue stall with a tin roof and fruit on the counter,
    // and a palapa next door with sacks of supplies under it
    const jx = S(3), jy = ground(jx) - 14;
    box(g, jx - 46, jy - 52, 70, 52, 1, lin(g, jx - 46, 0, jx + 24, 0, PLASTER.blue));
    g.fillStyle = '#F2BC2E'; g.fillRect(jx - 42, jy - 30, 62, 30);
    box(g, jx - 44, jy - 22, 66, 5, 1, '#F0478F'); box(g, jx - 44, jy - 17, 66, 3, 0.5, '#22AEC4');
    for (let k = 0; k < 11; k++) ell(g, jx - 38 + k * 5.6, jy - 25, 2.6, 2.4, ['#F28C28', '#FFD65A', '#3B8E38', '#E0352B'][k % 4]);
    box(g, jx - 44, jy - 50, 66, 11, 1, '#1C3F8A'); letters(g, 'JUGOS', jx - 11, jy - 47.5, '#FFD65A', 1.3);
    poly(g, [[jx - 52, jy - 54], [jx + 30, jy - 54], [jx + 28, jy - 60], [jx - 50, jy - 62]], '#8A6A4E'); for (let k = jx - 50; k < jx + 28; k += 4) line(g, [[k, jy - 61.5], [k + 0.5, jy - 54]], rgba('#5E4530', 0.6), 0.6);
    papelPicado(g, jx - 50, jx + 30, jy - 40, 9);
    ell(g, jx + 34, jy - 6, 5, 3.4, '#22272C'); ell(g, jx + 38, jy - 10, 3, 2.8, '#22272C'); ell(g, jx + 39.5, jy - 9, 1.4, 1.6, '#FFFFFF'); ell(g, jx + 34, jy - 5, 2.6, 1.6, '#FFFFFF'); line(g, [[jx + 31, jy - 3], [jx + 31, jy]], '#22272C', 1); line(g, [[jx + 36, jy - 3], [jx + 36, jy]], '#22272C', 1); line(g, [[jx + 29.5, jy - 7], [jx + 27, jy - 11]], '#22272C', 1);
    const px = jx + 90;
    for (const pp of [px - 34, px + 34]) line(g, [[pp, jy], [pp, jy - 44]], C.wood[3], 2.4);
    poly(g, [[px - 48, jy - 40], [px + 48, jy - 40], [px + 22, jy - 58], [px - 22, jy - 58]], lin(g, 0, jy - 58, 0, jy - 40, [C.straw[2], C.straw[3]]));
    for (let k = px - 46; k < px + 46; k += 3) line(g, [[k, jy - 41], [k + (r() - 0.5) * 3, jy - 34 - r() * 5]], C.straw[3], 0.9);
    for (let k = 0; k < 7; k++) box(g, px - 28 + (k % 4) * 13 + (k > 3 ? 6 : 0), jy - 12 - (k > 3 ? 10 : 0), 13, 12, 3, lin(g, 0, 0, 0, 1, ['#FBF8EF', '#D9D3C6']));
    // the steep lane: a mural of the bay on a house wall, crates, and a mule
    // carrying sacks down the hill
    const mx0 = S(4) - 120, mx1 = S(4) - 10;
    for (let x = mx0; x < mx1; x += 2) { const b0 = ground(x) - 14; g.fillStyle = lin(g, 0, b0 - 74, 0, b0, ['#1E2A44', '#20407A', '#2A63B0']); g.fillRect(x, b0 - 74, 2, 74); }
    const mb = (x) => ground(x) - 14;
    for (let x = mx0; x < mx1; x += 2) { g.fillStyle = '#3E9E63'; g.fillRect(x, mb(x) - 46 + Math.sin(x / 9) * 3, 2, 12); g.fillStyle = '#FFD65A'; g.fillRect(x, mb(x) - 34 + Math.sin(x / 9) * 3, 2, 3); g.fillStyle = '#E9F7FC'; g.fillRect(x, mb(x) - 31 + Math.sin(x / 9) * 3, 2, 1.4); }
    palm(g, mx0 + 26, mb(mx0 + 26) - 44, 22, 1); ell(g, mx1 - 22, mb(mx1 - 22) - 62, 6, 6, '#FFD65A');
    const tx0 = mx0 + 62, ty0 = mb(tx0) - 18;
    ell(g, tx0, ty0, 9, 6.5, lin(g, 0, ty0 - 6, 0, ty0 + 6, ['#E9D3A0', '#B08A52'])); for (const [dx, dy] of [[-3, -2], [3, -2], [0, 2], [-5, 2], [5, 2]]) ell(g, tx0 + dx, ty0 + dy, 1.8, 1.4, '#8A6A3A');
    ell(g, tx0 + 11, ty0 - 2, 3.4, 2.8, '#E9D3A0'); for (const [dx, dy] of [[-8, -6], [6, -7], [-8, 6], [6, 6]]) ell(g, tx0 + dx, ty0 + dy, 4, 1.8, '#E9D3A0');
    ell(g, mx0 + 90, mb(mx0 + 90) - 20, 6, 3, '#1E262C'); ell(g, mx0 + 92, mb(mx0 + 90) - 21, 2, 1.2, '#FFFFFF');
    crates(g, mx1 + 2, mb(mx1 + 2), 3);
    for (let x = S(3) + 140; x < S(4) + 90; x += 6) { const gy = ground(x) - 14; g.fillStyle = lin(g, 0, gy - 7, 0, gy, [C.rock[1], C.rock[3]]); g.fillRect(x, gy - 7 + (x % 12 ? 0 : 0.6), 6.4, 7); g.fillStyle = rgba('#5B534B', 0.5); g.fillRect(x, gy - 7, 0.6, 7); }
    mule(g, S(4) + 70, ground(S(4) + 70) - 12);
    // the umbrella plaza: umbrellas strung on wires overhead, green patio
    // umbrellas over cafe tables, a planter and a menu board
    const ux = S(5), uy = ground(ux) - 14;
    const RED = ['#FF8A80', '#E8574F', '#9E2B25'], WHITE = ['#FFFFFF', '#E3E8EC', '#7F8B95'], GREEN = ['#8ED04A', '#3B9E58', '#1D5B3C'];
    for (const [wy, s1, list] of [[uy - 104, 1.6, [RED, RED, WHITE, RED, RED, WHITE, RED, RED]], [uy - 80, 1.25, [WHITE, RED, GREEN, WHITE, RED, GREEN, RED, WHITE, GREEN]]]) {
      const x0 = ux - 170, x1 = ux + 170;
      g.beginPath(); g.moveTo(x0, wy - 6); g.quadraticCurveTo(ux, wy + 8, x1, wy - 6); g.strokeStyle = '#2A3440'; g.lineWidth = 0.6; g.stroke();
      list.forEach((col, k) => { const x = x0 + 20 + k * ((x1 - x0 - 40) / (list.length - 1)), t = (x - x0) / (x1 - x0); hungUmbrella(g, x, wy - 6 + 14 * 2 * t * (1 - t) * 2 + 8 * s1, col, s1); });
    }
    box(g, ux - 92, uy - 32, 14, 20, 1, '#22272C'); for (let k = 0; k < 5; k++) line(g, [[ux - 90, uy - 29 + k * 3.4], [ux - 81 + (k % 2) * -3, uy - 29 + k * 3.4]], rgba('#FFFFFF', 0.8), 0.6);
    line(g, [[ux - 92, uy - 12], [ux - 94, uy]], '#22272C', 1); line(g, [[ux - 78, uy - 12], [ux - 76, uy]], '#22272C', 1);
    ell(g, ux, uy - 4, 26, 6, '#F1EEE6'); g.fillStyle = '#D6D0C4'; g.fillRect(ux - 26, uy - 4, 52, 4); canopy(g, r, ux - 22, ux + 22, () => uy - 22, () => uy - 6, 5, 7, 1);
    for (const t of [ux - 56, ux + 56]) {
      line(g, [[t, uy], [t, uy - 50]], '#22272C', 1.2);
      poly(g, [[t - 30, uy - 46], [t + 30, uy - 46], [t, uy - 60]], lin(g, 0, uy - 60, 0, uy - 46, ['#6FBF8E', '#3E8A63']));
      for (let k = t - 30; k < t + 30; k += 6) ell(g, k + 3, uy - 46, 3, 1.4, '#3E8A63');
      cafeTable(g, t - 14, uy); cafeTable(g, t + 16, uy);
    }
    // the michelada bar: a teal counter under the stairs, with bottles on the
    // ledge, a blender and the menu painted on the wall
    const kx = S(6), ky = ground(kx) - 14;
    g.fillStyle = lin(g, kx - 70, 0, kx + 70, 0, PLASTER.teal); g.fillRect(kx - 70, ky - 104, 140, 104);
    box(g, kx - 74, ky - 108, 148, 6, 1, '#E4DFD4');
    letters(g, 'MICHELADAS', kx - 14 + 0.8, ky - 89 + 0.8, '#3A1F1A', 1.4); letters(g, 'MICHELADAS', kx - 14, ky - 89, '#C0392B', 1.4);
    box(g, kx - 46, ky - 70, 54, 32, 1, '#24403A');
    for (let k = 0; k < 7; k++) { g.fillStyle = ['#3B8E38', '#E9F7FC', '#C98F12', '#7A2B2A', '#E9F7FC', '#3B8E38', '#C98F12'][k]; g.fillRect(kx - 40 + k * 6, ky - 60, 3, 10); g.fillRect(kx - 39 + k * 6, ky - 63, 1, 3); }
    g.fillStyle = C.wood[2]; g.fillRect(kx - 44, ky - 50, 50, 2);
    box(g, kx - 50, ky - 40, 62, 4, 1, '#E8E4DA'); box(g, kx - 26, ky - 50, 7, 10, 2, rgba('#D9EEF6', 0.8)); box(g, kx - 27, ky - 41, 9, 2, 1, '#7C8794');
    box(g, kx - 46, ky - 36, 54, 36, 1, lin(g, 0, ky - 36, 0, ky, ['#74D5BF', '#45AE98']));
    for (let k = 0; k < 5; k++) { const sx = kx + 16 + k * 11, sy = ky - k * 12; box(g, sx, sy - 12, 12, 12, 0, '#B9B2A6'); g.fillStyle = '#E4DFD4'; g.fillRect(sx, sy - 12, 12, 2); }
    line(g, [[kx + 18, ky - 22], [kx + 70, ky - 82]], '#1E262C', 1.2); for (let k = 0; k < 6; k++) line(g, [[kx + 18 + k * 10.4, ky - 22 - k * 12], [kx + 18 + k * 10.4, ky - 10 - k * 12]], '#1E262C', 0.8);
    crates(g, kx - 92, ky, 2); crates(g, kx - 70 - 4, ky, 1);
    box(g, kx + 74, ky - 14, 16, 14, 2, lin(g, 0, ky - 14, 0, ky, ['#FFFFFF', '#C9D5DB'])); box(g, kx + 74, ky - 15, 16, 3, 1, '#1C5FA8');
    bananaPlant(g, kx + 112, ky, 1.2);
    return c;
  }

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

  return { C, setRider, paco, mario, parrot, maria, treat, DRINKS, PLATES, cafeLane, CAFE, flier, flight, market, FLIGHT, MARKET, tio, deliveries, DELIVER, boat, atv, diver, walker, icon, coast, hill, town, deep, COAST, HILL, TOWN, DEEP };
})();
