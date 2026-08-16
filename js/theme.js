/* theme.js — switches light/dark mode on every page */

const THEME_STORAGE_KEY = "preferredTheme"; // key in browser localStorage

function applyTheme(theme) {
  const root = document.documentElement; // the <html> element
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark"); // CSS dark tokens activate
  } else {
    root.removeAttribute("data-theme"); // no attribute = light mode
  }
  updateToggleButton(theme); // refresh icon + label
}

function updateToggleButton(theme) {
  const icon = document.getElementById("theme-icon");
  const label = document.getElementById("theme-label");
  const button = document.getElementById("theme-toggle");
  if (!icon || !label || !button) return; // safety if header missing

  if (theme === "dark") {
    icon.textContent = "\u2600"; // sun = “switch to light”
    label.textContent = "Light mode";
  } else {
    icon.textContent = "\u263D"; // moon = “switch to dark”
    label.textContent = "Dark mode";
  }
}

function loadSavedTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY); // read last choice
  if (saved === "dark" || saved === "light") {
    applyTheme(saved); // returning visitor
  } else {
    applyTheme("light"); // first visit default
  }
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark"; // flip

  document.documentElement.classList.remove("theme-switching");
  void document.documentElement.offsetWidth; // restart pulse animation
  document.documentElement.classList.add("theme-switching");

  applyTheme(newTheme);
  localStorage.setItem(THEME_STORAGE_KEY, newTheme); // persist across pages

  window.setTimeout(function () {
    document.documentElement.classList.remove("theme-switching");
  }, 400);
}

loadSavedTheme(); // apply ASAP (script is in <head>/early)

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("theme-toggle");
  if (button) button.addEventListener("click", toggleTheme); // wire click
});
