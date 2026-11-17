# After action record: a pinball scale, a benchmark and a key to the marks

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

Players found the points hard to read: they could not tell a good score, and the marks in the shared result were unexplained. The owner wanted pinball scoring kept, with big uneven numbers and real spread, not Krillion's flat tiers, but on a scale with an obvious top. No "typical day"; instead, benchmark each run against simulated players as a percentage, as Krillion does. And a key to the marks.

## 2. Action

- **Pinball scale.** `POINTS = 5.4` in `js/engine.js` multiplies every point value: rarity up to 108,000, the speed bonus's flat part 8,100, island time 2,700. A question tops out at 143,100 and a perfect day at 1,001,700. Nothing is rounded, so scores stay uneven. Trip stops, the points that open trips and the dive's full day scale by the same factor through `pt()`, so every place is exactly as reachable as before; the dive's depths in meters do not change. The "rough day" cutoffs that suggest Mario's mode and the gentler starter questions scale too.
- **Saved games convert once.** `tidy()` multiplies lifetime points and every stored answer by the factor and marks the save `points: 5.4`. A backup link from before the change converts the same way when it is opened. A save with 52,000 lifetime points, just past the old 50,000 for the walk, became 280,800 with the walk, now at 270,000, still open.
- **Benchmark.** `Engine.field()` builds 1,000 simulated players on the run's own seven questions, seeded by the set, so every player on the same set meets the same field. Each answers by share, misses about one question in eight and takes 3 to 17 seconds. The end screen shows "Better than 85% of simulated players" under the total, and Your scores shows the figure for every day. A field takes about 8 milliseconds to build.
- **Marks and their key.** Mark thresholds scale to 27,000, 64,800 and 108,000, and are halved in Mario's mode, which pays half, so a 🦎 means the same at either level (before, Mario's players could not earn one). The end screen lists the key under the share text, with the level's own numbers, each entry kept on one line. How to play explains the marks in words.
- `SPEC.md`: the formulas, the examples (recomputed by the engine), the trips table, the mark thresholds and the benchmark are updated.

## 3. Checks

- `node tools/check.mjs`: 0 problems. Every script passes `node --check`.
- On a sample day the field's middle score was 154,582, its top tenth started at 224,433 and its best was 342,142; a 250,000 day beat 95%.
- In headless Chrome: the old save converted as above and its past day showed its own percentage in Your scores. A Paco day and a Mario day ran to the end screen with the benchmark, the key with the level's thresholds and Mario's halved marks (🐢🦀🐢); the total matched the share text. No page errors.

## 4. Gaps

- The benchmark is simulated, not real players. The field's model (answers chosen by share, one miss in eight, 3 to 17 seconds) can be tuned in `Engine.field` once real scores are known.
- The share text does not include the percentage.
