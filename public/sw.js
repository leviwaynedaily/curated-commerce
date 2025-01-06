const CACHE_NAME = 'storefront-cache-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx'
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching');
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            // Add response to cache
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});