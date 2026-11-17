# Paco's Island: v0.5 spec

## The game

Paco is an iguana with a boat on Bahía Ixtaluz, a fictional bay. Every day he asks seven questions. Each question has a fixed list of right answers. Every right answer has a set rarity. The rarer your answer, the more points it earns, and the farther Paco takes you on your trip.

Everyone gets the same seven questions each day. A new set starts at 06:00 UTC, which is midnight at UTC−6, and the end screen shows that time in the player's own time zone. Day 1 is November 16, 2026.

## A question

There are three kinds of question:

- **Letter questions:** one list cut by one rule. "Name a US state whose name starts with N."
- **Group questions:** a group inside a list, asked whole or cut by a rule. "Name a country in South America." "Name a capital city in Asia whose name has the letter S in it."
- **Hand made lists:** "Name a noble gas." "Name a US state that touches the Mississippi River." "Name an NBA, NFL, MLB or NHL team based in Texas, by nickname."

**Lists** (`js/data.js`):
- The 193 UN member states, tagged by continent. Countries in both Europe and Asia count for both.
- World capitals, one or more for each UN member. Countries with more than one capital, like Bolivia and South Africa, list each.
- The 50 US states, tagged by Census Bureau region, and the 50 state capitals.
- Mexico's 32 federal entities.
- The 118 chemical elements, with atomic numbers and symbols.
- The NBA, NFL, MLB and NHL teams by nickname, and where each team plays.
- The 40 last names of US presidents, with party and era.
- The 88 constellations, the 24 Greek letters, the 26 words of the pilots' phonetic alphabet, and the books of the Bible. Numbered books count once: Kings covers 1 and 2 Kings.
- **Teams by place:** the city or state in each NFL, NBA, MLB and NHL team's name, so questions can ask "Name a city or state with a National Football League (NFL) team." Nickname questions also accept the full team name ("Dallas Cowboys").
- **World sports:** countries that have won the men's World Cup (Spain won in 2026), clubs that have won the Champions League or the European Cup (Paris Saint-Germain won in 2025 and 2026), the 20 Premier League clubs of the 2026–27 season, and the 23 cities that have hosted the Summer Olympics.
- **Movies and TV:** every Best Picture winner through One Battle After Another (2026 ceremony), the 31 Pixar films through Toy Story 5, the 25 official James Bond films, the 13 official Disney princesses, the nine Star Wars saga films, the six Friends, the six original Avengers and the seven dwarfs.
- **Music:** Taylor Swift's 12 studio albums, the Beatles songs that hit No. 1 in the U.S., the songs on Michael Jackson's Thriller and the members of BTS.
- **Books:** the Harry Potter books, The Chronicles of Narnia, Jane Austen's novels and Shakespeare's plays.
- **Games and puzzles:** Monopoly properties, the suspects, weapons and rooms in Clue, chess pieces, Rubik's Cube colors and poker hands.
- **Things most people learned in school:** planets, continents, rainbow colors, Santa's reindeer, the Seven Wonders of the Ancient World, the Olympian gods, Henry VIII's wives and the faces on U.S. paper money.
- Lists that change, like the Premier League, the Best Picture winners and the Pixar films, were checked against current sources in November 2026.

**Rules** (`js/prompts.js`): has a letter, starts with a letter, ends with a letter, has no letter, has N letters or fewer or more, is more than one word, starts and ends with the same letter, and has a double letter.

A letter question needs 6 to 55 answers and must leave out at least 40% of its list or group. Whole groups and hand made lists can have up to 60 answers. The rule is checked against every real name an item has, so "Ivory Coast" counts for a question about the letter Y.

### How easy a question is

Every question gets an ease score: the number of its answers most people know. An answer counts fully when its familiarity score is 4.8 or more (Canada, Lakers), a quarter at 4.0, and not at all under 3.2. Questions scoring under 0.1 are dropped as too hard. The rest are sorted into easy (3 or more), medium (1.5 to 3) and hard (under 1.5).

Some questions are marked as **openers**: whole lists anyone can answer (a US state, an NFL team, a country in Europe, a sign of the zodiac) and easy letter questions on the most familiar lists (countries, US states, world capitals, NBA and NFL teams, presidents).

Only simple letter rules (starts with a letter, has a letter) can be openers. The pool has 945 questions, 125 of them openers.

### Wording

A question never names one of its own right answers, in an example, a note or the subject itself. Edge cases still count as right answers without being named (Rudolph, Hestia, Scorpio, Mexico City). `tools/check.mjs` fails if a question's wording contains one of its answers.

A question spells out an acronym the first time it uses it: "a National Football League (NFL) team." Questions that cross leagues name the sports in place of the acronyms: "a U.S. or Canadian pro football, basketball, baseball or hockey team."

### Levels

The title screen offers two levels:

- **Paco's mode** is the full game: two openers, three medium and two hard questions, 25 seconds each, full points.
- **Mario's mode** is the easier one. Mario is Paco's iguana twin brother and his rival on the island; he is teal with an orange bandana, and in his mode he takes the trips. His sets have two openers and five easy questions, with no letter counting and no "has no letter" rules. Each question gets 35 seconds, and every score is halved.

Each level has its own daily set. After a rough set in Paco's mode, under 12,000 points or three or more questions with no answer, the end screen suggests Mario's mode. Shares from Mario's mode say so: "Paco's Island, day 1, Mario's mode." The level is locked while a set is under way.

### A set of seven

Every set follows the same shape: two openers, then three medium questions, then two hard ones. Easy questions that aren't openers can fill the medium slots.

