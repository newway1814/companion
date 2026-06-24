/** Route prefixes reachable without an authenticated session. */
const PUBLIC_PREFIXES = ["/sign-in", "/auth", "/api/health"];

/**
 * Whether a path requires an authenticated session. Everything is private by
 * default; only the sign-in, auth-callback, and health routes are public.
 */
export function isProtectedRoute(pathname: string): boolean {
  return !PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
