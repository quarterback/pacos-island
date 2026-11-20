# After action record: PWHL, NWSL and MLV teams, and locked daily sets

**Date:** November 20, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for more obscure sports teams to count as answers, including the Professional Women's Hockey League (PWHL), the National Women's Soccer League (NWSL) and Major League Volleyball (MLV).

## 2. Action

- **Lists (`js/data.js`):** 12 PWHL teams for 2026-27, including the four expansion names revealed Nov. 10 (Detroit Clutch, Hamilton Havoc, San Jose Sea Lions, Vegas Vanguards); the 16 NWSL clubs of 2026; and the 12 MLV teams set for 2027 (the 2026 eight minus the San Diego Mojo, plus DC Flight, Los Angeles Thunder, Minnesota Forge and NorCal Rumble). Each takes its nickname, full name and common short forms. Sources: Wikipedia's league and team pages and the leagues' own releases.
- **Pro team questions:** the leagues join the combined team list, so the existing questions now include them, as the rule that lists be complete for their rule requires: California (Angel City, Bay FC, Wave, Sea Lions, Thunder, Rumble), Texas (Dash, Pulse), Florida (Pride, Valkyries), Canada (Havoc, Victoire, Charge, Sceptres, Goldeneyes), birds (Goldeneyes, a duck), weather or sky (Frost, Supernovas) and nicknames used in two sports (Thunder, Royals, Stars). The New York Sirens and Gotham FC play in New Jersey, so they aren't New York State teams.
- **New question:** "Name a National Women's Soccer League (NWSL) team." It is a hard question. PWHL and MLV questions were tried, but they fall under the game's bar for questions most players can answer (ease below 0.1), so they were left out; their teams count as answers only.
- **Familiarity:** `tools/rarity.py` scores the three leagues by hand tier, since their nicknames are ordinary words, and `js/rarity.js` was rebuilt.
- **Locked days:** the daily sets were rebuilt from the whole pool on every load, so any new question reshuffled every day, today's included. `tools/lock-days.mjs` now records each played day's question ids, through tomorrow, in `js/locked-days.js`, and later days carry on from the last locked one. Days 1 to 5 were locked from the unchanged code before the teams went in. `AGENTS.md` now says to run it before any change to the question pool. `sw.js` moved to `paco-5`.

## 3. Checks

- `node tools/check.mjs`: 1,075 questions, 310 openers, 0 problems.
- Days 1 to 5 match the sets players saw, at both levels. From day 6 on, Paco's sets differ, as expected with a new pool; Mario's are unchanged.
- Every name from every sports list was typed into every sports question, before and after. Sixteen answers gained credit, and 15 off-list cities and nicknames now count where a new team fits ("Vancouver" for the Goldeneyes on birds). One credit was lost: "Charge" no longer counts as a typo of the Chargers on the California question, because it's now the Ottawa Charge. Most other changes turn "not on any list" into "real, but not on this list."
- The answer sweep: 35,898 right answers match themselves, and no off-list item gets credit.

## 4. Gaps

- A nickname shared by two leagues pools its city names, so "Oklahoma City" counts as the Thunder on the California question and "Chicago" counts as the Stars on the Texas question. The same was already true of older shared nicknames.
- WNBA, MLS and other leagues aren't included.
- If the question pool changes without running `tools/lock-days.mjs` first, the days since the last lock can still reshuffle.
