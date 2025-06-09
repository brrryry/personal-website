import { logoutAccount } from "@/lib/accounts";

export async function POST(req) {
    try {
        // Parse the request body to get the session ID
        const { sessionId } = await req.json();

        // Call the logout function
        await logoutAccount(sessionId);

        // Return a success response
        return new Response(JSON.stringify({ message: "Logout successful" }), { status: 200 });
    } catch (error) {
        console.error("Logout error:", error);
        return new Response(JSON.stringify({ error: error.error || "Logout failed" }), { status: error.status || 500 });
    }
}
