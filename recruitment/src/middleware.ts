import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if the path starts with /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check for auth_token cookie
        const token = request.cookies.get('auth_token')

        if (!token) {
            // Redirect to login page if no token
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Token exists, refresh session (sliding expiration)
        const response = NextResponse.next()
        response.cookies.set('auth_token', token.value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 // 1 hour
        })
        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
