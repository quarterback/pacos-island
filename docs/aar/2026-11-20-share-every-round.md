# After action record: sharing endless and vacation rounds

**Date:** November 20, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner couldn't share results from endless mode or vacation mode. Their screenshot showed an endless round played at the vacation level, ending with no share box and a time of 656:48.

## 2. Action

- **Share on every round:** the end screen hid the share box for every endless round, at any level. It now shows on every round. An endless round's share says so: "pacoisland.fun Nov. 20, endless round 5," with ", 🌺 Vacation mode" or ", Mario's mode" after it when that level was played (`Copy.endless.shareTag`). The box is shown explicitly each time, so a hidden state can't carry over from an earlier screen.
- **No time in vacation mode:** vacation mode has no clock, so a question left open overnight counted every minute. The Time row is hidden in vacation mode, daily or endless.
- `tools/copy-export.mjs` samples the new share line.

## 3. Checks

- In headless Chrome at phone size, a round was played and Copy my result pressed in four cases: endless in Paco's mode, endless at the vacation level, the daily vacation set and the daily Paco set. Each showed the share box, copied the expected text and said "Copied." The Time row was hidden in both vacation cases and shown in the others. No page errors.
- `node tools/check.mjs`: 1,075 questions, 310 openers, 0 problems.

## 4. Gaps

- Shares carry the date even for endless rounds, which aren't tied to a day.
- Your scores still lists daily days only, not endless rounds.
