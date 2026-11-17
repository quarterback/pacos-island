# After action record: music that the button turned on but nobody heard

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner reported that the Music button works but makes no sound.

## 2. Cause

- **The silent switch.** On an iPhone, web audio follows the ring/silent switch; media playback does not. With the phone on silent the game played and iOS muted it.
- **A stuck audio engine.** With music saved as on, the first touch created the audio engine on touch-down. iPhones do not count touch-down as permission for sound, so the engine started suspended. Later taps on Music or Start found the beat timer already running and returned before waking the engine.
- The mix was also quiet (gain 0.16) for phone speakers.

## 3. Action

- `unlock()` in `js/music.js` runs on every start, which always comes from a tap. It sets `navigator.audioSession.type = 'playback'` where Safari supports it, so audio plays through the silent switch. On older iPhones it loops a silent WAV clip, which does the same. It resumes the engine and plays a one sample buffer inside the tap.
- `start()` now wakes the engine even when the beat timer is already running.
- A saved "on" waits for `touchend`, `click` or `keydown` instead of `pointerdown`.
- Back from a hidden tab, the music resumes where the browser allows it and otherwise waits for the next tap.
- The mix is louder (gain 0.3) through a limiter so it stays clean.

## 4. Checks

- `node tools/check.mjs`: 0 problems. `js/music.js` passes `node --check`.
- In headless Chrome at phone size: the button started the engine (19 notes in 1.5 seconds); after a reload with music saved on, nothing played until a tap and Start then started it; turning it off stopped all new notes. No page errors.

## 5. Gaps

- This could not be tested on an iPhone here. The silent switch handling needs a check on a real phone, with the switch on silent and on ring.
