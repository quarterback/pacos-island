# After action record: interface text rules

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner said the points line needs no "You have". It should read as the figure alone. He asked why the copy did not follow Microsoft's or Salesforce's guidelines for interface text.

## 2. Action

- The earlier pass applied AP style and the plain language guidelines, which are written for prose. It turned short status lines into full sentences. This run applies interface text rules on top: fewest words, figures as labels, no period on labels and fragments.
- Lines changed: "41,242 points", "Counted as Oaxaca", "Not on the list. Try another.", "68,758 more points to open the ATV ride", "All 12 right answers and their rarity points", "New questions at 6 a.m. your time". The two endless mode help lines lost their periods.
- AGENTS.md now states the rule and names both sources. AP style still governs spelling, numbers, abbreviations and times.

## 3. Checks

- `node tools/check.mjs`: 0 problems.
- Every exported line was read again against the rule.

## 4. Gaps

- The three editorial tools were not run; this session cannot download them.
