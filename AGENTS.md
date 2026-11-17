<!-- plain-language-default:start -->
## Write in plain language

Before every user-facing response, follow `.agents/skills/plain-language-default/SKILL.md` as the default writing standard. Answer directly; use familiar words, active voice, and clear paragraphs. Do not repeat the user's input or add filler, invented jargon, or ornamental formatting. Preserve technical accuracy, sources, and user-requested formats. Quietly apply the checks in the skill before sending.
<!-- plain-language-default:end -->

## Paco's Island project rules

Set by the owner, Ron Bronson. Agents follow these on every run.

**Design**
- Style follows Coalition (quarterback/escape-game): phone first, a pixel art PixiJS scene across the top, a solid color play surface below. Paco's Island uses bright daytime bay colors in place of Coalition's night indigo.
- When Coalition's look and no-slop-ui disagree, no-slop-ui wins. Read `.agents/skills/no-slop-ui/SKILL.md` before UI work and run its review checklist after. Buttons keep an 8px radius. No pill buttons, gradients, glows, eyebrow labels or arrow glyphs on links and buttons.
- Fonts come from the owner's archive: PP Fuji Bold for the wordmark and numbers, PP Neue Montreal for reading text. Do not add Google Fonts.
- Colors live as CSS variables at the top of `css/style.css`. Check contrast before adding a pair.
- The scene art is drawn in code in `js/art.js` in a 32 bit style at 480 × 240: smooth gradients, soft edges and glow. Keep one pixel scale; do not mix 1x and 2x pixels.

**Copy**
- All player-facing text lives in `js/copy.js`. Question wording lives in `js/prompts.js`.
- Before committing copy changes, run `prosekeep check`, `plain-language-default check` and `red-pen-editor inspect` on an export of the copy, and fix real findings. Also check against the humanizer standard (github.com/blader/humanizer).
- Say what is happening in plain words. No line restates a button or another line.

**Facts**
- The setting is fictional: Bahía Ixtaluz, Puerto Ixtaluz, its stops and Paco's Island. Never name a real town, beach, bay, landmark or ship in the game. Before adding a place name, search it and drop it if it matches a real place.
- Real world facts belong only in the answer lists, which are trivia about the real world.
- Answer lists must be complete for their rule. Run `node tools/check.mjs` after editing `js/data.js` or `js/prompts.js`.

**Credits and records**
- The game credit is "A game by Ron Bronson." Agents and AI tools get no credit in the game, the README or commit trailers.
- After each run of work, write an after action record in `docs/aar/` and commit it with the work.
