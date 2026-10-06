const CACHE='makhanani-v5-super';
const ASSETS=[
'./','./index.html','./manifest.json',
'./health/','./health/index.html',
'./class-tracker/','./class-tracker/index.html',
'./quiz/','./quiz/index.html',
'./games/','./games/index.html'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))); self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./'))));});
