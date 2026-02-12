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
  filterSelect,
  isLandingPage,
  redirectToApp,
  redirectToLanding,
} from "./dom.js";
import { appState, setCachedMovements, setCurrentUser, setSelectedTransactionId } from "./state.js";
import {
  hydrateDetailsForm,
  renderMovements,
  resetDetailsForm,
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

export const pickTransaction = id => {
  setSelectedTransactionId(id);
  renderMovements(applyFilter(filterSelect.value));
  const selected = appState.cachedMovements.find(
    item => item.id === appState.selectedTransactionId
  );
  hydrateDetailsForm(selected);
};

export const signIn = async payload => {
  setLoading(true);
  try {
    setStatus("Signing in...");
    const user = await login(payload.email, payload.password);
    setCurrentUser(user);
    setAuthState(true);
    if (isLandingPage()) redirectToApp();
    setSelectedTransactionId(null);
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
    setSelectedTransactionId(null);
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

export const saveTransactionDetails = async ({ date }) => {
  setLoading(true);
  try {
    setStatus("Saving details...");
    await updateTransaction(appState.currentUser.uid, appState.selectedTransactionId, {
      category: categorySelect.value,
      date,
      note: (categoryNote.value || "").trim(),
    });
    await refreshDashboard();
    setStatus("Details saved", "success");
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
    if (appState.selectedTransactionId === id) {
      setSelectedTransactionId(null);
      resetDetailsForm();
    }
    setStatus("Transaction deleted", "success");
  } finally {
    setLoading(false);
  }
};

export const handleAuthState = user => {
  setCurrentUser(user);
  setAuthState(Boolean(user));
  if (!user) {
    setSelectedTransactionId(null);
    setCachedMovements([]);
    renderMovements([]);
    updateSummary({ income: 0, expense: 0, net: 0 });
    resetDetailsForm();
  }
};
