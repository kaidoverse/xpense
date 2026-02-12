"use strict";

export const appState = {
  currentUser: null,
  cachedMovements: [],
  selectedTransactionId: null,
};

export const setCurrentUser = user => {
  appState.currentUser = user;
};

export const setCachedMovements = movements => {
  appState.cachedMovements = movements;
};

export const setSelectedTransactionId = id => {
  appState.selectedTransactionId = id || null;
};
