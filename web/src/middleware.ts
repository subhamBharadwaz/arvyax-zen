import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/my-sessions", "/session"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route),
  );

  // Debug logging for production issues
  if (process.env.NODE_ENV === "production") {
    console.log("Middleware check:", {
      path: req.nextUrl.pathname,
      isProtected,
      hasToken: !!token,
      tokenValue: token?.value ? "present" : "missing",
    });
  }

  if (isProtected && !token) {
    console.log("Redirecting to login - no token found");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If we have a token, add it to the response headers for the page to use
  if (token) {
    const response = NextResponse.next();
    response.headers.set("x-auth-token", token.value);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-sessions/:path*", "/session/:path*"],
};
