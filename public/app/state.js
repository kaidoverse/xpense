"use strict";

export const appState = {
  currentUser: null,
  cachedMovements: [],
  editingTransactionId: null,
  dateRange: "all",
};

export const setCurrentUser = user => {
  appState.currentUser = user;
};

export const setCachedMovements = movements => {
  appState.cachedMovements = movements;
};

export const setEditingTransactionId = id => {
  appState.editingTransactionId = id;
};

export const setDateRange = range => {
  appState.dateRange = range;
};
