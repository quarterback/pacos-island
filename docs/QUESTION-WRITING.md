# Writing questions for Paco's Island

This is the guide for anyone, person or agent, who adds or edits questions. Read it before you touch `js/data.js` or `js/prompts.js`.

## Who the questions are for

Write for everyone at the table: the person who watches "The Bachelor," the one who bakes, the one who follows tennis, the one who reads Jane Austen and the one who has never heard of any of them. A question is fair game if a regular person could know some answers without special training. Trivia writers call this "general to who?" The answer is: general to the whole room, not to one kind of player.

Sports, geography and science are fine, but a set built mostly from them reads as written for one crowd. Food, TV, music, books, style, holidays, home life, kids' culture and famous people belong in every week of questions.

## The game's one rule

Every question is "Name a ..." with a fixed list of right answers. The scoring needs that list to check a guess and to price how rare it is. Everything below works inside that rule.

## Vary the angle, not just the topic

The old pool was one list per topic ("Name a country") plus letter cuts of it ("Name a country whose name has the letter G in it"). That gives every question the same rhythm. Quiz writers keep changing the angle. Use these kinds of question, and tag each one with its kind (`shape`):

| Kind | What it does | Examples |
| --- | --- | --- |
| `trait` | Asks for things that share a quality | "Name a red fruit." "Name an animal with stripes." "Name a country where people drive on the left." |
| `wordplay` | Plays with the words themselves | "Name a word that comes before 'cake.'" "Name a song with a color in its title." |
| `people` | Famous people through a hook | "Name a famous Taylor." "Name a singer known by one name." "Name an actor who played Batman." |
| `place` | Where something happens | "Name a movie set in Paris." "Name a TV show set in a hospital." "Name a city in Florida." |
| `time` | When something happens | "Name a holiday in December." "Name a Christmas song." "Name a classic arcade game." |
| `everyday` | Ordinary life, the way a Family Feud survey asks | "Name something you'd find in a junk drawer." "Name a room in a house." |
| `crossover` | Two worlds meet | "Name a planet named after a Roman god." "Name a Disney movie that became a Broadway musical." |
| `category` | A plain list | "Name a cheese." "Name a soap opera." |
| `letter` | A letter rule on a list | "Name a cheese whose name starts with B." |

Letter questions are a twist, never the backbone. The pool keeps only "starts with" and "has the letter" rules. A round holds at most two letter questions, and only one for new players and in Mario's mode.

## How a round is built

- Seven questions, seven different subjects. Never two questions on the same subject in a round.
- No more than two questions of one kind (three plain category questions).
- It opens with two easy questions anyone can answer, then climbs. Paco's mode: two openers, one easy, three medium, one hard. New players and Mario's mode never get a hard one.
- Questions a player hasn't seen come first. A question doesn't come back for at least 90 days if anything else is left.

## Writing the question

- Keep it short. "Name a 'Star Wars' movie." No notes about edge cases, no "by nickname," no "official." The answer list handles edge cases quietly.
- Never name one of the question's own answers. "Name an orange food" can't accept "orange." `node tools/check.mjs` catches this.
- Spell out an acronym the first time: "a National Football League (NFL) team."
- AP style: titles of movies, TV shows, books, songs and albums go in quotation marks, with the period or comma inside. Award categories are lowercase ("best picture"). U.S. with periods. No serial comma.
- Ask one clear thing. If a friend would ask "what do you mean?", rewrite it.

## Writing the answer list

- Be complete and generous. If a regular person would say it and it's true, it counts. A player typing a right answer and hearing "not on the list" is the worst moment in the game.
- Add every common way to say an answer as an alias: full name and last name, singular and plural, with and without "The," the nickname ("Mr. Wonderful"), the old name ("Swaziland").
- Give each answer a tier from 1 to 5 for how familiar it is. Tier 1 is what most people say first. Tier 5 is what almost nobody knows. Untagged lines are tier 3. Rarity points come from these tiers.
- Look up anything that can change: current members, latest seasons, who hosts what, who left. Search before you write it, and note the date in the list's comment if it is likely to change again.
- The setting of the game is fictional. Real places belong only in answer lists.

## Adding an angled question

Angled questions live in the `ANGLES` list in `js/data.js`:

```js
angle('red_fruit', 'food', 'trait', 'Name a red fruit.', `
1 Strawberry|Strawberries
1 Cherry|Cherries
2 Watermelon
Pomegranate
4 Lingonberry`),
```

The fields are an id (letters and underscores), a subject, a kind, the question, and the answers. Each answer line can start with a tier and lists aliases after `|`.

Subjects in use: food, drink, tv, movies, music, books, stage, people, style, home, holidays, nature, kids, games, art, awards, science, history, geo, sports, words, money, tech, basics. Prefer the subjects that have fewer questions.

## Mining open data

`tools/mine/` holds the tools and notes for finding questions in open data: Family Feud survey prompts (ProtoQA), fact lists from Wikidata, everyday prompts from ConceptNet and subject gaps from Open Trivia DB. Mined material is raw input. Every question still gets rewritten in house style, and every answer list is checked for completeness by hand. The data license and credits are in `LICENSE-DATA.md`.

## Before you commit

1. `python3 tools/rarity.py` to score new answers.
2. `node tools/check.mjs` must report 0 problems.
3. Export the copy with `node tools/copy-export.mjs` and run the copy checks listed in `AGENTS.md`.
4. Play a round in the browser.
5. Write an AAR in `docs/aar/`.

## What the pool still needs

More whole-list questions, especially easy ones in TV, music, books, style, holidays, nature, kids, art and tech. The pool has 363 whole questions. At about five a round, it needs around 600 to go four months without leaning on letter questions or repeats.
