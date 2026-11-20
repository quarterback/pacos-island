/* Paco's Island service worker.

   Lets the game install as an app and keep working offline. Pages, styles
   and scripts come from the network first, so a new deploy shows up on the
   next load, and fall back to the saved copy when offline. Fonts, PixiJS
   and icons never change under the same name, so they come from the saved
   copy first. Change VERSION to drop every saved copy. */
const VERSION = 'paco-6';
const CORE = ['./', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'vendor/pixi.min.js', 'js/rarity.js', 'js/locked-days.js', 'js/data.js', 'js/prompts.js', 'js/engine.js', 'js/copy.js', 'js/music.js', 'js/splash.js', 'js/art.js', 'js/scene.js', 'js/app.js',
  'fonts/PPFuji-Bold.woff2', 'fonts/PPNeueMontreal-Book.woff2', 'fonts/PPNeueMontreal-Medium.woff2', 'fonts/PPNeueMontreal-Semibold.woff2',
  'icons/favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  const keep = (res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); } return res; };
  if (/^\/(fonts|vendor|icons)\//.test(url.pathname)) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then(keep)));
    return;
  }
  e.respondWith(fetch(e.request).then(keep).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
});
