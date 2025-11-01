// export { auth as middleware } from "@/auth";
import { auth } from "@/auth";

export default auth((req) => {
  const { auth } = req;
  const { pathname } = req.nextUrl;

  // List of public pages that don't require authentication
  const publicPages = [
    "/",
    "/login",
    "/signup",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/blog",
    "/blog/(.*)",
    "/jobs",
    "/opengraph-image",
    "/sentry-example-page",
  ];
  const isPublicPage =
    publicPages.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/jobs/") ||
    pathname.startsWith("/opengraph-image");

  // If it's not a public page and user isn't authenticated
  if (!auth && !isPublicPage) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: [
    // "/((?!api|_next|.*\\..*).*)",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/admin-dashboard",
    "/company-dashboard",
    "/student-dashboard",
    "/admin-dashboard/:path*",
    "/company-dashboard/:path*",
    "/student-dashboard/:path*",
  ],
};
