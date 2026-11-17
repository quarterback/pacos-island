# After action record: Your scores, and keeping them

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

Players asked about saving scores. The owner chose two steps: a screen with every day's score, and making saved scores harder to lose. Cloud saving with a code was left for later.

## 2. Action

- **Your scores screen** (`#scores`), opened from a link under Start on the title screen and from the end of a daily trip. It lists days played, the current streak (back from today, or from yesterday if today is still to play), the best streak, the best day, the average and lifetime points, in the same plain totals list as the end screen. Below it, every finished day, newest first, with its date, trip, Mario's mode where it applies and its score. Each day opens to its seven questions, answers and points. Endless rounds are not listed. Nothing new is stored: the screen reads the day records the game already keeps.
- **Keeping scores:**
  - When a day is finished, and when the screen opens, the game asks the browser to keep the site's data (`navigator.storage.persist()`). Chrome usually agrees; Safari mostly does not.
  - On an iPhone or iPad in Safari, when the game is not on the Home Screen, the end screen and Your scores explain that Safari deletes saved scores after seven days without a visit and that adding the game to the Home Screen keeps them.
  - The "Play on another device" link is now "Back up your scores," on the end screen and at the bottom of Your scores. Its text says to save the link somewhere safe or open it on another device. The link already carried the whole save, scores included.

## 3. Checks

- `node tools/check.mjs`: 0 problems. Every script passes `node --check`. `plain-language-default check` and `prosekeep check` found nothing in the new lines.
- In headless Chrome with an iPhone user agent, with six earlier day records seeded (one in Mario's mode, with a gap): after a daily trip, the end screen showed the Home Screen tip, the Your scores link and Back up your scores. Your scores showed 6 days played, a current streak of 3, a best streak of 3, the best day, average and lifetime, and 7 day rows; a day opened to its seven answers. The backup link carried the save. Back returned to the end screen. No page errors.

## 4. Gaps

- Scores stay on the device. A wiped phone without a saved backup link loses them; cloud saving with a code would fix that.
- The backup link is long (several thousand characters) once there are many days.
