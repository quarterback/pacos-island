# Paco's Island

Live at [pacoisland.fun](https://pacoisland.fun/).

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

The game needs no build, server or database.

**Cloudflare.** In Workers & Pages, create an application and import this repo. Cloudflare builds it as a Worker that serves the game's files:

- Build command: leave empty.
- Deploy command: `npx wrangler deploy` (the default).

`wrangler.jsonc` tells Wrangler to serve this folder, and `.assetsignore` keeps docs, tools and repo files from being published. Every push to `main` redeploys. To deploy from your own machine, run `npx wrangler deploy` in the repo.

**Vercel.** Import the repo with the Other framework preset, an empty build command and `.` as the output directory.

## Rarity scores

Every right answer has a fixed familiarity score in `js/rarity.js`. `tools/rarity.py` builds it: for places, elements and presidents it blends how often the name appears in English text (the wordfreq package) with the hand tier in `js/data.js`, and team nicknames use the hand tier alone. After changing a list or a tier, rebuild the scores:

```
pip install wordfreq
python3 tools/rarity.py
```

## Share card

`icons/og.png` is the 1200 × 630 image shown when a link to the game is shared. `tools/og.html` draws it from the game's own art, and `python3 tools/og.py` rebuilds it (it needs Playwright and Chrome). The page's Open Graph and Twitter card tags load it from `https://pacoisland.fun/icons/og.png`.

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
