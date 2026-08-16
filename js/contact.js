/* contact.js — Contact form: validate fields, phone (+230), char count */

const FULL_NAME_PATTERN = /^[A-Za-z][A-Za-z' -]{1,}$/; // letters, spaces, ' -
const GENERAL_EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@alustudent\.com$/; // ALU emails only
const MU_PHONE_PATTERN = /^\+230\d{8}$/; // Mauritius: +230 + 8 digits

const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 500; /* matches maxlength on textarea */

const SUBJECT_OPTIONS = {
  "general-feedback": "General feedback",
  "technical-problem": "Technical problem",
  "question-about-results": "Question about my results",
  "accessibility-suggestion": "Accessibility suggestion"
};

function validateFullName(value) {
  const trimmed = value.trim();
  if (trimmed === "") return "Full name is required.";
  if (!FULL_NAME_PATTERN.test(trimmed)) return "Please enter a valid name (letters only).";
  return ""; // "" = valid
}

function validateContactEmail(value) {
  const trimmed = value.trim();
  if (trimmed === "") return "Email address is required.";
  if (!GENERAL_EMAIL_PATTERN.test(trimmed)) return "Please enter a valid email address.";
  return "";
}

function validatePhone(value) {
  const trimmed = value.trim();

  if (trimmed === "") return "Phone number is required.";

  if (/[A-Za-z]/.test(trimmed)) {
    return "Phone number cannot contain letters."; // no a-z
  }

  if (/[^0-9+]/.test(trimmed)) {
    return "Phone number cannot contain spaces or special characters."; // no () - spaces
  }

  if ((trimmed.match(/\+/g) || []).length > 1 || (trimmed.includes("+") && !trimmed.startsWith("+"))) {
    return "Only use + at the start as part of +230.";
  }

  if (!trimmed.startsWith("+230")) {
    return "Mauritian numbers must start with +230."; // country code required
  }

  const localPart = trimmed.slice(4); // digits after +230

  if (localPart === "") {
    return "Enter 8 digits after +230.";
  }

  if (!/^\d+$/.test(localPart)) {
    return "After +230, use digits only. No letters or symbols.";
  }

  if (localPart.length < 8) {
    return "Enter 8 digits after +230 (currently " + localPart.length + ").";
  }

  if (localPart.length > 8) {
    return "Use exactly 8 digits after +230.";
  }

  if (!MU_PHONE_PATTERN.test(trimmed)) {
    return "Enter a valid Mauritian number, e.g. +23051234567.";
  }

  return "";
}

function validateSubject(value) {
  if (!value || value === "") return "Please select a category.";
  if (!SUBJECT_OPTIONS[value]) return "Please select a valid category.";
  return "";
}

function validateMessage(value) {
  const trimmed = value.trim();
  if (trimmed === "") return "Message is required.";
  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return "Message must be at least " + MIN_MESSAGE_LENGTH + " characters.";
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return "Message must be " + MAX_MESSAGE_LENGTH + " characters or fewer.";
  }
  return "";
}

function setFieldState(inputElement, errorElement, errorMessage) {
  if (errorMessage === "") {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.add("is-valid"); // green border
    errorElement.textContent = "";
  } else {
    inputElement.classList.remove("is-valid");
    inputElement.classList.add("is-invalid"); // red border
    errorElement.textContent = errorMessage; // live error text
  }
}

function updateCharCount(messageInput, charCount) {
  charCount.textContent = messageInput.value.length + " / " + MAX_MESSAGE_LENGTH; // e.g. 42 / 500
}

function setFormStatus(statusElement, textElement, message, state) {
  textElement.textContent = message;
  statusElement.classList.remove("is-success", "is-error");
  if (state) statusElement.classList.add(state); // optional .is-success / .is-error
  statusElement.hidden = false; // show whole box (text + “i”) after submit
}

function hideFormStatus(statusElement, textElement) {
  statusElement.hidden = true; // remove whole box again
  statusElement.classList.remove("is-success", "is-error");
  textElement.textContent = "";
}

document.addEventListener("DOMContentLoaded", function () {
  setupContactForm(); // start when HTML is ready
});

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Field inputs
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const phoneInput = document.getElementById("contact-phone");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");

  // Matching error <small> elements
  const nameError = document.getElementById("contact-name-error");
  const emailError = document.getElementById("contact-email-error");
  const phoneError = document.getElementById("contact-phone-error");
  const subjectError = document.getElementById("contact-subject-error");
  const messageError = document.getElementById("contact-message-error");

  const charCount = document.getElementById("char-count");
  const statusElement = document.getElementById("form-status");
  const statusText = document.getElementById("form-status-text");

  hideFormStatus(statusElement, statusText); // start fully hidden

  // Validate on every keystroke
  nameInput.addEventListener("input", function () {
    setFieldState(nameInput, nameError, validateFullName(nameInput.value));
  });
  emailInput.addEventListener("input", function () {
    setFieldState(emailInput, emailError, validateContactEmail(emailInput.value));
  });
  phoneInput.addEventListener("input", function () {
    setFieldState(phoneInput, phoneError, validatePhone(phoneInput.value));
  });
  subjectInput.addEventListener("change", function () {
    setFieldState(subjectInput, subjectError, validateSubject(subjectInput.value));
  });
  messageInput.addEventListener("input", function () {
    updateCharCount(messageInput, charCount);
    setFieldState(messageInput, messageError, validateMessage(messageInput.value));
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // no real backend — demo only

    const nameMessage = validateFullName(nameInput.value);
    const emailMessage = validateContactEmail(emailInput.value);
    const phoneMessage = validatePhone(phoneInput.value);
    const subjectMessage = validateSubject(subjectInput.value);
    const messageMessage = validateMessage(messageInput.value);

    setFieldState(nameInput, nameError, nameMessage);
    setFieldState(emailInput, emailError, emailMessage);
    setFieldState(phoneInput, phoneError, phoneMessage);
    setFieldState(subjectInput, subjectError, subjectMessage);
    setFieldState(messageInput, messageError, messageMessage);

    const allValid =
      nameMessage === "" && emailMessage === "" && phoneMessage === "" &&
      subjectMessage === "" && messageMessage === "";

    if (!allValid) {
      setFormStatus(statusElement, statusText, "Please fix the highlighted fields before sending.", "is-error");
      return; // stop submit
    }

    const subjectLabel = SUBJECT_OPTIONS[subjectInput.value] || subjectInput.value;
    const preview =
      "Thank you, " + nameInput.value.trim().split(/\s+/)[0] +
      "! Your message about \"" + subjectLabel +
      "\" has been recorded for this demonstration.";

    setFormStatus(statusElement, statusText, preview, "is-success");
    form.reset(); // clear inputs
    updateCharCount(messageInput, charCount); // reset to 0 / 500

    [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach(function (el) {
      el.classList.remove("is-valid", "is-invalid");
    });
    [nameError, emailError, phoneError, subjectError, messageError].forEach(function (el) {
      el.textContent = "";
    });
  });
}
