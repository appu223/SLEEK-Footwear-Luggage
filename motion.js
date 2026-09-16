/**
 * ============================================================================
 * SLEEK® KRISHNAGIRI — FLAGSHIP MOTION ENGINE
 * File: motion.js
 * Dependencies: GSAP 3.12+, ScrollTrigger
 * Location: C:\Users\appu\Downloads\sleek\motion.js
 * ============================================================================
 */

(function () {
  "use strict";

  // Check if reduced motion is requested by the OS
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Wait for DOM and GSAP to be ready
  window.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") {
      console.warn("GSAP is not loaded. Please ensure GSAP CDN is present in index.html.");
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    initScrollProgressBar();
    initEditorialCursor();
    initMagneticButtons();
    init3DCardTilt();
    initParallaxDrift();
    initKineticTypography();
    initSoundEqualizerEngine();
    initSmoothAnchorNavigation();
    initNavigationMotion();
    initOverlayMotion();
    initIntroExperience();
  });

  function initIntroExperience() {
    const screen = document.getElementById("introScreen");
    const video = document.getElementById("introVideo");
    const skipButton = document.getElementById("skipIntro");

    if (!screen || document.documentElement.classList.contains("skip-intro")) {
      document.body.classList.remove("intro-lock");
      return;
    }

    const closeIntro = () => {
      if (screen.classList.contains("is-exiting")) return;
      screen.classList.add("is-exiting");
      video?.pause();
      document.body.classList.remove("intro-lock");

      if (prefersReducedMotion) {
        screen.remove();
        return;
      }

      gsap.to(screen, {
        opacity: 0,
        y: -18,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => screen.remove()
      });
    };

    skipButton?.addEventListener("click", closeIntro);

    if (prefersReducedMotion) {
      closeIntro();
      return;
    }

    gsap.fromTo(".intro-video", { scale: 1.04 }, {
      scale: 1,
      duration: 0.5,
      ease: "power3.out"
    });

    const autoClose = window.setTimeout(closeIntro, 5200);
    screen.addEventListener("click", (event) => {
      if (event.target === screen) {
        window.clearTimeout(autoClose);
        closeIntro();
      }
    });
  }

  function initNavigationMotion() {
    const header = document.querySelector(".sleek-header");
    const navLinks = document.querySelectorAll(".sleek-nav-link");

    if (!header) return;

    if (!prefersReducedMotion) {
      gsap.fromTo(header, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(navLinks, { y: -8, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.05,
        delay: 0.18,
        ease: "power2.out"
      });
    }
      const nav = header.querySelector(".sleek-nav");
      if (nav && !nav.querySelector(".nav-sliding-pill")) {
        const pill = document.createElement("span");
        pill.className = "nav-sliding-pill";
        nav.classList.add("has-sliding-pill");
        nav.appendChild(pill);

        const movePill = (link) => {
          const navRect = nav.getBoundingClientRect();
          const linkRect = link.getBoundingClientRect();
          gsap.to(pill, {
            x: linkRect.left - navRect.left,
            scaleX: linkRect.width / 100,
            duration: 0.24,
            ease: "power3.out",
            overwrite: true
          });
        };

        const activeLink = nav.querySelector(".sleek-nav-link.active");
        if (activeLink) movePill(activeLink);
        nav.querySelectorAll(".sleek-nav-link").forEach((link) => {
          link.addEventListener("mouseenter", () => movePill(link));
        });
        nav.addEventListener("mouseleave", () => {
          if (activeLink) movePill(activeLink);
        });
      }

    const updateHeaderState = () => header.classList.toggle("nav-scrolled", window.scrollY > 12);
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  function initOverlayMotion() {
    document.querySelectorAll(".offcanvas, .modal").forEach((overlay) => {
      overlay.addEventListener("show.bs.offcanvas", () => overlay.classList.add("showing"));
      overlay.addEventListener("shown.bs.offcanvas", () => overlay.classList.remove("showing"));
      overlay.addEventListener("show.bs.modal", () => overlay.classList.add("showing"));
      overlay.addEventListener("shown.bs.modal", () => overlay.classList.remove("showing"));
    });
  }

  /* ==========================================================================
     1. DYNAMIC SCROLL PROGRESS BEAM (TOP OF VIEWPORT)
     ========================================================================== */
  function initScrollProgressBar() {
    const bar = document.createElement("div");
    bar.id = "sleekScrollProgress";
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 0%;
      background: #C9F900;
      z-index: 999999;
      pointer-events: none;
      transform: scaleX(0);
      transform-origin: left center;
      will-change: transform;
      box-shadow: 0 0 10px rgba(201, 249, 0, 0.8);
    `;
    document.body.appendChild(bar);

    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;
      bar.style.transform = `scaleX(${progress / 100})`;
    }, { passive: true });
  }

  /* ==========================================================================
     2. EDITORIAL MAGNETIC CUSTOM CURSOR WITH CONTEXTUAL PILLS
     ========================================================================== */
  function initEditorialCursor() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    // Inject cursor elements
    const cursor = document.createElement("div");
    cursor.id = "sleekCursor";
    const cursorLabel = document.createElement("span");
    cursorLabel.id = "sleekCursorLabel";

    const style = document.createElement("style");
    style.textContent = `
      #sleekCursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 14px;
        height: 14px;
        background-color: #C9F900;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        --cursor-scale: 1;
        transform: translate(-50%, -50%) scale(var(--cursor-scale));
        mix-blend-mode: difference;
        transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1),
                    background-color 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
                    border-radius 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
        will-change: transform;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #sleekCursorLabel {
        font-family: 'Syne', sans-serif;
        font-size: 8px;
        font-weight: 800;
        color: #111613;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0;
        transform: scale(0.5);
        transition: opacity 160ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
        pointer-events: none;
      }
      #sleekCursor.hovering-media {
        --cursor-scale: 4.57;
        background-color: #C9F900;
        mix-blend-mode: normal;
        box-shadow: 0 10px 25px rgba(201, 249, 0, 0.4);
      }
      #sleekCursor.hovering-media #sleekCursorLabel {
        opacity: 1;
        transform: scale(1);
      }
      #sleekCursor.hovering-link {
        --cursor-scale: 2.57;
        background-color: rgba(201, 249, 0, 0.4);
        border: 1px solid #C9F900;
      }
    `;
    document.head.appendChild(style);
    cursor.appendChild(cursorLabel);
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth lerp frame loop
    gsap.ticker.add(() => {
      currentX += (mouseX - currentX) * 0.22;
      currentY += (mouseY - currentY) * 0.22;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(var(--cursor-scale))`;
    });

    // Cursor interactions over videos
    document.querySelectorAll(".triptych-card, .video-stage-wrapper, .marquee-media").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        cursor.classList.add("hovering-media");
        cursorLabel.textContent = item.classList.contains("marquee-media") ? "VIEW" : "LISTEN";
      });
      item.addEventListener("mouseleave", () => {
        cursor.classList.remove("hovering-media");
        cursorLabel.textContent = "";
      });
    });

    // Cursor interactions over interactive elements
    document.querySelectorAll(".btn-lime, .btn-sleek-outline, .btn-sleek-outline-white, .journey-tile, .product-box, .filter-pill, .clip-btn").forEach((item) => {
      item.addEventListener("mouseenter", () => {
        cursor.classList.add("hovering-link");
      });
      item.addEventListener("mouseleave", () => {
        cursor.classList.remove("hovering-link");
      });
    });
  }

  /* ==========================================================================
     3. MAGNETIC BUTTON PHYSICS
     ========================================================================== */
  function initMagneticButtons() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const magneticElements = document.querySelectorAll(".btn-lime, .btn-sleek-outline, #playBtn, #masterSoundToggle");

    magneticElements.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.28;
        const deltaY = (e.clientY - centerY) * 0.28;

        gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.25,
          ease: "power2.out"
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.45,
          ease: "elastic.out(1, 0.4)"
        });
      });
    });
  }

  /* ==========================================================================
     4. 3D GYRO / MOUSE TILT ON TILES & VIDEO CARDS
     ========================================================================== */
  function init3DCardTilt() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const tiltCards = document.querySelectorAll(".triptych-card, .journey-tile, .product-box");

    tiltCards.forEach((card) => {
      card.style.transformStyle = "preserve-3d";

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width - 0.5) * 2;
        const yPercent = (y / rect.height - 0.5) * 2;

        const rotateX = -yPercent * 6; // max 6 deg
        const rotateY = xPercent * 6;

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          transformPerspective: 1000,
          duration: 0.35,
          ease: "power1.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }

  /* ==========================================================================
     5. PARALLAX DRIFT ON SCROLL (2% to 4%)
     ========================================================================== */
  function initParallaxDrift() {
    if (prefersReducedMotion || typeof ScrollTrigger === "undefined") return;

    // Drifts category images gently as you scroll
    document.querySelectorAll(".journey-tile-img-box img, .product-box-img img").forEach((img) => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        },
        y: -18,
        ease: "none"
      });
    });
  }

  /* ==========================================================================
     6. KINETIC TYPOGRAPHY ENHANCEMENTS
     ========================================================================== */
  function initKineticTypography() {
    if (prefersReducedMotion) return;

    // Subtle scale pop on numbers (01, 02, 03, 04)
    gsap.utils.toArray(".font-monospace").forEach((mono) => {
      gsap.from(mono, {
        scrollTrigger: {
          trigger: mono,
          start: "top 92%"
        },
        opacity: 0,
        x: -8,
        duration: 0.5,
        ease: "power2.out"
      });
    });
  }

  /* ==========================================================================
     7. SOUND EQUALIZER ANIMATION REACTION
     ========================================================================== */
  function initSoundEqualizerEngine() {
    const wavesContainer = document.getElementById("soundWaves");
    const bars = document.querySelectorAll(".equalizer-bar");
    if (!wavesContainer || bars.length === 0) return;

    // Randomize equalizer height during active playback
    setInterval(() => {
      if (!wavesContainer.classList.contains("equalizer-paused")) {
        bars.forEach((bar) => {
          const randScale = (Math.random() * 0.9 + 0.3).toFixed(2);
          bar.style.transform = `scaleY(${randScale})`;
        });
      }
    }, 120);
  }

  /* ==========================================================================
     8. FLUID ANCHOR NAVIGATION EASING
     ========================================================================== */
  function initSmoothAnchorNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#" || targetId === "") return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navOffset = 80;
          const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      });
    });
  }

})();