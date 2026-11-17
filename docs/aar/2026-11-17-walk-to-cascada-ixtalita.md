# After action record: the walk to Cascada Ixtalita

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for a trip where Paco walks you through town on a path to a waterfall, modeled on the real walk to the town waterfall in Yelapa, with a name for the waterfall.

## 2. Action

- **Research:** travel guides describe the real walk as about 10 to 20 minutes from the beach. Walkers pass the church, cross a small bridge over the river, and climb cobblestone lanes past houses, murals, mosaic stairways and vendor stalls. The path ends at a waterfall of about 150 feet dropping into a rock pool. Donkeys and horses use the same lanes. The walk is built on that shape, and every name in it is invented.
- **Name:** Cascada Ixtalita, built from the game's own fictional Bahía Ixtaluz. Searches turned up no real place by that name. Two earlier picks were dropped: Yaxtla is close to Yextla, a real town in Guerrero, and Tlapeña is the word for someone from Tlapa.
- **Trip:** "Walk to Cascada Ixtalita," second in the trip list. The stops are the beach (0), the church plaza (9,000), the river bridge (18,000), the mural stairs (27,000), the cobblestone lane (36,000), the craft stalls (45,000) and Cascada Ixtalita (54,000). It opens at 50,000 lifetime points in the daily game, around day 2, and is open from the start in endless mode.
- **Art:** a new 3,600 × 290 strip in the 32 bit style, rising gently uphill:
  - the island's beach with a panga and palapas
  - houses in two rows up the hillside, some under bougainvillea
  - a white church with a bell tower on a tiled plaza
  - the river coming down from the hills under a wooden footbridge
  - a mural wall (sun and fish) over tiled stairs in bright colors
  - a donkey tied by the lane
  - three craft stalls with striped awnings and hanging hats
  - the waterfall falling off a jungle cliff into a rock pool with mist
  The path is cobblestone over a planted bank. Paco walks with his legs moving, and the trip has its own icon on the title screen.
- **Copy:** "Paco walked you to the river bridge." and "Paco walked you all the way to Cascada Ixtalita." The share line reads "Paco walked me…" Earlier rounds list the trip as "walk."
- **Docs:** the trip table, the scene description and the unlock days in SPEC.md were updated. AGENTS.md now lists Cascada Ixtalita among the fictional names.

## 3. Checks

- The scene was rendered at every stop and reviewed, and the full strip was reviewed in three sections. A first pass filled the ground below the path with flat dirt, which was replaced with a planted bank.
- An endless round on the walk played in headless Chrome with no page errors. It ended on "Paco walked you all the way to Cascada Ixtalita."
- `node tools/check.mjs`: 0 problems. prosekeep found only the two known "Testament" false positives in the question text.
- The endless mode screen notes (`docs/endless-mode-screens.md`) said "three trips" in three places. They now say four.
