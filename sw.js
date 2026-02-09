const CACHE_NAME = 'onsen-app-cache-v2'; // 🔁 <== Bei jedem Deployment ändern (z.B. v3, v4...)
const FILES_TO_CACHE = [
  'index.html',
  'manifest.json',
  'sw.js',
  'icon.png',
  'themen.js',
  'onsenui.min.js',
  'script.js',
  'https://cdn.jsdelivr.net/npm/onsenui/css/onsenui.min.css',
  'https://cdn.jsdelivr.net/npm/onsenui/css/onsen-css-components.min.css',
  'https://cdn.jsdelivr.net/npm/onsenui/js/onsenui.min.js'
];

// Install: neue Dateien cachen
self.addEventListener('install', (e) => {
  self.skipWaiting(); // sofort aktiv
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Aktivieren: alte Caches löschen
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim(); // übernimmt Kontrolle sofort
});

// Fetch: HTML immer frisch laden (network first), Rest aus Cache
self.addEventListener('fetch', (e) => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request))
    );
  }
});
