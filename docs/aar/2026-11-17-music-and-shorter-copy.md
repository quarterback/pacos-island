# After action record: music and shorter interface text

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for background music that players can turn off, and said the interface text on the title and end screens repeated itself and did not follow the house style for interface text (Microsoft and Salesforce UI text guidelines, the 18F content guide).

## 2. Action

- **Music:** `js/music.js` plays an eight-bar calypso loop with Web Audio: a steel-drum melody, a bass line and a shaker, written as note numbers and synthesized in the browser. There is no audio file, so it works offline. It is off until the player turns it on, the choice is saved on the device, a saved "on" waits for the first tap as browsers require, and it pauses while the page is hidden. A "Music" toggle sits in the corner of the scene on every screen (`aria-pressed` carries the state). `sw.js` caches the new file under `paco-2`.
- **Repetition removed:**
  - The Mario intro no longer restates his mode note.
  - "Seven questions" and "the same for everyone" appeared in the intro, the Today's trip note and How to play; each now appears once.
  - The end screen hint "Select a row to see its question and every right answer." is gone; the row arrows already say it.
  - "the mural stairs was 4,286 points farther." repeated the next stop already shown in the scene and started with a lowercase letter. It is now "4,286 points short of the mural stairs".
- **Shorter labels:** "All 24 right answers and their rarity points" is "Right answers". Row splits read "4,941 rarity + 209 speed". "Paco's mode: The full game" now says what it means: "25 seconds a question, full points", parallel to Mario's "35 seconds a question, half points". "Time's up. You'll see every answer at the end." is "Time's up".
- **House style:** the end headings ("Paco walked you to the river bridge") lost their periods, since headings take none.
- **Other notes shortened:** the endless note, the sets-repeat note, the move-device body, the WebGL note and the "Opens at" label.

## 3. Checks

- `node tools/check.mjs`: 947 questions, 0 problems. Every script passes `node --check`.
- `plain-language-default check`, `red-pen-editor inspect` and `prosekeep check` ran on the copy export. Their findings were the export's run-on lines, intended near-duplicate questions and "Testament" in the Bible question, so none called for a change; the repetitions above were found by reading each screen.
- In headless Chrome at phone size: the toggle turned music on (24 notes started in two seconds, choice saved) and off (no new notes). A full daily trip ran to the end screen with no page errors. Screenshots of the title (both levels), play and end screens were reviewed.

## 4. Gaps

- The music was not listened to; only that notes are scheduled was tested. Volume and mix may need a change on real speakers.
- There are no sound effects for right or wrong answers.
- The lifetime line under the total ("41,242 points") has no label, so after one day it can read as a second total.
