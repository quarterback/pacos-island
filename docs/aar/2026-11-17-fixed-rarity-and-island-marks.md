# After action record: fixed rarity scores and island marks

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for two changes, and said another agent now owns the redesign:

- Score rarity from fixed scores computed for each answer, so the game doesn't depend on how many people play.
- Replace the colored squares with island emoji, reptiles included.

## 2. Action

- **Rarity scores:** `tools/rarity.py` builds `js/rarity.js`, a fixed familiarity score for all 557 answers. For places, elements and presidents, 60% comes from how often the name appears in English text (the wordfreq package) and 40% from the hand tier. Presidents are looked up by full name, and Ciudad de México by "Mexico City." Team nicknames use the hand tier alone, because nicknames like Heat, Wild and Stars are common words. Against the hand tiers, text frequency agreed well for elements, countries and US states and poorly for teams, which is why teams were left on tiers.
- **Scoring:** an answer's share is its weight over the weights of all the right answers on that question, then the World Six curve runs as before. The same answer always scores the same.
- **Server removed:** the answer counting function, its D1 schema and every API call are gone. The game is a plain static site on any host.
- **Player text:** the result now shows where an answer ranks ("The least familiar of 6 right answers") in place of "Rarer than 87% of today's answers." The answer lists show each answer's rarity points in place of crowd percentages. The intro and page descriptions say "The rarer your answer" in place of "The fewer people who give your answer."
- **Marks:** 🌊 no answer, 🐚 under 5,000, 🦀 5,000 to 11,999, 🐢 12,000 to 19,999, 🦎 20,000 and up. They appear in the share text, the score sheet and the row of seven during play, where questions still ahead show 🏝️. The only CSS change was swapping the colored square rules for emoji sizing.
- **Trips:** the new scores spread days about 15% higher in simulation (middle day about 32,000, top tenth about 52,000), so stops, unlocks and the dive's full day were scaled to match. The boat reaches the island at 54,000, the ATV opens at 110,000 and the dive at 450,000.
- **Docs:** SPEC.md and README.md describe the fixed scores, how to rebuild them and the new deploy steps. `tools/check.mjs` now fails if an answer has no score.

## 3. Checks

- `node tools/check.mjs`: 218 questions, 21 days, 0 problems.
- A full day played in headless Chrome had no page errors and no failed requests.
- Editorial checks on an export of all copy: prosekeep 0 findings, plain-language-default 0 problems, red-pen-editor flagged only overlaps from sample values.

## 4. Gaps

- Team familiarity still rests on hand tiers. Wikipedia pageviews per team would be a measured signal, but the workspace can't reach Wikimedia.
- A few text scores lean on other meanings of a name: Chihuahua (the dog) ranks above Jalisco. The 40% tier share softens this but doesn't remove it.
