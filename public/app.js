"use strict";

const themeToggle = document.querySelector(".theme-toggle");

const setTheme = theme => {
  document.body.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
};

setTheme("dark");

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});
