"use client";

import Link from "next/link";
import { useSession } from "@/components/SessionContext";

const Login = () => {
  const { login, session, loading } = useSession();

  if (session) {
    // If the user is already logged in, redirect to home page
    window.location.href = "/";
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    //get username and password
    const username = event.target[0].value;
    const password = event.target[1].value;

    //validate username and password
    try {
      if (await login(username, password)) {
        // go back to previous page or home page after successful login
        const previousPage = document.referrer || "/";

        // Redirect to the previous page or home page
        window.location.href = previousPage;
      }
    } catch (err) {
      //console.error("Login failed:", err);
      // Show error message to user
      const errorElement = document.querySelector(".text-red-300");
      if (errorElement) {
        errorElement.classList.remove("hidden");
        errorElement.textContent = err.reason;
      }
    }
  };

  return (
    <div className="space-y-5 justify-center items-center flex flex-col">
      <h2>Login</h2>
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="bg-gray-300 border p-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-gray-300 border p-2 rounded text-black"
        />
        <button type="submit" className="bg-[#6a0dad] text-white p-2 rounded">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <p>
        Need an account? <Link href="/register">Register</Link>
      </p>
      <p className="text-red-300 hidden">This is an error message</p>
    </div>
  );
};

export default Login;
