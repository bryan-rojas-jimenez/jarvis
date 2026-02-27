import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './src/lib/auth'

export async function middleware(request: NextRequest) {
  // Check if session exists
  const session = request.cookies.get('session')?.value
  
  // Protect specific routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/projects') || 
      request.nextUrl.pathname.startsWith('/tasks')) {
      
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Refresh session if active
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
