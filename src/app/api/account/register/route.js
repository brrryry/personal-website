import { createNewAccount } from "@/lib/accounts";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        // Validate input
        if (!username || !password) {
            return new Response(JSON.stringify({ error: "username and password are required" }), { status: 400 });
        }

        // Create a new account
        const newAccount = await createNewAccount(username, password);

        // Return the newly created account details
        return new Response(JSON.stringify(newAccount), { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({error: error.error || "registration failed"}, { status: error.status || 500 });
    }
}