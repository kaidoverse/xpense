"use strict";

// Transactions stub API. Replace internals with Firebase calls later.
const demo = [
  { id: "1", type: "income", amount: 1250, date: "Today", category: "salary" },
  { id: "2", type: "expense", amount: 320, date: "Yesterday", category: "food" },
];

export async function listTransactions() {
  return demo;
}

export async function addTransaction(_, tx) {
  demo.unshift({ id: String(Date.now()), ...tx });
  return demo[0];
}

export async function deleteTransaction(_, id) {
  const index = demo.findIndex(item => item.id === id);
  if (index !== -1) demo.splice(index, 1);
}

export async function getSummary() {
  const income = demo.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = demo.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, net: income - expense };
}