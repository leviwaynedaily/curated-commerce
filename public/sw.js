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
  if (event.request.url.includes('manifest.json')) {
    console.log('Service Worker: Handling manifest request:', event.request.url);
    event.respondWith(
      fetch(event.request)
        .then(response => {
          console.log('Service Worker: Manifest fetched successfully');
          return response;
        })
        .catch(() => {
          console.log('Service Worker: Fetching manifest from cache');
          return caches.match(event.request);
        })
    );
  }
});

// Cache manifest when it's fetched
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('manifest.json')) {
    console.log('Service Worker: Caching manifest');
    event.waitUntil(
      fetch(event.request)
        .then(response => {
          return caches.open('manifest-cache')
            .then(cache => {
              console.log('Service Worker: Manifest cached successfully');
              return cache.put(event.request, response.clone());
            })
            .then(() => {
              return response;
            });
        })
        .catch(error => {
          console.error('Service Worker: Error caching manifest:', error);
        })
    );
  }
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
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
});