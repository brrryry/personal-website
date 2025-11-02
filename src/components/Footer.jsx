"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function Footer({ hash }) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted
    ? theme === "system"
      ? resolvedTheme
      : theme
    : "light";

  const textColor =
    currentTheme === "dark" ? "text-[#f8f8ff]" : "text-[#1e1e1e]";

  return (
    <>
      <p className={`text-sm ${textColor}`}>
        current commit:{" "}
        <a
          href={`https://github.com/brrryry/personal-website/commit/${hash}`}
          target="_blank"
        >
          {process.env.COMMIT_HASH.slice(0, 7)}
        </a>
        {" | "}
        source code{" "}
        <a href="https://github.com/brrryry/personal-website" target="_blank">
          here
        </a>
      </p>

      <p className="text-sm">
        <a href="https://nextjs.org/" target="_blank">
          next.js
        </a>
        {" | "}
        <a href="https://tailwindcss.com/" target="_blank">
          tailwindcss
        </a>
      </p>
    </>
  );
}

export default Footer;
