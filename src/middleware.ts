import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_CONFIG } from '@/config/constants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isStaticAsset = /\.(ico|png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot)$/i.test(pathname)

  // 1. Allow Next.js internal files, login endpoint, and static assets (excluding /api/)
  if (
    pathname.startsWith('/_next') ||
    pathname === '/api/auth/login' ||
    (isStaticAsset && !pathname.startsWith('/api/'))
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(SESSION_CONFIG.cookieName)?.value
  const isValidSessionToken =
    typeof sessionToken === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionToken)

  // 2. If user is accessing /login
  if (pathname === '/login') {
    // If already authenticated with a valid session cookie, redirect to dashboard
    if (isValidSessionToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // 3. For all other routes, require an active valid session token
  if (!isValidSessionToken) {
    // If it's an API route, return 401 Unauthorized
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentification requise. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    // If it's a page route, redirect to /login with callbackUrl
    const loginUrl = new URL('/login', request.url)
    if (pathname !== '/') {
      loginUrl.searchParams.set('callbackUrl', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images / static public files (.svg, .png, .jpg, .jpeg, .gif, .webp, .ico)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
