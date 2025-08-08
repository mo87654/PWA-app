const CACHE_NAME = "todo-pwa-v2"; // bump version on updates
const API_URL = "https://jsonplaceholder.typicode.com/todos/1";

const ASSETS = [
    "./",
    "./index.html",
    "./style.css",
    "./main.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Install event
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Caching app shell");
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", event => {
    if (event.request.url.includes(API_URL)) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(cached => {
                return cached || fetch(event.request);
            })
        );
    }
});

// Listen for skipWaiting
self.addEventListener("message", event => {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});
