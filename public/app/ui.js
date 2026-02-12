"use strict";

import {
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
import { appState } from "./state.js";

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

export const renderMovements = movements => {
  movementsList.innerHTML = "";
  movements.forEach(movement => {
    const row = document.createElement("div");
    row.className = "movements__row";
    if (movement.id === appState.selectedTransactionId) {
      row.classList.add("movements__row--selected");
    }
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

    row.append(type, date, value, deleteBtn);
    movementsList.append(row);
  });
};

export const setStatus = (message, tone = "info") => {
  statusEl.textContent = message || "";
  statusEl.classList.remove("is-error", "is-success");
  if (tone === "error") statusEl.classList.add("is-error");
  if (tone === "success") statusEl.classList.add("is-success");
};

export const setLoading = isLoading => {
  document.body.classList.toggle("is-loading", isLoading);
};

export const setAuthState = isAuthenticated => {
  document.body.classList.toggle("is-authenticated", isAuthenticated);
};

export const hydrateDetailsForm = transaction => {
  if (!transaction) return;
  categorySelect.value = transaction.category || "misc";
  categoryDate.value = transaction.date || "";
  categoryNote.value = transaction.note || "";
};

export const resetDetailsForm = () => {
  categoryDate.value = "";
  categoryNote.value = "";
  categorySelect.value = "misc";
};
