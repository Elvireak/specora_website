/* motion.js — scroll reveal, FAQ accordion, back-to-top */

function setupScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

function setupFaqAccordion() {
  const questions = document.querySelectorAll(".faq-question");
  if (!questions.length) return;

  questions.forEach(function (button) {
    button.addEventListener("click", function () {
      const isOpen = button.classList.contains("open");

      questions.forEach(function (other) {
        other.classList.remove("open");
      });

      if (!isOpen) {
        button.classList.add("open"); // CSS expands .faq-answer
      }
    });
  });
}

function setupBackToTop() {
  const link = document.querySelector(".back-to-top");
  if (!link) return;

  function updateVisibility() {
    if (window.scrollY > 280) {
      link.classList.add("is-visible");
    } else {
      link.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
}

document.addEventListener("DOMContentLoaded", function () {
  setupScrollReveal();
  setupFaqAccordion();
  setupBackToTop();
});
