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
            : "border-gray-600 bg-purple-700 hover:bg-purple-700"
        }`}
      >
        {resolvedTheme === "light" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#f8f8ff]"
            viewBox="0 0 24 24"
            fill="#9c7bde"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#333333]"
            fill="#333333"
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
