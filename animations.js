/* ============================================================
   ANIMATION SYSTEM — GSAP + ScrollTrigger
   Text reveal, section reveals, parallax, timeline progress,
   growth-flow draw-in.
   ============================================================ */
(function () {
  if (typeof gsap === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Hero text split + reveal ---------- */
  function splitToChars(el) {
    const text = el.textContent;
    el.textContent = "";
    const frag = document.createDocumentFragment();
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      frag.appendChild(span);
    });
    el.appendChild(frag);
    return el.querySelectorAll("span");
  }

  function heroIntro() {
    const heroLines = document.querySelectorAll("[data-split]");
    const tl = gsap.timeline({ delay: 0.15 });

    heroLines.forEach((line, i) => {
      const chars = splitToChars(line);
      tl.from(
        chars,
        {
          yPercent: 120,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.028,
        },
        i * 0.12
      );
    });

    tl.to(".reveal-line", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 }, "-=0.5");
  }

  /* ---------- Generic scroll reveal ---------- */
  function scrollReveals() {
    const items = document.querySelectorAll(".reveal");
    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        onEnter: () => item.classList.add("is-visible"),
        once: true,
      });
    });
  }

  /* ---------- Timeline progress fill ---------- */
  function timelineFill() {
    const track = document.getElementById("timeline");
    const fill = document.getElementById("timelineFill");
    if (!track || !fill) return;

    gsap.to(fill, {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.6,
      },
    });
  }

  /* ---------- Growth flow: sequential node reveal ---------- */
  function growthFlow() {
    const flow = document.getElementById("growthFlow");
    if (!flow) return;
    const nodes = flow.querySelectorAll(".growth-flow-node, .growth-flow-arrow");

    gsap.set(nodes, { opacity: 0.25 });
    ScrollTrigger.create({
      trigger: flow,
      start: "top 75%",
      onEnter: () => {
        gsap.to(nodes, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      },
      once: true,
    });
  }

  /* ---------- Filmstrip auto-scroll ---------- */
  function filmstrip() {
    const track = document.querySelector(".filmstrip-track");
    if (!track) return;
    gsap.to(track, {
      xPercent: -35,
      ease: "none",
      scrollTrigger: {
        trigger: track,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }

  /* ---------- Section headline parallax ---------- */
  function sectionParallax() {
    document.querySelectorAll(".section-title").forEach((title) => {
      gsap.from(title, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 88%",
        },
      });
    });
  }

  function init() {
    heroIntro();
    scrollReveals();
    timelineFill();
    growthFlow();
    filmstrip();
    if (!reduceMotion) sectionParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
