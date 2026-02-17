"use strict";

import { login, logout, register } from "../api/auth.js";
import {
  addTransaction,
  deleteTransaction,
  getSummary,
  listTransactions,
  updateTransaction,
} from "../api/transactions.js";
import {
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

export const applyFilter = filter => {
  if (filter === "income" || filter === "expense") {
    return appState.cachedMovements.filter(item => item.type === filter);
  }
  if (filter === "all") return appState.cachedMovements;
  return appState.cachedMovements.filter(item => item.category === filter);
};

const refreshDashboard = async () => {
  setCachedMovements(await listTransactions(appState.currentUser.uid));
  const summary = await getSummary(appState.currentUser.uid);
  renderMovements(appState.cachedMovements);
  updateSummary(summary);
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
