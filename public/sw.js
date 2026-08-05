/* ============================================================
   The Observer US — Service Worker
   Web Push notification handling + offline cache fallback.
   ============================================================ */

const CACHE_NAME = 'observeer-v1'

// ─── Install: pre-cache critical assets ─────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

// ─── Activate: clean old caches ─────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  )
})

// ─── Push Event: display notification ───────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()

    const options = {
      body: data.body ?? '',
      icon: data.icon ?? '/icon-192.png',
      badge: data.badge ?? '/badge-72.png',
      image: data.image,
      data: {
        url: data.url ?? '/',
      },
      actions: [
        {
          action: 'read',
          title: 'Read Article',
        },
      ],
      vibrate: [200, 100, 200],
    }

    event.waitUntil(
      self.registration.showNotification(data.title ?? 'The Observer US', options)
    )
  } catch {
    // Payload is plain text — show as-is
    event.waitUntil(
      self.registration.showNotification(event.data.text(), {
        icon: '/icon-192.png',
        badge: '/badge-72.png',
      })
    )
  }
})

// ─── Notification Click: open article or site ──────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url ?? '/'

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing tab if open
        for (const client of windowClients) {
          if (client.url === urlToOpen) {
            return client.focus()
          }
        }
        // Otherwise open new tab
        return clients.openWindow(urlToOpen)
      })
  )
})

// ─── Fetch: network-first with cache fallback ──────────────
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone)
        })
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
