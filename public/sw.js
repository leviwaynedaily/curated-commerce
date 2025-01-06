self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
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

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = ['static-cache', 'manifest-cache'];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/pwa-settings/')) {
    console.log('Intercepting manifest request:', event.request.url);
    event.respondWith(
      fetch(event.request, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(async response => {
          console.log('Manifest fetch response:', response.status, response.statusText);
          if (!response.ok) {
            throw new Error(`Manifest fetch failed: ${response.status}`);
          }
          
          const cache = await caches.open('manifest-cache');
          cache.put(event.request, response.clone());
          console.log('Cached manifest response');
          return response;
        })
        .catch(error => {
          console.error('Error fetching manifest:', error);
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('Using cached manifest');
                return cachedResponse;
              }
              console.error('No cached manifest available');
              throw error;
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return null;
        })
    );
  }
});