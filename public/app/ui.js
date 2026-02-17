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
  statusEl,
  summaryIn,
  summaryNet,
  summaryOut,
  themeToggle,
} from "./dom.js";

const toastRoot = document.createElement("div");
toastRoot.className = "toast-root";
toastRoot.setAttribute("aria-live", "polite");
toastRoot.setAttribute("aria-atomic", "false");
document.body.append(toastRoot);

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

export const setTheme = theme => {
  document.body.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
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

    row.append(type, date, value, editBtn, deleteBtn);
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
