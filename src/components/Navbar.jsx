"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "@/app/ThemeSwitcher";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || "";
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted
    ? theme === "system"
      ? resolvedTheme
      : theme
    : "light";

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const hoverClasses =
    "transition-colors duration-200 ease-in-out cursor-pointer" +
    (currentTheme === "dark" ? " hover:text-white" : " hover:text-purple-900");

  const getLinkClasses = (href, skipActive = false) => {
    // Determine active: for root require exact match, otherwise allow startsWith so nested routes still highlight
    const active =
      !skipActive &&
      (href === "/" ? pathname === "/" : pathname.startsWith(href));

    // theme-aware colors
    const activeColor =
      currentTheme === "dark" ? "text-white" : "text-gray-900";
    const inactiveColor =
      currentTheme === "dark" ? "text-purple-200" : "text-purple-700";

    return `text-2xl ${active ? activeColor : inactiveColor} font-bold ${hoverClasses}`;
  };

  // optional: adjust mobile toggle button color by theme
  const mobileButtonClasses =
    currentTheme === "dark"
      ? "md:hidden text-purple-200 focus:outline-none bg-purple-800/30 border border-purple-500/30 p-2.5 rounded-lg hover:bg-purple-800/50 transition-all duration-200"
      : "md:hidden text-purple-700 focus:outline-none bg-purple-200/40 border border-purple-300/30 p-2.5 rounded-lg hover:bg-purple-200/60 transition-all duration-200";

  return (
    <>
      <nav className="bg-transparent p-0 w-full h-auto md:h-32 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex justify-between items-center w-full py-4 md:py-0 md:w-auto md:space-x-4">
          <div className="flex space-x-4">
            <Link href="/" className="flex items-center p-0 mx-0">
              <p className={getLinkClasses("/")}>Bryan Chan</p>
            </Link>
            <ThemeSwitcher />
          </div>
          <button
            onClick={toggleMobileMenu}
            className={`${mobileButtonClasses} flex items-center justify-center w-10 h-10`}
            aria-label="Toggle Menu"
          >
            <div className="relative w-6 h-[18px] flex flex-col justify-between items-center group">
              <span
                className={`block h-0.5 w-6 bg-current rounded transition-all duration-300 ease-in-out ${
                  mobileOpen ? "rotate-45 translate-y-[8px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current rounded transition-all duration-300 ease-in-out ${
                  mobileOpen ? "opacity-0 scale-x-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current rounded transition-all duration-300 ease-in-out ${
                  mobileOpen ? "-rotate-45 -translate-y-[8px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            mobileOpen
              ? "max-h-64 opacity-100 mb-4"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col space-y-2 p-3 rounded-xl bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/15 backdrop-blur-md">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
            >
              <p className={getLinkClasses("/")}>Home</p>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0 text-purple-400 font-bold">
                →
              </span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
            >
              <p className={getLinkClasses("/about")}>About</p>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0 text-purple-400 font-bold">
                →
              </span>
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-purple-500/10 transition-all duration-200"
            >
              <p className={getLinkClasses("/blog")}>Blog</p>
              <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0 text-purple-400 font-bold">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 px-4">
          <li>
            <Link href="/">
              <p className={getLinkClasses("/")}>Home</p>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <p className={getLinkClasses("/about")}>About</p>
            </Link>
          </li>
          <li>
            <Link href="/blog">
              <p className={getLinkClasses("/blog")}>Blog</p>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
