# Shared result with the link

## What happened

Ron asked for the shared result to carry the game's link the way MapTap's does, and noted MapTap's result is far less cluttered than ours. Ours ran nine lines: a headline, a points line per question, rarity, speed, island time, total and time.

## What changed

- The shared result is now three lines: the link and the date in AP style, the row of seven marks and the final score.

  ```
  pacoisland.fun Nov. 17
  🐚🥥🌊🦀🐚🥥🐢
  Final score: 33,312
  ```

  Mario's mode adds ", Mario's mode" after the date. The score sheet on the end screen still shows the full breakdown.
- `Copy.share` takes the date, the mode, the marks and the total. `Copy.apDate` writes the date (Jan., Feb., Aug., Sept., Oct., Nov. and Dec. abbreviated, the rest spelled out).
- `js/rarity.js` was rebuilt. The New York sitcom answers added in the last commit had no familiarity score, which would have scored that question as nothing.

## Result

- The headless playtest passes with no page or console errors, and `node tools/check.mjs` shows 0 problems.
- Lesson: rebuild `js/rarity.js` every time an answer list changes, before pushing.
