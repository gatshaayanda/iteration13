// Background push is optional for this prototype. A failed remote import must never
// prevent the service worker from registering its offline shell and fetch handlers.
try {
  importScripts(
    "https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/11.9.0/firebase-messaging-compat.js",
    "/api/firebase/messaging-sw-config"
  );
} catch (error) {
  console.warn("Background messaging is unavailable; offline app-shell support remains enabled.", error);
}

let thePlugMessaging = null;
try {
  const config = self.__THE_PLUG_FIREBASE_CONFIG__;
  if (config && config.apiKey && config.projectId && config.messagingSenderId && config.appId) {
    firebase.initializeApp(config);
    thePlugMessaging = firebase.messaging();
    thePlugMessaging.onBackgroundMessage((payload) => {
      // Notification payloads are displayed automatically by Firebase. Only render
      // data-only pushes here to avoid showing the same notification twice.
      if (payload.notification) return;
      const title = payload.data?.title || "Iteration 13 update";
      const options = {
        body: payload.data?.body || "Open the app to check your latest information.",
        icon: "/iteration13-icon.svg",
        badge: "/iteration13-icon.svg",
        data: { link: payload.data?.link || "/account" },
      };
      self.registration.showNotification(title, options);
    });
  } else {
    console.error("The Plug Firebase Messaging web config is incomplete.");
  }
} catch (error) {
  console.error("The Plug Firebase Messaging service worker could not initialize.", error);
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const rawLink = event.notification.data?.link || "/account";
  const link = rawLink.startsWith("/") ? rawLink : "/account";
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const client of list) {
      if ("focus" in client) {
        void client.navigate(link);
        return client.focus();
      }
    }
    return clients.openWindow(link);
  }));
});

const CACHE_VERSION = "iteration13-shell-v6";
const MEDIA_CACHE = "iteration13-media-v4";
const SHELL_CACHE = CACHE_VERSION;
const STATIC_LIMIT = 100;
const PUBLIC_PAGE_LIMIT = 12;
const MEDIA_LIMIT = 24;
const MEDIA_MAX_BYTES = 4 * 1024 * 1024;
const MEDIA_HOSTS = ["images.unsplash.com", "utfs.io", "ufs.sh"];
const APP_SHELL = ["/", "/offline", "/patterns", "/iphone-install", "/iphone-install.svg", "/iteration13-icon.svg", "/iteration13-icon-192.svg", "/iteration13-icon-512.svg", "/iteration13-icon-192.png", "/iteration13-icon-512.png", "/iteration13-icon-180.png", "/manifest.webmanifest"];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    await precacheShell();
    // Keep updates waiting until the user chooses Refresh in the app's update notice.
    // First installation still activates normally because there is no prior controller.
  })());
});

async function precacheShell() {
  let shell;
  try {
    shell = await caches.open(SHELL_CACHE);
  } catch {
    // Storage may be disabled or exhausted. Do not fail service-worker installation.
    return;
  }
  const discovered = new Set();
  for (const path of APP_SHELL) {
    try {
      const request = new Request(path, { cache: "reload" });
      const response = await fetch(request);
      if (!response.ok) continue;
      try { await shell.put(request, response.clone()); } catch {}
      if (!(response.headers.get("content-type") || "").includes("text/html")) continue;
      const html = await response.text();
      for (const match of html.matchAll(/(?:src|href)=["'](\/_next\/static\/[^"']+)["']/g)) discovered.add(match[1]);
    } catch {}
  }
  await Promise.all([...discovered].map(async path => {
    try {
      const request = new Request(path, { cache: "reload" });
      const response = await fetch(request);
      if (response.ok) {
        try { await shell.put(request, response); } catch {}
      }
    } catch {}
  }));
  try { await trimCache(SHELL_CACHE, STATIC_LIMIT); } catch {}
}

self.addEventListener("message", event => {
  if (event.data?.type === "SKIP_WAITING") {
    // Keep the message event alive until the user-approved update activation is requested.
    event.waitUntil(self.skipWaiting());
    return;
  }
  if (event.data?.type === "CACHE_MEDIA" && Array.isArray(event.data.urls)) {
    const urls = [...new Set(event.data.urls.filter(url => typeof url === "string" && isApprovedMediaUrl(url)))].slice(0, MEDIA_LIMIT);
    event.waitUntil(cacheMediaBatch(urls));
  }
});

function isApprovedMediaUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && MEDIA_HOSTS.some(host => url.hostname === host || url.hostname.endsWith("." + host));
  } catch {
    return false;
  }
}

async function cacheMediaBatch(urls) {
  // Limit concurrency and total entries: large media must not crowd out the app shell.
  for (let index = 0; index < urls.length; index += 3) {
    await Promise.all(urls.slice(index, index + 3).map(cacheMediaUrl));
  }
  try { await trimCache(MEDIA_CACHE, MEDIA_LIMIT); } catch { /* Media is optional; cache quota must not break the app. */ }
}

async function cacheMediaUrl(value) {
  if (!isApprovedMediaUrl(value)) return;
  // Use a readable CORS response so storage can be bounded by actual declared size.
  // If a host does not permit CORS, its image still works online but is not prefetched.
  const request = new Request(value, { mode: "cors", credentials: "omit", cache: "reload" });
  const cache = await caches.open(MEDIA_CACHE);
  if (await cache.match(request)) return;
  try {
    const response = await fetch(request);
    const declaredSize = Number(response.headers.get("content-length") || 0);
    if (response.ok && response.type !== "opaque" && declaredSize > 0 && declaredSize <= MEDIA_MAX_BYTES) {
      await cache.put(request, response.clone());
      await trimCache(MEDIA_CACHE, MEDIA_LIMIT);
    }
  } catch {
    // Media remains optional; a failed prefetch must never interrupt app-shell use.
  }
}

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("theplug-shell-") || key.startsWith("theplug-media-") || (key.startsWith("iteration13-shell-") && key !== SHELL_CACHE) || (key.startsWith("iteration13-media-") && key !== MEDIA_CACHE)).map(key => caches.delete(key)));
    // Navigation preload overlaps the network request with worker startup. It is
    // optional and must never prevent activation on browsers that do not support it.
    try {
      if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    } catch {}
    await self.clients.claim();
  })());
});

