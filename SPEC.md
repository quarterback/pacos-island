# Paco's Island: v0.5 spec

## The game

Paco is an iguana with a boat on Bahía Ixtaluz, a fictional bay. Every day he asks seven questions. Each question has a fixed list of right answers. Every right answer has a set rarity. The rarer your answer, the more points it earns, and the farther Paco takes you on your trip.

Everyone gets the same seven questions. A new set starts at 06:00 UTC, which is midnight at UTC−6, and the end screen shows that time in the player's own time zone. Day 1 is November 16, 2026.

## A question

A question is one closed list cut by one rule:

- **Lists** (`js/data.js`): the 193 UN member states, the 50 US states, Mexico's 32 federal entities, the 118 chemical elements, the NBA, NFL, MLB and NHL teams by nickname, and the 40 last names of US presidents.
- **Rules** (`js/prompts.js`): has a letter, starts with a letter, ends with a letter, has no letter, has N letters or fewer or more, is more than one word, starts and ends with the same letter, and a double letter (US states only).
- **Questions written by hand:** UN member states with no coastline, names ending in "stan," Mexican states on the Pacific, team nicknames shared by two leagues, teams named after birds, and teams named after weather or the sky.

A cut becomes a question only if it has between 6 and 55 answers and leaves out at least 40% of its list. That gives 218 questions.

The rule is checked against every real name an item has. "Ivory Coast" counts for a question about the letter Y, and "Czech Republic" counts for the letter R.

### The schedule

A fixed shuffle turns the pool into days of seven. A day never uses the same list twice and has at most two sports questions. The 218 questions make 21 days before any question repeats.

## Answering

- You get 25 seconds per question. The start time is saved, so reloading the page doesn't reset the clock.
- Wrong guesses cost only time. You can keep guessing until the clock runs out.
- Messages:
  - Not on any list: "Not on the list. Try another."
  - Real but ruled out by this question: "Peru is real, but it doesn't fit this question."
  - A close misspelling is accepted and named: "Counted as Lesotho." One letter off is allowed for names of 4 to 6 letters, and two letters off for longer names. If two items are equally close, nothing is accepted.
- Abbreviations and other names are accepted: USA, UK, DRC, Swaziland, Burma, Sixers and Habs, for example.

## Scoring

Scoring is ported from World Six (quarterback/worldy-bug, `SCORING.md`), with rarity in place of distance.

### How common an answer was

Every answer has a fixed **familiarity score** in `js/rarity.js`. Scores never change with play, so the game scores the same with one player or a million, and it needs no server.

- **Places, elements and presidents:** 60% comes from how often the name appears in English text, measured by the wordfreq package (Wikipedia, news, books, subtitles and the web). Presidents are looked up by full name, since surnames like Grant or Taylor are common words. The other 40% comes from a hand tier from 1 (almost everyone thinks of it) to 5 (almost nobody does), which steadies names that double as words or surnames, like Lead, Chad, Georgia or Hidalgo.
- **Team nicknames:** the hand tier alone. Nicknames like Heat, Wild and Stars are common words, so their frequency in text says nothing about the team.
- Tiers sit on the same scale as text frequency: 1 = 5.0, 2 = 4.2, 3 = 3.4, 4 = 2.6, 5 = 1.8. `tools/rarity.py` builds the file, and `node tools/check.mjs` fails if an answer has no score.

On a question, each right answer gets a **share**: its weight, 10^(score ÷ 2), over the total weight of all the right answers. One tier more familiar is about 2.5 times the weight.

From the shares, **c** is how common your answer is: the shares of the right answers as familiar as yours or more. It is 1 for the most familiar answer and close to 0 for the least familiar answer on a long list. Because c comes from where an answer sits among the others, a 6 answer question and a 55 answer question score on the same scale. The result also shows where the answer ranks: "Number 14 of 32 right answers, most familiar first."

### Rarity points

R = 20,000 × e^(−(c ÷ 0.231)^0.65)

This is World Six's distance curve with c in place of miles. It is smooth, with no bands, and it falls steeply near the top, so a slightly rarer answer still moves the number. The most familiar answer earns about 1,500. An answer at c = 0.1 earns about 11,200, and one at c = 0.02 earns about 16,300. The least familiar answers on long lists come close to 20,000.

### Speed bonus

The speed bonus is World Six's, unchanged:

- q = R ÷ 20,000
- b = 1.5 × q³ × e^(−t ÷ 10), where t is seconds from the question appearing to the accepted answer
- total = round(R × (1 + b)), rarity = round(R), speed = total − rarity

A rare answer makes speed worth a lot, and a fast, common answer earns almost nothing extra. The bonus halves about every 7 seconds. Wrong guesses before the right one cost only the time they take. A question with no accepted answer scores 0.

### Examples

| Answer | Time | Rarity | Speed | Total |
| --- | ---: | ---: | ---: | ---: |
| The most common answer | 3 s | 1,497 | 1 | 1,498 |
| Middle of the pack (c = 0.5) | 5 s | 3,834 | 24 | 3,858 |
| Uncommon (c = 0.1) | 5 s | 11,195 | 1,786 | 12,981 |
| Rare (c = 0.02) | 5 s | 16,312 | 8,050 | 24,362 |
| Rare (c = 0.02) | 1 s | 16,312 | 12,010 | 28,322 |

