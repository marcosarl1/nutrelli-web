import { NextResponse } from 'next/server';

export function middleware(req) {

    const protectedRoutes = ['/dashboard'];

    if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
        const token = req.cookies.get('jwt_token');

        if (!token) {
            const loginUrl = new URL('/login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};