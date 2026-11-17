# After action record: speed bonus and a fictional setting

**Date:** November 16, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for three things:

- A speed bonus for accurate answers.
- Pinball style scoring modeled on a game he called World Six.
- A fictional location, with no real place named, Yelapa included.

## 2. Action

- **Speed bonus:** an accepted answer earns 20 × (seconds left ÷ 25), rounded, on top of the rarity points. A question can now score 120, so a day can score 840. The result line shows the split: "98 for the answer and 19 for speed." The dive depth curve and the share squares were rescaled to the new maximum.
- **Setting:** every real place was replaced with invented names: Bahía Ixtaluz, the Ixtaluz pier, Peñas Cantoras, Boca Tamarilla, Caleta Pochota, Playa Ondarena, Pueblo Tilmeca, Playa Zinzuna and Paco's Island. The dive's wreck is now "the old ferry wreck." The pier's tall sail became a striped lighthouse. The daily reset is now defined as 06:00 UTC and shown in the player's own time zone, so no city is named.
- **Name checks:** each name was web searched first. Two first picks were dropped: Mandarina is a real resort development on that coast, and Playa Lagartija is close to real beaches named Lagartijas and Lagartillo. Ondarena is close to Ondarreta, a neighborhood in San Sebastián, Spain, but is not the same name.
- **Docs and rules:** SPEC.md, README.md and AGENTS.md were updated, and AGENTS.md now forbids real place names in the setting.
- **Repo:** the commit was rebased onto the repo's initial commit, which holds the owner's CC0 LICENSE. README.md now says that the fonts, PixiJS and no-slop-ui keep their own licenses and are not covered by CC0.

## 3. Checks

- `node tools/check.mjs` found 0 problems.
- A full day played in headless Chrome had no page errors, and the speed bonus recorded on every answer.
- A text search of the code, docs and page found no real place names in the setting.

## 4. Gaps

- **Pinball scoring is not built.** Web searches and past chats turned up no game called World Six, so its scoring rules are unknown. It is waiting on the owner.
