/* ============================================================
   CUSTOM CURSOR
   Smooth-follow dot + lagging ring, with magnetic + hover states.
   Disabled entirely on touch devices via CSS (see style.css).
   ============================================================ */
(function () {
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) return;

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    // Lagging ease toward the pointer — this delay is what reads as "premium".
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand + tint over interactive elements
  const interactive = document.querySelectorAll("a, button, .tilt-card, .glass-card");
  interactive.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const isLink = el.tagName === "A" || el.tagName === "BUTTON";
      ring.classList.add(isLink ? "is-link" : "is-active");
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("is-link", "is-active");
    });
  });

  // Magnetic pull effect
  const magnets = document.querySelectorAll(".magnetic");
  magnets.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });
})();
