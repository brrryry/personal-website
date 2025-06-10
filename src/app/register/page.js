"use client"

import { useState } from "react"
import Link from "next/link";


const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const [error, setError] = useState("");
    
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
        const response = await fetch("/api/account/register", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
    

        const data = await response.json();

        if (!response.ok) {;
            throw new Error(data.error || "failed to register");
        }
    
        // Redirect to login or home page
        window.location.href = "/login";
        } catch (error) {
            setError(error.message);
        }
    };
    
    return (
        <div className="flex justify-center items-center p-4">
        <form onSubmit={handleSubmit} className="rounded shadow-md">
            <h2 className="text-2xl mb-4">register</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
            <label className="block mb-2">username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-1 border rounded text-black"
                required
            />
            </div>
            <div className="mb-4">
            <label className="block mb-1">password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
            />
            </div>
            <div className="mb-4">
            <label className="block mb-1">retype password</label>
            <input
                type="password"
                value={retypedPassword}
                onChange={(e) => setRetypedPassword(e.target.value)}
                className="w-full p-2 border rounded text-black"
                required
            />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Register
            </button>
            <p>already have an account? <Link href="/login">login</Link></p>
        </form>
        </div>
    );
}

export default Register;