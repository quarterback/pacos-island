# Paco's Island: v0.5 spec

## The game

Paco is an iguana with a boat on Bahía Ixtaluz, a fictional bay. Every day he asks seven questions. Each question has a fixed list of right answers. Every right answer has a set rarity. The rarer your answer, the more points it earns, and the farther Paco takes you on your trip.

Everyone gets the same seven questions each day. A new set starts at 06:00 UTC, which is midnight at UTC−6, and the end screen shows that time in the player's own time zone. Day 1 is November 16, 2026.

## A question

There are three kinds of question:

- **Letter questions:** one list cut by one rule. "Name a US state whose name starts with N."
- **Group questions:** a group inside a list, asked whole or cut by a rule. "Name a country in South America." "Name a capital city in Asia whose name has the letter S in it."
- **Hand made lists:** "Name a noble gas." "Name a landlocked country." "Name a pro team from Texas."

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
- **Mario's mode** is the easier one. Mario is Paco's iguana twin brother and his rival on the island; he is teal with an orange bandana, and in his mode he takes the trips. His sets have two openers and five easy questions, with no letter counting and no "has no letter" rules. Each question gets 40 seconds, and every score is halved.

- **Vacation mode** is the easiest, for players who'd rather not race a clock. Maria, who runs the café by the beach, hosts it. There is no clock, so no speed bonus and no island time, and a right answer scores its rarity points alone. Its sets are seven openers, the easiest questions, with no letter questions. Vacation mode takes its own trip, a stroll down the beach to Maria's café. After every right answer Maria steps into the scene beside Paco with a drink or a plate from her menu on her tray, and the screen between questions shows the treat, its name and her line; the menu of 15 runs in a different order each day, so everyone gets the same treats on the same day. On Stumped, Maria steps into the scene and speaks in place of Mario. Its marks sit lower, since there is no speed bonus: 🐚 under 13,500, 🦀 under 40,500, 🐢 under 75,600, 🦎 75,600 and up. Shares carry "🌺 Vacation mode," and the end screen skips the comparison with simulated players, who race the clock.

Each level has its own daily set. After a rough set in Paco's mode, under 64,800 points or three or more questions with no answer in time (skipped or answered in island time), the end screen suggests Mario's mode. Shares from Mario's mode say so: "Paco's Island, day 1, Mario's mode." The level is locked while a set is under way.

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

