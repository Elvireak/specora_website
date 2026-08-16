/* landing.js — Home page student-details form + Quiz link lock */

const STUDENT_STORAGE_KEY = "currentStudent"; // shared with quiz.js via localStorage

const NAME_PATTERN = /^[A-Za-z][A-Za-z'-]{1,}$/; // Anne-Marie, O'Brien OK
const STUDENT_ID_PATTERN = /^\d{10}$/; // exactly 10 digits
const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@alustudent\.com$/; // ALU emails only

function validateNameField(value, fieldLabel) {
  const trimmed = value.trim(); // ignore accidental spaces
  if (trimmed === "") return fieldLabel + " is required.";
  if (!NAME_PATTERN.test(trimmed)) {
    return fieldLabel + " can only contain letters, hyphens, or apostrophes.";
  }
  return ""; // empty string means “no error”
}

function validateStudentId(value) {
  const trimmed = value.trim();
  if (trimmed === "") return "Student ID is required.";
  if (trimmed === "0000000000") return "Student ID cannot be all zeros.";
  if (!STUDENT_ID_PATTERN.test(trimmed)) return "Student ID must be exactly 10 digits.";
  return "";
}

function validateEmail(value) {
  const trimmed = value.trim();
  if (trimmed === "") return "Institutional email is required.";
  if (!trimmed.includes("@")) return "Email must include an @ symbol.";

  const [localPart, domain] = trimmed.split("@"); // name @ domain

  if (!domain || domain !== "alustudent.com") return "Email domain must be alustudent.com.";
  if (localPart === "") return "Email username cannot be empty.";
  if (/^\d+$/.test(localPart)) return "Email username cannot contain numbers only.";
  if (!/[a-zA-Z]/.test(localPart)) return "Email username must contain at least one letter.";
  if (!/^[a-zA-Z0-9._-]+$/.test(localPart)) {
    return "Only letters, numbers, dots, hyphens, and underscores are allowed before @.";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Please use your institutional email, e.g. yourname@alustudent.com.";
  }
  return "";
}
//Apply valid/invalid state + inline message:
function setFieldState(inputElement, errorElement, errorMessage) {
  if (errorMessage === "") {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.add("is-valid"); // green border (CSS)
    errorElement.textContent = "";
  } else {
    inputElement.classList.remove("is-valid");
    inputElement.classList.add("is-invalid"); // red border (CSS)
    errorElement.textContent = errorMessage; // show why it failed
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setupHeroSlideshow(); // HOME.jpg ↔ hero_2.jpg crossfade

  const form = document.getElementById("student-details-form");
  if (!form) return; // only runs meaningfully on index.html

  const firstNameInput = document.getElementById("first-name");
  const lastNameInput = document.getElementById("last-name");
  const studentIdInput = document.getElementById("student-id");
  const emailInput = document.getElementById("email");

  const firstNameError = document.getElementById("first-name-error");
  const lastNameError = document.getElementById("last-name-error");
  const studentIdError = document.getElementById("student-id-error");
  const emailError = document.getElementById("email-error");

  // Live validation while typing
  firstNameInput.addEventListener("input", function () {
    setFieldState(firstNameInput, firstNameError, validateNameField(firstNameInput.value, "First name"));
  });
  lastNameInput.addEventListener("input", function () {
    setFieldState(lastNameInput, lastNameError, validateNameField(lastNameInput.value, "Last name"));
  });
  studentIdInput.addEventListener("input", function () {
    setFieldState(studentIdInput, studentIdError, validateStudentId(studentIdInput.value));
  });
  emailInput.addEventListener("input", function () {
    setFieldState(emailInput, emailError, validateEmail(emailInput.value));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // we handle save + redirect ourselves

    // Re-check everything on submit (in case a field was never touched)
    const firstNameMessage = validateNameField(firstNameInput.value, "First name");
    const lastNameMessage = validateNameField(lastNameInput.value, "Last name");
    const studentIdMessage = validateStudentId(studentIdInput.value);
    const emailMessage = validateEmail(emailInput.value);

    setFieldState(firstNameInput, firstNameError, firstNameMessage);
    setFieldState(lastNameInput, lastNameError, lastNameMessage);
    setFieldState(studentIdInput, studentIdError, studentIdMessage);
    setFieldState(emailInput, emailError, emailMessage);

    const allValid =
      firstNameMessage === "" &&
      lastNameMessage === "" &&
      studentIdMessage === "" &&
      emailMessage === "";

    if (!allValid) return; // stay on Home until fixed

    const studentDetails = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      studentId: studentIdInput.value.trim(),
      email: emailInput.value.trim()
    };

    localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentDetails)); // must be a string
    localStorage.removeItem("quizLocked"); // new form submit = allow a fresh quiz attempt
    window.location.href = "quiz.html"; // continue to quiz
  });
});

function setupHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide");
  if (slides.length < 2) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return; // keep first image only
  }

  var index = 0;
  window.setInterval(function () {
    slides[index].classList.remove("is-active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("is-active");
  }, 6500); // swap every 6.5s
}
