"use strict";

import { onAuthChange } from "./api/auth.js";

onAuthChange(user => {
  if (user) window.location.href = "app.html";
});