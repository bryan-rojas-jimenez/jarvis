import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './src/lib/auth'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const path = request.nextUrl.pathname;

  // Protect root path and specific routes
  if (path === '/' || 
      path.startsWith('/dashboard') || 
      path.startsWith('/projects') || 
      path.startsWith('/tasks') ||
      path.startsWith('/audit') ||
      path.startsWith('/profile') ||
      path.startsWith('/my-tasks')) {
      
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
