import { NextResponse } from 'next/server';

export async function GET() {
  // Create response
  const response = NextResponse.json({ success: true });

  // Clear the auth cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    expires: new Date(0),
    path: '/',
  });

  return response;
}
