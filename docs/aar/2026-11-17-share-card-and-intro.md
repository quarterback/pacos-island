# After action record: share card, page description and title intro

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner said to update the title screen and the Open Graph card if it was time.

## 2. Action

- **Share card:** `tools/og.html` now adds Esmeralda flying over the bay with Mario on her back, above Paco in his boat, so the card shows both twins and the macaw. `icons/og.png` was rebuilt. `tools/og.py` falls back to Playwright's own Chromium when Google Chrome is not installed.
- **Description:** the page, Open Graph, Twitter and app manifest descriptions said "Pacos Island is a daily trivia game where you try to find answers to random questions." It lacked its apostrophe and undersold the game. They now read "A daily trivia game. The rarer your answer, the farther Paco the iguana takes you." The image alt text names Mario and Esmeralda.
- **Title intro:** "Paco is an iguana with a boat." no longer fit a game where he also walks, drives, flies and dives. It now reads "Paco the iguana shows you around his island. The rarer your answer, the farther he takes you."

## 3. Checks

- `node tools/check.mjs`: 0 problems.
- `plain-language-default check` and `prosekeep check` ran on the new lines with no findings.
- The card was rendered at 1200 x 630 and reviewed. The title screen was checked at phone size with no page errors.

## 4. Gaps

- `og.png` was rendered with Playwright's bundled Chromium, not Google Chrome as before; the card's fonts and art match the earlier one.
- Share previews on social sites cache old cards; a new share may still show the old image for a while.
