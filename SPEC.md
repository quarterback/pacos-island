# Paco's Island: v0.5 spec

## The game

Paco is an iguana in Puerto Vallarta with a boat. Every day he asks seven questions. Each question has a fixed list of right answers. The fewer players who give your answer, the more points it earns, and the farther Paco takes you on your trip.

Everyone gets the same seven questions. A new set starts at midnight in Puerto Vallarta (America/Mexico_City). Day 1 is November 16, 2026.

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

Each answer on a question has a **share**: the part of today's answers that were that answer.

**Points = 10 + 90 × (the share of answers more common than yours)**

The most common answer earns 10. An answer almost nobody gives earns close to 100. Because points come from where an answer sits among the others, a 6 answer question and a 55 answer question score on the same scale. After you answer, the game shows "Rarer than 87% of today's answers."

**Before players arrive,** shares come from a familiarity guess. Each item has a tier from 1 (almost everyone thinks of it) to 5 (almost nobody does), weighted 40, 15, 6, 2 and 0.7.

**Once players arrive,** real counts take over:

share = (count + 20 × guess) ÷ (total + 20)

The guess stops one early player from swinging a share. The game marks shares as estimates until a question has 30 answers.

A day's score is the sum of the seven questions, so the most a day can score is 700.

## Trips

Your trip shows the day's score as a place. Trips open with lifetime points and never close again.

| Trip | Opens at | What the score moves |
| --- | --- | --- |
| Boat to Yelapa | Start | Along the water taxi route: Los Muertos pier (0), Los Arcos (60), Boca de Tomatlán (140), Colomitos (220), Las Ánimas (300), Quimixto (390), Majahuitas (480), Yelapa (580) |
| ATV through Yelapa | 1,500 points | Up from the beach: Yelapa beach (0), the village (120), the river (240), the waterfall (360), the jungle trail (470), the upper waterfall (580) |
| Dive into the bay | 6,000 points | Down: depth = 1,400 m × (score ÷ 700)². That puts the Los Arcos reef and the Princesa Vallarta wreck (41 m) early and the canyon floor at a perfect day. |

Your trip changes only how your score is shown. Points are the same on every trip, so players on different trips can compare scores.

You pick the trip before the first question. It's locked for the day once you answer.

### Place sources

- Water taxis leave from Los Muertos pier and stop at Las Ánimas and Quimixto on the way to Yelapa. The beaches south of Boca de Tomatlán are Colomitos, Las Ánimas, Quimixto, Majahuitas and Yelapa.
- Yelapa has no roads. People get around on foot, on horseback or by ATV on paths just wide enough for one. There's a waterfall above the village and a second one farther up.
- Los Arcos is a protected dive site with dives from 30 to 120 ft. The Princesa Vallarta wreck sits at 41 m. Reef surveys sampled 50 to 70 m at Los Arcos and Majahuitas. A canyon in the bay runs deeper than 1,400 m.

## Progress

- On the first visit the game makes an anonymous player id and saves everything in local storage: lifetime points, the chosen trip and each day's answers.
- **Move my progress** puts the whole record in a link (`#move=` followed by base64 JSON). Opening it on another device asks before replacing that device's progress.
- There's no sign in for v0.5. Google or ATProto sign in can attach to the same player id later.

## Answer counting

`functions/api/answers.js` is a Cloudflare Pages Function backed by a D1 database bound as `DB`. It counts each player once per question.

- `POST /api/answers` with `{ day, prompt, answer, player }` records an answer and returns `{ total, counts }`.
- `GET /api/answers?day=&prompt=` returns the same counts for the end of day reveal.

The client waits up to 2 seconds. If the function is missing or slow (on Vercel, locally, or without a database), the game scores with the familiarity guess and keeps working.

## End of day

- Where Paco got you ("Paco got you to Quimixto."), with the day's score and your lifetime points.
- How far the next stop was, and how many points until the next trip opens.
- Share text with one square per question: ⬜ no answer, 🟦 under 30, 🟩 30 to 59, 🟨 60 to 84, 🟥 85 and up.
- Every question with your answer, and a list of every right answer sorted by share. Answers nobody gave are marked "nobody yet" once real counts exist.

## Look

- **Style:** Coalition's structure on a daytime Banderas Bay palette. A pixel art PixiJS scene across the top, a solid play surface below. no-slop-ui wins any conflict with Coalition's look.
- **Colors:** bay `#095565` play surface, sun `#FFC43A` for the one action color and numbers, ink `#0D2340`, sky `#8ED8EE`, leaf `#BDE66E` for success, coral `#F7A8CB` for errors, bougainvillea `#C21A68` for top scores. White on bay is 8.4:1, ink on sun is 9.9:1, and sun on bay is 5.3:1.
- **Type:** PP Fuji Bold for the wordmark and big numbers. PP Neue Montreal Book, Medium and Semibold for everything people read. Both come from the owner's licensed font archive.
- **Scene:** 240 × 120 pixels, scaled up with no smoothing. The sprites are Paco (an iguana in a straw hat with a pink band), a panga with an outboard motor, a red ATV, and Paco in a yellow mask, tank and pink fins. Each trip has one long background strip drawn in code. Motion follows `prefers-reduced-motion`.

## Known limits in v0.5

- 21 days of questions, then the schedule repeats. A content pipeline is the next job.
- Familiarity tiers are hand set. Wikipedia pageview counts would give a better day one guess.
- The answer counter trusts the client. It doesn't check server side that an answer is on the list, so someone could post junk counts. Sharing `js/data.js` and `js/prompts.js` with the function would fix that.
- Answer counting runs only on Cloudflare Pages with D1. Vercel serves the game without counting.
- The PP font files came from the tennis-team-manager repo. Confirm the licenses cover this site.
