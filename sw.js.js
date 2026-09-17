const CACHE_NAME = 'munchiz-v2';

// Archivos esenciales mínimos para que nunca falle la instalación
const ESSENTIAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './img/logo.png',
  './img/lilo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Intenta guardar los archivos sin romper la instalación si falta alguno
      for (const asset of ESSENTIAL_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('No se pudo precargar:', asset);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});