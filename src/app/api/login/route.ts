import { type NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.alternativaUsers.findFirst({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found!',
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Wrong password',
        },
        { status: 401 }
      );
    }

    const feUser = { userId: user.id, username: user.username };

    const token = jwt.sign(feUser, JWT_SECRET, { expiresIn: '3h' });
    const response = NextResponse.json({
      success: true,
      message: 'Sucesfully logged in!',
      user: feUser,
    });

    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 3, // 3h
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error!',
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
