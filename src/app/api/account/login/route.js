import { authenticateAccount } from "@/lib/accounts";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
    
        // Validate input
        if (!username || !password) {
        return new Response(JSON.stringify({ error: "Username and password are required" }), { status: 400 });
        }
    
        // Authenticate the account
        const account = await authenticateAccount(username, password);
    
        // Return the authenticated account details
        return new Response(JSON.stringify(account), { status: 200 });
    } catch (error) {
        console.error("Authentication error:", error);
        return new Response(JSON.stringify({ error: error.error || "Authentication failed" }), { status: error.status || 500 });
    }
}