/* ==================================================
   MAIN JS FOR FULL PORTFOLIO PROJECT
   Author: Senior-Level JS
   Description: Handles animations, interactions,
   scroll triggers, skill bars, radial progress,
   project hover, contact form, social links,
   responsive behaviors, and education carousel.
================================================== */

/* =========================
   GLOBAL UTILS
========================= */
const select = (el, all = false) =>
  all ? [...document.querySelectorAll(el)] : document.querySelector(el);

const throttle = (fn, limit) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};

/* =========================
   HERO TITLE SCROLL
========================= */
const heroTitle = select(".hero-title");
if (heroTitle) {
  window.addEventListener(
    "scroll",
    throttle(() => {
      const y = window.scrollY;
      heroTitle.style.transform = `translateY(${y * 0.2}px)`;
      heroTitle.style.opacity = Math.max(1 - y / 500, 0);
    }, 16)
  );
}

/* =========================
   HERO IMAGE INTERACTIVE
========================= */
const heroImage = select(".hero-image");
if (heroImage && window.innerWidth > 768) {
  let rect, targetX = 0, targetY = 0, currentX = 0, currentY = 0, rafId;
  const MAX_ROTATE = 18, SPEED = 0.08;

  const animate = () => {
    currentX += (targetX - currentX) * SPEED;
    currentY += (targetY - currentY) * SPEED;

    heroImage.style.transform = `
      perspective(1000px)
      rotateX(${currentY}deg)
      rotateY(${currentX}deg)
      translateZ(0)
      scale(1.05)
    `;

    heroImage.style.filter = `
      drop-shadow(${-currentX * 1.4}px ${currentY * 1.4}px 35px rgba(0,240,255,.45))
    `;

    rafId = requestAnimationFrame(animate);
  };

  heroImage.addEventListener("mouseenter", () => {
    rect = heroImage.getBoundingClientRect();
    heroImage.style.transition = "none";
    rafId = requestAnimationFrame(animate);
  });

  heroImage.addEventListener(
    "mousemove",
    throttle((e) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetX = (x / rect.width - 0.5) * MAX_ROTATE;
      targetY = (y / rect.height - 0.5) * -MAX_ROTATE;
    }, 16)
  );

  heroImage.addEventListener("mouseleave", () => {
    cancelAnimationFrame(rafId);
    heroImage.style.transition = "transform .7s cubic-bezier(.19,1,.22,1), filter .7s";
    heroImage.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    heroImage.style.filter = "none";
    targetX = targetY = 0;
  });

  window.addEventListener(
    "scroll",
    throttle(() => {
      heroImage.style.translate = `0 ${window.scrollY * 0.04}px`;
    }, 16)
  );
}

/* =========================
   SKILL BARS
========================= */
function animateSkillBars() {
  select(".skill-progress-fill", true).forEach((bar) => {
    const value = bar.dataset.progress || 0;
    bar.style.width = "0%";
    bar.style.background = "linear-gradient(90deg, #00f0ff, #0077ff)";
    bar.style.borderRadius = "6px";
    bar.style.transition = "width 1.2s ease-in-out";
    setTimeout(() => (bar.style.width = value + "%"), 100);
  });
}

/* =========================
   RADIAL SKILLS
========================= */
function animateRadialSkills() {
  select(".radial-skill", true).forEach((skill) => {
    const circle = skill.querySelector(".progress-ring");
    const percentEl = skill.querySelector(".radial-percentage");
    if (!circle) return;

    const value = Number(skill.dataset.progress || 0);
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    circle.style.strokeWidth = "8";
    circle.style.fill = "transparent";
    circle.style.strokeLinecap = "round";
    circle.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1), stroke 1.5s";

    const color = `rgba(0,190,255,1)`; // can interpolate if needed

    requestAnimationFrame(() => {
      circle.style.strokeDashoffset = circumference - (value / 100) * circumference;
      circle.style.stroke = color;
      if (percentEl) percentEl.textContent = `${value}%`;
    });
  });
}

