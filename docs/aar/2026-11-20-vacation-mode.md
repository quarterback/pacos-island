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

## 4. Follow-up: Maria's own lane

The owner played it on a phone and said Maria should live in the main picture, with Vacation mode taking her own lane like every other trip, not appearing as a big portrait in the panel below.

- **The lane:** a new trip, "Stroll to Maria's café" (`cafe`, flagged `vacation`), is the only trip Vacation mode takes and never shows for the other levels. `Art.cafeLane` draws a beach boardwalk with the bay behind it: the beach path with a CAFE arrow, a hammock between palms, a coconut stand, tide pools with a starfish and a crab, a volleyball net, shady palms with beach chairs, and Maria's palapa café with a CAFE MARIA sign, a menu board, tables and Maria at the counter. Umbrellas, sandcastles, surfboards and pangas fill the sand between stops, with sailboats and pelicans on the bay. Stops are closer together than other trips (216,000 points to the café), since vacation days score lower.
- **Maria in the scene (`Scene.host`):** after a right answer she steps onto the boardwalk beside Paco, facing him, with the treat on her tray. On Stumped she stands beside him with an empty tray and speaks from the panel without a portrait. She leaves when the next question starts.
- **The panel:** the treat screen keeps the treat drawn large, its name, its English words and Maria's line; the portrait is gone.
- Vacation days saved before the lane existed now use it. The pixel font gained F and a space. Headings read "Paco strolled with you to the hammocks."

## 5. Checks for the follow-up

- `node tools/check.mjs`: 1,075 questions, 310 openers, 0 problems.
- A full vacation day at phone size: the café lane, Maria beside Paco with each treat and on Stumped, no page errors. Paco's and Mario's modes and endless mode list the seven usual trips and not the café lane.

## 6. Follow-up: ordering from the menu

The owner asked for the menu itself to show after each right answer, like a real menu, so the player picks what they want, sees it happen in the picture and then moves on, with real screen transitions: a game within the game.

- **The menu screen:** after a right answer in vacation mode, a cream paper card, Café Maria ("Everything's on the house. What'll it be?"), lists the seven drinks and eight plates under Drinks and Plates, each with its drawing, Spanish name and English words. Every row is a button.
- **The delivery:** the pick is saved with the answer (`treat`). In the scene Maria walks in from the right, bobbing as she walks, and stops beside Paco with it on her tray. The next screen shows the pick drawn large, its name and her line.
- **Transitions:** the menu and delivery screens slide up and fade in over 320 milliseconds; with reduced motion they appear at once, and Maria is already beside Paco.
- The day-ordered treats from the first version are gone; players choose. Contrast on the card: ink on paper 14.4 to 1, the descriptions 8.9 to 1, and on the highlighted row 12.1 and 7.4 to 1.

## 7. Checks for the menu

- A full vacation day at phone size: seven questions with one Stumped, a different pick from the menu after each right answer, each pick saved, Maria's walk caught in frames at about 0.2, 0.7, 1.2 and 1.6 seconds. No page errors.

## 8. Follow-up: editorial review

The owner asked that the vacation copy pass the editorial tools and follow the same rules as the rest of the game.

- `tools/copy-export.mjs` had no sample for the new progress line, so the export printed "Question the upper waterfall of 7"; it now samples `vacation.progress`, and every vacation line is in the export.
- `plain-language-default check`, `prosekeep check` and `red-pen-editor inspect` ran on the full export (730 lines) and on the vacation copy alone. The full-export findings are the known ones: run-on "sentences" made by joining labels, "Testament" in the Bible question, and the same progress line on two screens. One was real: Maria's Stumped line "Next one's yours." could appear on the same panel as Esmeralda's "Next one's yours!" (on the 10th Stumped). It is now "The next one has your name on it."
- Read against `AGENTS.md`: Maria's intro said "Have a drink and take your time" on the same screen as the level note "Play the game at your own pace," restating it; the intro now reads "Maria runs the café by the beach. Points come only from how rare your answer is." The menu heading said "Café María" while she is Maria everywhere else, including the café sign; it is now "Café Maria." Labels, buttons and menu descriptions take no period, full sentences keep theirs, and there are no serial commas.
- After the fixes, the vacation copy alone passes all three tools with no findings.

## 9. Gaps




- Maria's portrait and the treats were reviewed at phone size only.
- Lifetime points from vacation days open trips like any other day, though vacation days score lower.
- There's no music change or sound for a treat.