function isSafePublicHtml(request, response) {
  const cacheControl = response.headers.get("cache-control") || "";
  const vary = (response.headers.get("vary") || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  const queryKeys = [...new URL(request.url).searchParams.keys()];
  const sensitiveQuery = /^(?:token|access_token|code|email|auth|authorization|invite|key|signature|sig)$/i;
  let responseOrigin = self.location.origin;
  try { if (response.url) responseOrigin = new URL(response.url).origin; } catch { return false; }

  return request.method === "GET"
    && !request.headers.has("authorization")
    && response.type === "basic"
    && responseOrigin === self.location.origin
    && (response.headers.get("content-type") || "").includes("text/html")
    && !/private|no-store/i.test(cacheControl)
    && !vary.some(value => value === "*" || value === "cookie" || value === "authorization")
    && !response.headers.has("set-cookie")
    && !queryKeys.some(key => sensitiveQuery.test(key));
}

async function networkFirstNavigation(request, event) {
  try {
    const preloaded = event.preloadResponse ? await event.preloadResponse.catch(() => undefined) : undefined;
    const response = preloaded || await fetch(request);
    if (response.ok && isSafePublicHtml(request, response)) {
      // Cache writes are deliberately detached from the navigation response.
      // Keep cache maintenance detached so a slow disk write never delays navigation.
      void caches.open(SHELL_CACHE).then(async cache => {
        try {
          await cache.put(request, response.clone());
          await trimCache(SHELL_CACHE, PUBLIC_PAGE_LIMIT + STATIC_LIMIT);
        } catch {
          // Cache quota failures must not affect the live navigation response.
        }
      }).catch(() => {});
    } else if (response.status >= 500) {
      // A transient server failure should not blank a previously cached public page.
      try {
        const cache = await caches.open(SHELL_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
      } catch {}
    }
    return response;
  } catch {
    try {
      const cache = await caches.open(SHELL_CACHE);
      return await cache.match(request) || await cache.match("/") || await cache.match("/offline") || Response.error();
    } catch {
      return Response.error();
    }
  }
}

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Cache only explicitly approved image CDNs. Video streams and arbitrary third-party
  // traffic stay network-dependent so they cannot consume the app-shell storage budget.
  if (request.destination === "image" && isApprovedMediaUrl(request.url)) {
    event.respondWith(cacheMediaRequest(request, event));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  const isNavigation = request.mode === "navigate" || request.headers.get("accept")?.includes("text/html");
  const isPrivate = /^\/(?:account|requests|orders|admin|invite)(?:\/|$)/.test(url.pathname);

  // Private/member routes are network-only. Never serve a cached account/request page as
  // a substitute for a different route or when the authenticated page cannot be fetched.
  if (isNavigation && isPrivate) {
    event.respondWith(fetch(request).catch(async () => {
      try {
        const cache = await caches.open(SHELL_CACHE);
        return await cache.match("/offline") || Response.error();
      } catch {
        return Response.error();
      }
    }));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname === "/manifest.webmanifest" || /\.(?:css|js|woff2?|ttf|otf|png|jpe?g|webp|svg|ico|avif)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isNavigation) {
    event.respondWith(networkFirstNavigation(request, event));
  }
});

async function cacheMediaRequest(request, event) {
  let cache;
  try {
    cache = await caches.open(MEDIA_CACHE);
  } catch {
    try { return await fetch(request); } catch { return Response.error(); }
  }
  const cached = await cache.match(request);
  const refresh = async () => {
    // Convert the browser's often-opaque image request to CORS where supported.
    // Opaque responses cannot be size-checked and are deliberately not persisted.
    const readableRequest = new Request(request, { mode: "cors", credentials: "omit" });
    const response = await fetch(readableRequest);
    const declaredSize = Number(response.headers.get("content-length") || 0);
    if (response.ok && response.type !== "opaque" && declaredSize > 0 && declaredSize <= MEDIA_MAX_BYTES) {
      await cache.put(request, response.clone());
      await trimCache(MEDIA_CACHE, MEDIA_LIMIT);
    }
    return response;
  };
  if (cached) {
    // Return the known-good cached image immediately; refresh without blocking paint.
    event.waitUntil(refresh().catch(() => {}));
    return cached;
  }
  try {
    try {
      return await refresh();
    } catch {
      // Preserve normal online rendering for CDNs that reject CORS; do not cache opaque data.
      return await fetch(request);
    }
  } catch {
    return Response.error();
  }
}

async function cacheFirst(request) {
  let cache;
  try {
    cache = await caches.open(SHELL_CACHE);
  } catch {
    try { return await fetch(request); } catch { return Response.error(); }
  }
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      try {
        await cache.put(request, response.clone());
        await trimCache(SHELL_CACHE, STATIC_LIMIT + PUBLIC_PAGE_LIMIT);
      } catch {
        // Storage quota failures must not block a successfully fetched asset.
      }
    }
    return response;
  } catch {
    return Response.error();
  }
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(keys.slice(0, keys.length - maxEntries).map(request => cache.delete(request)));
}
