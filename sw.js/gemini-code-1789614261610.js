const CACHE_NAME = 'munchiz-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './audio/musica_fiesta.mp3',
  './img/logo.png',
  './img/lilo.png',
  './img/capy.png',
  './img/fondo_cuarto.png',
  './img/fondo_disco.png',
  './img/fondo_juego.png',
  './img/fondo_flappy.png',
  './img/galleta.png',
  './img/canasta.png',
  './img/pilar_arriba.png',
  './img/pilar_abajo.png',
  './img/moneda.png',
  './img/huevo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});