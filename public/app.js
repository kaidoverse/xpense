"use strict";

import { onAuthChange as watchAuthChange } from "./api/auth.js";
import {
  addCancelButton,
  addForm,
  filterClear,
  filterSelect,
  loginForm,
  movementsList,
  rangeFilter,
  signOutButton,
  signupButton,
  themePicker,
} from "./app/dom.js";
import {
  onAddSubmit,
  onCancelEditClick,
  onAuthChange,
  onFilterChange,
  onFilterClear,
  onLoginSubmit,
  onMovementsClick,
  onRangeFilterClick,
  onThemeChoiceClick,
  onSignOutClick,
  onSignupClick,
} from "./app/handlers.js";
import {
  initializeTheme,
  setActiveRangeButton,
  setAuthState,
  setCurrentDate,
  updateSummary,
} from "./app/ui.js";

initializeTheme();
setCurrentDate();
updateSummary({ income: 0, expense: 0, net: 0 });
setAuthState(false);
filterSelect.value = "all";
setActiveRangeButton("all");

themePicker.addEventListener("click", onThemeChoiceClick);
loginForm.addEventListener("submit", onLoginSubmit);
signupButton.addEventListener("click", onSignupClick);
addForm.addEventListener("submit", onAddSubmit);
addCancelButton.addEventListener("click", onCancelEditClick);
signOutButton.addEventListener("click", onSignOutClick);
filterSelect.addEventListener("change", onFilterChange);
filterClear.addEventListener("click", onFilterClear);
rangeFilter.addEventListener("click", onRangeFilterClick);
movementsList.addEventListener("click", onMovementsClick);
watchAuthChange(onAuthChange);
