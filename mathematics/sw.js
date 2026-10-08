// Mathemate SA - 84 Classes - CAPS Approved - Service Worker
// Version: 2.0 CAPS ATP 2024

const CACHE_NAME = 'mathemate-84-caps-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './daily_questions.json'
];

// Install - cache CAPS files
self.addEventListener('install', e => {
  console.log('[SW] Installing CAPS Approved version');
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate - clean old cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - Offline-first strategy for SA schools with no data
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      // Return cached if exists (offline)
      if (cached) return cached;
      
      // Else fetch from network and cache for next offline use
      return fetch(e.request).then(res => {
        // Don't cache chrome extensions
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      }).catch(() => {
        // If both fail and it's a page request, return index.html (offline fallback)
        if (e.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Background sync for attendance when back online (CAPS SA-SAMS sync)
self.addEventListener('sync', e => {
  if (e.tag === 'sync-attendance') {
    e.waitUntil(syncAttendance());
  }
});

async function syncAttendance() {
  // This will sync localStorage attendance to Firebase when online
  console.log('[SW] Syncing attendance to cloud...');
  // Placeholder for Firebase sync
  return Promise.resolve();
}
