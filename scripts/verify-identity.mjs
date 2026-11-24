import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git","node_modules",".next","coverage"]);
const ignoredFiles = new Set(["AGENTS.md","scripts/verify-identity.mjs"]);
const textExtensions = new Set([".ts",".tsx",".js",".mjs",".css",".json",".webmanifest",".md",".yml",".yaml",".txt",".html",".svg"]);
const failures = [];
const page = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
if (!page.includes('url.searchParams.set("sample", "1")')) failures.push("shared business example links must launch first-time visitors directly into the Store");
if (!page.includes('"iteration13:shared-example-visited:" + sharedExample.id')) failures.push("shared example links must remember when a visitor has opened the example");
if (!page.includes("beginOwnBusinessFromSharedExample")) failures.push("returning visitors must be able to start a separate business without replacing the shared example");
if (!page.includes("Open this example")) failures.push("returning visitors must be able to reopen the shared business example");
function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full)); else files.push(full);
  }
  return files;
}
for (const file of walk(root)) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  if (ignoredFiles.has(rel) || !textExtensions.has(path.extname(file).toLowerCase())) continue;
  const content = fs.readFileSync(file, "utf8");
  if (/boemo-joos-food-deals|namane-tyres\\.vercel\\.app|yusuf-clothing-line\\.vercel\\.app|BOEMO_REMINDER_CRON_SECRET|boemoMedia|the-plug-pearl\\.vercel\\.app|plug-icon\\.svg|THE_PLUG_PUBLIC_URL/i.test(content)) failures.push(rel + ": inherited client identity, credential, storage path or production URL remains");
}
const manifest = JSON.parse(fs.readFileSync(path.join(root, "public/manifest.webmanifest"), "utf8"));
if (manifest.name !== "Iteration 13 | Service Studio") failures.push("manifest: wrong application name");
if (manifest.short_name !== "Iteration 13") failures.push("manifest: wrong short name");
if (manifest.theme_color !== "#155eef") failures.push("manifest: wrong theme color");
if (!manifest.icons?.some(icon => icon.src === "/iteration13-icon.svg" || icon.src === "/iteration13-icon-192.png")) failures.push("manifest: prototype icon missing");
for (const iconPath of ["/iteration13-icon.svg", "/iteration13-icon-192.png", "/iteration13-icon-512.png"]) {
  if (!manifest.icons?.some(icon => icon.src === iconPath)) failures.push("manifest: icon missing " + iconPath);
  if (!fs.existsSync(path.join(root, "public", iconPath.slice(1)))) failures.push("manifest icon asset missing " + iconPath);
}
const appManifest = fs.readFileSync(path.join(root, "src/app/manifest.ts"), "utf8");
if (!appManifest.includes('name: "Iteration 13 | Service Studio"')) failures.push("app manifest: wrong application name");
if (appManifest.includes("The Plug") || appManifest.includes("plug-icon")) failures.push("app manifest: inherited The Plug identity remains");
for (const iconPath of ["/iteration13-icon-192.png", "/iteration13-icon-512.png"]) if (!appManifest.includes(iconPath)) failures.push("app manifest: missing " + iconPath);
if (!fs.existsSync(path.join(root, "public/iteration13-icon.svg"))) failures.push("prototype icon file missing");
if (!fs.existsSync(path.join(root, "public/iteration13-icon-180.png"))) failures.push("Apple install icon file missing");
const layout = fs.readFileSync(path.join(root, "src/app/layout.tsx"), "utf8");
const pwaRegister = fs.readFileSync(path.join(root, "src/app/pwa-register.tsx"), "utf8");
for (const expected of ["Iteration 13 | Service Studio", "applicationName:\"Iteration 13\""]) if (!layout.includes(expected)) failures.push("layout: missing " + expected);
// Validate Apple install metadata semantically; whitespace and additional metadata fields are harmless.
if (!/appleWebApp\s*:\s*\{[^}]*\bcapable\s*:\s*true\b[^}]*\btitle\s*:\s*["']Iteration 13["']/s.test(layout)) failures.push('layout: missing appleWebApp capable=true and title="Iteration 13"');
const sw = fs.readFileSync(path.join(root, "public/sw.js"), "utf8");
if (!/iteration13-shell-v\d+/.test(sw)) failures.push("service worker: missing isolated cache namespace");
if (!sw.includes("/iteration13-icon.svg")) failures.push("service worker: prototype icon missing from app shell");
if (!sw.includes("/iphone-install") || !sw.includes("/iphone-install.svg")) failures.push("service worker: iPhone installation guide is not cached for offline use");
if (!layout.includes("__iteration13InstallPrompt") || !layout.includes("beforeinstallprompt")) failures.push("PWA layout: early native install-prompt capture is missing");
const installCardCss = fs.readFileSync(path.join(root, "src/app/install-card.css"), "utf8");
if (!layout.includes("<PwaRegister initialEmbedded={embedded} initialAndroid={android}/>{children}")) failures.push("PWA layout: install card must be mounted before page content");
if (!/\.i13-install-card\s*\{[^}]*position:\s*relative[^}]*max-width:\s*390px[^}]*margin:\s*12px auto 0/s.test(installCardCss)) failures.push("PWA install card: protected compact top-of-page placement has changed");

