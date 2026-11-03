"use client";

import { useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "kindred-theme";
const CHANGE_EVENT = "kindred-theme-change";

function subscribe(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // The toggle still works when browser storage is unavailable.
  }

  return document.documentElement.dataset.theme === "dark"
    ? "dark"
    : "light";
}

function getServerTheme() {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getTheme,
    getServerTheme
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Theme changes remain available for the current page.
    }

    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      aria-pressed={theme === "dark"}
      className="btn btn-outline btn-sm rounded-full"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}