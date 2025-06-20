// Service Worker for Manjaly Infrastructure Website
const CACHE_NAME = "manjaly-infrastructure-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/about.html",
  "/css/about.css",
  "/js/about.js",
  "/assets/main-DGRWbgL8.css",
  "/assets/main-Dqbv5mv1.js",
  "/assets/mj-home-main.webp",
  "/assets/mj-ab-1.webp",
  "/assets/mj-ab-2.webp",
  "/assets/mj-sh-1.webp",
  "/assets/mj-sm-2.webp",
  "/assets/mj-sm-3.webp",
  "/assets/mj-th-1.webp",
  "/assets/mj-th-2.webp",
  "/assets/mj-bg-1.webp",
  "/assets/mj-bg-2.webp",
  "/assets/mj-pr-1.webp",
  "/assets/md-C1YG0UGc.jpg",
  "/assets/favicon-BKQihvu8.ico",
  "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/manjani-logo-qn1_C1XG.png",
  "https://cdn.jsdelivr.net/gh/brandcrafters01/media@main/bai-aDrhRLBf.png",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (
    !event.request.url.startsWith(self.location.origin) &&
    !event.request.url.includes("cdn.jsdelivr.net") &&
    !event.request.url.includes("fonts.googleapis.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      // Clone the request because it's consumed by fetch
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Add to cache for future use
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback if available
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
