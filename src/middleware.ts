import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value;

  // If there's no token and the request is to a page that should be public, allow access
  if (!token && (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/register")) {
    return NextResponse.next();
  }

  // If there's no token and the request is to a restricted page, redirect to home
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle token-based redirections
  if (token) {
    const path = request.nextUrl.pathname;

    if (path === "/settings/profile") {
      return NextResponse.redirect(new URL("/settings/profile/general", request.url));
    }

    if (path === "/settings/account") {
      return NextResponse.redirect(new URL("/settings/account/tags", request.url));
    }

    if (path === "/settings/team") {
      return NextResponse.redirect(new URL("/settings/team/general", request.url));
    }

    if (path === "/" || path === "/register") {
      return NextResponse.redirect(new URL("/allLogs", request.url));
    }
  }
  
  // Allow the request to proceed if none of the conditions matched
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/allLogs",
    "/feedback/:path*",
    "/allPosts",
    "/",
    "/register",
    "/changeLog/:path*",
    "/settings/:path*",
    "/create-team",
    "/roadmap",
    "/roadmap/:path*",
  ],
};
