import { getAccountByUsername } from "@/lib/accounts";
import { getUserComments } from "@/lib/comments";
import { NextResponse } from "next/server";

import { handleError, RouteError } from "@/lib/errors";

export async function GET(req, { params }) {
    try {
        // Extract the account ID from the dynamic route parameter
        const { id } = params;

        // Fetch the account details
        const account = await getAccountByUsername(id);

        // Fetch user comments
        const comments = await getUserComments(id);

        // Return the account details along with comments
        return NextResponse.json({ account, comments }, { status: 200 });
    } catch (error) {
        // Handle errors and return a response
        let err = RouteError.fromBaseError(error, "get /api/account/[id]");
        return handleError(err);
    }
}
