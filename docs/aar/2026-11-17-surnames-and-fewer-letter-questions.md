# Surnames count, and fewer letter questions

## What happened

Ron played round 2 in endless mode and hit three problems:
- "Lawrence" and "Aniston" were refused for "Name a famous Jennifer," because the list only held full names.
- "The Cosby Show" was refused for "Name a sitcom set in New York," because the list left it out.
- "Name a Beatles No. 1 hit whose title has the letter Y in it" felt like a puzzle about spelling, not about the Beatles.

## What changed

- **Part of a name counts on people questions.** For any question with the `people` shape, the engine also accepts a unique part of an answer's name: the last name, everything after the first name, or the name minus the word the question gives. "Aniston" counts for a famous Jennifer. "Will," "Jada" and "Pinkett" count for a famous Smith. A part shared by two answers counts for neither, so "Simpson" alone does not count for "The Simpsons." The code is in `js/engine.js` (`partNames`).
- **Letter questions are rare now.** New rounds only deal "starts with" questions, and only on countries, capitals, states, state capitals, presidents, elements and the four leagues' team nicknames. The "has the letter" questions and the letter questions on songs, movies, foods and other titles are retired. They stay in the pool, so a round already saved on a phone still loads. A round holds at most one letter question, and none for new players or in Mario's mode.
- **New York sitcoms:** added "The Cosby Show," "Everybody Loves Raymond," "Diff'rent Strokes" and 19 more. Removed "Sanford and Son" (set in Los Angeles), "Ramy" (New Jersey) and "Pen15" (Connecticut).
- `docs/QUESTION-WRITING.md` now covers the letter rule and the part-of-a-name rule.

## Result

- `node tools/check.mjs` shows 0 problems.
- Daily rounds hold 43 letter questions in the first 60 days, out of 420 questions, down from about two a day.
- There are 410 questions left to deal, so the first repeat in Paco's mode comes on day 47, down from day 71. The next batch of whole questions (cartoons, sitcoms, TV, charts, desserts, flags and ProtoQA prompts) pushes that back out.

## Still open

- Other lists can have gaps like the Cosby one. Any list a player calls out gets fixed the same day.
