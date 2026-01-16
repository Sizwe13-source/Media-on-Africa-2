/* ======================= LOADING SCREEN ======================= */
window.addEventListener("load", function () {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    loadingScreen.style.transition = "opacity 0.5s ease";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }
});

// Fallback
setTimeout(() => {
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen && loadingScreen.style.display !== "none") {
    loadingScreen.style.transition = "opacity 0.5s ease";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }
}, 5000);

/* ======================= MOBILE MENU ======================= */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", !expanded);
  });

  // Close menu when clicking links
  document.querySelectorAll("#mobileMenu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* === SMOOTH SCROLLING === */
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* === BACK TO TOP BUTTON === */
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});


/* === CONTACT FORM === */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const formData = new FormData(this);
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        document.getElementById("formSuccess").style.display = "block";
        this.reset();
        setTimeout(() => {
          document.getElementById("formSuccess").style.display = "none";
        }, 5000);
      }
    } catch (error) {
      alert(
        "Sorry, there was an error. Please email us directly at info@mediaon.africa"
      );
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* === LIVE CHAT === */
function openChat() {
  const phoneNumber = "+27787414261";
  const message = "Hi Media On Africa, I'm interested in your services!";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappURL, "_blank");
}

/* === COOKIE CONSENT === */
document.addEventListener("DOMContentLoaded", () => {
  const cookieDiv = document.getElementById("cookie-consent");

  // Show cookie if not accepted
  if (!localStorage.getItem("cookiesAccepted") && cookieDiv) {
    cookieDiv.style.display = "flex"; // or "block" depending on your CSS
  }

  // Accept button function
  window.acceptCookies = function () {
    localStorage.setItem("cookiesAccepted", "true");
    if (cookieDiv) {
      cookieDiv.style.display = "none";
    }
  };
});

/* === STEPS ANIMATION (HOW WE WORK) === */
document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".timeline-step");
  const spine = document.getElementById("steps-line");

  // Fade-in each step
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.5 }
  );
  steps.forEach(step => observer.observe(step));

  // Smooth spine growth based on scroll
  window.addEventListener("scroll", () => {
    if (!spine) return;
    const stepsContainer = document.querySelector(".steps-list");
    const containerTop = stepsContainer.offsetTop;
    const containerHeight = stepsContainer.offsetHeight;
    const scrollY = window.scrollY + window.innerHeight / 2;
    let progress = (scrollY - containerTop) / containerHeight;
    progress = Math.max(0, Math.min(1, progress));
    spine.style.transform = `scaleY(${progress})`;
  });
});

// Scroll Fade-In Animation for Privacy Sections
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.privacy-section');

  const revealSection = () => {
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', revealSection);
  revealSection(); // Reveal sections already in view on load
});

