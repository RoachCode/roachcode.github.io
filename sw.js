// A minimal service worker. 
// The fetch listener is required to pass browser PWA installation checks.
self.addEventListener('fetch', (event) => {
    // We aren't caching anything yet, so we just let the network handle it.
    return;
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});