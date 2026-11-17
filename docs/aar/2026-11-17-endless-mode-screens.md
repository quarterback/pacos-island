# After action record: endless mode screens and wording

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner is adding an endless mode so he can keep playing rounds and test every trip. Another agent builds it, with all three trips open to an endless player. He asked for the screens to be designed first, the ATV and dive screens included, and for the wording to follow the copy rules.

## 2. Action

- Designed seven screens on the owner's design canvas, in the game's own colors, type and scene art: the title with endless chosen, a question on the boat, a right answer on the ATV, a wrong guess on the dive, the round end for the ATV and for the dive, and the change trip screen.
- Added the wording to `js/copy.js` as `Copy.endless`. Nothing reads it yet, so the game is unchanged.
- Wrote `docs/endless-mode-screens.md`, which lists each screen and the rules the build should keep.
- Changed the dive label from "26 m" to "26 meters" in `js/engine.js`, to follow AP style. The label on the scene and the end headline both use it.

## 3. Checks

- `node tools/check.mjs`: 0 problems.
- The seven screens were rendered at phone width and reviewed. Every figure on the two round end screens adds up to its total.
- The new lines were read by hand against AP style and the plain language guidelines.

## 4. Gaps

- `prosekeep check`, `plain-language-default check` and `red-pen-editor inspect` were not run. This session could not download and run them.
- The designs assume endless rounds have no share text and no lifetime points line. The owner or the building agent may decide otherwise.
