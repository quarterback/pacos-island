# After action record: questions that gave away answers

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner noticed questions giving away their answers. He asked why, asked for trivia writing guidance to be read, then for the questions to be rewritten, with my understanding confirmed first.

## 2. Findings

- **Cause:** examples and clarifying notes added to make questions easier to read were often right answers from the same list. Examples include "like the SS in Mississippi," "Rudolph counts," "like a full house," "like A New Hope," "Scorpio and Capricorn count," "where A is Alfa and B is Bravo," "Mexico City counts," "Numbered books like 1 Kings count once," "like Fe for iron" and "Dionysus and Hestia both count."
- **Subjects that are answers:** "Name a Taylor Swift studio album" contained her debut, Taylor Swift, which was rated rare and so scored high. "A song on … Thriller" contained "Thriller," and "touches the Mississippi River" contained Mississippi.
- **Guidance read:** quiz writing guides list giving away answers in the question text as a mistake, and ask for one clear stem. The Trivia Hall of Fame allows a giveaway only as a deliberate joke.

## 3. Action

- Every example and note that named an answer was rewritten without one:
  - "has the same letter twice in a row"
  - "The capital's own district counts."
  - "Books in numbered parts count once."
  - "The sign's everyday name counts."
  - "Name a ranked hand in poker."
  - "Name a word from the phonetic alphabet pilots and police use to spell out letters over the radio."
  - "Name an element whose chemical symbol starts with a different letter than its English name does."
- Edge cases still count as right answers without being named.
- **Taylor Swift:** now "other than her self-titled debut," and the debut no longer counts for that question.
- **Thriller:** now "Michael Jackson's 1982 album, the best-selling album of all time."
- **Mississippi:** the river is now "the great river that flows past St. Louis, Memphis and New Orleans."
- **Star Wars:** the subtitle question no longer accepts "Star Wars" alone for A New Hope.
- **Prevention:** `tools/check.mjs` now fails any question whose wording contains one of its own answers or their other accepted names. "America" is allowed, since it is part of "North America." The rule was added to AGENTS.md and SPEC.md.

## 4. Checks

- `node tools/check.mjs`: 945 questions, 0 problems. The new check caught one more case, "Star Wars" as an accepted name inside the Star Wars question, and it was fixed.
- A headless playthrough of a Paco's mode set and a Mario's mode set had no page errors.
- prosekeep flagged only the two known "Testament" false positives.
