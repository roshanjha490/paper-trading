import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    return NextResponse.redirect(new URL('/login', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/api/auth/signin',
}