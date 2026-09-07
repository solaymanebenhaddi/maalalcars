import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_CONFIG } from '@/config/constants'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Allow Next.js internal files and static assets with extensions (.png, .ico, .svg, etc.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(SESSION_CONFIG.cookieName)?.value

  // 2. If user is accessing /login
  if (pathname === '/login') {
    // If already authenticated with a session cookie, redirect to dashboard
    if (sessionToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // 3. For all other routes, require an active session cookie
  if (!sessionToken) {
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
