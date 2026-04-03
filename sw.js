const CACHE_NAME = 'speakai-v5'; // Incremented to v5: Bypass API calls in SW
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './js/chat.js',
  './js/reading.js',
  './js/scenarios.js',
  './js/vocab.js',
  './js/words_db.js',
  './assets/icon.png'
];

// Install Event: Pre-cache all essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First Strategy for static assets
self.addEventListener('fetch', (event) => {
  // CRITICAL: Skip Service Worker interception for API calls (pass through to network)
  if (event.request.url.includes('/api/')) {
    return; // Pass through to original browser network layer
  }

  // Skip cross-origin requests (Google Fonts, Font Awesome) from the main cache
  // But we can still serve them if they're in the cache
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle local assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Don't cache API or partial responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Add to cache for future use
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    }).catch(() => {
      // Fallback for missing assets (though we should have most)
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
