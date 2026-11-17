/* Paco's Island: background music.

   A short calypso loop played with Web Audio, written as note numbers (MIDI
   style) and synthesized in the browser, so there is no audio file and it
   works offline. A steel-drum melody over a bass line and a shaker, in C:
   C, A minor, F, G, eight bars, about 18 seconds per pass.

   Off until the player turns it on. The choice is saved on this device.
   Browsers only start sound after a tap, so a saved "on" waits for the
   first tap on the page. The music pauses while the page is hidden. */
'use strict';
const Music = (() => {
  const KEY = 'paco-music';
  const BPM = 104;
  const STEP = 60 / BPM / 2; // eighth notes
  const _ = null;
  // Melody, one eighth note per entry, eight per bar.
  const MELODY = [
    72, _, 76, _, 79, 76, _, 72,   74, _, 76, 72, _, 69, _, _,
    69, _, 72, _, 77, 76, _, 74,   74, _, 71, _, 67, _, _, _,
    76, _, 79, _, 84, _, 79, 76,   76, _, 74, 72, _, 76, _, 72,
    72, 74, _, 77, _, 76, 74, _,   74, _, 79, _, 71, _, _, _,
  ];
  const ROOTS = [48, 45, 41, 43, 48, 45, 41, 43]; // C, A minor, F, G
  const BASS = { 0: 0, 3: 0, 4: 7, 6: 12 };       // calypso bass: step in bar -> interval

  let ctx = null, master = null, noise = null, timer = null;
  let step = 0, nextTime = 0;
  let on = false;
  try { on = localStorage.getItem(KEY) === 'on'; } catch (e) { /* storage off: stay quiet */ }

  const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);

  function setup() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
    // One second of white noise, reused for every shaker hit.
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }

  // Steel drum: a few sine partials with a quick attack and a ringing decay.
  function pan(note, t) {
    const f = hz(note);
    for (const [ratio, level, decay] of [[1, 0.5, 0.9], [2, 0.22, 0.45], [3, 0.1, 0.25], [4.2, 0.05, 0.12]]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * ratio;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(level, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      o.connect(g).connect(master); o.start(t); o.stop(t + decay + 0.05);
    }
  }

  function bass(note, t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = hz(note);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.45, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + STEP * 1.6);
    o.connect(g).connect(master); o.start(t); o.stop(t + STEP * 1.7);
  }

  function shaker(t, level) {
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; f.type = 'highpass'; f.frequency.value = 6000;
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(f).connect(g).connect(master); s.start(t, Math.random() * 0.9); s.stop(t + 0.06);
  }

  function play(i, t) {
    const note = MELODY[i % MELODY.length];
    if (note !== null) pan(note, t);
    const bar = Math.floor(i / 8) % ROOTS.length, inBar = i % 8;
    if (inBar in BASS) bass(ROOTS[bar] + BASS[inBar], t);
    shaker(t, inBar % 2 ? 0.12 : 0.05);
  }

  // Schedule notes a little ahead of time so timers can be late without gaps.
  function tick() {
    while (nextTime < ctx.currentTime + 0.12) {
      play(step, nextTime);
      step = (step + 1) % MELODY.length;
      nextTime += STEP;
    }
  }

  function start() {
    setup();
    if (!ctx || timer) return;
    ctx.resume();
    step = 0; nextTime = ctx.currentTime + 0.05;
    timer = setInterval(tick, 25);
  }

  function stop() {
    clearInterval(timer); timer = null;
    if (ctx) ctx.suspend();
  }

  function set(value) {
    on = value;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* not saved */ }
    if (on) start(); else stop();
  }

  // A saved "on" starts with the first tap, as browsers require.
  function armFirstTap() {
    if (!on) return;
    const go = () => { window.removeEventListener('pointerdown', go); window.removeEventListener('keydown', go); if (on && !document.hidden) start(); };
    window.addEventListener('pointerdown', go);
    window.addEventListener('keydown', go);
  }

  document.addEventListener('visibilitychange', () => {
    if (!on || !ctx) return;
    if (document.hidden) { clearInterval(timer); timer = null; ctx.suspend(); }
    else start();
  });

  armFirstTap();
  return { isOn: () => on, set, toggle: () => set(!on) };
})();
if (typeof module !== 'undefined') module.exports = Music;
