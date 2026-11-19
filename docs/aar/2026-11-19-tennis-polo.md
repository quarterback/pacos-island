# After action record: tennis polo, and real words that aren't typos

**Date:** November 19, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for tennis polo (toccer), as described on Wikipedia, to be added to any question it fits.

## 2. Action

- **Answers:** "Tennis polo," also accepted as "Toccer," is a rare answer to "Name a sport played with a racket or paddle" (the goalkeeper holds a racket) and "Name a sport that uses a net" (it's played with a ball into a soccer goal with a net). It doesn't fit the glove, helmet or water-sport questions, so it isn't on them.
- **Familiarity:** `js/rarity.js` was rebuilt with `tools/rarity.py`. Without a score for the new answer, both questions' ease became NaN, they fell to "hard," and 357 of the next 365 daily sets reshuffled. After the rebuild, neither question changes level and no daily set changes. The rebuild also dropped a stale score for "Robot B-9," which is no longer in the data.
- **Matching (`Engine.match`, rule 2b):** "toccer" was credited as soccer on questions that list soccer, because it's one letter away. A name that's an exact answer on another list in the same subject is now never read as a typo of a different answer. It can still be part of one ("Mexico" for Mexico City), and the same word in another form still counts: a plural, a dropped "the," a British "ou" spelling ("Peanut" for Peanuts, "Neighbours" for The Neighbors).

## 3. Checks

- `node tools/check.mjs`: 1,074 questions, 310 openers, 0 problems.
- Every item name in each subject was typed into every other question in that subject, before and after (485,961 pairs). The first draft of rule 2b took away 2,488 credits, including partial names the owner asked to keep ("Kuwait" for Kuwait City) and plurals; narrowing it to typos and exempting word forms brought that to 817. A sample of those reads as right to block: "Mets" isn't the Jets, "Hammer" isn't Hamper, "Avatar" isn't The Aviator, "Iron" isn't Iran. Most other changes turn "not on any list" into "real, but not on this list."
- The answer sweep is unchanged: 35,787 right answers match themselves and no off-list item gets credit.

## 4. Gaps

- Demonyms are now blocked as typos: "Syrian" no longer counts as Syria, nor "Indian" as India.
- The 817 blocked credits were sampled, not each read.
