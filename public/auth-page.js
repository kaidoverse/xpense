"use strict";

import { login, onAuthChange, register } from "./api/auth.js";

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

document.body.setAttribute("data-theme", getTheme(getThemeMode()));

const form = document.querySelector(".auth-form");
const emailInput = document.querySelector("#auth-email");
const passwordInput = document.querySelector("#auth-password");
const submitButton = document.querySelector(".auth-submit");
const mode = document.body.dataset.authMode === "signup" ? "signup" : "login";

const showError = message => {
  const existing = document.querySelector(".auth-error");
  if (existing) existing.remove();
  const node = document.createElement("p");
  node.className = "auth-error";
  node.textContent = message;
  form.insertBefore(node, submitButton);
};

const clearError = () => {
  const existing = document.querySelector(".auth-error");
  if (existing) existing.remove();
};

const mapAuthError = error => {
  const code = error?.code || "";
  if (code === "auth/weak-password") return "Password must be at least 6 characters.";
  if (code === "auth/email-already-in-use") return "Unable to create account with these details.";
  if (code === "auth/invalid-credential" || code === "auth/user-not-found") {
    return "Unable to sign in with these details.";
  }
  if (code === "auth/wrong-password") return "Unable to sign in with these details.";
  if (code === "auth/network-request-failed") return "Network error. Check your connection and try again.";
  return "Authentication failed. Please try again.";
};

const validate = () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    showError("Email and password are required.");
    return null;
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    showError("Enter a valid email address.");
    return null;
  }
  if (password.length < 6) {
    showError("Password must be at least 6 characters.");
    return null;
  }
  return { email, password };
};

form.addEventListener("submit", async event => {
  event.preventDefault();
  clearError();
  const payload = validate();
  if (!payload) return;

  submitButton.disabled = true;
  submitButton.textContent = mode === "signup" ? "Creating..." : "Signing in...";
  try {
    if (mode === "signup") {
      await register(payload.email, payload.password);
    } else {
      await login(payload.email, payload.password);
    }
    window.location.href = "app.html";
  } catch (error) {
    showError(mapAuthError(error));
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = mode === "signup" ? "Create account" : "Continue";
  }
});

onAuthChange(user => {
  if (user) window.location.href = "app.html";
});
