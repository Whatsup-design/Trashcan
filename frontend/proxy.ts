import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeRole } from "@/lib/auth/normalizeRole";
import { AUTH_ROLE_COOKIE, AUTH_TOKEN_COOKIE } from "@/lib/auth/sessionConfig";

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const role = normalizeRole(req.cookies.get(AUTH_ROLE_COOKIE)?.value);
  const { pathname } = req.nextUrl;

  const isAdminPath = pathname.startsWith("/admin");
  const isUserPath = pathname.startsWith("/user");

  if (!isAdminPath && !isUserPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/error/401", req.url));
  }

  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(new URL("/error/403", req.url));
  }

  if (isUserPath && role !== "student") {
    return NextResponse.redirect(new URL("/error/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
