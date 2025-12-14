import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "./server/better-auth/server";

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We will still be handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: [
    // This will run the middleware on all routes
    // EXCEPT /sign-in, /_next, /api, /static, and /favicon.ico
    "/((?!sign-in|_next|api|static|favicon.ico).*)",
  ],
};
