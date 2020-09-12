const filesToCache = [
  "./",
  // "js/vendor/jquery-3.4.1.min.js",
  "js/vendor/modernizr-3.8.0.min.js",
  "js/main.js",
  "js/plugins.js",
  "css/master.min.css",
  "css/bootstrap.min.css",
  "css/home.min.css",
  "css/normalize.min.css",
  // "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css",
  // "https://kit-free.fontawesome.com/releases/latest/css/free.min.css",
  // "https://kit.fontawesome.com/a2ea8d437a.js",
  "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"
];
const vNum = Math.floor(Math.random() * 1000000000000) + 1;
const staticCacheName = `sunny-cache-v${vNum}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
