import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_TOKEN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth-tokens'

export async function middleware(request: NextRequest) {
  // Check if the request is for an admin route (excluding login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    // Check for authentication token in cookies
    const token = request.cookies.get(ADMIN_TOKEN_COOKIE_NAME)?.value
    
    if (!token) {
      // Redirect to login page if no token found
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // For now, we'll do basic token validation
    // In production, you'd want to verify the JWT token properly
    try {
      await verifyAdminToken(token)
    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/admin/login', request.url)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.set({
        name: ADMIN_TOKEN_COOKIE_NAME,
        value: '',
        path: '/',
        maxAge: 0,
      })
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
