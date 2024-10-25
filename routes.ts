// Public routes that do not require authentication
export const publicRoutes: string[] = [
  "/",
  "/auth/new-verification"
];

// Authentication routes that redirect logged-in users to /settings
export const authRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password"
];

// Prefix for API authentication routes
export const apiAuthPrefix: string = "/api/auth";

// Default redirect path after logging in
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";
