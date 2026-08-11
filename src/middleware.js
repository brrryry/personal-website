import { NextResponse } from "next/server";

const DELETED_ACTION_IDS = ["cba9cd97b02946710aa04fdccbf85fb6b7d087d3"]; //someone was trying to login/logout of the account system after I removed it...

export function middleware(request) {
  const nextActionId = request.headers.get("next-action");
  if (nextActionId) {
    //these bots are trying to call action functions directly smh
    if (nextActionId.length < 10 || DELETED_ACTION_IDS.includes(nextActionId)) {
      return new NextResponse("Malformed Action ID", { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
