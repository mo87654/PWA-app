const CACHE_NAME = "todo-cache-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./main.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Install and cache assets
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate and clean old caches
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache the new version
                let resClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, resClone);
                });
                return response;
            })
            .catch(() => {
                // Return cache if offline
                return caches.match(event.request);
            })
    );
});
