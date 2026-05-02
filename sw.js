// ============================================================
// JimatPRO Service Worker
// VERSION: Change this number every time you update the app!
// ============================================================
const VERSION = '2.5';
const CACHE_NAME = 'jimat-v' + VERSION;

const CORE_ASSETS = [
  '/JimatPRO/',
  '/JimatPRO/index.html',
  '/JimatPRO/manifest.json',
  '/JimatPRO/icon.png',
  '/JimatPRO/icon-192.png',
  '/JimatPRO/icon-512.png',
  '/JimatPRO/halal-db.json',
];

// INSTALL — cache core assets
self.addEventListener('install', function(e) {
  console.log('[SW] Installing version', VERSION);
  // Skip waiting immediately — don't wait for old SW to die
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_ASSETS).catch(function(err) {
        console.log('[SW] Cache addAll error (ok):', err);
      });
    })
  );
});

// ACTIVATE — delete ALL old caches immediately
self.addEventListener('activate', function(e) {
  console.log('[SW] Activating version', VERSION);
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) {
              console.log('[SW] Deleting old cache:', k);
              return caches.delete(k);
            })
      );
    }).then(function() {
      // Take control of ALL open tabs immediately
      return clients.claim();
    }).then(function() {
      // Tell all tabs to reload to get new version
      clients.matchAll({ type: 'window' }).then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'SW_UPDATED', version: VERSION });
        });
      });
    })
  );
});

// FETCH — network first for HTML, cache first for assets
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Always network first for the main page and JSON files
  // so updates are picked up immediately
  if (url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.json') ||
      url.pathname === '/JimatPRO/' ||
      url.pathname === '/JimatPRO') {
    e.respondWith(
      fetch(e.request).then(function(res) {
        // Update cache with fresh version
        const clone = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
        return res;
      }).catch(function() {
        // Offline fallback
        return caches.match(e.request);
      })
    );
    return;
  }

  // Skip external APIs — always network
  if (url.hostname === 'api.anthropic.com' ||
      url.hostname === 'api.frankfurter.app' ||
      url.hostname === 'world.openfoodfacts.org') {
    e.respondWith(
      fetch(e.request).catch(function() { return caches.match(e.request); })
    );
    return;
  }

  // Cache first for everything else (fonts, libraries, icons)
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(res) {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(function(c) { c.put(e.request, clone); });
        return res;
      }).catch(function() {
        return caches.match('/JimatPRO/');
      });
    })
  );
});
