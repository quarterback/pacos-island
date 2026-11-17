# Home button on the end screen

## What happened

Ron finished a set and had no way back to the start screen.

## What changed

- A "Home" link sits at the top of the end screen, above the headline, so it is the first thing a player can tap after a set. It opens the start screen. From there, "See today's results" brings the end screen back, and in endless mode the start button begins the next round.
- `index.html` adds the `homeBtn` button, `css/style.css` gives it a 12px gap above the headline, `js/copy.js` adds `home: 'Home'` and `js/app.js` wires it to `showTitle()`.
- The service worker loads scripts from the network first, so no version bump was needed.

## Result

- A headless playtest finished a daily set, tapped Home, landed on the start screen and returned to the results with "See today's results." It logged no page or console errors.
