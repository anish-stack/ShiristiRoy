import { NextRequest, NextResponse } from 'next/server';

// ─── Route config ─────────────────────────────────────────────────

// Requires valid accessToken (any logged-in user)
const PROTECTED = [
  '/dashboard',
  '/book',
  '/profile',
];

// Requires role === 'admin'
const ADMIN_ONLY = [
  '/admin',
];

// Logged-in users should not access these (redirect to dashboard)
const AUTH_ONLY = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

// ─── Helpers ──────────────────────────────────────────────────────

function matchesPrefix(pathname: string, routes: string[]) {
  return routes.some(r => pathname === r || pathname.startsWith(r + '/'));
}

/**
 * Parse accessToken + role from the Zustand persisted auth store.
 * localStorage is not available in Edge runtime — we read the same
 * data from a cookie that the client must mirror.
 *
 * On the client, write this once after login:
 *   document.cookie = `auth_token=${accessToken}; path=/; SameSite=Lax`;
 *   document.cookie = `auth_role=${user.role}; path=/; SameSite=Lax`;
 */
function getAuth(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value ?? null;
  const role  = req.cookies.get('auth_role')?.value  ?? null;
  return { token, role };
}

// ─── Middleware ───────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { token, role } = getAuth(req);

  const isAuthed = !!token;
  const isAdmin  = role === 'admin';

  // ── admin routes ────────────────────────────────────────────────
  if (matchesPrefix(pathname, ADMIN_ONLY)) {
    if (!isAuthed) return redirectToLogin(req);
    if (!isAdmin)  return NextResponse.redirect(new URL('/dashboard', req.url));
    return NextResponse.next();
  }

  // ── protected routes ────────────────────────────────────────────
  if (matchesPrefix(pathname, PROTECTED)) {
    if (!isAuthed) return redirectToLogin(req);
    return NextResponse.next();
  }

  // ── auth-only routes (login/register) ───────────────────────────
  if (matchesPrefix(pathname, AUTH_ONLY)) {
    if (isAuthed) {
      const next = req.nextUrl.searchParams.get('next') ?? '/dashboard';
      return NextResponse.redirect(new URL(next, req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

// ─── Matcher ──────────────────────────────────────────────────────
// Only run middleware on relevant paths — skip _next, static, api

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets|fonts|icons|images|api/).*)',
  ],
};