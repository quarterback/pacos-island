# Paco's Island

A daily answer game. Paco the iguana asks seven questions a day, and each one has a fixed list of right answers. The fewer players who give your answer, the farther he takes you across Bahía Ixtaluz to his island. Every place in the game is fictional.

A game by Ron Bronson.

The rules, scoring and trips are in [SPEC.md](SPEC.md). Rules for anyone working in this repo are in [AGENTS.md](AGENTS.md).

## Run it locally

It's a static site with no build step.

```
python3 -m http.server 8000
```

Open http://localhost:8000. Answer counting is off locally, so shares are estimates.

Check the answer lists and question pool after any data change:

```
node tools/check.mjs
```

## Deploy on Cloudflare Pages (with answer counting)

1. In Cloudflare, go to Workers & Pages, create a Pages project and connect this repo.
2. Leave the build command empty and set the output directory to `/`.
3. Deploy. The game works now, with estimated shares.
4. To count answers across players, create a D1 database, open its console and run `schema.sql`.
5. In the Pages project, under Settings, then Bindings, add a D1 binding named `DB` pointing to that database. Redeploy.

`functions/api/answers.js` deploys on its own because it sits in `functions/`.

## Deploy on Vercel (no answer counting)

Import the repo with the Other framework preset, an empty build command and `.` as the output directory. The game runs with estimated shares, because Vercel doesn't run Cloudflare Pages Functions.

## Files

- `index.html`, `css/style.css`: the page
- `js/data.js`: the answer lists and familiarity tiers
- `js/prompts.js`: the rules, the question pool and the schedule
- `js/engine.js`: days, matching, scoring and trips
- `js/copy.js`: every line players read
- `js/art.js`, `js/scene.js`: pixel art and the Pixi scene
- `js/app.js`: screens, saved progress and moving progress between devices
- `functions/api/answers.js`, `schema.sql`: answer counting on Cloudflare
- `fonts/`: owner-licensed PP Fuji and PP Neue Montreal files
- `vendor/pixi.min.js`: PixiJS 8, MIT license

## Licenses

The game's own code and text are released under CC0 (see `LICENSE`). These files keep their own licenses and are not covered by CC0:

- `fonts/`: PP Fuji and PP Neue Montreal, commercial fonts licensed to Ron Bronson by Pangram Pangram
- `vendor/pixi.min.js`: PixiJS, MIT license (`vendor/pixi.LICENSE`)
- `.agents/skills/no-slop-ui/`: MIT license (its `LICENSE` file)
