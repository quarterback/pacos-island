# After action record: installable web app and a layout for computers

**Date:** November 17, 2026
**Accountable human:** Ron Bronson, game owner

## 1. Intent

The owner asked for the game to be a progressive web app, since most people will play on computers, and for it to work well that way.

## 2. Action

- **Manifest:** `manifest.webmanifest` gives the app its name, colors, standalone window and icons. `index.html` links it and adds the Apple touch icon.
- **Icons:** `tools/icon.html` and `tools/icon.py` draw Paco on the beach from the game's own art at 180, 192 and 512 pixels, plus a 512 maskable icon with a wider margin. `Art.paco` takes a scale so the icon is drawn sharp.
- **Service worker:** `sw.js` saves the page, styles, scripts, fonts, PixiJS and icons. Pages and scripts are fetched from the network first and fall back to the saved copy offline. Fonts, PixiJS and icons come from the saved copy first. Requests under `/api/` are never touched. `_headers` stops browsers from holding an old `sw.js`.
- **Computers:** at 960 pixels wide and up, the scene sits on the left at a larger size and stays in view, and the game sits on the right. Phones and narrow windows are unchanged.

## 3. Checks

- `node tools/check.mjs`: 0 problems.
- In headless Chrome the service worker took control and saved 20 files. With the network turned off, the page reloaded, the scene drew and the first question opened, with no page errors.
- Screenshots at 1280 and 390 pixels wide were reviewed for the title and question screens.

## 4. Gaps

- The install prompt itself was not tested. It needs the live HTTPS site and a real browser.
- A change to a font, PixiJS or an icon under the same file name needs a new `VERSION` in `sw.js`.
- Offline play cannot reach any server feature added later, such as shared answer counts.
