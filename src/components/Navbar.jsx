"use client"

import Link from "next/link";
import { useState } from "react";
import { useSession } from "./SessionContext";

const Navbar = () => {
  const { session, loading, logout } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <nav className="bg-transparent p-0 h-auto md:h-32 flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex justify-between items-center w-full py-4 md:py-0 md:w-auto">
        <Link href="/" className="flex items-center p-0 mx-0">
          <p className="text-2xl text-purple-200 font-bold whitespace-nowrap mx-0">bryan chan.</p>
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-purple-200 text-3xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`flex-col px-4 space-y-2 md:hidden ${mobileOpen ? "flex" : "hidden"}`}>
        <Link href="/" className="flex items-center">
          <p className="text-2xl text-purple-200 font-bold">-- home</p>
        </Link>
        <Link href="/Chan_Bryan_Resume.pdf" target="_blank" className="flex items-center">
          <p className="text-2xl text-purple-200 font-bold">-- resume</p>
        </Link>
        <Link href="/projects" className="flex items-center">
          <p className="text-2xl text-purple-200 font-bold">-- projects</p>
        </Link>
        <Link href="/blog" className="flex items-center">
          <p className="text-2xl text-purple-200 font-bold">-- blog</p>
        </Link>
        {session?.sessionId && !loading && (
          <Link href="/" onClick={handleLogout} className="flex items-center">
            <p className="text-2xl text-purple-200 font-bold">-- logout</p>
          </Link>
        )}
        {!session?.sessionId && !loading && (
          <Link href="/login" className="flex items-center">
            <p className="text-2xl text-purple-200 font-bold">-- login</p>
          </Link>
        )}
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 px-4">
        <li>
          <Link href="/">
            <p className="text-2xl text-purple-200 font-bold">home</p>
          </Link>
        </li>
        <li>
          <Link href="/Chan_Bryan_Resume.pdf" target="_blank">
            <p className="text-2xl text-purple-200 font-bold">resume</p>
          </Link>
        </li>
        <li>
          <Link href="/projects">
            <p className="text-2xl text-purple-200 font-bold">projects</p>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <p className="text-2xl text-purple-200 font-bold">blog</p>
          </Link>
        </li>
        {session?.sessionId && !loading && (
          <li>
            <Link href="/" onClick={handleLogout}>
              <p className="text-2xl text-purple-200 font-bold">logout</p>
            </Link>
          </li>
        )}
        {!session?.sessionId && !loading && (
          <li>
            <Link href="/login">
              <p className="text-2xl text-purple-200 font-bold">login</p>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
