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
  if (event.request.url.includes('/manifest/manifest.json')) {
    event.respondWith(
      (async () => {
        try {
          const url = new URL(event.request.url);
          const storefrontId = url.searchParams.get('storefrontId');
          
          if (!storefrontId) {
            console.error('Manifest Request: No storefront ID provided');
            return new Response(JSON.stringify({ error: 'No storefront ID provided' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          console.log('Manifest Request: Fetching for storefront', storefrontId);
          const manifestUrl = `https://bplsogdsyabqfftwclka.supabase.co/storage/v1/object/public/storefront-assets/${storefrontId}/manifest/manifest.json`;
          
          // Try cache first
          const cache = await caches.open('manifest-cache');
          const cachedResponse = await cache.match(event.request);
          
          if (cachedResponse) {
            console.log('Manifest Request: Using cached manifest');
            return cachedResponse;
          }
          
          console.log('Manifest Request: Fetching from storage:', manifestUrl);
          const response = await fetch(manifestUrl);
          
          if (!response.ok) {
            throw new Error(`Manifest fetch failed: ${response.status}`);
          }
          
          // Clone the response before caching
          const responseToCache = response.clone();
          
          // Validate JSON before caching
          const jsonData = await responseToCache.json();
          if (jsonData) {
            console.log('Manifest Request: Successfully fetched manifest:', jsonData);
            await cache.put(event.request, response.clone());
          }
          
          return response;
        } catch (error) {
          console.error('Manifest Request Error:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })()
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