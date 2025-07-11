import { getAccountBySessionId } from "@/lib/accounts";
import { handleError, RouteError } from "@/lib/errors";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the request body to get the session ID
        const { sessionId } = await req.json();
    
        // Get account details by session ID
        const account = await getAccountBySessionId(sessionId);
    
        // Return the account details
        return NextResponse.json(account, { status: 200 });
    } catch (error) {
        let err = RouteError.fromBaseError(error, "post /api/account/session");
        return handleError(err);
    }
}