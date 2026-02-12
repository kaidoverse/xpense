"use strict";

import { onAuthChange as watchAuthChange } from "./api/auth.js";
import {
  addForm,
  categoryForm,
  filterClear,
  filterSelect,
  loginForm,
  movementsList,
  signOutForm,
  signupButton,
  themeToggle,
} from "./app/dom.js";
import {
  onAddSubmit,
  onAuthChange,
  onCategorySubmit,
  onFilterChange,
  onFilterClear,
  onLoginSubmit,
  onMovementsClick,
  onSignOutSubmit,
  onSignupClick,
  onThemeToggle,
} from "./app/handlers.js";
import { setAuthState, setTheme, updateSummary } from "./app/ui.js";

setTheme("dark");
updateSummary({ income: 0, expense: 0, net: 0 });
setAuthState(false);
filterSelect.value = "all";

themeToggle.addEventListener("click", onThemeToggle);
loginForm.addEventListener("submit", onLoginSubmit);
signupButton.addEventListener("click", onSignupClick);
addForm.addEventListener("submit", onAddSubmit);
categoryForm.addEventListener("submit", onCategorySubmit);
signOutForm.addEventListener("submit", onSignOutSubmit);
filterSelect.addEventListener("change", onFilterChange);
filterClear.addEventListener("click", onFilterClear);
movementsList.addEventListener("click", onMovementsClick);
watchAuthChange(onAuthChange);