- You get 25 seconds per question (40 in Mario's mode). The start time is saved, so reloading the page doesn't reset the clock.
- Wrong guesses cost only time. You can keep guessing until the clock runs out.
- **Island time:** when the clock runs out, the question stays open. The clock bar gives way to "Island time" and a Skip button, and the note reads "Time's up. A right answer still earns a few points." There is no time limit. Wrong guesses get the same messages as on the clock. A right answer earns a flat 500 points (250 in Mario's mode), with no rarity or speed points. Skip moves on with 0. Only a skip scores 0. Reloading during island time comes back to island time.
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

R = 108,000 × e^(−(c ÷ 0.231)^0.65)

This is World Six's distance curve with c in place of miles. It is smooth, with no bands, and it falls steeply near the top, so a slightly rarer answer still moves the number. The most familiar answer earns about 1,500. An answer at c = 0.1 earns about 11,200, and one at c = 0.02 earns about 16,300. The least familiar answers on long lists come close to 20,000.

### Speed bonus

Every right answer on the clock earns a speed bonus, common answers included. It holds full for 5 seconds, falls sharply after 10 and is close to 0 by 15:

- f = 1 for t up to 5 seconds, then e^(−((t − 5) ÷ 7)³), where t is seconds from the question appearing to the accepted answer. f is 0.92 at 8 seconds, 0.70 at 10, 0.37 at 12, 0.05 at 15 and 0 by 20.
- speed = f × (8,100 + 0.25 × R)
- total = round(R + speed), rarity = round(R), speed = total − rarity. Mario's mode halves both.

A fast answer to an easy question more than doubles its points, and the bonus still grows with rarity. Rarity matters most: a rare answer given slowly beats a common answer given fast, and a middle answer given slowly beats the most familiar answer given fast. Wrong guesses before the right one cost only the time they take. Island time answers get no speed bonus.

### Examples

| Answer | Time | Rarity | Speed | Total |
| --- | ---: | ---: | ---: | ---: |
| The most common answer | 3 s | 8,085 | 10,121 | 18,206 |
| Middle of the pack (c = 0.5) | 5 s | 20,702 | 13,276 | 33,978 |
| Middle of the pack (c = 0.5) | 12 s | 20,702 | 4,884 | 25,586 |
| Uncommon (c = 0.1) | 5 s | 60,451 | 23,213 | 83,664 |
| Rare (c = 0.02) | 5 s | 88,083 | 30,120 | 118,203 |
| Rare (c = 0.02) | 12 s | 88,083 | 11,080 | 99,163 |
| Rare (c = 0.02) | 20 s | 88,083 | 1 | 88,084 |
| Any answer in island time | over 25 s | 0 | 0 | 2,700 |

### The day

A day's score is the sum of the seven question scores. As in World Six, the end screen shows every question's rarity and speed points, then the rarity total, the speed total, an island time total when there is one, the grand total and the total time, and the lines add up. Island time rows read "Island time" in place of the rarity and speed split, and skips read "Skipped." The total time counts island time in full. Each question has one row there. Selecting a row opens its question and every right answer with the rarity points each one earns, so nothing on the screen is listed twice. There is no whole-day multiplier.

Points use a pinball scale: every value is the original World Six style scale times 5.4 (`POINTS` in `js/engine.js`), so a question can score up to 143,100 and a perfect day comes to 1,001,700. Real scores land wherever they land; nothing is rounded to make them tidy.

There is no fixed "typical day." Instead the end screen benchmarks each run against a field of 1,000 simulated players on the same seven questions: "Better than 73% of simulated players." Each simulated player gives an answer as often as real players would (its share), misses about one question in eight and answers in 3 to 17 seconds. The field is seeded by the set, so every player's run on the same set is measured against the same field, and endless rounds get a field for their own set. Your scores shows the same figure for every past day. On a sample day the field's middle score was about 155,000, its top tenth started near 224,000 and its best was about 342,000.

## Trips

Your trip shows the day's score as a place. Trips open with lifetime points and never close again.

| Trip | Opens at | What the score moves |
| --- | --- | --- |
| Boat to Paco's Island | Start | Along the water taxi route: the Ixtaluz pier (0), Peñas Cantoras (37,800), Boca Tamarilla (72,900), Caleta Pochota (108,000), Playa Ondarena (145,800), Pueblo Tilmeca (189,000), Playa Zinzuna (237,600), Paco's Island (291,600) |
| Walk to Cascada Ixtalita | 270,000 lifetime points | On foot up from the island's beach through the village: the beach (0), the church plaza (48,600), the river bridge (97,200), the mural stairs (145,800), the cobblestone lane (194,400), the craft stalls (243,000), Cascada Ixtalita (291,600) |
| ATV across Paco's Island | 594,000 lifetime points | Up from the island's beach: the beach (0), the village (59,400), the river (121,500), the waterfall (180,900), the jungle trail (237,600), the upper waterfall (291,600) |
| Deliveries with Tío | 810,000 lifetime points | Tío, an older, strong man who moves supplies around town, wheels Paco in his wheelbarrow from the pier up narrow river-stone lanes to the michelada bar, with a crate of bottles, a sack of ice and a gas canister. Daytime, with jungle close behind the houses, and the street climbs past a mural and a mule carrying sacks: the pier (0), the ice house (48,600), the corner store (97,200), the juice stand (145,800), the steep lane (194,400), the umbrella plaza (243,000), the michelada bar (291,600) |
| Night market in Pueblo Tilmeca | 1,080,000 lifetime points | On foot down the market street at night, under strings of lights: past places to eat and bars all along it: the bus stop (0), the taco stand (48,600), the empanada seller (97,200), the corner bar (145,800), the clothing shops (194,400), the souvenir shops (243,000), the church steps (291,600) |
| Stroll to Maria's café | Vacation mode only | Vacation mode's own lane, and the only trip it takes: Paco strolls a beach boardwalk, past umbrellas, sandcastles and surfboards, to Maria's café. Stops sit closer together, since vacation points have no speed bonus: the beach path (0), the hammocks (32,400), the coconut stand (64,800), the tide pools (97,200), the volleyball net (129,600), the shady palms (162,000), Maria's café (216,000) |
| Fly with Esmeralda | 1,620,000 lifetime points | Esmeralda, the great green macaw, carries Paco over the bay, with the boat route far below: the Ixtaluz lighthouse (0), Peñas Cantoras (48,600), Boca Tamarilla (97,200), Playa Ondarena (145,800), Pueblo Tilmeca (194,400), Paco's Island (243,000), Esmeralda's nest in a ceiba tree (291,600) |
| Dive into Bahía Ixtaluz | 2,430,000 lifetime points | Down: depth = 1,400 m × (score ÷ 356,400)². The reef at Peñas Cantoras and the old ferry wreck (41 m) come early, and the canyon floor is a 356,400 point day. |

At a typical day's score, the walk opens around day 2, the ATV around day 3 and the dive around day 11. Deliveries, the market and the flight open between the ATV and the dive; their stops use the walk's spacing. (Before the speed bonus was spread out, the ATV took about four days and the dive about 14.)

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
- Share text in World Six's format: the day, where Paco got you, one line per question with an island mark and its points (🌊 skipped or no answer, 🥥 answered in island time, 🐚 under 27,000, 🦀 under 64,800, 🐢 under 108,000, 🦎 108,000 and up; half those in Mario's mode), then rarity, speed, island time when there is any, total and time. No link.
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
