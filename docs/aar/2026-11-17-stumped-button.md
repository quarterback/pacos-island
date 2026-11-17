# After action record: Stumped button with Mario and the parrot

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for a way to move on from a question the player cannot answer: a "Stumped" button with its own color, placed away from Answer so nobody presses it by accident, and Mario and a parrot appearing on screen to say something when it is pressed. The parrot is Esmeralda, a great green macaw drawn from the owner's photo.

## 2. Action

- **Button:** "Stumped" sits on its own row under the clock, in coral, about 120 pixels below Answer on a phone. It is outside the answer form, so Enter never presses it. It ends the question with no points, like running out of time, but records only the seconds used.
- **Mario and the parrot:** a card under the result shows a line from each, always encouraging, puns welcome. The owner supplied the first three of Mario's. Mario has 15 lines (`Copy.stumpedMario`) and the parrot 11 (`Copy.stumpedParrot`). A counter saved on the device steps through both lists, so every line plays before one repeats, and the two lists' different lengths keep the pairs changing.
- **One button with main's Skip:** main added island time, where the question stays open after the clock runs out, with its own Skip button. Skip and Stumped did the same thing, so Stumped replaces Skip: it shows for the whole question, island time included, records the answer as skipped the way Skip did, and the result and end screen label it "Stumped".
- **Art:** `Art.parrot` draws the macaw in the game's style: green body, red forehead, pink bare face with fine lines, dark hooked beak, blue flight feathers and a blue tail tip, on a wooden perch, facing Mario. `Art.mario` draws Mario on his own whatever the current rider.

## 3. Checks

- `node tools/check.mjs`: 947 questions, 0 problems. Every script passes `node --check`.
- In headless Chrome at phone size: Enter with a wrong answer still showed "Not on the list. Try another." and stayed on the question. Stumped showed the card with both lines, then Next question moved on. Seven Stumped answers in a row reached the end screen, which lists them as "No answer", with no page errors. Screenshots of the question and the card were reviewed.

## 4. Gaps

- The card has no motion; it appears with the result.
- The share text and end screen do not tell a stumped question from a timed-out one.
