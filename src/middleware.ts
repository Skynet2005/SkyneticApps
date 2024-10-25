// src/middleware.ts

import NextAuth from "next-auth";
import createMiddleware from 'next-intl/middleware';
import { routing } from "./i18n/routing";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

// Initialize middlewares
const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

// Define authentication middleware
const authMiddleware = auth((req: any, ctx: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

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
    return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }
});

// Main middleware function
const middleware = (req: any, ctx: any) => {
  const { nextUrl } = req;
  const isApiRoute = nextUrl.pathname.startsWith('/api') || nextUrl.pathname.startsWith('/trpc');

  if (!isApiRoute) {
    const intlResponse = intlMiddleware(req);
    if (intlResponse) return intlResponse;
  }

  return authMiddleware(req, ctx);
};

export default middleware;

// Configuration for middleware matcher
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/(de|en|es|pt|tr)/:path*'
  ]
};
