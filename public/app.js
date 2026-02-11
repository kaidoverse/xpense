"use strict";

const themeToggle = document.querySelector(".theme-toggle");
const loginForm = document.querySelector(".login");
const loginEmailInput = document.querySelector(".login__input--email");
const loginPasswordInput = document.querySelector(".login__input--password");
const addForm = document.querySelector(".form--add");
const addAmountInput = document.querySelector(".form__input--amount");
const addTypeInput = document.querySelector(".form__input--type");
const categoryForm = document.querySelector(".form--category");
const categorySelect = document.querySelector(".form__input--category");
const categoryNote = document.querySelector(".form__input--note");
const signOutForm = document.querySelector(".form--close");
const signOutEmail = document.querySelector(".form__input--email");
const signOutPassword = document.querySelector(".form__input--password");
const balanceValue = document.querySelector(".balance__value");
const summaryIn = document.querySelector(".summary__value--in");
const summaryOut = document.querySelector(".summary__value--out");
const summaryNet = document.querySelector(".summary__value--net");
const movementsList = document.querySelector(".movements");

const setTheme = theme => {
  document.body.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
};

setTheme("dark");

themeToggle.addEventListener("click", () => {
  const nextTheme =
    document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

const updateSummary = ({ income, expense, net }) => {
  balanceValue.textContent = `$${net.toFixed(2)}`;
  summaryIn.textContent = `$${income.toFixed(2)}`;
  summaryOut.textContent = `$${expense.toFixed(2)}`;
  summaryNet.textContent = `$${net.toFixed(2)}`;
};

const renderMovements = movements => {
  movementsList.innerHTML = "";
  movements.forEach(movement => {
    const row = document.createElement("div");
    row.className = "movements__row";

    const type = document.createElement("div");
    type.className = `movements__type movements__type--${movement.type}`;
    type.textContent = movement.type === "income" ? "Income" : "Expense";

    const date = document.createElement("div");
    date.className = "movements__date";
    date.textContent = movement.date;

    const value = document.createElement("div");
    value.className = "movements__value";
    value.textContent = `${movement.type === "expense" ? "-" : ""}$${movement.amount.toFixed(2)}`;

    row.append(type, date, value);
    movementsList.append(row);
  });
};

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  console.log("Login", loginEmailInput.value, loginPasswordInput.value);
});

addForm.addEventListener("submit", event => {
  event.preventDefault();
  console.log("Add transaction", addAmountInput.value, addTypeInput.value);
});

categoryForm.addEventListener("submit", event => {
  event.preventDefault();
  console.log("Save category", categorySelect.value, categoryNote.value);
});

signOutForm.addEventListener("submit", event => {
  event.preventDefault();
  console.log("Sign out", signOutEmail.value, signOutPassword.value);
});

updateSummary({ income: 0, expense: 0, net: 0 });
renderMovements([
  { type: "income", amount: 1250, date: "Today" },
  { type: "expense", amount: 320, date: "Yesterday" },
]);
