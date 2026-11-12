/* LivingSeed · RLL Discipleship — service worker.
   Keeps the app's own files on the phone so it opens fast, even on a slow network.
   - Only handles files inside this app's folder; requests to the tracker (Google) and to other
     apps or sites go straight to the network untouched.
   - Its storage is named "rll-discipleship-…" and it only ever deletes its own old copies,
     so other installed apps on the same website are not affected. */
const VERSION = "2026.11.12-1328";
const PREFIX = "rll-discipleship-";
const CACHE = PREFIX + VERSION;
const SHELL = ["./", "index.html", "pwa.js", "manifest.webmanifest", "install.html", "help.html",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))));
});
self.addEventListener("message", e => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url), scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;   // not ours: leave it alone
  if (url.pathname.endsWith("/config.js")) {   // the tracker address: always fresh when online
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; }).catch(() => caches.match(req)));
    return;
  }
  if (req.mode === "navigate") {   // opening the app: this version's page (updates come through "Update now")
    const page = url.pathname.endsWith("/") ? "index.html" : req;
    e.respondWith(caches.match(page, { ignoreSearch: true }).then(r => r || fetch(req)));
    return;
  }
  // everything else (help pictures…): from the phone if kept, else download and keep it
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(res => {
    if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); }
    return res;
  })));
});
