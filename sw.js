const CACHE_NAME = 'munchiz-v3';

const ESSENTIAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './img/logo.png',
  './img/icon-512.png',
  './img/lilo.png',
  './img/sofi.png',
  './img/moana.png',
  './img/rodri.png',
  './img/fondo_cuarto.png',
  './img/fondo_disco.png',
  './img/fondo_juego.png',
  './img/fondo_flappy.png',
  './img/galleta.png',
  './img/canasta.png',
  './img/moneda.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ESSENTIAL_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('Recurso no precargado:', asset);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});