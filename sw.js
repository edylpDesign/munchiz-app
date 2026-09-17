const CACHE_NAME = 'munchiz-v5';

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
  './img/fondo_nubes.png',
  './img/nube_plataforma.png',
  './img/resorte_estrella.png',
  './img/galleta.png',
  './img/canasta.png',
  './img/moneda.png',
  './audio/musica_fiesta.mp3',
  './audio/musica_juegos.mp3'
];

// Instalación: Precarga sin bloquear si algún archivo multimedia aún no se sube
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ESSENTIAL_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn('Recurso no precargado:', asset);
        }
      }
    })
  );
});

// Activación: Limpia inmediatamente cachés anteriores (v1, v2, v3, v4)
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

// Estrategia Network-First: Busca siempre en la red primero para que el celular no retenga la copia vieja
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});