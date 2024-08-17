import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  ADMIN_ROUTE,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  publicApis,
} from "@/routes";
import { currentRole } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = await currentRole();
  const isAdminRoute = nextUrl.pathname.startsWith(ADMIN_ROUTE);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicApi = publicApis.some((route) => nextUrl.pathname.includes(route));

  if (role === UserRole.USER && isAdminRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }

  if (isPublicApi) return;

  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};