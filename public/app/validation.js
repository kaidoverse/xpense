"use strict";

import {
  addAmountInput,
  addForm,
  categoryDate,
  categoryForm,
  loginEmailInput,
  loginForm,
  loginPasswordInput,
} from "./dom.js";
import { setStatus } from "./ui.js";

const clearFieldErrors = form => {
  if (!form) return;
  form.querySelectorAll(".is-invalid").forEach(field => {
    field.classList.remove("is-invalid");
  });
  form.querySelectorAll(".field-error").forEach(node => node.remove());
};

const showFieldError = (field, message) => {
  if (!field) return;
  field.classList.add("is-invalid");
  const error = document.createElement("div");
  error.className = "field-error";
  error.textContent = message;
  field.insertAdjacentElement("afterend", error);
};

const isValidEmail = email => /\S+@\S+\.\S+/.test(email);

export const requireAuthInputs = () => {
  clearFieldErrors(loginForm);
  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value.trim();
  if (!email || !password) {
    if (!email) showFieldError(loginEmailInput, "Email required");
    if (!password) showFieldError(loginPasswordInput, "Password required");
    setStatus("Email and password required", "error");
    return null;
  }
  if (!isValidEmail(email)) {
    showFieldError(loginEmailInput, "Invalid email");
    setStatus("Enter a valid email", "error");
    return null;
  }
  if (password.length < 6) {
    showFieldError(loginPasswordInput, "Min 6 characters");
    setStatus("Password must be at least 6 characters", "error");
    return null;
  }
  return { email, password };
};

export const requireAmount = () => {
  clearFieldErrors(addForm);
  const amount = Number(addAmountInput.value);
  if (!amount || amount <= 0) {
    showFieldError(addAmountInput, "Enter amount");
    setStatus("Enter a valid amount", "error");
    return null;
  }
  return amount;
};

export const requireDate = () => {
  clearFieldErrors(categoryForm);
  if (!categoryDate.value) {
    showFieldError(categoryDate, "Select date");
    setStatus("Select a date", "error");
    return null;
  }
  return categoryDate.value;
};

export const getAuthErrorMessage = error => {
  const code = error?.code || "";
  if (code === "auth/email-already-in-use") {
    showFieldError(loginEmailInput, "Email already registered");
    return "Email already registered. Sign in instead.";
  }
  if (code === "auth/invalid-credential" || code === "auth/user-not-found") {
    showFieldError(loginEmailInput, "Check email");
    showFieldError(loginPasswordInput, "Check password");
    return "Invalid credentials. Check email/password.";
  }
  if (code === "auth/wrong-password") {
    showFieldError(loginPasswordInput, "Wrong password");
    return "Wrong password.";
  }
  if (code === "auth/weak-password") {
    showFieldError(loginPasswordInput, "Weak password");
    return "Password is too weak.";
  }
  return "Authentication failed";
};
