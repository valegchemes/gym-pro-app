import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-dev-only')

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value

    const { pathname } = request.nextUrl

    // Define public routes
    const isPublicRoute =
        pathname === '/login' ||
        pathname === '/register' ||
        pathname === '/verify' ||
        pathname.startsWith('/api/auth')

    if (isPublicRoute) {
        // If user is already logged in, redirect away from login/register
        if (token && pathname !== '/verify') {
            try {
                await jwtVerify(token, JWT_SECRET)
                return NextResponse.redirect(new URL('/', request.url))
            } catch (e) {
                // Token invalid, continue to public route
            }
        }
        return NextResponse.next()
    }

    // Check for token on protected routes
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)

        // Admin route protection
        if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url))
        }

        return NextResponse.next()
    } catch (err) {
        // Session expired or invalid
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('auth-token')
        return response
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
}
