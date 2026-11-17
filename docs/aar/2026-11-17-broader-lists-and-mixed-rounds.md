# AAR: Broader lists and mixed rounds

**Date:** 2026-11-17

## What was asked

Ron asked for more questions that women spot and play, not sets tilted toward sports and geography. He wanted reality TV, tools, wine grapes, coffee and tea countries, oil, gold and silver, food, authors and literature. A round should never ask two questions on the same subject, the game should be easier for new players and early rounds, and Mario's mode should give 40 seconds.

## What changed

- 36 new lists:
  - TV: "Real Housewives" cities, Kardashians and Jenners, "Shark Tank" sharks, "American Idol" judges, Bridgerton siblings, "Peanuts" characters.
  - Books: Roald Dahl, "Little House," Dickens, the Brontës, "Little Women," the Bennet sisters, Suzanne Collins.
  - Music and the stage: Spice Girls, Destiny's Child, Andrew Lloyd Webber musicals, songs from "The Sound of Music" and "Grease."
  - Movies and history: "The Wizard of Oz" characters, Tudor monarchs.
  - Food and drink: pasta, cheese, citrus, herbs, spices, apples, squash, wine grapes, Starbucks sizes, and countries that grow coffee or tea.
  - Money: OPEC members (11 since the United Arab Emirates left in May 2026) and precious metals.
  - Home and style: tools in a toolbox, birthstones.
- Letter questions were added for pasta, cheese, tools, wine grapes, spices, apples and birthstones.
- The pool grew from 947 to 1,146 questions across 17 subjects.
- A round never repeats a subject. Sets pick a subject first and then a list, with sports, geography, science and word lists weighted down. Yesterday's subjects and lists sit out when they can.
- Letter questions are capped per round: three in Paco's mode, two for new players and in Mario's mode. The trickier letter rules (ends with, no letter, letter counts) are capped at one in Paco's mode and none elsewhere.
- Paco's daily climb is now two openers, one easy question, three medium and one hard. Endless mode uses a starter climb with no hard question for players under 50,000 lifetime points, for the first three rounds, and after a round under 12,000.
- Mario's mode gives 40 seconds a question.
- Whole list questions may have five answers (Spice Girls, Bennet sisters).
- Rarity scores were rebuilt, and the check now verifies that no day or round repeats a subject.

## Known gap

Whole list questions are the most accessible kind, but there are only about 140 of them against about 1,000 letter questions. After the first month the letter limit gives way to avoid repeats, so letter questions climb from about four a day to six. More whole lists are what fixes that.

## Checks

- `node tools/check.mjs`: 1,146 questions, 187 openers, 0 problems.
- Pushed before playtests at Ron's request. The copy checks and browser playthrough still need to run.
