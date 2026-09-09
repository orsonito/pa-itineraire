const CACHE = "pa-plan-v4";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const dest = req.destination;
  const isPage = req.mode === "navigate" || dest === "document";
  const isAsset =
    dest === "script" ||
    dest === "style" ||
    dest === "image" ||
    dest === "font" ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/icons/");

  // Never serve HTML as a fallback for JS/CSS — that paints a dead UI.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && isAsset && dest !== "script" && dest !== "style") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        if (isPage) return caches.match("/");
        return Response.error();
      })
  );
});
