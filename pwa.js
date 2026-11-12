/* LivingSeed · RLL Discipleship — installable app (PWA) helper.
   Shows "Install the app" on the sign-in screen, and "A new version is ready" inside the app.
   It only looks after this app's own folder: other installed apps are never touched. */
(function () {
  "use strict";
  var VERSION = "2026.11.12-1501";
  var $ = function (s) { return document.querySelector(s); };
  var ver = $("#appVer"); if (ver) ver.textContent = "App version " + VERSION;

  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  var ua = navigator.userAgent || "";
  var ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var iosNotSafari = ios && /crios|fxios|edgios|opios/i.test(ua);
  var box = $("#getApp"), btn = $("#installBtn"), how = $("#installHow"), deferred = null;

  if (!standalone && box) {
    box.hidden = false;
    how.hidden = false;
    if (iosNotSafari) how.innerHTML = "On iPhone: open this page in <b>Safari</b>, then tap <b>Share</b> → <b>Add to Home Screen</b>.";
    else if (ios) how.innerHTML = "On iPhone: tap <b>Share</b> (the square with an arrow) → <b>Add to Home Screen</b> → <b>Add</b>.";
    else how.innerHTML = "No Install button? Open the browser menu <b>⋮</b> and choose <b>Install app</b> or <b>Add to Home screen</b>.";
  }
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferred = e;
    if (btn && !standalone) { btn.hidden = false; how.hidden = true; }
  });
  if (btn) btn.addEventListener("click", function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function (r) {
      deferred = null; btn.hidden = true; how.hidden = false;
      how.innerHTML = r.outcome === "accepted" ? "Installing… look for <b>RLL Disciples</b> on your home screen." : "You can install it later from the browser menu <b>⋮</b>.";
    });
  });
  window.addEventListener("appinstalled", function () { if (box) box.hidden = true; });

  if (!("serviceWorker" in navigator)) return;
  var reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", function () { if (reloading) return; reloading = true; location.reload(); });

  function unsaved() {
    try { return (typeof CLS !== "undefined" && CLS.dirty) || (typeof MEET !== "undefined" && MEET.dirty) || (typeof DIS !== "undefined" && DIS.dirty); } catch (e) { return false; }
  }
  function offer(worker) {
    var bar = $("#updBar"); if (!bar) return;
    bar.hidden = false;
    $("#updBtn").onclick = function () {
      if (unsaved() && !confirm("You have marks or changes that are not saved yet. Marks are kept on this phone as a draft, but it is safest to save first.\n\nUpdate now anyway?")) return;
      bar.querySelector("span").textContent = "Updating…";
      worker.postMessage("SKIP_WAITING");
    };
    $("#updLater").onclick = function () { bar.hidden = true; };
  }
  navigator.serviceWorker.register("sw.js", { scope: "./" }).then(function (reg) {
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener("updatefound", function () {
      var w = reg.installing; if (!w) return;
      w.addEventListener("statechange", function () { if (w.state === "installed" && navigator.serviceWorker.controller) offer(w); });
    });
    var check = function () { reg.update().catch(function () {}); };
    setInterval(check, 30 * 60 * 1000);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") check(); });
  }).catch(function () {});
})();
