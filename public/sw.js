const CACHE_VERSION = "iteration13-shell-v32";
const MEDIA_CACHE = "iteration13-media-v5";
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
  // The worker is not installable until the essential Store and offline fallback are
  // safely stored. Optional artwork and utility pages must never block installation.
  const shell = await caches.open(SHELL_CACHE);
  const discovered = new Set();

  for (const path of APP_SHELL) {
    const required = path === "/" || path === "/offline";
    try {
      const request = new Request(path, { cache: "reload" });
      const response = await fetch(request);
      if (!response.ok) {
        if (required) throw new Error("Required app-shell route returned " + response.status + ": " + path);
        continue;
      }

      const isHtml = (response.headers.get("content-type") || "").includes("text/html");
      if (required && !isHtml) throw new Error("Required app-shell route was not HTML: " + path);
      if (required) await shell.put(request, response.clone());
      else {
        try { await shell.put(request, response.clone()); } catch {}
      }

      if (!isHtml) continue;
      const html = await response.text();
      for (const match of html.matchAll(/(?:src|href)=["'](\/_next\/static\/[^"']+)["']/g)) discovered.add(match[1]);
    } catch (error) {
      if (required) throw error;
    }
  }

  const criticalAssets = [...discovered].filter(path => /\.(?:js|css)(?:[?#]|$)/i.test(path));
  if (!criticalAssets.some(path => /\.js(?:[?#]|$)/i.test(path)) || !criticalAssets.some(path => /\.css(?:[?#]|$)/i.test(path))) {
    throw new Error("The Store HTML did not expose its required Next.js JavaScript and CSS assets.");
  }

  await Promise.all(criticalAssets.map(async path => {
    const request = new Request(path, { cache: "reload" });
    const response = await fetch(request);
    if (!response.ok) throw new Error("Required app-shell asset returned " + response.status + ": " + path);
    await shell.put(request, response);
  }));

  const optionalAssets = [...discovered].filter(path => !criticalAssets.includes(path));
  await Promise.all(optionalAssets.map(async path => {
    try {
      const request = new Request(path, { cache: "reload" });
      const response = await fetch(request);
      if (response.ok) {
        try { await shell.put(request, response); } catch {}
      }
    } catch {}
  }));

  try { await trimCache(SHELL_CACHE, STATIC_LIMIT, APP_SHELL); } catch {}
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
    if (response.ok && response.type !== "opaque" && (response.headers.get("content-type") || "").startsWith("image/") && declaredSize > 0 && declaredSize <= MEDIA_MAX_BYTES) {
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
    await Promise.all(keys.filter(key => (key.startsWith("iteration13-shell-") && key !== SHELL_CACHE) || (key.startsWith("iteration13-media-") && key !== MEDIA_CACHE)).map(key => caches.delete(key)));
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
          await trimCache(SHELL_CACHE, PUBLIC_PAGE_LIMIT + STATIC_LIMIT, APP_SHELL);
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
    if (response.ok && response.type !== "opaque" && (response.headers.get("content-type") || "").startsWith("image/") && declaredSize > 0 && declaredSize <= MEDIA_MAX_BYTES) {
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
        await trimCache(SHELL_CACHE, STATIC_LIMIT + PUBLIC_PAGE_LIMIT, APP_SHELL);
      } catch {
        // Storage quota failures must not block a successfully fetched asset.
      }
    }
    return response;
  } catch {
    return Response.error();
  }
}

async function trimCache(cacheName, maxEntries, preservePaths = []) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  const preserved = new Set(preservePaths.map(path => new URL(path, self.location.origin).href));
  const removable = keys.filter(request => !preserved.has(request.url));
  const excess = keys.length - maxEntries;
  await Promise.all(removable.slice(0, excess).map(request => cache.delete(request)));
}
