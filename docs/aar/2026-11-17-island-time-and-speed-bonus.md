# After action record: island time and a spread out speed bonus

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for two scoring changes:

- **Island time:** "When someone runs out of time on a question they get 'island time' to answer and then can move on or skip. Island time answers earn a minimum of points but at least they can still answer, nobody gets a zero unless they skip."
- **Speed bonus:** "The time speed bonus should be higher even for easy questions if you get it in the first 5 seconds and decline sharply after 10 seconds. Right now only obscure questions get a massive bonus and I want the bonuses to be better spread out so there's still some incentive for those playing on easy/medium questions to be able to benefit from answering well and doing it speedily. Accuracy still matters but speed can help."

## 2. Action

### Island time

- When the clock hits 0, the question no longer ends. The clock bar is replaced by "Island time" in leaf green with a Skip button beside it, and the note reads "Time's up. A right answer still earns a few points." The input stays open with no time limit.
- Wrong guesses in island time get the same messages as on the clock ("Not on the list. Try another." and the rest). The "Island time" label stays up while those messages change.
- A right answer in island time earns a flat 500 points (250 in Mario's mode, since the level's pay applies the same way). It earns no rarity or speed points. The result reads the answer, 500 and "Island time."
- Skip records the question as skipped with 0 points, the only way to score 0. The result and the score sheet say "Skipped."
- Island time comes from the saved start time, so reloading during island time returns to island time.
- **Records:** an island time answer is saved with `island: true`, and a skip with `skip: true`, beside the existing fields. Both fields are optional, so old records load as they are and no migration in `tidy()` was needed. Old time-ups (no name, no skip flag) still read "No answer."
- **End screen:** island time rows show "Island time" in place of the rarity and speed split. The totals add an "Island time +1,000" line only when there are island time points, so the lines still add up. Total time counts island time in full.
- **Marks:** island time answers get 🥥 in the row of seven, the score sheet and the share text. Skips keep 🌊. A palm (🌴) was tried first and dropped because it looks too much like the 🏝️ shown for questions still ahead. The share text adds "Island time +1,000" between speed and total only when there is any.
- **Mario's mode suggestion:** a rough Paco's mode set is still under 12,000 points or three or more questions with no answer, now counting skips and island time answers both as no answer in time. An island time answer means the player ran out of clock, which is what the rule is meant to catch.

### Speed bonus

- New formula in `Engine.score`:
  - f = 1 through 5 seconds, then e^(−((t − 5) ÷ 7)³). That is 0.92 at 8 seconds, 0.70 at 10, 0.37 at 12, 0.05 at 15 and 0 by 20.
  - speed = f × (1,500 + 0.25 × R)
  - total = round(R + speed), with Mario's mode halving both.
- The flat 1,500 makes speed pay on every answer. The 0.25 × R part keeps the bonus growing with rarity, at a much gentler rate than World Six's q³ term. Rarity points are unchanged.
- Island time answers get no speed bonus.

