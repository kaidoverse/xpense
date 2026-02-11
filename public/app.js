"use strict";

import { login, logout, onAuthChange } from "./api/auth.js";
import {
  addTransaction,
  getSummary,
  listTransactions,
} from "./api/transactions.js";

const themeToggle = document.querySelector(".theme-toggle");
const loginForm = document.querySelector(".login");
const loginEmailInput = document.querySelector(".login__input--email");
const loginPasswordInput = document.querySelector(".login__input--password");
const addForm = document.querySelector(".form--add");
const addAmountInput = document.querySelector(".form__input--amount");
const addTypeInput = document.querySelector(".form__input--type");
const categoryForm = document.querySelector(".form--category");
const categorySelect = document.querySelector(".form__input--category");
const categoryDate = document.querySelector(".form__input--date");
const categoryNote = document.querySelector(".form__input--note");
const signOutForm = document.querySelector(".form--close");
const signOutEmail = document.querySelector(".form__input--email");
const signOutPassword = document.querySelector(".form__input--password");
const balanceValue = document.querySelector(".balance__value");
const summaryIn = document.querySelector(".summary__value--in");
const summaryOut = document.querySelector(".summary__value--out");
const summaryNet = document.querySelector(".summary__value--net");
const movementsList = document.querySelector(".movements");
const statusEl = document.querySelector(".status");
const filterSelect = document.querySelector(".filter__select");
const filterClear = document.querySelector(".filter__clear");
let currentUser = null;
let cachedMovements = [];

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

const updateSummary = ({ income, expense, net }) => {
  balanceValue.textContent = `$${net.toFixed(2)}`;
  summaryIn.textContent = `$${income.toFixed(2)}`;
  summaryOut.textContent = `$${expense.toFixed(2)}`;
  summaryNet.textContent = `$${net.toFixed(2)}`;
};

const renderMovements = movements => {
  movementsList.innerHTML = "";
  movements.forEach(movement => {
    const row = document.createElement("div");
    row.className = "movements__row";
    row.dataset.id = movement.id;

    const type = document.createElement("div");
    type.className = `movements__type movements__type--${movement.type}`;
    type.textContent = movement.type === "income" ? "Income" : "Expense";

    const date = document.createElement("div");
    date.className = "movements__date";
    const categoryLabel = movement.category ? `• ${movement.category}` : "";
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

const setStatus = (message, tone = "info") => {
  statusEl.textContent = message || "";
  statusEl.classList.remove("is-error", "is-success");
  if (tone === "error") statusEl.classList.add("is-error");
  if (tone === "success") statusEl.classList.add("is-success");
};

const setLoading = isLoading => {
  document.body.classList.toggle("is-loading", isLoading);
};

const applyFilter = filter => {
  if (filter === "income" || filter === "expense")
    return cachedMovements.filter(item => item.type === filter);
  if (filter === "all") return cachedMovements;
  return cachedMovements.filter(item => item.category === filter);
};

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  try {
    setLoading(true);
    setStatus("Signing in...");
    currentUser = await login(loginEmailInput.value, loginPasswordInput.value);
    cachedMovements = await listTransactions(currentUser.uid);
    const summary = await getSummary(currentUser.uid);
    renderMovements(cachedMovements);
    updateSummary(summary);
    setStatus("Signed in", "success");
  } catch (error) {
    console.error(error);
    setStatus("Sign in failed", "error");
  } finally {
    setLoading(false);
  }
});

addForm.addEventListener("submit", async event => {
  event.preventDefault();
  const amount = Number(addAmountInput.value);
  if (!amount || !currentUser) return;
  try {
    setLoading(true);
    setStatus("Adding transaction...");
    await addTransaction(currentUser.uid, {
      type: addTypeInput.value,
      amount,
      date: categoryDate.value || "Today",
      category: categorySelect.value,
      note: categoryNote.value || "",
    });
    cachedMovements = await listTransactions(currentUser.uid);
    const summary = await getSummary(currentUser.uid);
    renderMovements(cachedMovements);
    updateSummary(summary);
    setStatus("Transaction added", "success");
    addAmountInput.value = "";
  } catch (error) {
    console.error(error);
    setStatus("Failed to add transaction", "error");
  } finally {
    setLoading(false);
  }
});

categoryForm.addEventListener("submit", event => {
  event.preventDefault();
  console.log("Save category", categorySelect.value, categoryNote.value);
});

signOutForm.addEventListener("submit", async event => {
  event.preventDefault();
  try {
    setLoading(true);
    setStatus("Signing out...");
    await logout();
    currentUser = null;
    cachedMovements = [];
    renderMovements([]);
    updateSummary({ income: 0, expense: 0, net: 0 });
    setStatus("Signed out");
  } catch (error) {
    console.error(error);
    setStatus("Sign out failed", "error");
  } finally {
    setLoading(false);
  }
});

updateSummary({ income: 0, expense: 0, net: 0 });

onAuthChange(user => {
  currentUser = user;
  if (!user) {
    cachedMovements = [];
    renderMovements([]);
    updateSummary({ income: 0, expense: 0, net: 0 });
  }
});

filterSelect.addEventListener("change", () => {
  renderMovements(applyFilter(filterSelect.value));
});

filterClear.addEventListener("click", () => {
  filterSelect.value = "all";
  renderMovements(cachedMovements);
});

movementsList.addEventListener("click", async event => {
  const target = event.target;
  if (!target.classList.contains("movements__delete")) return;
  if (!currentUser) return;
  const row = target.closest(".movements__row");
  if (!row?.dataset?.id) return;

  try {
    setLoading(true);
    await deleteTransaction(currentUser.uid, row.dataset.id);
    cachedMovements = await listTransactions(currentUser.uid);
    const summary = await getSummary(currentUser.uid);
    renderMovements(cachedMovements);
    updateSummary(summary);
    setStatus("Transaction deleted", "success");
  } catch (error) {
    console.error(error);
    setStatus("Failed to delete transaction", "error");
  } finally {
    setLoading(false);
  }
});

filterSelect.value = "all";
