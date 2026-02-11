"use strict";

// Auth stub API. Replace internals with Firebase calls later.
export async function register(email, password) {
  console.log("Register", email, password);
  return { uid: "stub-user" };
}

export async function login(email, password) {
  console.log("Login", email, password);
  return { uid: "stub-user" };
}

export async function logout() {
  console.log("Logout");
}

export function onAuthChange(callback) {
  callback(null);
}