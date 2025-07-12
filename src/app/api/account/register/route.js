import { createNewAccount } from "@/lib/accounts";
import { NextResponse } from "next/server";

import { handleError, RouteError } from "@/lib/errors";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Create a new account
    const newAccount = await createNewAccount(username, password);

    // Return the newly created account details
    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    let err = RouteError.fromBaseError(error, "post /api/account/register");
    return handleError(err);
  }
}