**Old and new points** (old / new, Paco's mode):

| Answer | Rarity | 2 s | 5 s | 8 s | 12 s | 20 s |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Common (most familiar, c = 1) | 1,497 | 1,498 / 3,372 | 1,498 / 3,372 | 1,498 / 3,230 | 1,498 / 2,187 | 1,497 / 1,497 |
| Medium (c = 0.5) | 3,834 | 3,867 / 6,292 | 3,858 / 6,292 | 3,852 / 6,106 | 3,846 / 4,738 | 3,839 / 3,834 |
| Uncommon (c = 0.1) | 11,195 | 13,606 / 15,493 | 12,981 / 15,493 | 12,518 / 15,168 | 12,082 / 12,776 | 11,593 / 11,195 |
| Rare (c = 0.02) | 16,312 | 27,179 / 21,890 | 24,362 / 21,890 | 22,276 / 21,467 | 20,310 / 18,364 | 18,108 / 16,312 |

An island time answer is 500 in both columns' terms (it was 0 before).

What the table shows:

- A fast common answer more than doubles, from 1,498 to 3,372. A fast medium answer rises by about 60%.
- Rarity still leads. A rare answer at 20 seconds (16,312) beats an uncommon one at 2 seconds (15,493) and far beats a fast common one. A medium answer at 20 seconds (3,834) still beats the most familiar answer at 2 seconds (3,372).
- A rare answer given fast still scores best of all, but less than before: 21,890 in the first 5 seconds against 27,179 at 2 seconds under the old bonus. That is the cost of spreading the bonus out. The most a question can score falls from 50,000 in theory to 26,500.
- Island time (500) sits at a third of the lowest on-time answer (1,497).

### Copy (`js/copy.js`)

- How to play: "When the clock runs out, it's island time. Keep guessing for a few points, or skip." and "Answer in the first 5 seconds for the full speed bonus. It fades fast after 10 seconds." The second replaces "A fast answer earns a speed bonus. The rarer the answer, the bigger the bonus," which no longer described the bonus.
- New lines: "Island time," "Time's up. A right answer still earns a few points.," "Skip" and "Skipped." The old "Time's up. You'll see every answer at the end." is gone, since time running out no longer ends a question.
- `Copy.share` takes an island time total. `tools/copy-export.mjs` skips the new mark.

### Docs

`SPEC.md` now covers island time under Answering, the new speed bonus and examples, the island time total and marks on the end screen, the Mario's mode rule, and the new day totals and unlock timing.

## 3. Trip thresholds

A simulation over the year of daily Paco's mode sets compared the two bonuses. The simulated player picks answers weighted toward familiar ones (by the square root of each answer's share, which puts the old middle day near the documented 30,000 to 32,000) and misses one question in ten. Old / new:

| Answer pace | Middle day | Top tenth | Days reaching the island (54,000) | Days to ATV (110,000) | Days to dive (450,000) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Fast (2 to 8 s) | 29,565 / 44,135 | 47,926 / 62,441 | 5% / 25% | 5 / 3 | 16 / 11 |
| Mixed (3 to 17 s) | 28,855 / 37,514 | 45,902 / 54,340 | 2% / 10% | 5 / 3 | 17 / 13 |
| Slow (6 to 25 s) | 28,564 / 32,337 | 44,489 / 47,886 | 2% / 3% | 5 / 4 | 17 / 16 |

- Days rise by about 30% for a mixed pace player and about 50% for a fast one. Slow players barely move. Island time answers, which used to be zeros, add a little more.
- The walk (50,000) still opens on day 2. The ATV (110,000) opens about a day sooner, around day 3. The dive (450,000) opens two to five days sooner, around day 11 for a typical player.
- The unlocks still work as a short climb, so they don't need to move. The boat and walk stops are where the shift shows: a fast player now reaches Paco's Island on one day in four instead of one in 20. If the island should stay about a one day in ten finish for fast players, the stops would need to rise by about 15%, with the ATV at about 125,000 and the dive at about 550,000 to keep the old pace. Nothing was moved.

## 4. Checks

- `node tools/check.mjs`: 988 questions, 257 openers, 0 problems.
- Editorial checks on `node tools/copy-export.mjs`: prosekeep flagged "Testament" twice in Bible questions owned by another agent, plain-language-default flagged run together interface labels from the export format, and red-pen-editor flagged similar letter questions. None touched the new lines.
- Headless playtest in Chrome (`/home/claude/shot-island.py`, adapted from shot4.py): a fast common answer (3,372: 1,497 for rarity, +1,875 for speed), a real 26 second wait into island time, a wrong guess there ("Not on the list. Try another." with island time still showing), an island time answer (500), a skip (Skipped, 0), answers at 8 and 12 seconds, a reload during island time that came back to island time, a fast rare answer, the end screen totals and share text with 🥥 and the "Island time +1,000" line, the Mario's mode suggestion, a Mario's mode island time answer (250) and an old format record loading. No page errors or console errors.
- no-slop-ui review checklist: pass. The Skip button uses the existing quiet button with an 8px radius.

## 5. Gaps

- The speed bonus numbers (1,500 flat, 0.25 of rarity, full through 5 seconds, a 7 second fade) were chosen by this run to fit the owner's shape. They are constants at the top of the scoring block in `js/engine.js` if he wants to tune them.
- Island time pays a flat 500 whatever the answer's rarity, as asked. A rare answer in island time earns the same as a common one.
- The simulation's player model is a guess. Real totals after a week should be checked against the stops.
