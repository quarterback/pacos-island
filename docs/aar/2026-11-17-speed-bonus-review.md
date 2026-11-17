# After action record: speed bonus review

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked how the speed bonus works now that rarity comes from fixed scores, given that every question is timed.

## 2. Action

No code changed. The speed bonus was reviewed and measured against the fixed rarity scores.

- **Timing:** the clock starts when a question appears and stops when an answer is accepted. Wrong guesses cost only the time they take. The clock runs 25 seconds, and a question with no accepted answer scores 0.
- **Formula:** World Six's, unchanged: b = 1.5 × q³ × e^(−t ÷ 10), where q is rarity points ÷ 20,000. The bonus halves about every 7 seconds. The move to fixed scores didn't touch it.
- **Measured bonus** (rarity points, then the speed bonus at each answer time):

| Answer | Rarity | 2 s | 5 s | 10 s | 15 s | 24 s |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Most familiar | 1,497 | +1 | +1 | +1 | 0 | 0 |
| Middle of the list | 3,834 | +33 | +24 | +15 | +9 | +3 |
| Uncommon | 11,195 | +2,411 | +1,786 | +1,083 | +657 | +267 |
| Rare | 16,312 | +10,867 | +8,050 | +4,883 | +2,961 | +1,204 |

## 3. Findings

- In World Six, accuracy means closeness to the target. In Paco's Island every accepted answer is correct, so the q³ term ties the speed bonus to rarity. A common answer earns almost nothing for speed, however fast.
- That protects the rarity scoring. If speed paid on common answers, typing the most obvious answer as fast as possible would be the best play.
- The clock creates a real tradeoff on each question. A rare answer at 15 seconds totals about 19,300, while an uncommon answer at 2 seconds totals about 13,600. Digging for the rare answer still wins, but time spent digging costs points.
- The cost is that a player who knows only the common answers sees "+1 for speed" and may feel the bonus isn't for them.

## 4. Decision and gaps

- Recommendation given: keep World Six's speed bonus as it is.
- Open for the owner: whether to add a small flat bonus for any fast answer, capped at a few hundred points so it can't outweigh rarity. Nothing was built while that's undecided.
