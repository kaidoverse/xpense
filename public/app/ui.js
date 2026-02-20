"use strict";

import {
  addAmountInput,
  addCancelButton,
  addFormTitle,
  addSubmitButton,
  addTypeInput,
  balanceDate,
  balanceValue,
  categoryDate,
  categoryNote,
  categorySelect,
  movementsList,
  rangeFilterButtons,
  statusEl,
  summaryIn,
  summaryNet,
  summaryOut,
  themePickerButtons,
} from "./dom.js";

const toastRoot = document.createElement("div");
toastRoot.className = "toast-root";
toastRoot.setAttribute("aria-live", "polite");
toastRoot.setAttribute("aria-atomic", "false");
document.body.append(toastRoot);

const THEME_MODE_KEY = "xpense-theme-mode";
const THEME_COOKIE_NAME = "xpense_theme_mode";
let activeThemeMode = "system";

const readCookie = name => {
  const prefix = `${name}=`;
  const parts = document.cookie.split(";").map(item => item.trim());
  const found = parts.find(part => part.startsWith(prefix));
  return found ? decodeURIComponent(found.slice(prefix.length)) : null;
};

const writeCookie = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
};

const getStoredThemeMode = () => {
  const isValid = value => value === "light" || value === "dark" || value === "system";
  try {
    const stored = window.localStorage.getItem(THEME_MODE_KEY);
    if (isValid(stored)) return stored;
  } catch {
    // Ignore and fallback to cookie.
  }
  const cookieValue = readCookie(THEME_COOKIE_NAME);
  return isValid(cookieValue) ? cookieValue : "system";
};

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setActiveThemeChoice = mode => {
  themePickerButtons.forEach(button => {
    button.classList.toggle("is-active", button.dataset.themeChoice === mode);
    button.setAttribute(
      "aria-pressed",
      button.dataset.themeChoice === mode ? "true" : "false"
    );
  });
};

const applyTheme = theme => {
  document.body.setAttribute("data-theme", theme);
};

const persistThemeMode = mode => {
  try {
    window.localStorage.setItem(THEME_MODE_KEY, mode);
  } catch {
    // Ignore storage errors in locked-down browser modes.
  }
  writeCookie(THEME_COOKIE_NAME, mode);
};

const showToast = (message, tone) => {
  if (!message || (tone !== "error" && tone !== "success")) return;
  const toast = document.createElement("div");
  toast.className = `toast toast--${tone}`;
  toast.textContent = message;
  toastRoot.append(toast);
  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 220);
  }, 2600);
};

export const setThemeMode = (mode, options = {}) => {
  const { persist = true } = options;
  const nextMode = mode === "light" || mode === "dark" || mode === "system"
    ? mode
    : "system";
  activeThemeMode = nextMode;
  const theme = nextMode === "system" ? getSystemTheme() : nextMode;
  applyTheme(theme);
  setActiveThemeChoice(nextMode);
  if (persist) persistThemeMode(nextMode);
};

export const initializeTheme = () => {
  const storedMode = getStoredThemeMode();
  setThemeMode(storedMode, { persist: false });
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", event => {
    if (activeThemeMode !== "system") return;
    applyTheme(event.matches ? "dark" : "light");
  });
};

export const updateSummary = ({ income, expense, net }) => {
  balanceValue.textContent = `$${net.toFixed(2)}`;
  summaryIn.textContent = `$${income.toFixed(2)}`;
  summaryOut.textContent = `$${expense.toFixed(2)}`;
  summaryNet.textContent = `$${net.toFixed(2)}`;
};

export const setCurrentDate = (date = new Date()) => {
  if (!balanceDate) return;
  balanceDate.textContent = date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const renderMovements = movements => {
  movementsList.innerHTML = "";
  if (!movements.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "movements__empty";
    emptyState.textContent = "No transactions yet. Add your first one.";
    movementsList.append(emptyState);
    return;
  }

  movements.forEach(movement => {
    const row = document.createElement("div");
    row.className = "movements__row";
    row.dataset.id = movement.id;

    const type = document.createElement("div");
    type.className = `movements__type movements__type--${movement.type}`;
    type.textContent = movement.type === "income" ? "Income" : "Expense";

    const date = document.createElement("div");
    date.className = "movements__date";
    const categoryLabel = movement.category ? `? ${movement.category}` : "";
    date.textContent = `${movement.date || "Today"} ${categoryLabel}`.trim();

    const value = document.createElement("div");
    value.className = "movements__value";
    value.textContent = `${movement.type === "expense" ? "-" : ""}$${movement.amount.toFixed(2)}`;
    if (movement.note) value.title = movement.note;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "movements__delete";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";

    const editBtn = document.createElement("button");
    editBtn.className = "movements__edit";
    editBtn.type = "button";
    editBtn.textContent = "Edit";

    const actions = document.createElement("div");
    actions.className = "movements__actions";
    actions.append(editBtn, deleteBtn);

    row.append(type, date, value, actions);
    movementsList.append(row);
  });
};

export const setStatus = (message, tone = "info") => {
  statusEl.textContent = "";
  statusEl.classList.remove("is-error", "is-success");
  showToast(message, tone);
};

export const setLoading = isLoading => {
  document.body.classList.toggle("is-loading", isLoading);
};

export const setAuthState = isAuthenticated => {
  document.body.classList.toggle("is-authenticated", isAuthenticated);
};

export const setActiveRangeButton = range => {
  rangeFilterButtons.forEach(button => {
    button.classList.toggle("is-active", button.dataset.range === range);
  });
};

export const enterEditMode = transaction => {
  addFormTitle.textContent = "Edit transaction";
  addSubmitButton.textContent = "Save changes";
  addCancelButton.hidden = false;
  addTypeInput.value = transaction.type || "expense";
  categorySelect.value = transaction.category || "misc";
  addAmountInput.value = transaction.amount ?? "";
  categoryDate.value = transaction.date || "";
  categoryNote.value = transaction.note || "";
};

export const exitEditMode = () => {
  addFormTitle.textContent = "Add transaction";
  addSubmitButton.textContent = "Add transaction";
  addCancelButton.hidden = true;
  addTypeInput.value = "income";
  categorySelect.value = "salary";
  addAmountInput.value = "";
  categoryDate.value = "";
  categoryNote.value = "";
};
