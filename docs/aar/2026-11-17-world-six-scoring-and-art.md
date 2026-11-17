# After action record: World Six scoring, no dividers, sharper art

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for four things:

- Port World Six's scoring (quarterback/worldy-bug) to the trivia format, with its speed bonus.
- Remove every divider.
- Redraw Paco at a higher resolution.
- Raise the fidelity of the game's screens.

## 2. Action

- **Scoring:** World Six's distance curve now takes c, the share of today's answers that were as common as yours or more. Rarity is 20,000 × e^(−(c ÷ 0.231)^0.65), and the speed bonus is World Six's own: 1.5 × q³ × e^(−t ÷ 10). The most common answer earns about 1,500 points, and a rare, fast answer can pass 28,000. There is no whole-day multiplier, matching World Six.
- **Trips:** stop thresholds were set from a simulation of daily totals (middle day about 27,000, top tenth about 47,000). The boat reaches Paco's Island at 48,000. The ATV opens at 100,000 lifetime points and the dive at 400,000.
- **Screens:** the trip bar was replaced by labels on the scene that show the next stop and the day's score. Points count up when an answer lands, and the result shows the rarity and speed split and the "Rarer than" line. The end screen lists every question's points, then rarity, speed, total and time, as World Six does. Share text follows World Six's layout.
- **Dividers:** every border and rule is gone. Sections are separated by space, type size and color, and totals and share text sit on a darker surface.
- **Art:** the scene went from 240 × 120 to 384 × 192 pixels. Paco was redrawn with shading, an outline pass, a banded tail, crest, dewlap and woven hat. The boat, ATV and diver were redrawn to match. The coast, island climb and dive got new layers, a lighthouse, houses in five colors, two waterfalls, a reef, the wreck and canyon walls. Trip icons on the title screen use the same sprites.
- **Docs:** SPEC.md now describes the ported scoring with worked examples, the new thresholds, the share format, the scene and the no divider rule.

## 3. Checks

- `node tools/check.mjs`: 218 questions, 21 days, 0 problems.
- A full day played in headless Chrome had no page errors. The only failed requests were to the answer counting API, which a local static server doesn't run; the game fell back to estimates as designed.
- Editorial checks on an export of all copy, run before committing:
  - prosekeep check: 0 findings.
  - plain-language-default check: 0 problems.
  - red-pen-editor inspect: flagged only overlaps created by filling every template with the same sample values.
- Screenshots of the title, result, end screen and all three trips were reviewed at phone and desktop widths.

## 4. Gaps

- The owner's editorial passes before launch are still to come, at his direction.
- Thresholds come from a simulation with estimated shares. They should be checked against real totals after the first week.
