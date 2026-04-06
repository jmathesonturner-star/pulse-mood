// Pulse Service Worker v1
const CACHE = 'pulse-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap'
];

// ─── Install: cache all assets ───────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// ─── Activate: clean old caches ──────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch: serve from cache, fall back to network ───────────────────────────
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// ─── Push notifications ───────────────────────────────────────────────────────
self.addEventListener('push', e => {
  const data = e.data?.json() || {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'Pulse', {
      body: data.body || 'Time for your check-in 🌟',
      icon: './icon-192.svg',
      badge: './icon-192.svg',
      tag: data.tag || 'pulse-checkin',
      requireInteraction: false,
      data: { url: './' }
    })
  );
});

// ─── Notification click: open app ────────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('index.html') || client.url.endsWith('/')) {
          return client.focus();
        }
      }
      return clients.openWindow('./index.html');
    })
  );
});

// ─── Alarm-style nudges via periodic sync (fallback: message from app) ────────
// The app posts a message to schedule nudges when it can't use Push API
self.addEventListener('message', e => {
  if (e.data?.type === 'SCHEDULE_NUDGE') {
    const { label, delayMs, tag } = e.data;
    // We store nudge intent; setTimeout inside SW is unreliable across sleep,
    // so we use the app-side scheduler for same-session nudges and SW for
    // cross-session via Push. This handler acknowledges receipt.
    e.ports?.[0]?.postMessage({ ok: true });
  }
});
