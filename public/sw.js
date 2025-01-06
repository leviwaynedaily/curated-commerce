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
    console.log('Service Worker: Intercepted manifest request:', event.request.url);
    event.respondWith(
      fetch(event.request)
        .then(async response => {
          if (!response.ok) {
            throw new Error(`Manifest fetch failed: ${response.status} ${response.statusText}`);
          }
          console.log('Service Worker: Manifest fetched successfully');
          
          // Log the response content for debugging
          const clone = response.clone();
          const text = await clone.text();
          console.log('Service Worker: Manifest content:', text);
          
          return response;
        })
        .then(response => {
          // Cache the manifest response
          return caches.open('manifest-cache').then(cache => {
            console.log('Service Worker: Caching manifest response');
            return cache.put(event.request, response.clone()).then(() => {
              console.log('Service Worker: Manifest cached successfully');
              return response;
            });
          });
        })
        .catch(error => {
          console.error('Service Worker: Error handling manifest:', error);
          console.log('Service Worker: Attempting to serve manifest from cache');
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              console.log('Service Worker: Serving manifest from cache');
              return cachedResponse;
            }
            console.error('Service Worker: No cached manifest available');
            throw error;
          });
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