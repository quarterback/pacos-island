# AAR: Questions mined from open data

**Date:** 2026-11-17

## What was asked

Ron approved mining Family Feud survey data, Wikidata, ConceptNet and Open Trivia DB for questions, said a license change was fine, and asked to run the pipeline from the last run: find prompts, build full answer lists, score familiarity, rewrite in house style, check.

## How each source was reached

The cloud workspace can only reach GitHub, so each source took a different route:

- **ProtoQA (Family Feud surveys):** cloned from GitHub. About 9,800 survey questions, filtered to 1,819 "Name a ..." prompts with five or more answer clusters. `tools/mine/protoqa_candidates.py` repeats the filter.
- **Wikidata:** queried from a browser tab on query.wikidata.org. The queries and notes are in `tools/mine/wikidata_queries.md`. Many items now carry their name in the `mul` language instead of `en`, and the first queries silently dropped them (Forrest Gump went missing) until the query took either.
- **ConceptNet:** its public API returned 502 errors. The seeds came from the 100,000-fact sample published with Li et al. (2016), grouped by "AtLocation" in the browser. The data is noisy and has offensive entries, so it was used only to pick prompts.
- **Open Trivia DB:** its 24 categories were checked against the pool's subjects to find gaps (math, vehicles, computers, comics, anime, mythology).

## What changed

- 55 new questions, all with full answer lists written or checked by hand:
  - **From Wikidata (14):** movies starring Tom Hanks, Julia Roberts, Meryl Streep, Sandra Bullock, Denzel Washington, Will Smith, Leonardo DiCaprio, Reese Witherspoon, Jennifer Aniston and Adam Sandler; winners of the Oscars for best actress, best actor and best supporting actress; best animated feature winners. Familiarity tiers come from each item's Wikipedia sitelinks, through `tools/mine/wikidata_to_angles.py`. Voice roles missing from cast data were added by hand.
  - **From ProtoQA prompts:** something there are seven of, vegetables that aren't green, Disney park rides, things that come in pairs, ways to cook an egg, London sights, hats, power tools, fruit salad, ballpark snacks, movies with talking animals or robots, things with flippers, ways to say goodbye, conditions ending in "itis," game consoles, table games, construction gear, doctor's tools, pirate gear, Hawaii, famous Franks, glove sports, appetizers, music cities, baseball legends, candy with peanuts, three-letter agencies.
  - **From ConceptNet seeds:** things in a kitchen, a bathroom, a garage, on an office desk, at a movie theater, newspaper sections.
  - **From Open Trivia DB gaps:** car brands, superheroes, Studio Ghibli movies, Apple products, shapes, Norse gods, computer brands.
- The pool is 988 questions: 363 whole questions (up from 308) and 625 letter questions.
- `tools/mine/` holds the scripts, the saved Wikidata lists and the notes for each source. `docs/QUESTION-WRITING.md` points to it.
- The question and answer data is now CC BY-SA 4.0, with credits in `LICENSE-DATA.md`. The code and interface text stay CC0.

## Result

- In the first month a Paco set holds two letter questions. Between days 31 and 90 it rises to three, down from about four before this run.
- Paco's daily schedule goes 71 days before a repeat, and no question returns within 62 days.

## Checks

- `node tools/check.mjs`: 988 questions, 257 openers, 0 problems, including the no-giveaway check.
- prosekeep flagged only the known "Testament" false positives.
