import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SECRET_KEY || "has-super-secret-key-production-2026"
);

const COOKIE_NAME = "has_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes protégées par rôle
  const isAdminRoute = pathname.startsWith("/admin");
  const isProfRoute = pathname.startsWith("/professeur");
  const isEtudiantRoute = pathname.startsWith("/etudiant");

  if (!isAdminRoute && !isProfRoute && !isEtudiantRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const roleId = payload.roleId as number;

    // 1 = admin, 2 = enseignant, 3 = etudiant
    if (isAdminRoute && roleId !== 1) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isProfRoute && roleId !== 2) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isEtudiantRoute && roleId !== 3) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/professeur/:path*",
    "/etudiant/:path*",
  ],
};
