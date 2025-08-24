/* ===== GSAP + Locomotive setup ===== */
gsap.registerPlugin(ScrollTrigger);

const smoothContent = document.querySelector("#smooth-content");
let loco;

function initLoco() {
  loco = new LocomotiveScroll({
    el: smoothContent,
    smooth: true,
    multiplier: 1,
    smartphone: { smooth: true },
    tablet: { smooth: true }
  });

  ScrollTrigger.scrollerProxy("#smooth-content", {
    scrollTop(value) {
      return arguments.length
        ? loco.scrollTo(value, { duration: 0, disableLerp: true })
        : loco.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: smoothContent.style.transform ? "transform" : "fixed"
  });

  loco.on("scroll", ScrollTrigger.update);
  ScrollTrigger.addEventListener("refresh", () => loco.update());
  ScrollTrigger.refresh();
}

/* ===== Capsule Preloader with progress + fade-in fixes ===== */
function runPreloader() {
  const pre = document.querySelector(".preloader");
  const progress = document.querySelector(".preloader-progress");
  const spline = document.querySelector(".spline-bg");

  if (progress) {
    gsap.fromTo(progress,
      { width: "0%" },
      { width: "100%", duration: 2, ease: "power2.out" }
    );
  }

  gsap.delayedCall(2.1, () => {
    if (pre) {
      gsap.to(pre, {
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          pre.style.display = "none";
          document.body.classList.remove("loading");
          if (spline) {
            gsap.fromTo(spline,
              { opacity: 0 },
              { opacity: 1, duration: 1.2, delay: 0.4, ease: "power2.out" }
            );
          }
          initLoco();
          introAnimations();
        }
      });
    } else {
      document.body.classList.remove("loading");
      initLoco();
      introAnimations();
    }
  });
}

/* ===== Intro + Scroll animations ===== */
function introAnimations() {
  const scroller = "#smooth-content";

  // Hero animations
  if (document.querySelector(".hero")) {
    gsap.from(".hero-brand", { opacity: 0, y: 50, filter: "blur(10px)", duration: 0.9, ease: "power2.out" });
    gsap.from(".hero-headline", { opacity: 0, y: 46, filter: "blur(10px)", duration: 1, delay: 0.1, ease: "power2.out" });
    gsap.from(".hero-sub", { opacity: 0, y: 36, duration: 0.9, delay: 0.2, ease: "power2.out" });
    gsap.from(".cta", { opacity: 0, scale: 0.9, duration: 0.8, delay: 0.28, ease: "power2.out" });
  }

  // Values section
  if (document.querySelector("#values")) {
    gsap.utils.toArray("#values .line").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, scroller, start: "top 80%" },
        opacity: 0, y: 30, filter: "blur(6px)", duration: 0.7, delay: i * 0.05, ease: "power2.out"
      });
    });
  }

  // Gradient outline sections
  gsap.utils.toArray(".gradient-outline").forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, scroller, start: "top 85%" },
      opacity: 0, y: 40, duration: 0.8, ease: "power2.out"
    });
  });

  // Comparison cards
  if (document.querySelector(".comparison")) {
    gsap.utils.toArray(".comparison .card").forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, scroller, start: "top 85%" },
        opacity: 0, y: 40, duration: 0.7, delay: i * 0.08, ease: "power2.out"
      });
    });
  }

  // About / Story section
  gsap.utils.toArray(".about-box, .story-content").forEach((el) => {
    el.style.opacity = 1;
    gsap.from(el, {
      scrollTrigger: { trigger: el, scroller, start: "top 90%" },
      opacity: 0, y: 50, duration: 0.9, ease: "power2.out"
    });
  });

  // Contact form
  if (document.querySelector(".contact-form")) {
    gsap.from(".contact-form", {
      scrollTrigger: { trigger: ".contact-form", scroller, start: "top 85%" },
      opacity: 0, y: 40, duration: 0.8, ease: "power2.out"
    });
  }
}

/* ===== Smooth anchor links via Locomotive ===== */
function wireAnchors() {
  document.querySelectorAll("[data-scroll-to]").forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target && loco) {
        loco.scrollTo(target, { offset: 0, duration: 800, easing: [0.25, 0.00, 0.35, 1.00] });
      } else if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ===== Active nav underline (index page only) ===== */
function activeNav() {
  const homeSection = document.querySelector("#home");
  const valuesSection = document.querySelector("#values");
  const modelsSection = document.querySelector("#models");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  if (!homeSection) return;

  const sections = [homeSection, valuesSection, modelsSection].filter(Boolean);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      navLinks.forEach(a => {
        a.classList.toggle("active", entry.isIntersecting && a.getAttribute("href") === `#${id}`);
      });
    });
  }, { root: null, threshold: 0.55 });

  sections.forEach(sec => io.observe(sec));
}

/* ===== Init ===== */
window.addEventListener("load", () => {
  wireAnchors();
  activeNav();
  runPreloader();
});
