/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/", 
  "/auth/new-verification",
  "realestateapi",
  "send_mail"
];

/**
 * An array of routes that are used for API calls
 * @type {string[]}
 */
export const publicApis = [
  "realestateapi",
  "send_mail"
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication puposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/client";

/**
 * The default redirect path after logging out
 * @type {string}
 */
export const ADMIN_ROUTE = "/admin";