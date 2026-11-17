# After action record: endless test mode and a bigger, easier question pool

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for four things while the game is in testing:

- Let players keep playing as long as they want, which also lets them reach the ATV and dive trips.
- Expand the question pool by a lot.
- Make questions easier for people who don't play trivia, and more varied.
- Open every set with easy questions and get harder from there.

## 2. Action

- **Endless mode:** built to the other agent's screen notes in `docs/endless-mode-screens.md`, using the `Copy.endless` lines as written. With `TEST_MODE` on, the title screen offers today's trip or endless mode. Endless rounds open every trip, skip today's daily questions and questions already seen, and end with an "Earlier rounds" list (one line per finished round, never added up), then "Play another round," "Change trip" and a link back to today's trip. The round end shows no lifetime total. A dive round names the deepest mark passed. The daily end keeps its share text and adds "Play another round" below it. Rounds are saved apart from the daily game and add to lifetime points. Records now keep their question ids. Records from before this change are cleared, but their lifetime points are kept.
- **Merge:** the other agent pushed AP style question wording ("U.S.", "four letters or fewer"), the endless mode designs, the earlier rounds list and interface text rules while this run was in progress. The new question text follows the same AP style.
- **New lists:** 198 world capitals, 50 US state capitals, 88 constellations, 24 Greek letters, 26 NATO alphabet words and 56 books of the Bible, with familiarity tiers. `tools/rarity.py` scored all 999 answers.
- **New groups:** countries by continent, capitals by continent, US states by Census region, element symbols and atomic numbers, presidents by party and era, and teams by where they play.
- **New hand made questions:** borders of China, Russia, Germany and Brazil; states on the Atlantic, the Mississippi River and the Great Lakes, states bordering Canada and the 13 colonies; every NBA, NFL, MLB and NHL team; noble gases, halogens, alkali metals, the first 10 and 20 elements, one letter symbols and symbols that don't match the English name; the zodiac; and the books of the Old and New Testaments.
- **Pool:** 640 questions, up from 218.
- **Ease:** each question is scored by how many of its answers most people know. Questions almost nobody could answer were dropped. 120 questions are marked as openers: whole lists anyone can answer and easy letter questions on the most familiar lists.
- **Sets:** every set runs two openers, three medium and two hard. No list repeats in a set. Subjects are capped (three geography, two sports), and a set holds at most three letter questions. Lists are picked before questions so countries don't crowd out the smaller lists. Mexican states and constellations come up less often.
- **Wording:** questions say "country" in place of "UN member state," and capitals by continent read "Name a capital city in Asia whose name…"
- **Daily schedule:** a year of daily sets is built ahead. Each day avoids the previous 30 days' questions.
- **Docs:** SPEC.md and README.md were updated. `tools/check.mjs` now checks the new list sizes, that every country has a continent and a capital, that the first 60 days open with two openers, and that random rounds never repeat a question.

## 3. Checks

- `node tools/check.mjs`: 640 questions, 120 openers, 0 problems. No alias collisions, and every answer matches itself.
- In headless Chrome, a daily set and two endless rounds (the second on the dive, picked through Change trip) ran with no page errors. The round count, the dive mark line, the round end buttons, a reload, and switching back to today's trip all worked.
- A simulation of daily totals on the new sets came out close to the last one (middle day about 31,700, top tenth about 52,700), so the trip thresholds stay.
- `tools/copy-export.mjs` output, which includes every question shape: prosekeep flagged "Testament" twice as stock AI vocabulary. It's the proper name of the Old and New Testament, so the text stays. plain-language-default flagged only run on lines the export joins without punctuation.

## 4. Gaps

- The world capitals, team locations and presidents' parties were written from knowledge and checked by count, not against a source, and they need a fact check before launch. Known judgment calls: Jerusalem is listed as Israel's capital, as Israel names it. Jakarta stays Indonesia's capital until the move to Nusantara is formalized. Malabo stays Equatorial Guinea's capital.
- Ease is measured by how familiar the answers are, not by how hard the rule is to apply.
