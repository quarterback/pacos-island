/* Paco's Island: background music.

   A short calypso loop played with Web Audio, written as note numbers (MIDI
   style) and synthesized in the browser, so there is no audio file and it
   works offline. A steel-drum melody over a bass line and a shaker, in C:
   C, A minor, F, G, eight bars, about 18 seconds per pass.

   Off until the player turns it on. The choice is saved on this device.
   Browsers only start sound after a tap, so a saved "on" waits for the
   first tap on the page. The music pauses while the page is hidden.

   iPhones mute web audio with the ring/silent switch. unlock() marks the
   page's audio as playback, which plays through the switch: with
   navigator.audioSession where Safari has it, and otherwise by looping a
   silent audio clip, which switches the page to playback too. */
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
    // a limiter after the mix keeps louder playback clean on phone speakers
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -12; limit.ratio.value = 6;
    limit.connect(ctx.destination);
    master = ctx.createGain();
    master.gain.value = 0.3;
    master.connect(limit);
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

  // A tiny silent WAV, looped, for iPhones without navigator.audioSession.
  let silent = null;
  function silentClip() {
    const n = 4410, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const str = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); str(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 44100, true); v.setUint32(28, 88200, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * 2, true);
    const a = new Audio(URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })));
    a.loop = true; a.setAttribute('playsinline', ''); a.preload = 'auto';
    return a;
  }

  // Called from a tap: wake the audio and let it play through the silent switch.
  function unlock() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* not supported */ }
    if (!navigator.audioSession && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
      silent = silent || silentClip();
      silent.play().catch(() => {});
    }
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    // a one sample buffer started inside the tap, which some browsers need
    const b = ctx.createBufferSource(); b.buffer = ctx.createBuffer(1, 1, ctx.sampleRate); b.connect(ctx.destination); b.start(0);
  }

  function start() {
    setup();
    if (!ctx) return;
    unlock(); // every start comes from a tap, so always wake the audio
    if (timer) return;
    step = 0; nextTime = ctx.currentTime + 0.05;
    timer = setInterval(tick, 25);
  }

  function stop() {
    clearInterval(timer); timer = null;
    if (ctx) ctx.suspend();
    if (silent) silent.pause();
  }

  function set(value) {
    on = value;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) { /* not saved */ }
    if (on) start(); else stop();
  }

  // A saved "on" starts with the first tap, as browsers require.
  function armFirstTap() {
    if (!on) return;
    // iPhones allow sound from the end of a touch or a click, not from touch-down
    const kinds = ['touchend', 'click', 'keydown'];
    const go = () => { kinds.forEach((k) => window.removeEventListener(k, go, true)); if (on && !document.hidden) start(); };
    kinds.forEach((k) => window.addEventListener(k, go, true));
  }

  document.addEventListener('visibilitychange', () => {
    if (!on || !ctx) return;
    if (document.hidden) { clearInterval(timer); timer = null; ctx.suspend(); if (silent) silent.pause(); }
    else {
      // desktops let the music resume at once; iPhones need a new tap, so wait for one if it stays off
      start();
      setTimeout(() => { if (on && ctx.state !== 'running') { clearInterval(timer); timer = null; armFirstTap(); } }, 400);
    }
  });

  armFirstTap();
  return { isOn: () => on, set, toggle: () => set(!on), state: () => (ctx ? ctx.state : 'none') };
})();
if (typeof module !== 'undefined') module.exports = Music;
