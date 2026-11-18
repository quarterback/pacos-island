# After action record: Deliveries with Tío

**Date:** November 18, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner met an older, strong man on a trip who moved supplies around town in a wheelbarrow, and called him "Tío" or "Unc." They asked for a trip built around him: Paco rides in Tío's wheelbarrow on his delivery round.

## 2. Action

- **Trip:** "Deliveries with Tío" (`deliver` in `Engine.TRIPS`) opens at 810,000 lifetime points, between the ATV and the night market. It uses the walk's spacing between stops: the pier, the ice house, the corner store, the bakery, the steep lane, the restaurant terrace, the cantina.
- **Art (`js/art.js`):** `tio()` draws Tío in a red cap and a work shirt with rolled sleeves, with grey hair and a white moustache, leaning into a green wheelbarrow. The barrow carries a crate of bottles, a sack of ice, a red gas canister and the rider: Paco, or Mario in Mario's mode. Two frames move his legs. `deliveries()` is a 3,600 pixel daytime street: the bay and pier with a panga and crates, a row of painted shopfronts under papel picado, an ice house with a freezer and ice blocks, a corner store with shelves and a soda cooler, a bakery table of bread, a stone wall and bougainvillea up the steep lane (the street climbs 30 pixels), a palapa terrace with tables, and a cantina with swing doors, stools and crates already dropped off. `icon('deliver')` adds the menu picture.
- **Scene and copy:** `scene.js` maps the trip to its strip, rider and ground line. Headings read "Tío wheeled you to the bakery" and "Tío wheeled you all the way to the cantina"; the short name is "deliveries."
- **Name:** The owner didn't choose between "Tío" and "Unc," so the game uses "Tío," which fits the island's Spanish place names. It is one string in `js/copy.js` and the trip name in `js/engine.js` if they want "Unc."
- `SPEC.md` has the new row in the trips table. `sw.js` moved to `paco-4` so players get the new art.

## 3. Checks

- `node tools/check.mjs`: 1,074 questions, 0 problems. Every script passes `node --check`.
- In headless Chrome: the strip, the sprite (both frames) and the icon were rendered and reviewed at five times size; the scene was checked at seven scores from the pier to the cantina, with Tío on the street the whole way, including the climb. Two fixes came from that review: the bay now reaches the first shopfront, and the ice house sign no longer covers a window.
- A Mario's mode endless round on the delivery trip ran to the end screen with no page errors; Mario rode in the barrow and the heading read "Tío wheeled you to the pier."
- `plain-language-default check`, `prosekeep check` and `red-pen-editor inspect` found nothing in the new lines.

## 4. Gaps

- The cantina sign has no lettering, and the shops between stops repeat the same facade style.
- Houses on the steep lane sit with their doors partly behind the stone wall.
- Tío has no cameo outside his trip (for example, on the Stumped panel).