- No list is used twice in a set.
- No more than two sports questions and three geography questions. Other subjects get one question each unless nothing else fits.
- No more than three letter questions.
- The list for each slot is picked first, weighted by the square root of how many questions it has, so big lists like countries don't crowd out small ones. Mexican states and constellations come up less often, since most players know little about them.

The daily sets are built ahead for a year. Each day avoids the questions used in the 30 days before it.

### Endless mode (test mode only)

`TEST_MODE` at the top of `js/app.js` is on for now. It adds a "Choose how to play" choice on the title screen: today's trip or endless mode. The screens follow `docs/endless-mode-screens.md`.

- Endless mode opens every trip from the start, so testers can try the ATV ride and the dive.
- Each round is a new set of seven in the same shape as the daily set. It skips today's daily questions and the questions already seen in endless mode. When every question has been seen, the sets start over and the title screen says so once.
- The count reads "Round 3, question 4 of 7." The round end has the score sheet and totals, an "Earlier rounds" list from round 2 on, then "Play another round," "Change trip" and a link back to today's trip. There is no share text and no total across rounds.
- On a dive, the round end names the deepest mark passed: "You passed the canyon wall at 300 meters."
- The daily end screen keeps its share text and, in test mode, adds "Play another round" below it.
- Rounds are saved apart from the daily game, and each one adds to lifetime points.

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

From the shares, **c** is how common your answer is: the shares of the right answers as familiar as yours or more. It is 1 for the most familiar answer and close to 0 for the least familiar answer on a long list. Because c comes from where an answer sits among the others, a 6 answer question and a 55 answer question score on the same scale.

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

A day's score is the sum of the seven question scores. As in World Six, the end screen shows every question's rarity and speed points, then the rarity total, the speed total, the grand total and the total time, and the lines add up. Each question has one row there. Selecting a row opens its question and every right answer with the rarity points each one earns, so nothing on the screen is listed twice. There is no whole-day multiplier.

In a simulation of players across the question pool, the middle day scored about 32,000, three days in four stayed under 42,000, and about one in ten passed 52,000. A question can score up to 50,000 in theory, but only with the least familiar answer on a long list, typed instantly.

## Trips

Your trip shows the day's score as a place. Trips open with lifetime points and never close again.

| Trip | Opens at | What the score moves |
| --- | --- | --- |
| Boat to Paco's Island | Start | Along the water taxi route: the Ixtaluz pier (0), Peñas Cantoras (7,000), Boca Tamarilla (13,500), Caleta Pochota (20,000), Playa Ondarena (27,000), Pueblo Tilmeca (35,000), Playa Zinzuna (44,000), Paco's Island (54,000) |
| Walk to Cascada Ixtalita | 50,000 lifetime points | On foot up from the island's beach through the village: the beach (0), the church plaza (9,000), the river bridge (18,000), the mural stairs (27,000), the cobblestone lane (36,000), the craft stalls (45,000), Cascada Ixtalita (54,000) |
| ATV across Paco's Island | 110,000 lifetime points | Up from the island's beach: the beach (0), the village (11,000), the river (22,500), the waterfall (33,500), the jungle trail (44,000), the upper waterfall (54,000) |
| Dive into Bahía Ixtaluz | 450,000 lifetime points | Down: depth = 1,400 m × (score ÷ 66,000)². The reef at Peñas Cantoras and the old ferry wreck (41 m) come early, and the canyon floor is a 66,000 point day. |

At a typical day's score, the walk opens around day 2, the ATV around day 4 and the dive around day 14.

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
- **App:** the game is a progressive web app. A browser can install it to a computer or phone, where it opens in its own window. A service worker saves the page, scripts, fonts and icons, so the game loads and plays with no connection. New deploys show up on the next load because pages and scripts are fetched from the network first.
- **Computers:** at 960 pixels wide and up, the scene sits on the left and stays in view while the game scrolls on the right. Narrower windows keep the single column.
- **Scene:** 480 × 240 pixels in a 32 bit style, drawn in code with smooth gradients, soft edges, glow around lights and see through water. The stage renders at three times that size so each art pixel stays sharp at any page width. Paco is a shaded green iguana with a banded tail, an orange crest, a dewlap, a pink cheek and a woven straw hat with a pink band, and his sprites carry a soft dark rim. He rides a panga with stripes and an outboard motor, walks, rides a red ATV with treaded tires, or dives in a yellow mask, tank and pink fins. The coast has three ranges of jungle with mist on the far one, palms, houses in five colors with tiled roofs, palapas, a striped lighthouse with a lit lamp and granite islets with an arch. The walk climbs from the island's beach through the village: a white church with a bell tower on a tiled plaza, a wooden footbridge over the river, a mural wall with tiled stairs, a donkey tied by the lane and bougainvillea over the walls, craft stalls with striped awnings and hanging hats, and Cascada Ixtalita falling off a jungle cliff into a rock pool. The island climb has a river and two waterfalls with mist. The dive passes light rays, a reef, the wreck on its ledge, kelp, canyon walls, fish and glowing plankton. Motion follows `prefers-reduced-motion`.
- **Score on the scene:** the next stop and the day's score sit on the picture in solid ink labels.
- **No dividers:** sections are separated by space, type size and color. Totals and share text sit on a slightly darker surface.
- **Points count up** when an answer lands, the way a pinball score does. With reduced motion the number appears at once.

## Known limits in v0.5

- Answer lists for world capitals, team locations and presidents' parties were written by hand and checked only by count. They need a fact check before launch.
- Team familiarity still rests on hand tiers. A measure such as Wikipedia pageviews for each team's article would replace them.
- The PP font files came from the tennis-team-manager repo. Confirm the licenses cover this site.
