# After action record: "Pennsylvania" counts for the Avenue question

**Date:** November 18, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

A player reported that "Name a Monopoly property whose name ends in "Avenue."" made them type "Avenue": "Pennsylvania" alone did not count, which also cost them the speed bonus.

## 2. Cause

Most avenues had a short name ("Baltic," "Kentucky"), but States Avenue, New York Avenue and Pennsylvania Avenue had none. "Pennsylvania" cannot be a plain short name, because it is also the Pennsylvania Railroad.

## 3. Action

- `js/data.js`: short names "States," "New York," "St. Charles," "Saint Charles," "St. James" and "Saint James."
- `js/engine.js`: an answer also counts without a word the question names when every answer to that question has the word. In the Avenue question every answer ends in "Avenue," so "Pennsylvania" means Pennsylvania Avenue there. A first, looser version that dropped any word the question named was swept across the pool and rejected: it let "basketball" count as water basketball and "bread pudding" as chocolate bread pudding. The rule as kept applies to three questions: the Avenue question, "Name a Spice Girl" ("Scary") and "Name a "Harry Potter" book." The existing rules for people questions are unchanged.

## 4. Checks

- `node tools/check.mjs`: 0 problems.
- The Avenue question accepts "Pennsylvania," "Pensylvania," "New York" and "States"; "St. Charles" is still real but off the list. "Name a Monopoly property." accepts "New York," "States" and "St. James" and still refuses "Pennsylvania" alone, which could be the avenue or the railroad. "basketball" for the water sports question and "bread pudding" for chocolate desserts are refused.

## 5. Gaps

- "Pennsylvania" alone still does not count in questions where the railroad is also a right answer.
