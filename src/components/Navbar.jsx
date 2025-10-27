"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "./SessionContext";

const Navbar = () => {
  const { session, loading, logout } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() || "";

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const hoverClasses =
    "transition-colors duration-200 ease-in-out hover:text-white cursor-pointer";

  const getLinkClasses = (href, skipActive = false) => {
    // Determine active: for root require exact match, otherwise allow startsWith so nested routes still highlight
    const active =
      !skipActive &&
      (href === "/" ? pathname === "/" : pathname.startsWith(href));
    return `text-2xl ${active ? "text-white" : "text-purple-200"} font-bold ${hoverClasses}`;
  };

  return (
    <>
      <nav className="bg-transparent p-0 h-auto md:h-32 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex justify-between items-center w-full py-4 md:py-0 md:w-auto">
          <Link href="/" className="flex items-center p-0 mx-0">
            <p className={getLinkClasses("/")}>bryan chan.</p>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-purple-200 text-xl focus:outline-none bg-purple-500/50"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`flex-col space-y-1 mx-0 pb-5 items-start md:hidden ${mobileOpen ? "flex" : "hidden"}`}
        >
          <Link href="/" className="flex items-center mx-0">
            <p className={getLinkClasses("/")}>-- home</p>
          </Link>
          <Link
            href="/Chan_Bryan_Resume.pdf"
            target="_blank"
            className="flex items-center mx-0"
          >
            <p className={getLinkClasses("/Chan_Bryan_Resume.pdf")}>
              -- resume
            </p>
          </Link>
          <Link href="/projects" className="flex items-center mx-0">
            <p className={getLinkClasses("/projects")}>-- projects</p>
          </Link>
          <Link href="/blog" className="flex items-center mx-0">
            <p className={getLinkClasses("/blog")}>-- blog</p>
          </Link>
          {session?.sessionId && !loading && (
            <Link
              href="/"
              onClick={handleLogout}
              className="flex items-center mx-0"
            >
              {/* don't treat logout link as "active" even though href is "/" */}
              <p className={getLinkClasses("/", true)}>-- logout</p>
            </Link>
          )}
          {!session?.sessionId && !loading && (
            <Link href="/login" className="flex items-center mx-0">
              <p className={getLinkClasses("/login")}>-- login</p>
            </Link>
          )}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 px-4">
          <li>
            <Link href="/">
              <p className={getLinkClasses("/")}>home</p>
            </Link>
          </li>
          <li>
            <Link href="/Chan_Bryan_Resume.pdf" target="_blank">
              <p className={getLinkClasses("/Chan_Bryan_Resume.pdf")}>resume</p>
            </Link>
          </li>
          <li>
            <Link href="/projects">
              <p className={getLinkClasses("/projects")}>projects</p>
            </Link>
          </li>
          <li>
            <Link href="/blog">
              <p className={getLinkClasses("/blog")}>blog</p>
            </Link>
          </li>
          {session?.sessionId && !loading && (
            <li>
              <Link href="/" onClick={handleLogout}>
                <p className={getLinkClasses("/", true)}>logout</p>
              </Link>
            </li>
          )}
          {!session?.sessionId && !loading && (
            <li>
              <Link href="/login">
                <p className={getLinkClasses("/login")}>login</p>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
