import { getAccountByUsername } from "@/lib/accounts";
import { getUserComments } from "@/lib/comments";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        // Extract the account ID from the dynamic route parameter
        const { id } = params;

        // Validate account ID
        if (!id) {
            return NextResponse.json({ error: "account username is required" }, { status: 400 });
        }

        // Fetch the account details
        const account = await getAccountByUsername(id);

        // Fetch user comments
        const comments = await getUserComments(id);

        // Return the account details along with comments
        return NextResponse.json({ account, comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching account:", error);
        return NextResponse.json({ error: error.error || "failed to fetch account" }, { status: error.status || 500 });
    }
}
