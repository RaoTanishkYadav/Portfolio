/* ============================================================
   MAIN — Preloader boot sequence
   ============================================================ */
(function () {
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preloaderFill");
  const percent = document.getElementById("preloaderPercent");
  if (!preloader || !fill || !percent) return;

  let progress = 0;
  const duration = 1400; // ms
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    progress = Math.min(elapsed / duration, 1);
    const pct = Math.floor(progress * 100);
    fill.style.width = pct + "%";
    percent.textContent = pct + "%";

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      finishLoad();
    }
  }

  function finishLoad() {
    document.body.style.overflow = "";
    preloader.classList.add("is-hidden");
    setTimeout(() => preloader.remove(), 900);
  }

  document.body.style.overflow = "hidden";
  requestAnimationFrame(tick);
})();
