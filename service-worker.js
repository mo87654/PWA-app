const CACHE_NAME = "todo-cache-v2";
const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=5";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install event: cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch event: try network first for API, then fallback to cache
self.addEventListener("fetch", event => {
  if (event.request.url.includes(API_URL.split("?")[0])) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache API response
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request)) // fallback to cache
    );
  } else {
    // App shell strategy: Cache first, then network
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
