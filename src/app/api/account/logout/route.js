import { logoutAccount } from "@/lib/accounts";

import { handleError, RouteError } from "@/lib/errors";
import { NextResponse } from "../../../../../node_modules/next/server";

export async function POST(req) {
  try {
    // Parse the request body to get the session ID
    const { sessionId } = await req.json();

    // Call the logout function
    await logoutAccount(sessionId);

    // Return a success response
    return NextResponse.json(
      { message: "logged out successfully" },
      { status: 200 },
    );
  } catch (error) {
    let err = RouteError.fromBaseError(error, "post /api/account/logout");
    return handleError(err);
  }
}
