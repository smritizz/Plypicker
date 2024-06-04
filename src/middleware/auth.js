import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET; // Ensure you have this in your .env.local file

export async function middleware(req) {
  const { cookies } = req;
  const token = cookies.token;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const user = jwt.verify(token, secret);
    req.user = user;
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
