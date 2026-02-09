/* =========================================================
   Media On Africa - scripts.js (UPDATED)
   Keeps: loading screen, mobile menu, back-to-top, form,
   WhatsApp chat, cookie consent, scroll reveals, timeline
   + Adds: Get a Quote (random brand-aligned quotes)
========================================================= */

(() => {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Enable JS-specific styling ---------- */
  document.documentElement.classList.add("js");
  document.body.classList.add("js-reveal");

  /* ======================= LOADING SCREEN ======================= */
  const hideLoadingScreen = () => {
    const loadingScreen = $("#loadingScreen");
    if (!loadingScreen) return;

    loadingScreen.style.transition = "opacity 0.5s ease";
    loadingScreen.style.opacity = "0";

    window.setTimeout(() => {
      loadingScreen.style.display = "none";
      loadingScreen.setAttribute("aria-hidden", "true");
    }, 500);
  };

  window.addEventListener("load", hideLoadingScreen);
  window.setTimeout(hideLoadingScreen, 5000); // fallback

  /* ======================= BACK TO TOP ======================= */
  window.scrollToTop = function scrollToTop() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const backToTop = $("#backToTop");
  const onScrollBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 300);
  };
  window.addEventListener("scroll", onScrollBackToTop, { passive: true });
  onScrollBackToTop();

  /* ======================= MOBILE MENU (ACCESSIBLE) ======================= */
  const menuBtn = $("#menuBtn");
  const mobileMenu = $("#mobileMenu");

  const closeMenu = () => {
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
  };

  const isMenuOpen = () => mobileMenu && mobileMenu.classList.contains("active");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => (isMenuOpen() ? closeMenu() : openMenu()));
    $$("#mobileMenu a").forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (e) => {
      if (!isMenuOpen()) return;
      const clickedInside = mobileMenu.contains(e.target) || menuBtn.contains(e.target);
      if (!clickedInside) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen()) closeMenu();
    });
  }

  /* ======================= CONTACT FORM (NETLIFY) ======================= */
  const contactForm = $("#contactForm");

  const setButtonLoading = (btn, isLoading) => {
    if (!btn) return;

    if (!btn.dataset.originalHtml) btn.dataset.originalHtml = btn.innerHTML;

    if (isLoading) {
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
      btn.innerHTML = `Sending…`;
    } else {
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
      btn.innerHTML = btn.dataset.originalHtml;
    }
  };

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const successMsg = $("#formSuccess");

      setButtonLoading(submitBtn, true);

      try {
        const formData = new FormData(contactForm);

        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        });

        if (response.ok) {
          if (successMsg) successMsg.style.display = "block";
          contactForm.reset();

          window.setTimeout(() => {
            if (successMsg) successMsg.style.display = "none";
          }, 5000);
        } else {
          window.alert("Something went wrong. Please try again or email us directly.");
        }
      } catch {
        window.alert("Sorry, there was an error. Please email us directly at info@media.on.africa");
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  /* ======================= WHATSAPP CHAT ======================= */
  window.openChat = function openChat() {
    const phoneNumber = "27787414261";
    const message = "Hi Media On Africa, I'm interested in your services!";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  };

  /* ======================= COOKIE CONSENT ======================= */
  const cookieDiv = $("#cookie-consent");

  window.acceptCookies = function acceptCookies() {
    localStorage.setItem("cookiesAccepted", "true");
    if (cookieDiv) cookieDiv.style.display = "none";
  };

  const initCookies = () => {
    if (!cookieDiv) return;
    const accepted = localStorage.getItem("cookiesAccepted") === "true";
    cookieDiv.style.display = accepted ? "none" : "flex";
  };

  /* ======================= REVEAL ANIMATIONS ======================= */
  const initServiceReveal = () => {
    const cards = $$(".service-card");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card, i) => {
      if (!prefersReducedMotion()) card.style.transitionDelay = `${i * 60}ms`;
      observer.observe(card);
    });
  };

  const initTimeline = () => {
    const steps = $$(".timeline-step");
    const spine = $("#steps-line");
    const stepsContainer = $(".steps-list");

    if (steps.length) {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
        { threshold: 0.35 }
      );
      steps.forEach((step) => observer.observe(step));
    }

    const updateSpine = () => {
      if (!spine || !stepsContainer) return;

      const containerTop = stepsContainer.offsetTop;
      const containerHeight = stepsContainer.offsetHeight;
      const scrollY = window.scrollY + window.innerHeight * 0.55;

      let progress = (scrollY - containerTop) / containerHeight;
      progress = Math.max(0, Math.min(1, progress));

      spine.style.transform = `scaleY(${progress})`;
    };

    window.addEventListener("scroll", updateSpine, { passive: true });
    updateSpine();
  };

  const initPrivacyReveal = () => {
    const sections = $$(".privacy-section");
    if (!sections.length) return;

    const revealSection = () => {
      const triggerBottom = window.innerHeight * 0.85;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < triggerBottom) section.classList.add("visible");
      });
    };

    window.addEventListener("scroll", revealSection, { passive: true });
    revealSection();
  };

  /* ======================= GET A QUOTE (RANDOM) ======================= */
  const initQuoteButton = () => {
    const quoteBtn = $("#quoteBtn");
    const quoteBox = $("#quoteBox");
    const quoteText = $("#quoteText");

    // If you haven't added the HTML yet, just safely exit.
    if (!quoteBtn || !quoteBox || !quoteText) return;

    const quotes = [
      "Build what Africa needs — then build it world-class.",
      "Progress is engineered: one clean decision at a time.",
      "Innovation isn’t noise — it’s clarity, structure, and execution.",
      "Great products earn trust by being fast, secure, and simple.",
      "Your vision is valid. Now make it real with the right system.",
      "Consistency turns ideas into platforms people rely on.",
      "Start small. Ship clean. Scale smart.",
      "Digital excellence is not luck — it’s process.",
      "If it serves people better, it’s worth building.",
      "Africa’s future is being coded today — with purpose.",
      "Strong brands don’t chase attention — they deliver value.",
      "The best strategy is the one you can execute every week.",
      "Don’t just go online — go premium, reliable, and scalable.",
      "Every business can grow when technology is built right."
    ];

    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const showQuote = () => {
      quoteText.textContent = `“${pickRandom(quotes)}”`;
      quoteBox.hidden = false;

      // re-trigger small animation
      quoteBox.style.animation = "none";
      void quoteBox.offsetWidth; // force reflow
      quoteBox.style.animation = "";
    };

    quoteBtn.addEventListener("click", showQuote);
  };

  /* ======================= INIT ======================= */
  document.addEventListener("DOMContentLoaded", () => {
    initCookies();
    initServiceReveal();
    initTimeline();
    initPrivacyReveal();
    initQuoteButton(); // ✅ added
  });
})();
