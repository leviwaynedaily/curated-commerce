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
});

self.addEventListener('fetch', (event) => {
  // Let manifest.json requests go directly to the network
  if (event.request.url.includes('manifest.json')) {
    console.log('Manifest request detected:', event.request.url);
    event.respondWith(
      fetch(event.request)
        .then(response => {
          console.log('Manifest fetch response:', response);
          return response;
        })
        .catch(error => {
          console.error('Error fetching manifest:', error);
          return new Response(null, { status: 404 });
        })
    );
    return;
  }
  
  // Handle all other requests with cache-first strategy
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
});