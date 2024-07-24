import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session-token")?.value;

  if (
    !token &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    token &&
    (request.nextUrl.pathname === "/settings/profile")
  ) {
    return NextResponse.redirect(new URL("/settings/profile/general", request.url));
  }

  if (
    token &&
    (request.nextUrl.pathname === "/settings/team")
  ) {
    return NextResponse.redirect(new URL("/settings/team/tags", request.url));
  }

  if (
    token &&
    (request.nextUrl.pathname === "/" ||
      request.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/allLogs", request.url));
  }
}
export const config = {
  matcher: [
    "/allLogs",
    "/",
    "/register",
    "/changeLog/add",
    "/settings/:path*",
    "/create-project",
    "/changeLog/:path*",
  ],
};
