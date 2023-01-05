/// <reference lib="webworker" />

// Imports:
import { build, files, version } from '$service-worker';

// Initializations:
const worker = self as unknown as ServiceWorkerGlobalScope;
const cacheName = `pg-${version}`;
const cacheList = build.concat(files);

worker.addEventListener('install', (event) => {
  worker.skipWaiting();
  const cachePromise = caches.open(cacheName).then((cache) => {
    console.log('[Service Worker] Event [Install]: ', cacheList);
    return cache.addAll(cacheList);
  });
  event.waitUntil(cachePromise);
});

worker.addEventListener('fetch', async (event) => {
  const request = event.request;
  const matchURL = request.url.indexOf('http') === 0 && request.method === 'GET';
  if (matchURL) {
    event.respondWith(
      (async () => {
        const cacheResponse = await caches.match(request);
        console.log(`[Service Worker] Fetching resource: ${request.url}`);
        if (cacheResponse) {
          if (cacheResponse.ok && cacheResponse.status < 400) {
            console.warn('Cache Response:', cacheResponse);
            return cacheResponse;
          }
        }
        const response = await fetch(request);
        const cacheStorage = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${request.url}`);
        cacheStorage.put(request, response.clone());
        return response;
      })()
    );
  }
});

worker.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (cacheName.indexOf(key) === -1) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
