"use strict";

export const themePicker = document.querySelector(".theme-picker");
export const themePickerButtons = document.querySelectorAll(".theme-picker__btn");
export const loginForm = document.querySelector(".login");
export const loginEmailInput = document.querySelector(".login__input--email");
export const loginPasswordInput = document.querySelector(".login__input--password");
export const signupButton = document.querySelector(".login__btn--secondary");
export const addForm = document.querySelector(".form--add");
export const addFormTitle = document.querySelector(".operation--add .operation__title");
export const addAmountInput = document.querySelector(".form__input--amount");
export const addTypeInput = document.querySelector(".form__input--type");
export const categorySelect = document.querySelector(".form__input--category");
export const categoryDate = document.querySelector(".form__input--date");
export const categoryNote = document.querySelector(".form__input--note");
export const addSubmitButton = document.querySelector(".form__btn--add");
export const addCancelButton = document.querySelector(".form__btn--cancel");
export const signOutButton = document.querySelector(".signout__btn");
export const balanceValue = document.querySelector(".balance__value");
export const balanceDate = document.querySelector(".date");
export const summaryIn = document.querySelector(".summary__value--in");
export const summaryOut = document.querySelector(".summary__value--out");
export const summaryNet = document.querySelector(".summary__value--net");
export const movementsList = document.querySelector(".movements__list");
export const statusEl = document.querySelector(".status");
export const filterSelect = document.querySelector(".filter__select");
export const filterClear = document.querySelector(".filter__clear");
export const rangeFilter = document.querySelector(".range-filter");
export const rangeFilterButtons = document.querySelectorAll(".range-filter__btn");

export const isAppPage = () => window.location.pathname.endsWith("/app.html");
export const isLandingPage = () => !isAppPage();

export const redirectToApp = () => {
  if (!isAppPage()) window.location.href = "app.html";
};

export const redirectToLanding = () => {
  if (isAppPage()) window.location.href = "index.html";
};
