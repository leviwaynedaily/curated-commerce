// Log when the service worker is installed
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open('static-cache').then((cache) => {
      console.log('Service Worker: Caching static files');
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/src/main.tsx',
      ]);
    })
  );
});

// Log when the service worker is activated
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  const cacheWhitelist = ['static-cache', 'manifest-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle manifest requests
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/pwa-settings/')) {
    console.log('Service Worker: Handling manifest request:', event.request.url);
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            throw new Error('Manifest fetch failed');
          }
          console.log('Service Worker: Manifest fetched successfully');
          return response.clone();
        })
        .then(response => {
          // Cache the manifest response
          caches.open('manifest-cache').then(cache => {
            cache.put(event.request, response.clone());
            console.log('Service Worker: Manifest cached successfully');
          });
          return response;
        })
        .catch(error => {
          console.error('Service Worker: Error fetching manifest:', error);
          // Try to serve from cache if fetch fails
          return caches.match(event.request);
        })
    );
  }
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  if (!event.request.url.includes('/api/pwa-settings/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            console.log('Service Worker: Serving from cache:', event.request.url);
            return response;
          }
          console.log('Service Worker: Fetching:', event.request.url);
          return fetch(event.request);
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            console.log('Service Worker: Serving offline page');
            return caches.match('/index.html');
          }
          return null;
        })
    );
  }
});