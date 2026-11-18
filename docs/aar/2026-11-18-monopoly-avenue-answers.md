# After action record: answers without their full names

**Date:** November 18, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

A player reported that "Name a Monopoly property whose name ends in "Avenue."" made them type "Avenue": "Pennsylvania" alone did not count, which also cost them the speed bonus. The owner then asked for this to be fixed in every question: never force full names.

## 2. Cause

Most avenues had a short name ("Baltic," "Kentucky"), but States, New York and Pennsylvania had none, and only questions about people accepted part of a name.

## 3. Action

- `js/data.js`: short names "States," "New York," "St. Charles," "Saint Charles," "St. James" and "Saint James."
- `js/engine.js`, every question: a distinctive part of an answer counts. A part is the front or back of the name, or the name without a word every answer shares ("avenue"); it has four or more letters and is not only small words or the question's own words. A part may drop the question's word from the end of a name ("Brooklyn" for Brooklyn Bridge) but not from the front, which makes another thing ("basketball" is not water basketball, "bread pudding" not chocolate bread pudding). A part that fits two answers counts for the more familiar one, so "Pennsylvania" counts in "Name a Monopoly property." Typos are forgiven on parts of six letters or more only, so "king" never reads as "Kong." Questions about people keep their own rules.
- `js/engine.js`, the order of checks: an exact right answer, then an exact real item that is off the list (reported as off), then typos, then parts. Before, a real item typed exactly could be credited as a typo of another answer: "Nigeria" for "starts with A" counted as Algeria.

## 4. Checks

- `node tools/check.mjs`: 0 problems.
- Every answer and alias of all 1,074 questions, against the code before this change: right answers matching themselves went from 35,752 to 35,783 (the new short names); off-list items wrongly credited as a right answer went from 239 to 0; 12 answers match another item with the same name, unchanged, from overlaps in the data.
- Spot checks: "Pennsylvania" and "Pensylvania" count in the Avenue question, "Pennsylvania" and "Marvin" in "Name a Monopoly property," "Norfolk," "Golden Gun," "Brooklyn"; "basketball," "bread pudding," "chocolate" and "Nigeria" (for A) do not.

## 5. Gaps

- A part that drops the question's word from the front is refused even when harmless: "Kong" for King Kong.
- Twelve answers share a name with another item on the same list; they still count, for the other item.
