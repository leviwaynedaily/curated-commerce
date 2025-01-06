self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('manifest.json')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          // If network request fails, try to return cached manifest
          return caches.match(event.request);
        })
    );
  }
});

// Cache manifest when it's fetched
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('manifest.json')) {
    event.waitUntil(
      fetch(event.request)
        .then(response => {
          return caches.open('manifest-cache')
            .then(cache => {
              return cache.put(event.request, response.clone());
            })
            .then(() => {
              return response;
            });
        })
    );
  }
});

// Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('static-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/src/main.tsx',
      ]);
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return the offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return null;
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['static-cache', 'manifest-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});