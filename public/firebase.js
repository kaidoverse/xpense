"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REDACTED",
  authDomain: "xpense-acd5a.firebaseapp.com",
  projectId: "xpense-acd5a",
  storageBucket: "xpense-acd5a.firebasestorage.app",
  messagingSenderId: "350896435962",
  appId: "1:350896435962:web:52ee39e66c152d48c94f43",
  measurementId: "G-TB8ZCBERPY",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
