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
  where,
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { db } from "../firebase.js";

const collectionName = "transactions";

const mapDoc = snapshot => ({
  id: snapshot.id,
  ...snapshot.data(),
});

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
    userId,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(ref, payload);
  return { id: docRef.id, ...payload };
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
