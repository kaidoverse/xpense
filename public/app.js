"use strict";

import { onAuthChange as watchAuthChange } from "./api/auth.js";
import {
  addCancelButton,
  addForm,
  filterClear,
  filterSelect,
  loginForm,
  movementsList,
  signOutButton,
  signupButton,
  themeToggle,
} from "./app/dom.js";
import {
  onAddSubmit,
  onCancelEditClick,
  onAuthChange,
  onFilterChange,
  onFilterClear,
  onLoginSubmit,
  onMovementsClick,
  onSignOutClick,
  onSignupClick,
  onThemeToggle,
} from "./app/handlers.js";
import { setAuthState, setCurrentDate, setTheme, updateSummary } from "./app/ui.js";

setTheme("light");
setCurrentDate();
updateSummary({ income: 0, expense: 0, net: 0 });
setAuthState(false);
filterSelect.value = "all";

themeToggle.addEventListener("click", onThemeToggle);
loginForm.addEventListener("submit", onLoginSubmit);
signupButton.addEventListener("click", onSignupClick);
addForm.addEventListener("submit", onAddSubmit);
addCancelButton.addEventListener("click", onCancelEditClick);
signOutButton.addEventListener("click", onSignOutClick);
filterSelect.addEventListener("change", onFilterChange);
filterClear.addEventListener("click", onFilterClear);
movementsList.addEventListener("click", onMovementsClick);
watchAuthChange(onAuthChange);
