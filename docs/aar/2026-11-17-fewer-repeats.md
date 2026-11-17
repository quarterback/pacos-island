# AAR: Fewer repeats

**Date:** 2026-11-17

## What was asked

Ron asked how many questions the game has, how random the sets are, and said he doesn't want repeats.

## Where it stood

- 947 questions: 103 whole list questions and 844 letter questions spread across 55 lists.
- The daily schedule only avoided the previous 30 days. A question could come back on day 32, and over a year the median gap between repeats was 47 days in Paco's mode and 33 in Mario's.
- Endless mode avoided seen questions, but a slot that ran out of new questions took any question at random.
- Countries and world capitals showed up about five times a week each, because the list pick favored lists with many questions.

## What changed

- Sets now take unseen questions first, then the ones seen longest ago. A question is never repeated within 30 days if the set can avoid it. The daily schedule and endless mode both use this.
- A slot borrows from a nearby level before it repeats a question. A hard slot can take an unseen medium question, and the other way around. Mario's easy slots can take the milder medium questions.
- Mario's easy slots use openers only after the other easy questions run out, so the openers last longer.
- The lists from the day before (or the round before, in endless mode) sit out when they can.
- 33 more openers (158 now): easy whole list questions such as "Name a state that borders Canada," plus simple letter questions on baseball and hockey teams and cities.
- Endless mode shows its "sets start over" note the first time a repeat comes up. The seen list is capped at 200 rounds.

## Result

| | Before | After |
|---|---|---|
| Paco's mode, first repeat | day 32 | day 107 |
| Paco's mode, shortest gap | 31 days | 90 days |
| Mario's mode, first repeat | day 32 | day 56 |
| Endless, Paco's mode, first repeat | round 58 | round 111 |
| Endless, Mario's mode, first repeat | round 32 | round 55 |

## The limit

At seven questions a day, 947 questions last at most 135 days without a repeat in Paco's mode. Mario's mode can use about 500 of them, so about 70 days. A full year without repeats would take about 2,550 questions.

## Checks

- `node tools/check.mjs`: 947 questions, 158 openers, 0 problems.
- Daily and endless playthroughs plus the Mario flow: no page errors.
