# AAR: Short questions

**Date:** 2026-11-17

## What was asked

Ron said the "Star Wars" question should just be "Name a Star Wars movie," and that every question should be written that way. Brevity is the rule, and his editorial tools enforce it. He said not to drop any questions, only to stop padding them.

## Why the questions had grown

Earlier passes had added a clause for every edge case: "by nickname," "by last name," "Railroads and utilities count," "Countries on the Caspian Sea count as having none," "as the Census Bureau draws it." Each clause tried to settle an argument before anyone started one. That made the questions longer and harder to read, and the edge cases were already handled in the answer lists.

## What changed

- Every whole list question and letter lead in `js/prompts.js` is now a short stem. Examples: "Name a 'Star Wars' movie." "Name a U.S. president." "Name a landlocked country." "Name a sign of the zodiac." "Name a pro team from Texas." The list questions now average about six words.
- The notes after questions are gone (Mexico City, U.S. spelling, numbered Bible books, countries in both Europe and Asia). Those answers still count.
- Every question is still in the pool, now at 947 questions.
- New answers, since the shorter questions ask more broadly:
  - "Star Wars" now includes Rogue One, Solo, The Clone Wars and The Mandalorian and Grogu (released May 2026).
  - Disney princesses now include Elsa and Anna.
  - Presidents now take a full name ("Abraham Lincoln") as well as a last name. The engine tries the last words of a typed name for any list marked `surname`.
- Rarity scores were rebuilt for the new answers.
- AGENTS.md swaps the answer form rule for a brevity rule, and SPEC.md examples were updated.

## Known gap

The giveaway check still refuses "Star Wars" as an answer to the "Star Wars" question, and "Taylor Swift" for her album question, because the question names them.

## Checks

- `node tools/check.mjs`: 947 questions, 125 openers, 0 problems.
- Matching tested for "Abraham Lincoln," "martin van buren," "Rogue One," "the mandalorian & grogu," "Elsa," "Boston Celtics" and "Lakers."
- prosekeep flagged only the known "Testament" false positives. The copy export shrank from about 5,480 words to about 4,450.
- Playthrough in Mario's mode, no page errors.
