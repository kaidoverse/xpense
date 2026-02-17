"use strict";

import { appState } from "./state.js";
import { addAmountInput, categoryNote, filterSelect } from "./dom.js";
import { renderMovements, setStatus, setTheme } from "./ui.js";
import {
  getAuthErrorMessage,
  requireAmount,
  requireAuthInputs,
  requireDate,
} from "./validation.js";
import {
  applyFilter,
  createTransaction,
  deleteTransactionById,
  handleAuthState,
  signIn,
  signOutUser,
  signUp,
} from "./services.js";

export const onThemeToggle = () => {
  const nextTheme =
    document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(nextTheme);
};

export const onLoginSubmit = async event => {
  event.preventDefault();
  const payload = requireAuthInputs();
  if (!payload) return;
  try {
    await signIn(payload);
  } catch (error) {
    console.error(error);
    setStatus(getAuthErrorMessage(error), "error");
  }
};

export const onSignupClick = async () => {
  const payload = requireAuthInputs();
  if (!payload) return;
  try {
    await signUp(payload);
  } catch (error) {
    console.error(error);
    setStatus(getAuthErrorMessage(error), "error");
  }
};

export const onAddSubmit = async event => {
  event.preventDefault();
  const amount = requireAmount();
  if (!amount || !appState.currentUser) return;
  const date = requireDate();
  if (!date) return;
  try {
    await createTransaction({ amount, date });
    addAmountInput.value = "";
    categoryNote.value = "";
  } catch (error) {
    console.error(error);
    setStatus("Failed to add transaction", "error");
  }
};

export const onSignOutClick = async () => {
  try {
    await signOutUser();
  } catch (error) {
    console.error(error);
    setStatus("Sign out failed", "error");
  }
};

export const onAuthChange = async user => {
  await handleAuthState(user);
};

export const onFilterChange = () => {
  renderMovements(applyFilter(filterSelect.value));
};

export const onFilterClear = () => {
  filterSelect.value = "all";
  renderMovements(appState.cachedMovements);
};

export const onMovementsClick = async event => {
  const target = event.target;
  if (!target.classList.contains("movements__delete")) return;
  if (!appState.currentUser) return;
  const row = target.closest(".movements__row");
  if (!row?.dataset?.id) return;
  try {
    await deleteTransactionById(row.dataset.id);
  } catch (error) {
    console.error(error);
    setStatus("Failed to delete transaction", "error");
  }
};
