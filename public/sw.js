/**
 * Service worker so Android Chrome offers a real "Install app" (WebAPK) and the
 * app survives a flaky connection.
 *
 * Strategy matters here: the HTML document must be NETWORK-FIRST. Expo emits a
 * content-hashed JS bundle each deploy (entry-<hash>.js), and every deploy
 * replaces the whole site — so a cached old index.html would point at a bundle
 * that no longer exists, and the installed app would open to a blank screen.
 * Hashed assets never change under the same name, so those stay cache-first.
 */
const CACHE = 'arda-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop caches from older versions so stale HTML/JS can't shadow a deploy.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let the browser handle cross-origin

  const isNavigation =
    req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    // Network-first: always try to load the current document; fall back to cache
    // (and finally the app shell) only when offline.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match('./')) || Response.error()),
    );
    return;
  }

  // Everything else (hashed JS/CSS, images, fonts): cache-first with a background
  // refresh, so the app loads fast and stays fresh.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
