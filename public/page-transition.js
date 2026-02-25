"use strict";

(() => {
  const root = document.documentElement;

  const startLoader = () => {
    root.classList.add("is-navigating");
  };

  const shouldHandleLink = anchor => {
    if (!anchor) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return false;
    return true;
  };

  document.addEventListener(
    "click",
    event => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest("a");
      if (!shouldHandleLink(anchor)) return;
      startLoader();
    },
    true
  );

  document.addEventListener(
    "submit",
    event => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.target && form.target !== "_self") return;
      startLoader();
    },
    true
  );

  window.addEventListener("beforeunload", startLoader);
  window.addEventListener("pageshow", () => {
    root.classList.remove("is-navigating");
  });
})();
