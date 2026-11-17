# After action record: two new trips, Esmeralda's flight and the night market

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for new scenes and picked two of the proposals: a flight with Esmeralda, the great green macaw, and market day in Pueblo Tilmeca. After the first version the owner asked for the market to be a night market.

## 2. Action

- **Trips:** `Engine.TRIPS` gains `market` (opens at 200,000 lifetime points) and `fly` (300,000), between the ATV (110,000) and the dive (450,000). Both use the walk's spacing between stops, 9,000 points apart up to 54,000.
  - Market: the bus stop, the fruit stalls, the taco stand, the bandstand, the flower stalls, the pottery stalls, the church steps.
  - Flight: the Ixtaluz lighthouse, Peñas Cantoras, Boca Tamarilla, Playa Ondarena, Pueblo Tilmeca, Paco's Island, Esmeralda's nest.
- **Flight art:** `Art.flight` draws a 2400 x 240 sky. The boat trip's coast is drawn below at half size under a haze, so the stops are the same places seen from the air, and the strip ends on Paco's Island at a ceiba tree with Esmeralda's nest on top. `Art.flier` draws Esmeralda in flight, wings up and down for two frames, with the rider small on her back, so Mario rides in Mario's mode.
- **Night market art:** `Art.market` draws a 3600 x 240 street close up, at night: shopfronts with shutters and flower boxes, papel picado strung the length of the street, a bus at the stop, fruit stalls, a taco cart, a bandstand with a marimba and a guitar, flower buckets, clay pots and blue and white jugs, and the church at the end up a few steps. The street is drawn on its own layer, darkened to moonlight and laid over a sky with stars and a moon. Then the lights go on top: lit windows and doorways, bulbs strung along the papel picado, a lantern and a pool of light at each stall, street lamps, bulbs around the bandstand roof, the bus's headlights and the church's doors, rose window and towers.
- **Icons, scene and copy:** each trip has a menu icon. `scene.js` now looks up strips, riders and stop geometry in tables instead of chains of conditions. `Copy.where`, `madeIt` and `tripShort` have entries for both trips. `SPEC.md` lists both in the trips table.
- No real place names were added. Pueblo Tilmeca, Peñas Cantoras, Boca Tamarilla, Playa Ondarena and the Ixtaluz lighthouse already exist in the game.

## 3. Checks

- `node tools/check.mjs`: 1,074 questions, 0 problems. Every script passes `node --check`.
- Both strips, the flier and the icons were rendered and reviewed. In the scene, both trips were checked at 0, 27,000, 45,000 and 54,000 points. The flight's far coast first showed a hard top edge and a gap where it ended; both were fixed by cropping the coast from higher and fading its end into the sky.
- An endless round on the flight ran to the end screen: "Esmeralda flew you to the Ixtaluz lighthouse", "9,000 points short of Peñas Cantoras", no page errors.

## 4. Gaps

- The opening points (200,000 and 300,000) were placed between existing trips, not simulated like the earlier ones.
- At the end of the flight Esmeralda flies over her nest rather than landing in it.
- A faint line remains where the far coast meets the sky; it reads as the horizon.
