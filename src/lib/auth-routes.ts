/** Route prefixes reachable without an authenticated session. */
const PUBLIC_PREFIXES = ["/sign-in", "/auth", "/api/health"];
const PUBLIC_PATHS = new Set(["/"]);

/**
 * Whether a path requires an authenticated session. Everything is private by
 * default; only the sign-in, auth-callback, and health routes are public.
 */
export function isProtectedRoute(pathname: string): boolean {
  return !(
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  );
}
