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

## 4. Follow-up: the rough spots

The owner asked for the rough spots in the first pass to be fixed. They came from shortcuts: lettering at this pixel size needs a hand-drawn font, so the cantina sign was left as a plain box; every shopfront came from one helper with random colors; and houses on the hill sat level with the top of their slope, with a tall wall hiding the gap under them.

- **Signs:** a small pixel font (`GLYPH`, `letters()`, five pixels tall, N four wide) letters HIELO, TIENDA, PANADERIA and CANTINA. An N three pixels wide read as an M, then as a lowercase n, so it got a fourth column.
- **Shopfronts:** `dress()` gives each house between stops one of five extras in turn: a striped awning, a balcony with flower pots, a hanging blade sign, potted plants by the doors, or bougainvillea over the roof. Houses next to a stop stay plain so the stop's props stand out.
- **Hill:** each house now sits at the street height under its middle, set into the slope, and the tall wall is a low stone kerb with flowers. The doors show in full.
- Rerendered and reviewed at five times size; no page errors.

## 5. Follow-up: the owner's trip photos

The owner sent seven photos from the trip with no note. Next to them, the first street was too neat and pastel, so the strip was redrawn from them; every name stays fictional.

- **Town:** plastered houses in white, ochre, peach, teal, concrete and blue (`casa()`), with concrete roof slabs or tile edges, wooden doors, barred or louvered windows, iron balconies, strings of bulbs and stone bases (`stoneBase()`). White block walls on stone bases with jungle behind them (`compound()`, `bananaPlant()`) break up the row. Thick jungle covers the hills close behind town.
- **Street:** grey river stones with shadows and highlights in place of beige gravel.
- **Signs:** hand-painted arrows, PLAYA back toward the pier and CASCADA onward (`arrowSign()`). The pixel font gained M, S, Y, J, U and G.
- **Stops:** the bakery is now **the juice stand** (a blue stall with a tin roof, fruit, papel picado, a dog, and a palapa next door with sacks under it). The restaurant terrace is now **the umbrella plaza** (red, white and green umbrellas hung on wires, green patio umbrellas over café tables, a planter and a menu board). The cantina is now **the michelada bar** (teal, under a stairway with an iron railing, bottles on the ledge, a blender, MICHELADAS painted on the wall). The final heading reads "Tío wheeled you all the way to the michelada bar."
- **The steep lane:** a mural of the bay with a sea turtle, stacked black crates, and a mule with sacks on a pack saddle walking down the hill (`mule()`).
- Removed after review: leaf clusters meant to overhang the street floated in the sky, and a red mark on the mule's sacks read as a flag. The kerb on the hill had gaps like a fence and is now continuous. The umbrellas were enlarged so they read at play size.

## 6. Gaps


- Tío has no cameo outside his trip (for example, on the Stumped panel).
