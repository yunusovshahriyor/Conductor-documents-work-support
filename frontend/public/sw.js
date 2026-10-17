/* Provodnik service worker: offline shell + runtime caching. Bump VERSION to invalidate caches. */
const VERSION = "v2";
// Works under a sub-path (GitHub Pages project sites): derive it from the registration scope.
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const STATIC_CACHE = `provodnik-static-${VERSION}`;
const PAGES_CACHE = `provodnik-pages-${VERSION}`;
const PRECACHE = ["/offline.html", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon.svg"].map((p) => BASE + p);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![STATIC_CACHE, PAGES_CACHE].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Pages: network first, fall back to cache, then the offline screen.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !response.redirected) {
            const copy = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(BASE + "/offline.html")),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  if (url.pathname.startsWith(BASE + "/_next/static/") || url.pathname.startsWith(BASE + "/icons/")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
