import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { checkRateLimit, validateEmail, validatePasswordStrength, getClientIP, generateSessionToken } from '@/lib/ddosProtection';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers as any);
    
    // Check rate limit
    const rateLimit = checkRateLimit('signup', clientIP);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          message: rateLimit.message || 'Too many signup attempts. Please try again later.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check password strength
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        {
          message: 'Password is not strong enough',
          feedback: passwordCheck.feedback,
        },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(email, password, name);
    if (!user) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 409 }
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
        message: 'Account created successfully',
        session,
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}

