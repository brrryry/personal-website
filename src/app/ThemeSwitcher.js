"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const resolvedTheme = theme === "system" ? (systemTheme ?? "light") : theme;

  const handleTheme = () => {
    const current = theme === "system" ? (systemTheme ?? "light") : theme;
    if (current === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div>
      <button
        onClick={handleTheme}
        className={`p-2 rounded-full border-2 transition-colors duration-200 ${
          resolvedTheme === "dark"
            ? "border-gray-300 bg-purple-100 hover:bg-white"
            : "border-gray-600 bg-black hover:bg-purple-700"
        }`}
      >
        {resolvedTheme === "light" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m8.66-9h1M3.34 12h1m15.36 6.36l.7.7M4.64 5.64l.7.7m12.02 12.02l-.7.7M5.34 5.34l-.7.7M12 5a7 7 0 100 14 7 7 0 000-14z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
