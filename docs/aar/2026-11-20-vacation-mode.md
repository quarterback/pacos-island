# After action record: Vacation mode, hosted by Maria

**Date:** November 20, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner wanted a way to play for people who hate timers and speed bonuses, with easier questions and its own emoji. After an endless-style "cozy mode" was proposed and partly built, they chose a daily version called Vacation mode, hosted by Maria, who runs a café on the island and tells players to sit back, have a drink and not worry about time. Every right answer, she brings a drink or a plate from her menu, shown on screen between questions.

## 2. Action

- **A third level (`Engine.LEVELS.vacation`):** no clock, and `Engine.vacationScore` pays rarity points alone. It has its own daily set (`Prompts.VACATION_DAYS`), seven openers with no letter questions, saved under the day key `4v` beside Paco's `4` and Mario's `4m`. It also works in endless mode. `tools/lock-days.mjs` now locks vacation days too.
- **Maria (`Art.maria`):** dark hair in a bun with a hibiscus, gold earrings, an embroidered blouse, an apron over a teal skirt, holding out a tray. She replaces Mario on the Stumped panel in vacation mode, with her own lines.
- **The menu (`Art.treat`, `Art.MENU`):** seven drinks and eight plates, drawn in the game's style: horchata, agua de jamaica, coco frío, limonada, café de olla, licuado de mango, agua de sandía, tacos de pescado, ceviche, chilaquiles, pescado zarandeado, conchas, flan, elote and quesadilla. Drinks and plates take turns, and the day's menu starts at a different place each day, so everyone gets the same treats.
- **The treat screen:** after a right answer in vacation mode, the answer and its points, Maria and the treat, its name and a few words of English, one of Maria's lines, and Next question.
- **Marks and share:** vacation marks sit lower, since there's no speed bonus (🐚 under 13,500, 🦀 under 40,500, 🐢 under 75,600, 🦎 above), and the key leaves out island time. Shares read "pacoisland.fun Nov. 20, 🌺 Vacation mode." The end screen shows only the total, since every point is rarity, and skips the simulated-player comparison, whose players race the clock. Your scores lists vacation days as "Vacation mode."
- **Copy:** the level label and note, Maria's intro on the start screen, seven serving lines, six Stumped lines, the menu and a How to play line, all in `js/copy.js`. `sw.js` moved to `paco-6`.
- The partly built cozy mode (endless-style rounds hosted by Tío) was discarded before commit.

## 3. Checks

- `node tools/check.mjs`: 1,075 questions, 310 openers, 0 problems.
- Paco's and Mario's 365 daily sets are unchanged by the new level.
- A full vacation day at phone size: no clock, the day's vacation set, a treat after each right answer, Maria on Stumped, the end screen with only the total, the share and the scores row. No page errors.
- Paco's daily mode still shows the clock and the rarity-and-speed result, and Mario's endless round on the delivery trip still ends normally.
- `plain-language-default check`, `prosekeep check` and `red-pen-editor inspect` found nothing in the new copy.

## 4. Gaps

- Maria's portrait and the treats were reviewed at phone size only.
- Lifetime points from vacation days open trips like any other day, though vacation days score lower.
- There's no music change or sound for a treat.
