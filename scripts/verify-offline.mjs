import fs from "node:fs";

const read = path => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const sw = read("../public/sw.js");
const page = read("../src/app/page.tsx");
const account = read("../src/app/AccountWorkspace.tsx");
const offline = read("../src/app/offline/page.tsx");
const pwaRegister = read("../src/app/pwa-register.tsx");
const pwaCss = read("../src/app/pwa.css");
const globalCss = read("../src/app/globals.css");
const installCss = read("../src/app/install-card.css");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(sw.includes('event.waitUntil(self.skipWaiting())'), "user-approved worker activation must be awaited by the message event");
check(sw.includes("navigationPreload.enable()") && sw.includes("event.preloadResponse"), "navigation preload must be optional and used by network-first page loads");
check(sw.includes("function isSafePublicHtml") && sw.includes('value === "cookie"') && sw.includes('value === "authorization"'), "public HTML caching must reject cookie- or authorization-varying responses");
check(sw.includes("sensitiveQuery.test(key)") && sw.includes("responseOrigin === self.location.origin"), "public HTML caching must reject sensitive query strings and cross-origin redirects");
check(sw.includes("response.status >= 500") && sw.includes("networkFirstNavigation(request, event)"), "cached public pages must recover from transient server errors");
check(/const CACHE_VERSION = "iteration13-shell-v10"/.test(sw), "current Iteration 13 app-shell cache version must be v10");
check(/const MEDIA_CACHE = "iteration13-media-v5"/.test(sw), "image-only media cache version must be v5");
check(/const MEDIA_CACHE = "iteration13-media-v\d+"/.test(sw), "versioned media cache is missing");
check(sw.includes('"/", "/offline"') && sw.includes('"/patterns", "/iphone-install"'), "home, offline and public utility routes must be precached");
check(sw.includes("for (const match of html.matchAll") && sw.includes("/_next\\/static\\/"), "app-shell HTML must discover and precache its versioned Next.js assets");
check(sw.includes('request.destination === "image"') && sw.includes('event.respondWith(cacheMediaRequest(request, event))'), "only approved image requests should use the offline media cache");
check(sw.includes('response.type !== "opaque"') && sw.includes("declaredSize > 0 && declaredSize <= MEDIA_MAX_BYTES"), "opaque or oversized media must not be persisted");
check(sw.includes("private|no-store") && sw.includes("cache-control"), "private/no-store HTML must not be cached");
check(sw.includes('url.pathname.startsWith("/api/")') && sw.includes("const isPrivate ="), "API and private routes must remain outside public page caching");
check(sw.includes('event.data?.type === "CACHE_MEDIA"'), "service worker must accept the page's current media list");
check(sw.includes('event.data?.type === "SKIP_WAITING"') && !sw.includes("await self.skipWaiting()"), "updates must wait for the user's explicit refresh action");
check(sw.includes('return await cache.match(request) || await cache.match("/") || await cache.match("/offline")'), "offline public navigation must fall back to the saved app shell and offline route");
check(page.includes("setOnline(navigator.onLine)") && page.includes('window.addEventListener("offline", syncOnline)') && page.includes('window.addEventListener("online", syncOnline)'), "the compact Store offline indicator must follow browser connectivity events");
check(pwaRegister.includes('window.addEventListener("online", online)') && pwaRegister.includes('window.removeEventListener("online", online)'), "pending notification delivery must retry when connectivity returns");
check(!pwaRegister.includes("offlineBanner") && !page.includes("sd-offline-notice") && !pwaCss.includes(".offlineBanner"), "duplicated full-width offline/reconnect banners must stay removed");
check(page.includes("Offline ready") && page.includes("Local demo mode") && page.includes("iteration13-shell-v10") && page.includes("shell.match(\"/offline\")"), "the expandable connectivity status must verify the saved app shell and explain local demo boundaries");
check(globalCss.includes(".sd-connect-details>summary") && globalCss.includes(".sd-connect-popover") && globalCss.includes("[open]>summary"), "connectivity status must be a compact, keyboard-operable disclosure rather than a persistent banner");
check(pwaCss.includes(".pwaUpdate{position:fixed;top:calc(env(safe-area-inset-top") && pwaCss.includes("bottom:auto"), "update-ready prompt must stay compact at the top, not cover bottom actions");
check(sw.includes("preservePaths = []") && sw.includes("removable.slice(0, excess)") && sw.includes("trimCache(SHELL_CACHE, STATIC_LIMIT, APP_SHELL)"), "cache trimming must preserve precached app-shell routes");
check(sw.includes('"images.unsplash.com"') && sw.includes('"utfs.io"') && sw.includes('"ufs.sh"'), "media cache must be restricted to the supported image/upload hosts");
check(sw.includes("const MEDIA_LIMIT = 24") && sw.includes("const MEDIA_MAX_BYTES = 4 * 1024 * 1024"), "media cache must enforce 24 entries and a 4 MB per-image limit");
check(sw.includes('if (cached) return cached') && sw.includes('return Response.error()'), "media and navigation fetches must retain an offline fallback");
check(page.includes('type: "CACHE_MEDIA"') && page.includes("data.services.filter(service => service.mediaType !== \"video\")") && page.includes("data.announcementImage"), "only offline-eligible service images and announcement media must be prepared for offline use");
check(sw.includes('startsWith("image/")'), "media cache must reject videos and other non-image responses");
check(installCss.includes(".i13-install-card{position:relative") && !installCss.includes(".i13-install-card{position:fixed"), "install card must stay in document flow rather than cover bottom actions");
check(page.includes('window.localStorage.setItem(getStorageKey(STORAGE_KEY), JSON.stringify(data))'), "customer/admin demo changes must be synchronously saved before success feedback");
check(account.includes("if (!online || !navigator.onLine)") && account.includes("Upload"), "offline account messaging must stay available while uploads are blocked");
check(offline.includes("not queued for server delivery") && offline.includes("images") && offline.toLowerCase().includes("video streaming"), "offline guidance must explain image caching, video limits and non-sync boundaries");

if (failures.length) {
  console.error("OFFLINE VERIFICATION FAILED");
  failures.forEach(failure => console.error(" - " + failure));
  process.exit(1);
}
console.log("OFFLINE VERIFIED — versioned app shell, bounded approved media cache, local customer/admin writes, and honest upload/sync boundaries.");
