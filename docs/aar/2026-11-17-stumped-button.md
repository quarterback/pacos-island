# After action record: Stumped button with Mario and the parrot

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for a way to move on from a question the player cannot answer: a "Stumped" button with its own color, placed away from Answer so nobody presses it by accident, and Mario and a parrot appearing on screen to say something when it is pressed. The parrot is drawn from the owner's photo of a great green macaw.

## 2. Action

- **Button:** "Stumped" sits on its own row under the clock, in coral, about 120 pixels below Answer on a phone. It is outside the answer form, so Enter never presses it. It ends the question with no points, like running out of time, but records only the seconds used.
- **Mario and the parrot:** a card under the result shows Mario saying a short line and the parrot repeating the end of it, as parrots do. Five pairs of lines in `Copy.stumpedLines` rotate by day and question.
- **Art:** `Art.parrot` draws the macaw in the game's style: green body, red forehead, pink bare face with fine lines, dark hooked beak, blue flight feathers and a blue tail tip, on a wooden perch, facing Mario. `Art.mario` draws Mario on his own whatever the current rider.

## 3. Checks

- `node tools/check.mjs`: 947 questions, 0 problems. Every script passes `node --check`.
- In headless Chrome at phone size: Enter with a wrong answer still showed "Not on the list. Try another." and stayed on the question. Stumped showed the card with both lines, then Next question moved on. Seven Stumped answers in a row reached the end screen, which lists them as "No answer", with no page errors. Screenshots of the question and the card were reviewed.

## 4. Gaps

- The parrot has no name; the card calls it "The parrot".
- The card has no motion; it appears with the result.
- The share text and end screen do not tell a stumped question from a timed-out one.
