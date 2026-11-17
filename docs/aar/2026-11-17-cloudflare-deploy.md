# After action record: Cloudflare deploy setup

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked whether the game can go on Cloudflare and whether it needs a build or deploy command.

## 2. Action

- Cloudflare's import flow now creates a Worker and asks for a deploy command, which defaults to `npx wrangler deploy`. That command needs a Wrangler config, which the repo didn't have.
- Added `wrangler.jsonc`, which names the Worker `pacos-island` and serves the repo folder as static files with no Worker code.
- Added `.assetsignore` so `.git`, `.agents`, `docs`, `tools`, Markdown files, the license and the Wrangler files are not published.
- Rewrote the README deploy section: build command empty, deploy command `npx wrangler deploy`.

## 3. Checks

- `wrangler deploy --dry-run` (Wrangler 4.163.0) read the config with no errors and no bindings.
- `wrangler dev` served the game: `/` and `/js/app.js` returned 200, while `/SPEC.md`, `/.git/config`, `/tools/rarity.py`, `/docs/aar/`, `/wrangler.jsonc` and `/_headers` returned 404.
- `_headers` applied: fonts were served with the one year immutable cache rule.

## 4. Gaps

- No live deploy was run from this workspace, because it has no Cloudflare credentials. The first real deploy happens when the owner imports the repo.
