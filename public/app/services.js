"use strict";

import { login, logout, register } from "../api/auth.js";
import {
  addTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "../api/transactions.js";
import {
  filterSelect,
  addTypeInput,
  categoryNote,
  categorySelect,
  isLandingPage,
  redirectToApp,
  redirectToLanding,
} from "./dom.js";
import { appState, setCachedMovements, setCurrentUser } from "./state.js";
import {
  renderMovements,
  setAuthState,
  setLoading,
  setStatus,
  updateSummary,
} from "./ui.js";

const summarizeMovements = movements => {
  const income = movements
    .filter(item => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = movements
    .filter(item => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  return { income, expense, net: income - expense };
};

const toDayStart = date => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
};

const isInRange = (dateValue, range) => {
  if (range === "all") return true;
  const value = toDayStart(dateValue);
  const today = toDayStart(new Date());

  if (range === "today") {
    return value.getTime() === today.getTime();
  }
  if (range === "7d") {
    const start = toDayStart(new Date(today));
    start.setDate(start.getDate() - 6);
    return value >= start && value <= today;
  }
  if (range === "30d") {
    const start = toDayStart(new Date(today));
    start.setDate(start.getDate() - 29);
    return value >= start && value <= today;
  }
  if (range === "month") {
    return (
      value.getFullYear() === today.getFullYear() &&
      value.getMonth() === today.getMonth()
    );
  }
  return true;
};

export const getFilteredMovements = () => {
  let movements = appState.cachedMovements;
  const categoryFilter = filterSelect.value;
  if (categoryFilter === "income" || categoryFilter === "expense") {
    movements = movements.filter(item => item.type === categoryFilter);
  } else if (categoryFilter !== "all") {
    movements = movements.filter(item => item.category === categoryFilter);
  }

  return movements.filter(item => isInRange(item.date, appState.dateRange));
};

export const renderFilteredDashboard = () => {
  const filtered = getFilteredMovements();
  renderMovements(filtered);
  updateSummary(summarizeMovements(filtered));
};

const refreshDashboard = async () => {
  setCachedMovements(await listTransactions(appState.currentUser.uid));
  renderFilteredDashboard();
};

export const signIn = async payload => {
  setLoading(true);
  try {
    setStatus("Signing in...");
    const user = await login(payload.email, payload.password);
    setCurrentUser(user);
    setAuthState(true);
    if (isLandingPage()) redirectToApp();
    await refreshDashboard();
    setStatus("Signed in", "success");
  } finally {
    setLoading(false);
  }
};

export const signUp = async payload => {
  setLoading(true);
  try {
    setStatus("Creating account...");
    const user = await register(payload.email, payload.password);
    setCurrentUser(user);
    setAuthState(true);
    if (isLandingPage()) redirectToApp();
    await refreshDashboard();
    setStatus("Account created", "success");
  } finally {
    setLoading(false);
  }
};

export const createTransaction = async ({ amount, date }) => {
  setLoading(true);
  try {
    setStatus("Adding transaction...");
    await addTransaction(appState.currentUser.uid, {
      type: addTypeInput.value,
      amount,
      date,
      category: categorySelect.value,
      note: categoryNote.value || "",
    });
    await refreshDashboard();
    setStatus("Transaction added", "success");
  } finally {
    setLoading(false);
  }
};

export const editTransaction = async (id, { amount, date }) => {
  setLoading(true);
  try {
    setStatus("Saving transaction...");
    await updateTransaction(appState.currentUser.uid, id, {
      type: addTypeInput.value,
      amount,
      date,
      category: categorySelect.value,
      note: categoryNote.value || "",
    });
    await refreshDashboard();
    setStatus("Transaction updated", "success");
  } finally {
    setLoading(false);
  }
};

export const signOutUser = async () => {
  setLoading(true);
  try {
    setStatus("Signing out...");
    await logout();
    setCurrentUser(null);
    setCachedMovements([]);
    renderMovements([]);
    updateSummary({ income: 0, expense: 0, net: 0 });
    setStatus("Signed out");
    setAuthState(false);
    redirectToLanding();
  } finally {
    setLoading(false);
  }
};

export const deleteTransactionById = async id => {
  setLoading(true);
  try {
    await deleteTransaction(appState.currentUser.uid, id);
    await refreshDashboard();
    setStatus("Transaction deleted", "success");
  } finally {
    setLoading(false);
  }
};

export const handleAuthState = async user => {
  setCurrentUser(user);
  setAuthState(Boolean(user));
  if (!user) {
    setCachedMovements([]);
    renderMovements([]);
    updateSummary({ income: 0, expense: 0, net: 0 });
    return;
  }
  await refreshDashboard();
};
