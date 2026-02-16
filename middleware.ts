import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow access to maintenance page itself
  if (request.nextUrl.pathname === '/maintenance') {
    return NextResponse.next();
  }

  // Allow access to static files and Next.js internals
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect all other traffic to maintenance page
  return NextResponse.redirect(new URL('/maintenance', request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
