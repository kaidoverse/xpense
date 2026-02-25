"use strict";

import { onAuthChange } from "./api/auth.js";

const THEME_MODE_KEY = "xpense-theme-mode";
const THEME_COOKIE_NAME = "xpense_theme_mode";

const readCookie = name => {
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map(item => item.trim());
  const found = parts.find(part => part.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
};

const getThemeMode = () => {
  const isValid = value => value === "light" || value === "dark" || value === "system";
  try {
    const stored = window.localStorage.getItem(THEME_MODE_KEY);
    if (isValid(stored)) return stored;
  } catch {
    // Ignore storage access errors.
  }
  const cookieValue = readCookie(THEME_COOKIE_NAME);
  return isValid(cookieValue) ? cookieValue : "system";
};

const getTheme = mode => {
  if (mode === "light" || mode === "dark") return mode;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const initialTheme = getTheme(getThemeMode());
document.documentElement.setAttribute("data-theme", initialTheme);
document.documentElement.style.backgroundColor = initialTheme === "dark" ? "#0f1720" : "#f3f5f7";
document.body.setAttribute("data-theme", initialTheme);

onAuthChange(user => {
  if (user) window.location.href = "app.html";
});
