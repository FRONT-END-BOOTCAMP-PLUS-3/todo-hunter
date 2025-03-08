self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  // Add a call to skipWaiting here if you want to force the waiting service worker to become the active service worker
  // self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
