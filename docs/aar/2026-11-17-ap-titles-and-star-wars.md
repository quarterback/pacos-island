# AAR: AP titles and a clearer "Star Wars" question

**Date:** 2026-11-17

## What was asked

Ron found the "Star Wars" question unclear and asked whether the questions had been checked against AP style.

## What happened before

The new pop culture questions followed the AP summary in AGENTS.md (U.S. with periods, numbers, times, no serial comma). That summary did not cover composition titles, and I did not check the AP Stylebook itself. So titles went out bare ("the TV show Friends") and the Oscar category was capitalized ("Best Picture").

The "Star Wars" question asked for a movie "by the subtitle that follows the episode number." Most people call these movies by a title or by "Episode IV," and the question read like a riddle.

## What changed

- "Star Wars" question now reads: Name one of the nine main "Star Wars" movies, by its title or its episode number.
- Each of the nine movies now accepts its title, "Episode IV," "Episode 4," the bare number in either form, "Star Wars Episode IV," "Star Wars: A New Hope" and the full "Star Wars: Episode IV A New Hope." The bare "Star Wars" is still refused, since the question names it.
- The Roman numerals came out of the question text so the check would let them count as answers.
- AP pass on question text:
  - Titles in quotation marks: "Toy Story," "Friends," "The Avengers," "Snow White and the Seven Dwarfs," "Harry Potter," "The Chronicles of Narnia."
  - Lowercase best picture.
  - "Twelve Olympian gods" is now "12."
- Rewrote several questions:
  - The Avengers question names the 2012 movie.
  - The dwarfs question names the 1937 movie.
  - The Narnia question names C.S. Lewis and the seven books.
  - The shared team nickname question now reads in one plain line.
- Unused list labels in data.js now use U.S. and U.N. and quote their titles.
- AGENTS.md now has the title rule and a rule to state the answer form when it could be in doubt.

## Sources

- AP composition titles: quotation marks around books, movies, TV shows, albums, songs and plays; none for the Bible or for game names (Missouri State University and PR News summaries of the AP Stylebook).
- AP Academy Awards coverage writes "best picture" and "best supporting actress" in lowercase.
- Geeks Who Drink questions: a clear stem and a hint on answer form when the form could be in doubt.

## Checks

- `node tools/check.mjs`: 945 questions, 125 openers, 0 problems.
- prosekeep flagged only the known "Testament" false positives. plain-language-default flagged only joined interface labels in the export.
- Playthrough in Mario's mode: quotes render, no page errors.
