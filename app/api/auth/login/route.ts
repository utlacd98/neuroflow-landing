import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';
import { checkRateLimit, validateEmail, getClientIP, generateSessionToken } from '@/lib/ddosProtection';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers as any);
    
    // Check rate limit
    const rateLimit = checkRateLimit('login', clientIP);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message: rateLimit.message || 'Too many login attempts. Please try again later.',
          remaining: rateLimit.remaining,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        {
          message: 'Invalid email or password',
          remaining: rateLimit.remaining - 1,
        },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const session = {
      token: sessionToken,
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    // Return user data (without password hash)
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Login successful',
        session,
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

