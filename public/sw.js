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
  // Special handling for manifest.json requests
  if (event.request.url.includes('manifest.json')) {
    event.respondWith(
      (async () => {
        try {
          // Extract slug from URL path
          const url = new URL(event.request.url);
          const pathParts = url.pathname.split('/');
          const pwaIndex = pathParts.indexOf('pwa');
          const slug = pwaIndex !== -1 ? pathParts[pwaIndex + 1] : null;
          
          if (!slug) {
            console.error('Manifest Request: No slug found in path');
            return new Response(JSON.stringify({ error: 'No slug provided' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          console.log('Manifest Request: Fetching for storefront with slug:', slug);
          const manifestUrl = `https://bplsogdsyabqfftwclka.supabase.co/storage/v1/object/public/storefront-assets/pwa/${slug}/manifest.json`;
          
          // Try cache first
          const cache = await caches.open('manifest-cache');
          const cachedResponse = await cache.match(manifestUrl);
          
          if (cachedResponse) {
            console.log('Manifest Request: Using cached manifest');
            return cachedResponse;
          }
          
          console.log('Manifest Request: Fetching from storage:', manifestUrl);
          const response = await fetch(manifestUrl, {
            headers: {
              'Content-Type': 'application/json',
              'Service-Worker-Allowed': '/'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Manifest fetch failed: ${response.status}`);
          }
          
          // Clone the response before caching
          const responseToCache = response.clone();
          
          // Validate JSON before caching
          const jsonData = await responseToCache.json();
          if (jsonData) {
            console.log('Manifest Request: Successfully fetched manifest:', jsonData);
            // Create a new response with proper headers
            const newResponse = new Response(JSON.stringify(jsonData), {
              headers: {
                'Content-Type': 'application/json',
                'Service-Worker-Allowed': '/',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
              }
            });
            await cache.put(manifestUrl, newResponse.clone());
            return newResponse;
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
  }
  
  // Handle all other requests
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