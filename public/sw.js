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
  const url = new URL(event.request.url);
  
  // Check if this is a manifest request
  if (event.request.url.includes('manifest.json')) {
    console.log('Intercepting manifest request:', event.request.url);
    
    // Extract the storefront ID from the URL path or query params
    const storefrontId = url.searchParams.get('storefrontId') || url.pathname.split('/')[1];
    console.log('Extracted storefront ID:', storefrontId);
    
    if (!storefrontId) {
      console.error('No storefront ID found in manifest request');
      return;
    }

    // First try to get the manifest URL from PWA settings
    event.respondWith(
      fetch(`https://bplsogdsyabqfftwclka.supabase.co/rest/v1/pwa_settings?storefront_id=eq.${storefrontId}&select=manifest_url`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwbHNvZ2RzeWFicWZmdHdjbGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ1OTg5NzgsImV4cCI6MjAyMDE3NDk3OH0.LvZzOTYqHHWK8mFj51li8OVyxeODHXGxEHUXGwDx_zo'
        }
      })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Failed to fetch PWA settings');
        }
        const settings = await response.json();
        console.log('PWA settings response:', settings);
        
        if (settings && settings[0] && settings[0].manifest_url) {
          console.log('Found manifest URL in settings:', settings[0].manifest_url);
          return fetch(settings[0].manifest_url);
        }
        
        // Fallback to constructed URL if no manifest_url in settings
        console.log('No manifest URL in settings, using fallback path');
        const fallbackUrl = `https://bplsogdsyabqfftwclka.supabase.co/storage/v1/object/public/storefront-assets/${storefrontId}/manifest/manifest.json`;
        return fetch(fallbackUrl);
      })
      .then(async response => {
        console.log('Manifest fetch response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Manifest fetch failed: ${response.status}`);
        }

        // Clone the response before reading it
        const responseToCache = response.clone();

        try {
          // Try to parse the JSON to validate it
          const jsonData = await responseToCache.json();
          console.log('Successfully parsed manifest JSON:', jsonData);
          
          // Cache the valid response
          const cache = await caches.open('manifest-cache');
          await cache.put(event.request, response.clone());
          console.log('Cached valid manifest response');
        } catch (error) {
          console.error('Invalid JSON in manifest response:', error);
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