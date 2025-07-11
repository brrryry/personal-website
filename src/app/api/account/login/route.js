import { authenticateAccount } from "@/lib/accounts";
import { NextResponse } from "next/server";

import { handleError, RouteError } from "@/lib/errors";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
    
        // Authenticate the account
        const account = await authenticateAccount(username, password);
    
        // Return the authenticated account details
        return NextResponse.json(account, { status: 200 });
    } catch (error) {
        let err = RouteError.fromBaseError(error, "post /api/account/login");
        return handleError(err);
    }
}

