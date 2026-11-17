# Endless mode screens

Designs for endless mode, ready for the build. The wording is in `js/copy.js` under `Copy.endless`. Use those lines as written, and add any new line there so the editorial checks read it.

In endless mode a player gets a new set of seven questions each round and can take any of the four trips.

## Screens

1. **Title, endless chosen.** A "Choose how to play" group sits above "Choose a trip" with two choices: "Today's trip" and "Endless mode". Each has one line of help under it. With endless chosen, all four trips are open and no trip shows an "Opens at" line. The main button reads "Start round 1".
2. **Question, boat.** The same play screen as the daily game. The count reads "Round 3, question 4 of 7" on one line.
3. **Right answer, ATV.** The same result block as the daily game: the answer, the points, the rarity and speed split, then "Next question".
4. **Wrong guess, dive.** The label on the scene reads "Depth 26 meters". The note under the clock uses `Copy.wrong`.
5. **Round end, ATV.** The headline and the next stop line are the daily ones. The sheet heading is "Round 3" in place of "Today". Under the totals is "Earlier rounds", a list with one line for each round already played: the round number, the trip and that round's points, such as "Round 2, dive" and "39,150". The list holds each round on its own and never adds them up. Leave it out after round 1. Then come "Play another round" as the main button, "Change trip" as the quiet button, and a text link, "Back to today's trip". There is no share text, no copy button, no points total across rounds and no line about new questions arriving.
6. **Round end, dive.** The headline reads "Paco took you down 309 meters." The second line names the deepest mark passed: "You passed the canyon wall at 300 meters." Use `Copy.endless.passedMark` with the mark's name in lower case after "the". Leave the line out above the first mark.
7. **Change trip.** A heading, "Choose a trip for round 5", the four trips, "Start round 5" and the link back to today's trip.

## Rules the designs follow

- One fact once per screen. The round end has one row per question, the same as the daily end screen.
- The trip pictures in the list are the game's own trip icons.
- Numbers one through nine are spelled out in sentences. Round and question numbers stay as figures.
- Labels, buttons and fragments take no period. Only full sentences do.
- Depths read "26 meters". `Engine.reached` now returns that form for the dive.
