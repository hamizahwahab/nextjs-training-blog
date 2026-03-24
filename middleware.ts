import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const protectedRoutes = ["/add"];
  
  const isProtectedRoute = protectedRoutes.some(
    route => request.nextUrl.pathname === route
  );
  
  const isEditRoute = request.nextUrl.pathname.includes("/edit");
  
  if ((isProtectedRoute || isEditRoute) && !request.cookies.has("blog_user")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/add/:path*", "/post/:path*/edit"],
};
