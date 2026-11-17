# Paco's Island

A daily answer game. Paco the iguana asks seven questions a day, and each one has a fixed list of right answers. Every right answer has a set rarity, and the rarer your answer, the farther he takes you across Bahía Ixtaluz to his island. Every place in the game is fictional.

A game by Ron Bronson.

The rules, scoring and trips are in [SPEC.md](SPEC.md). Rules for anyone working in this repo are in [AGENTS.md](AGENTS.md).

## Run it locally

It's a static site with no build step.

```
python3 -m http.server 8000
```

Open http://localhost:8000.

Check the answer lists and question pool after any data change:

```
node tools/check.mjs
```

## Deploy

The game needs no server or database, so any static host works.

- **Cloudflare Pages:** in Workers & Pages, create a Pages project and connect this repo. Leave the build command empty and set the output directory to `/`.
- **Vercel:** import the repo with the Other framework preset, an empty build command and `.` as the output directory.

## Rarity scores

Every right answer has a fixed familiarity score in `js/rarity.js`. `tools/rarity.py` builds it: for places, elements and presidents it blends how often the name appears in English text (the wordfreq package) with the hand tier in `js/data.js`, and team nicknames use the hand tier alone. After changing a list or a tier, rebuild the scores:

```
pip install wordfreq
python3 tools/rarity.py
```

## Files

- `index.html`, `css/style.css`: the page
- `js/data.js`: the answer lists and hand tiers
- `js/rarity.js`: fixed familiarity scores, built by `tools/rarity.py`
- `js/prompts.js`: the rules, the question pool and the schedule
- `js/engine.js`: days, matching, scoring and trips
- `js/copy.js`: every line players read
- `js/art.js`, `js/scene.js`: pixel art and the Pixi scene
- `js/app.js`: screens, saved progress and moving progress between devices
- `fonts/`: owner-licensed PP Fuji and PP Neue Montreal files
- `vendor/pixi.min.js`: PixiJS 8, MIT license

## Licenses

The game's own code and text are released under CC0 (see `LICENSE`). These files keep their own licenses and are not covered by CC0:

- `fonts/`: PP Fuji and PP Neue Montreal, commercial fonts licensed to Ron Bronson by Pangram Pangram
- `vendor/pixi.min.js`: PixiJS, MIT license (`vendor/pixi.LICENSE`)
- `.agents/skills/no-slop-ui/`: MIT license (its `LICENSE` file)
