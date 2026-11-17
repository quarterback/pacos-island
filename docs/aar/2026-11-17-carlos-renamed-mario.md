# After action record: Carlos renamed Mario

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner said Paco's twin brother and rival is named Mario, not Carlos, and asked for the name to be replaced.

## 2. Action

- Every Carlos in the game, code, page and spec is now Mario: "Mario's mode", his intro, the suggestion after a rough set, the headlines ("Mario got you to…") and the share line ("day 1, Mario's mode"). The level id is now `mario`.
- Mario's red cap became an orange bandana with white dots, knotted at the back. An iguana named Mario in a red cap would read as Nintendo's character. He stays teal.
- Saves made under the old name move over on load: the level, each record's level, and the daily key (`1c` becomes `1m`).
- The earlier record (`2026-11-17-easier-questions-and-carlos.md`) is left as written, since it records what shipped at the time.

## 3. Checks

- `node tools/check.mjs`: 0 problems.
- In headless Chrome, a rough Paco's mode set suggested Mario's mode. Following it showed Mario's intro and a 35 second clock, and the set ended on "Mario got you to the Ixtaluz pier." No page errors.
- A close crop of the scene confirmed the teal Mario in the orange bandana.
