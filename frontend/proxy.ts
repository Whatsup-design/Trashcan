import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { normalizeRole } from "@/lib/auth/normalizeRole";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const role = normalizeRole(req.cookies.get("auth_role")?.value);
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
