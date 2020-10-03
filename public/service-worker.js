// console.log('Hi from your service-worker.js file!');

const CACHE_NAME = "my-site-cache-v1";
const Data_CACHE_NAME = "data_cache_v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "manifest.json",
  "/css/styles.css",
  "/icons/icon-72x72x.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  "/js/index.js",
];

//Install service worker
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were pre-cached succesfully");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

//Activate service worker & remove old data from the cache
self.addEventListener("fetch", function (e) {
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          return fetch(e.request)
            .then((response) => {
              //if response is good, clone it and store into cache
              if (response.status === 200) {
                cache.put(e.request.url, response.clone());
              }
              return response;
            })
            .catch((err) => {
              //If network request failed, try to get it from the cache
              return cache.match(e.request);
            });
        })
        .catch((err) => console.log(err))
    );
    return;
  }
});
