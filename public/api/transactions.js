"use strict";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { db } from "../firebase.js";

const collectionName = "transactions";

const toInputDate = value => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.toDate) return value.toDate().toISOString().slice(0, 10);
  return "";
};

const toFirestoreDate = input => {
  const date = new Date(`${input}T00:00:00`);
  return Timestamp.fromDate(date);
};

const mapDoc = snapshot => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    date: toInputDate(data.date),
  };
};

export async function listTransactions(userId) {
  const ref = collection(db, collectionName);
  const q = query(ref, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const result = await getDocs(q);
  return result.docs.map(mapDoc);
}

export async function addTransaction(userId, tx) {
  const ref = collection(db, collectionName);
  const payload = {
    ...tx,
    date: toFirestoreDate(tx.date),
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(ref, payload);
  return { id: docRef.id, ...payload };
}

export async function updateTransaction(_, id, patch) {
  const txRef = doc(db, collectionName, id);
  await updateDoc(txRef, {
    ...patch,
    date: toFirestoreDate(patch.date),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTransaction(_, id) {
  await deleteDoc(doc(db, collectionName, id));
}

export async function getSummary(userId) {
  const items = await listTransactions(userId);
  const income = items
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = items
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, net: income - expense };
}
