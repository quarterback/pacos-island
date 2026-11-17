# After action record: a title screen with Start

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for a title screen with a Start button, like a video game and like Coalition, which opens on its art, a large wordmark, one line, Start and a credit.

## 2. Action

- **Title screen:** a full screen `#splash` opens on every visit. The bay from the boat trip fills the screen: the coast pans slowly, Paco's boat bobs, and every 16 seconds Esmeralda flies across carrying the other twin (Mario in Paco's mode, Paco in Mario's). Over it, a solid panel holds the wordmark, "The rarer your answer, the farther Paco takes you.", a large Start button, a How to play link and "A game by Ron Bronson."
- **Drawing:** `js/splash.js` draws on a plain canvas, separate from the Pixi scene. Each frame is built at the art's own 240 pixel height and scaled up whole, so the title keeps one pixel scale. The strip's top row of sky stretches above it and the sea's color fills below. With reduced motion the scene holds still. On wide screens the boat sails in the open water left of the panel.
- **Start:** hides the title, makes the page usable again (`inert` is set while the title is up), moves focus to the setup heading, and starts the music if the player has it on. Start is the first tap browsers require for sound. How to play closes the title and opens the How to play list.
- **Setup screen:** the intro paragraph is gone in Paco's mode, since the title screen now carries the pitch; Mario's introduction still shows in his mode. A page opened with a link from another device skips the title so its import dialog works.
- Following the project's design rules, the Start button is a plain solid button with no pulse or glow, unlike Coalition's.
- `sw.js` caches `js/splash.js` under `paco-3`.

## 3. Checks

- `node tools/check.mjs`: 0 problems. Every script passes `node --check`.
- In headless Chrome: Start had focus on load and the page behind was inert. Start hid the title, focus moved to the setup heading and the intro was hidden; Start on setup then opened the first question. How to play opened the list. Phone (1x and 2x), desktop (1x and 2x) and reduced motion were screenshotted and reviewed, with no page errors over five reloads.
- Fixed during review: a negative clock on the first frame, a vertical line from stretching the strip's bottom row, the boat hidden behind the panel on desktop and cut off at the edge, and a focus outline on the setup heading.

## 4. Gaps

- The title shows on every visit, also to players who return the same day to see their result; one tap on Start continues as before.
- There is no Music toggle on the title screen itself; it stays on the scene behind.
