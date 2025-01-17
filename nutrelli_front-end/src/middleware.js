import { NextResponse } from 'next/server';
import { verifyAuth } from "@/services/loginService";
import { cookies } from "next/headers";

const PUBLIC_ROUTES = ['/']; // Apenas a rota raiz é pública

const isPublicRoute = (url) => PUBLIC_ROUTES.some((page) => page.startsWith(url));

export default async function middleware(req) {
    const { value: token } = (await cookies()).get("jwt_token") ?? { value: null };

    const isValidToken = token && (await verifyAuth(token));
    const isPublicRouteReq = isPublicRoute(req.nextUrl.pathname);

    // Se a rota for pública, permita o acesso
    if (isPublicRouteReq) {
        return NextResponse.next();
    }

    // Se o token for válido e o usuário tentar acessar /login, redirecione para /dashboard
    if (isValidToken && req.nextUrl.pathname === '/login') {
        const redirectUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Se o token não for válido e a rota não for pública, redirecione para /login
    if (!isValidToken && req.nextUrl.pathname !== '/login') {
        const redirectUrl = new URL('/login', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Se o token for válido e o usuário estiver em /dashboard, permita o acesso
    if (isValidToken && req.nextUrl.pathname === '/dashboard') {
        return NextResponse.next();
    }

    // Se o token for válido e o usuário não estiver em /dashboard, redirecione para /dashboard
    if (isValidToken && req.nextUrl.pathname !== '/dashboard') {
        const redirectUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // Permita o acesso para outras rotas válidas
    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/dashboard/:path*'],
};