if (!pwaRegister.includes("await prompt.prompt()") || !pwaRegister.includes("setCanInstall(true)")) failures.push("PWA install: retained native prompt is not connected to the branded install action");
if (!pwaRegister.includes("(canInstall || canShowManualInstall)") || !pwaRegister.includes("isIosSafari()")) failures.push("PWA install: CTA must appear only for a captured native prompt or the iOS Safari guide");
if (/Install Iteration 13 from your browser|Chrome or Edge, open the <b>browser menu|platform-specific fallback as Odi/i.test(pwaRegister)) failures.push("PWA install: generic desktop/Android explainer fallback must not replace the native browser prompt");

// Guard the actual installation lifecycle, not just its visible copy. These checks
// intentionally fail the production build if a future edit breaks the approved flow.
const installContracts = [
  [layout.includes('strategy="beforeInteractive"') && layout.includes('event.preventDefault()') && layout.includes('window.__iteration13InstallPrompt = event'), "early beforeinstallprompt capture must retain the native event before hydration"],
  [pwaRegister.includes('promptWindow.__iteration13PwaListenerReady = true') && pwaRegister.includes('const earlyPrompt = promptWindow.__iteration13InstallPrompt'), "early prompt handoff to the single controller is missing"],
  [pwaRegister.includes('window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt)') && pwaRegister.includes('window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt)'), "native install listener setup/cleanup is missing"],
  [pwaRegister.includes('await prompt.prompt()') && pwaRegister.includes('await prompt.userChoice'), "branded install action must invoke and await the browser-owned prompt"],
  [pwaRegister.includes('className="i13-install-card"') && pwaRegister.includes('className="i13-install-close"') && pwaRegister.includes('setInstallCardDismissed(true)'), "branded dismissible install card is missing"],
  [pwaRegister.includes('window.addEventListener("appinstalled", appInstalled)') && pwaRegister.includes('setCanInstall(false)'), "installed-state cleanup is missing"],
  [pwaRegister.includes('function isIosSafari()') && pwaRegister.includes('Share</b>, choose <b>Add to Home Screen</b>'), "iOS Safari Share → Add to Home Screen guidance is missing"],
  [pwaRegister.includes('installState === "embedded"') && pwaRegister.includes('function openBrowser()'), "embedded-browser handoff is missing"],
  [pwaRegister.includes('navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })') && pwaRegister.includes('SKIP_WAITING') && pwaRegister.includes('className="pwaUpdate"'), "service-worker registration/update recovery UI is missing"],
];
for (const [passed, message] of installContracts) if (!passed) failures.push("PWA install contract: " + message);

const installGuidePath = path.join(root, "src/app/iphone-install/page.tsx");
if (!fs.existsSync(installGuidePath)) failures.push("iPhone installation guide route missing");
else if (!fs.readFileSync(installGuidePath, "utf8").includes("https://youtu.be/et2_1AcBYlg")) failures.push("iPhone installation guide: walkthrough link missing");
if (!fs.existsSync(path.join(root, "public/iphone-install.svg"))) failures.push("iPhone installation illustration missing");
// Protect the install journey across the entire UI, not only pwa-register.tsx.
// Branding/visual changes must never reintroduce a fake or dead-end desktop install screen.
function walkUiSource(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkUiSource(full));
    else if (/\.(?:tsx|ts|jsx|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}
const forbiddenInstallCopy = /If your browser provides a native install prompt|Chrome install option|If neither option appears, Chrome has not marked this site installable|In Chrome, open the .*menu and choose Install app or Add to Home screen|open the Chrome menu and choose Install app|Continue on the website.{0,80}(?:Chrome|browser menu)|No app-store search needed.{0,100}browser will guide the installation|your browser will guide the installation/i;
for (const file of walkUiSource(path.join(root, "src"))) {
  if (forbiddenInstallCopy.test(fs.readFileSync(file, "utf8"))) {
    failures.push(path.relative(root, file).replaceAll(path.sep, "/") + ": forbidden generic desktop/Android install fallback copy returned");
  }
}

// New-project hygiene is part of the build contract: these routes and handlers
// belonged to a separate client storefront and must not return to the BOS baseline.
const retiredClientPaths = [
  "src/app/account/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/invite",
  "src/app/order",
  "src/app/orders",
  "src/app/products",
  "src/app/request",
  "src/app/requests",
  "src/app/saved",
  "src/app/api/notifications",
  "src/app/api/sourcing-request",
  "src/app/api/operations-login",
  "src/app/api/firebase",
  ".github/workflows/pickup-reminders.yml"
];
for (const retiredPath of retiredClientPaths) {
  if (fs.existsSync(path.join(root, retiredPath))) failures.push(retiredPath + ": retired client-specific route or workflow must not be present in the foundation");
}
if (/plug-pending-order-notification|retryPendingOrderNotifications/i.test(pwaRegister)) failures.push("PWA controller: client-specific order retry logic must not be coupled to installation");
if (/THE_PLUG|thePlug|theplug-|The Plug|plug-icon/i.test(sw)) failures.push("service worker: inherited client messaging identity remains");
const foundationAgents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
const cloneChecklist = fs.readFileSync(path.join(root, "docs/CLONE-RESET-CHECKLIST.md"), "utf8");
if (!foundationAgents.includes("Clone identity and experience gate (mandatory)")) failures.push("AGENTS: mandatory clone identity/experience gate is missing");
if (!cloneChecklist.includes("Product genre and visual direction gate")) failures.push("clone checklist: mandatory project genre/design checkpoint is missing");

if (failures.length) {
  console.error("IDENTITY VERIFICATION FAILED");
  failures.forEach(failure => console.error(" - " + failure));
  process.exit(1);
}
console.log("IDENTITY VERIFIED — Iteration 13 app metadata and service-worker cache are isolated.");
