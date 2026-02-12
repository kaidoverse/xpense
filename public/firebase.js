"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = window.__FIREBASE_CONFIG__;

if (!firebaseConfig?.apiKey) {
  throw new Error(
    "Missing Firebase config. Create public/firebase-config.local.js from public/firebase-config.template.js."
  );
}

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