/* =========================
   PROJECT CARD GLARE
========================= */
select(".project-card", true).forEach((card) => {
  const glow = card.querySelector(".project-glow");
  if (!glow) return;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    glow.style.background = `radial-gradient(circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, var(--glow-color), transparent 70%)`;
  });
});

/* =========================
   CONTACT CARD HOVER
========================= */
select(".contact-card", true).forEach((card) => {
  const text = card.querySelector(".contact-link-text");
  if (!text) return;
  card.addEventListener("mouseenter", () => {
    text.style.color = "var(--primary-color)";
    text.style.textShadow = "0 0 12px var(--glow-color)";
  });
  card.addEventListener("mouseleave", () => {
    text.style.color = "var(--text-secondary)";
    text.style.textShadow = "none";
  });
});

/* =========================
   SCROLL REVEAL
========================= */
const reveals = select(".reveal", true);
function handleReveal() {
  reveals.forEach((el) => {
    el.classList.toggle("scrolled", el.getBoundingClientRect().top < window.innerHeight * 0.8);
  });
}
window.addEventListener("scroll", throttle(handleReveal, 100));

/* =========================
   SOCIAL ICON EFFECT
========================= */
select(".social-link", true).forEach((icon) => {
  icon.addEventListener("mousemove", (e) => {
    const r = icon.getBoundingClientRect();
    icon.style.boxShadow = `${(e.clientX - r.left - r.width / 2) / 6}px ${(e.clientY - r.top - r.height / 2) / 6}px 22px rgba(0,240,255,.5)`;
  });
  icon.addEventListener("mouseleave", () => (icon.style.boxShadow = "none"));
});

/* =========================
   NAV HAMBURGER IMPROVED
========================= */
const hamburger = select(".hamburger");
const navMenu = select(".nav-menu");
const navLinks = select(".nav-link", true);

if (hamburger && navMenu) {
  const toggleNav = () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  };

  hamburger.addEventListener("click", toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) toggleNav();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) toggleNav();
  });
}

/* =========================
   BACK TO TOP BUTTON
========================= */
const backToTop = select(".back-to-top");
if (backToTop) {
  const toggleBackToTop = () => backToTop.classList.toggle("show", window.scrollY > 400);
  window.addEventListener("scroll", throttle(toggleBackToTop, 150));
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* =========================
   LAZY LOAD IMAGES
========================= */
const lazyImages = select("img[data-src]", true);
function lazyLoad() {
  lazyImages.forEach((img) => {
    if (img.getBoundingClientRect().top < window.innerHeight + 200) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  });
}
window.addEventListener("scroll", throttle(lazyLoad, 200));
window.addEventListener("load", lazyLoad);

/* =========================
   CONTACT FORM
========================= */
const contactForm = select(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Sending...";
    try {
      await fetch(contactForm.action, { method: "POST", body: new FormData(contactForm) });
      btn.textContent = "Sent!";
      contactForm.reset();
    } catch {
      btn.textContent = "Error!";
    }
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Send Message";
    }, 2000);
  });
}

/* =========================
   EDUCATION & CERTIFICATION CAROUSEL
========================= */
function initCarousel() {
  select(".education-grid-carousel .scrolling-wrapper", true).forEach((wrapper) => {
    let speed = 2, position = 0;
    const cloneWidth = wrapper.scrollWidth / 2;

    const scroll = () => {
      position -= speed;
      if (position <= -cloneWidth) position = 0;
      wrapper.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(scroll);
    };
    scroll();

    wrapper.parentElement.addEventListener("mouseenter", () => (speed = 0));
    wrapper.parentElement.addEventListener("mouseleave", () => (speed = 2));
  });
}

/* =========================
   INIT ON LOAD
========================= */
window.addEventListener("load", () => {
  animateSkillBars();
  animateRadialSkills();
  handleReveal();
  lazyLoad();
  initCarousel();
});

