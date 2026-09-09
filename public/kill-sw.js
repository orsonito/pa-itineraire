/* Clears a poisoned service worker that served HTML as JS (dead buttons). */
(function () {
  try {
    var host = location.hostname;
    var isDev = host === "localhost" || host === "127.0.0.1";
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (regs) {
        regs.forEach(function (reg) {
          if (isDev) {
            reg.unregister();
            return;
          }
          var url =
            (reg.active && reg.active.scriptURL) ||
            (reg.waiting && reg.waiting.scriptURL) ||
            (reg.installing && reg.installing.scriptURL) ||
            "";
          if (url.indexOf("sw.js") !== -1) {
            /* keep current worker; caches below still get a scrub */
            return;
          }
          reg.unregister();
        });
      });
    }
    if ("caches" in window) {
      caches.keys().then(function (keys) {
        keys.forEach(function (k) {
          if (isDev || k === "pa-plan-v1" || k === "pa-plan-v2") {
            caches.delete(k);
          }
        });
      });
    }
  } catch (e) {
    /* ignore */
  }
})();
