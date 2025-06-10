import { authenticateAccount } from "@/lib/accounts";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
    
        // Validate input
        if (!username || !password) {
        return new Response(JSON.stringify({ error: "username and password are required" }), { status: 400 });
        }
    
        // Authenticate the account
        const account = await authenticateAccount(username, password);
    
        // Return the authenticated account details
        return new Response(JSON.stringify(account), { status: 200 });
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ error: error.error || "authentication failed" }, { status: error.status || 500 });
    }
}