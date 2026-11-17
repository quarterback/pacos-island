# After action record: one row per question, a second slop scan, AP style

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner shared a screenshot of "The answer lists" on the end screen and said he did not like its repeating structure. He asked for a second anti slop UI skill to catch remaining AI tics, and for the game's wording to follow AP style and the plainlanguage.gov rules.

## 2. Action

- **End screen:** "The answer lists" is gone. It repeated the question, the player's answer and the points in seven blocks of the same shape, under a score sheet that already listed the answers and points. Each score row now opens to show its question and every right answer with its rarity points. The player's own answer is marked in the list. A question with no answer still opens.
- **Second skill:** added the no-slop skill from eid0lon/zero-slop (Apache 2.0) at `.agents/skills/zero-slop/`, with its pattern list, references and steps. Its helper script was left out. AGENTS.md now tells agents to scan against its pattern list after the no-slop-ui checklist, and to show each fact once per screen.
- **Scan findings fixed:** the repeated blocks above (its "hierarchy collapse" pattern), a boxed surface around every answer list, two raw hex colors on the main button (now `--sun-deep` and `--sun-lift`), negative letter spacing on the wordmark, and a leftover `image-rendering: pixelated` rule on the trip pictures.
- **Scan findings left alone:** `outline: none` on the two headings that receive focus from script, since they are not controls. The hard shadow on large numbers stays as part of the title style. The share text still repeats the day's numbers because it shows exactly what gets copied.
- **AP style and plain language:** "U.S." and "U.N." take periods. Numbers four, five and six are spelled out in questions. The reset time reads "6 a.m." in place of "6:00 AM", with "noon" and "midnight". Answer counts under 10 are spelled out. Fragments became sentences: "That answer isn't on the list.", "We counted that as Oaxaca.", "You have 41,242 points in all.", "Score 68,758 more points to open the ATV ride." The copy failure note said "the text below" when the text sits above; it now says "above". Two questions were shortened.
- **Tooling:** `tools/copy-export.mjs` prints every line of player text for the editorial checks.

## 3. Checks

- `node tools/check.mjs`: 218 questions, 21 days, 0 problems.
- A full day was played in headless Chrome at phone width with one timed out question, with no page errors. The end screen was screenshotted closed and with two rows open.
- All 128 exported lines were read by hand against AP style and the plain language guidelines.

## 4. Gaps

- `prosekeep check`, `plain-language-default check` and `red-pen-editor inspect` were not run. This session was not allowed to download and run them. They need a run on the output of `tools/copy-export.mjs` before the next copy change ships.
- The owner's meta description was left as written.
- Stored results from earlier days keep working. Question wording changed for display only; question ids did not change.