### The day

A day's score is the sum of the seven question scores. As in World Six, the end screen shows every question's rarity and speed points, then the rarity total, the speed total, the grand total and the total time, and the lines add up. There is no whole-day multiplier.

In a simulation of players across the question pool, the middle day scored about 32,000, three days in four stayed under 42,000, and about one in ten passed 52,000. A question can score up to 50,000 in theory, but only with the least familiar answer on a long list, typed instantly.

## Trips

Your trip shows the day's score as a place. Trips open with lifetime points and never close again.

| Trip | Opens at | What the score moves |
| --- | --- | --- |
| Boat to Paco's Island | Start | Along the water taxi route: the Ixtaluz pier (0), Peñas Cantoras (7,000), Boca Tamarilla (13,500), Caleta Pochota (20,000), Playa Ondarena (27,000), Pueblo Tilmeca (35,000), Playa Zinzuna (44,000), Paco's Island (54,000) |
| ATV across Paco's Island | 110,000 lifetime points | Up from the island's beach: the beach (0), the village (11,000), the river (22,500), the waterfall (33,500), the jungle trail (44,000), the upper waterfall (54,000) |
| Dive into Bahía Ixtaluz | 450,000 lifetime points | Down: depth = 1,400 m × (score ÷ 66,000)². The reef at Peñas Cantoras and the old ferry wreck (41 m) come early, and the canyon floor is a 66,000 point day. |

At a typical day's score, the ATV opens around day 4 and the dive around day 14.

Your trip changes only how your score is shown. Points are the same on every trip, so players on different trips can compare scores.

You pick the trip before the first question. It's locked for the day once you answer.

### The setting

Every place is invented: Bahía Ixtaluz, the town of Puerto Ixtaluz and its pier, the stops along the coast, and Paco's Island with its village, river and two waterfalls. Each name was searched before use, and names that matched a real place were dropped.

## Progress

- On the first visit the game makes an anonymous player id and saves everything in local storage: lifetime points, the chosen trip and each day's answers.
- **Move my progress** puts the whole record in a link (`#move=` followed by base64 JSON). Opening it on another device asks before replacing that device's progress.
- There's no sign in for v0.5. Google or ATProto sign in can attach to the same player id later.

## End of day

- Where Paco got you ("Paco got you to Pueblo Tilmeca."), with the day's score and your lifetime points.
- How far the next stop was, and how many points until the next trip opens.
- Share text in World Six's format: the day, where Paco got you, one line per question with an island mark and its points (🌊 no answer, 🐚 under 5,000, 🦀 5,000 to 11,999, 🐢 12,000 to 19,999, 🦎 20,000 and up), then rarity, speed, total and time. No link.
- Every question with your answer, and a list of every right answer, most familiar first, with the rarity points each one is worth.
- The same marks show in the score sheet and in the row of seven during play, where questions still ahead show 🏝️.

## Look

- **Style:** Coalition's structure on a bright daytime bay palette. A pixel art PixiJS scene across the top, a solid play surface below. no-slop-ui wins any conflict with Coalition's look.
- **Colors:** bay `#095565` play surface, sun `#FFC43A` for the one action color and numbers, ink `#0D2340`, sky `#8ED8EE`, leaf `#BDE66E` for success, coral `#F7A8CB` for errors, bougainvillea `#C21A68` for top scores. White on bay is 8.4:1, ink on sun is 9.9:1, and sun on bay is 5.3:1.
- **Type:** PP Fuji Bold for the wordmark and big numbers. PP Neue Montreal Book, Medium and Semibold for everything people read. Both come from the owner's licensed font archive.
- **Scene:** 384 × 192 pixels, scaled with no smoothing. Paco is built from shaded shapes with an outline pass: scales, a banded tail, an orange crest, a dewlap, a pink cheek and a woven straw hat with a pink band. He rides a panga with stripes and an outboard motor, a red ATV with treaded tires, or dives in a yellow mask, tank and pink fins. The coast has three layers of jungle, palms, houses in five colors with tiled roofs, palapas, a striped lighthouse and granite islets with an arch. The island climb has a river and two waterfalls. The dive passes light rays, a reef, the wreck, kelp, canyon walls and fish. Motion follows `prefers-reduced-motion`.
- **Score on the scene:** the next stop and the day's score sit on the picture in solid ink labels.
- **No dividers:** sections are separated by space, type size and color. Totals and share text sit on a slightly darker surface.
- **Points count up** when an answer lands, the way a pinball score does. With reduced motion the number appears at once.

## Known limits in v0.5

- 21 days of questions, then the schedule repeats. A content pipeline is the next job.
- Team familiarity still rests on hand tiers. A measure such as Wikipedia pageviews for each team's article would replace them.
- The PP font files came from the tennis-team-manager repo. Confirm the licenses cover this site.
