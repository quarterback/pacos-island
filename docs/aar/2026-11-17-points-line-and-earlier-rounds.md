# After action record: shorter points line, earlier rounds in endless mode

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner said "in all" is not needed in the points line. He said endless mode should not add rounds together, and should show each round's result.

## 2. Action

- The daily end screen now reads "You have 41,242 points."
- The two endless round end designs gained an "Earlier rounds" list: one line per round already played, with the round number, the trip and that round's points. It never shows a sum. It is left out after round 1.
- `Copy.endless` gained `earlierHead` and `earlierRow`, and `Copy.tripShort` gained "boat trip". `docs/endless-mode-screens.md` describes the list.

## 3. Checks

- `node tools/check.mjs`: 0 problems.
- Both round end designs were rendered at phone width and reviewed.

## 4. Gaps

- The three editorial tools were not run; this session cannot download them. The new lines were read by hand.
