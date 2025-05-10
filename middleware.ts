import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request })
	const isAuthenticated = !!token

	// Define protected routes
	const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

	// Define auth routes
	const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

	// Redirect authenticated users away from auth pages
	if (isAuthRoute && isAuthenticated) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	// Redirect unauthenticated users away from protected pages
	if (isProtectedRoute && !isAuthenticated) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/dashboard/:path*', '/login'],
}
