/* nav.js — mobile menu + Quiz link lock after a completed attempt */

const NAV_STUDENT_KEY = "currentStudent";
const NAV_QUIZ_LOCKED_KEY = "quizLocked";

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("nav-toggle"); // ☰ button
  const nav = document.getElementById("main-nav"); // link list
  const header = document.querySelector(".site-header");
  if (!toggle || !nav || !header) return; // skip if not on a page with nav

  function setMenuOpen(isOpen) {
    header.classList.toggle("nav-open", isOpen); // CSS: .nav-open shows menu + X icon
  }

  toggle.addEventListener("click", function () {
    const currentlyOpen = header.classList.contains("nav-open");
    setMenuOpen(!currentlyOpen); // open ↔ close
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenuOpen(false); // close after user picks a page
    });
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 641px)").matches) {
      setMenuOpen(false); // desktop width: force closed
    }
  });

  setupQuizNavLock(); // disable Quiz after results until Retake
});

function setupQuizNavLock() {
  const locked = localStorage.getItem(NAV_QUIZ_LOCKED_KEY) === "true"; // finished quiz
  const hasStudent = !!localStorage.getItem(NAV_STUDENT_KEY);
  const blockQuiz = locked || !hasStudent; // need form filled AND unlocked

  if (!blockQuiz) return;

  document.querySelectorAll('a[href="quiz.html"]').forEach(function (link) {
    link.classList.add("disabled-link");

    link.addEventListener("click", function (event) {
      event.preventDefault(); // stop opening quiz.html

      // On Home: always guide to the student form (even if a past attempt is locked)
      const studentForm = document.getElementById("student-form");
      if (studentForm) {
        studentForm.scrollIntoView({ behavior: "smooth", block: "start" });
        const firstNameInput = document.getElementById("first-name");
        if (firstNameInput) firstNameInput.focus();
        return;
      }

      if (locked) {
        // Other pages: finished attempt → Results (use Retake there)
        window.location.href = "results.html";
        return;
      }

      window.location.href = "index.html"; // no student yet — go fill the form
    });
  });
}
