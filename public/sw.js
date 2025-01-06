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
    
    // Create a new request with the correct headers
    const manifestRequest = new Request(event.request.url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      mode: 'cors'
    });

    event.respondWith(
      fetch(manifestRequest)
        .then(async response => {
          console.log('Manifest fetch response:', response.status, response.statusText);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            throw new Error(`Manifest fetch failed: ${response.status}`);
          }

          // Clone the response before reading it
          const responseToCache = response.clone();

          try {
            // Try to parse the JSON to validate it
            const jsonData = await responseToCache.json();
            console.log('Successfully parsed manifest JSON:', jsonData);
            
            if (jsonData) {
              const cache = await caches.open('manifest-cache');
              await cache.put(event.request, response.clone());
              console.log('Cached valid manifest response');
            }
          } catch (error) {
            console.error('Invalid JSON in manifest response:', error);
            console.log('Response text:', await response.clone().text());
          }

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