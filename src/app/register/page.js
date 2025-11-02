"use client";

import { useState } from "react";
import Link from "next/link";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypedPassword, setRetypedPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username || !password || !retypedPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== retypedPassword) {
      setError("passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      setLoading(false);

      if (data.status === "failed") {
        setError(data.reason || "registration failed due to an unknown error.");
        return;
      }

      // Redirect to login or home page
      window.location.href = "/login";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="rounded shadow-md max-w-2xl">
        <h2 className="text-2xl mb-4">Register</h2>
        <div className="mb-4">
          <label className="block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-1 border rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Retype Password</label>
          <input
            type="password"
            value={retypedPassword}
            onChange={(e) => setRetypedPassword(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#6a0dad] text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Register"}
        </button>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>

        <div className="mb-4 min-h-[24px] max-w-full">
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Register;
