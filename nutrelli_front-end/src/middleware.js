import { NextResponse } from "next/server";
import { authenticate } from "@/services/loginService";

export async function middleware(req) {

    if (process.env.NODE_ENV === 'development') {
        return NextResponse.next();
    }

    const jwtToken = req.cookies.get('jwt_token');
    const {pathname} = req.nextUrl;

    const protectedRoutes = ['/dashboard'];
    const publicRoutes = ['/', '/login'];

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);

    if (jwtToken) {
        const isValid = await authenticate(jwtToken.value);
        if (!isValid && isProtectedRoute) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        if (isValid && isPublicRoute) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    } else if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [ '/login','/dashboard/:path*'],
};