"use strict";

export const appState = {
  currentUser: null,
  cachedMovements: [],
};

export const setCurrentUser = user => {
  appState.currentUser = user;
};

export const setCachedMovements = movements => {
  appState.cachedMovements = movements;
};
