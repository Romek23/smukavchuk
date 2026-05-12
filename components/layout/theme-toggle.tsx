"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "smukavchuk-theme";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const nextTheme = theme === "dark" ? "light" : "dark";

  const toggleTheme = () => {
    setTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  };

  return (
    <button
      type="button"
      className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 text-[#ffffff] opacity-75 transition duration-200 ease-out hover:border-white/30 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === "dark" ? (
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 3v2.4M12 18.6V21M4.36 4.36l1.7 1.7M17.94 17.94l1.7 1.7M3 12h2.4M18.6 12H21M4.36 19.64l1.7-1.7M17.94 6.06l1.7-1.7M16.5 12A4.5 4.5 0 1 1 7.5 12a4.5 4.5 0 0 1 9 0Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="size-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M20.25 14.18A7.35 7.35 0 0 1 9.82 3.75 8.25 8.25 0 1 0 20.25 14.18Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </button>
  );
}
