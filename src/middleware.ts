import { jwtVerify } from 'jose';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';
import { generateSecret } from './lib/auth';

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const url = request.nextUrl.clone();
  const isPublicRoute = path === '/login';

  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return handleInvalidToken(isPublicRoute, url);
  }

  try {
    const payload = await jwtVerify(token, generateSecret(), {
      algorithms: ['HS256'],
    });
  } catch (err) {
    return handleInvalidToken(isPublicRoute, url);
  }

  // token is valid

  if (!isPublicRoute) {
    return NextResponse.next();
  }
  url.pathname = '/admin/dashboard';
  return NextResponse.redirect(url);
}

function handleInvalidToken(isPublicRoute: boolean, url: NextURL) {
  if (isPublicRoute) {
    return NextResponse.next();
  }
  url.pathname = '/';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/login', // to redirect to admin dashboard if already logged in
    '/admin/:path*', // redirect to home screen if not logged in
    '/api/admin/:path*', // protected api routes
  ],
};
