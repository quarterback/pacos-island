# AAR: Angled questions and a writing guide

**Date:** 2026-11-17

## What was asked

Ron asked to redo the questions with what quiz writers know about varying a set, to write those lessons down for future agents, and to add more whole questions as the last run said the pool needed.

## What was wrong

The pool was almost all one shape: a list per topic plus letter cuts of it. About 1,000 of 1,146 questions were letter rules ("has the letter G," "ends with S," "has no letter A," "has six letters or fewer"). Every round had the same rhythm, and the letter rules leaned on sports and geography lists.

## What changed

- `docs/QUESTION-WRITING.md` now holds the lessons for future agents:
  - who the questions are for
  - the kinds of question
  - how a round is built
  - how to write a question and its answer list
  - how to add one
  - the checks to run
  - what the pool still needs

  AGENTS.md points to it.
- 170 angled questions with their own answer lists, in nine kinds:
  - **Trait:** "Name a red fruit." "Name an animal with stripes."
  - **Wordplay:** "Name a word that comes before 'cake.'" "Name a song with a color in its title."
  - **People:** "Name a famous Taylor." "Name a singer known by one name."
  - **Place:** "Name a movie set in Paris." "Name a TV show set in a hospital."
  - **Time:** "Name a holiday in December." "Name a Christmas song."
  - **Everyday:** "Name something you'd find in a junk drawer."
  - **Crossover:** "Name a planet named after a Roman god." "Name a Disney movie that became a Broadway musical."
  - **Plain category:** cheeses, soaps, ballets, cookies and others.
- Subjects added: people, holidays, nature, kids, art, awards and tech, alongside more food, drink, TV, music, style and home.
- Letter questions cut to "starts with" and "has the letter" only. The tricky rules are gone. A round holds at most two letter questions, and one for new players and in Mario's mode.
- A round holds no more than two questions of one kind (three plain category questions), on top of one question per subject.
- Easy angled questions open rounds. Medium and hard slots borrow whole questions before reaching for more letter rules.
- Rarity scores cover the new answers (9,052 in all).

## Result

- Pool: 933 questions, of which 308 are whole questions (up from about 140) and 625 letter questions (down from about 1,000).
- In the first month a Paco set averages two letter questions, and a Mario set one. Before this run it was four.
- Paco's daily schedule goes 71 days before a repeat and never repeats within 60 days. Mario's goes 74 days.

## Known gap

After about seven weeks the unseen whole questions run low, and letter questions climb back to about four a round. The guide sets the target: around 600 whole questions.

## Checks

- `node tools/check.mjs`: 933 questions, 209 openers, 0 problems, including the no-giveaway check across all new lists.
