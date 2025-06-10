import {getAccountByUsername } from "@/lib/accounts";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Extract the account ID from the request URL
        const url = new URL(req.url);
        const accountId = url.searchParams.get("id");

        // Validate account ID
        if (!accountId) {
            return NextResponse.json({ error: "account username is required" }, { status: 400 });
        }

        // Fetch the account details
        const account = await getAccountByUsername(accountId);




        // Return the account details
        return NextResponse.json(account, { status: 200 });
    } catch (error) {
        console.error("Error fetching account:", error);
        return NextResponse.json({ error: error.error || "failed to fetch account" }, { status: error.status || 500 });
    }
}