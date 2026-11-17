# After action record: cut the rank line

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked to remove the line under each result that ranked the answer ("The least familiar of 6 right answers"). He called that detail unnecessary and an AI tic that should not have shipped.

## 2. Action

- Removed the rank line from the result screen, along with its copy, its page element, its style and the engine's rank function. The unused "rarer than" percentage was also dropped from the engine and from saved answers.
- Trimmed the how to play list. Two lines that spelled out point ranges and repeated "the rarer your answer" became: "Rarer answers earn more points, up to 20,000." and "Answering fast adds a speed bonus, which grows with rarity."
- Removed the rank line from SPEC.md.

## 3. Checks

- `node tools/check.mjs`: 0 problems.
- A full day played in headless Chrome had no page errors. The result now shows the answer, its points and the rarity and speed split.
- prosekeep check: 0 findings. plain-language-default check: 0 problems.

## 4. Lessons

- The rank line was added in the previous run to replace "Rarer than 87% of today's answers." Removing the crowd data was a reason to cut that line, not to replace it. Extra explanatory lines on the result screen should be cut before shipping.
