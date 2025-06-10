import { getAccountBySessionId } from "@/lib/accounts";

export async function POST(req) {
    try {
        // Parse the request body to get the session ID
        const { sessionId } = await req.json();
    

        // Validate sessionId
        if (!sessionId || typeof sessionId !== 'string') {
            return new Response(JSON.stringify({ error: "Invalid session ID" }), { status: 400 });
        }
    
        // Get account details by session ID
        const account = await getAccountBySessionId(sessionId);
    
        // Return the account details
        return new Response(JSON.stringify(account), { status: 200 });
    } catch (error) {
        console.error("Error fetching account:", error);
        return new Response(JSON.stringify({ error: error.error || "Failed to fetch account" }), { status: error.status || 500 });
    }
}