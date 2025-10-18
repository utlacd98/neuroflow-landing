import { NextRequest, NextResponse } from 'next/server';
import { updateUserProfile, getUserById } from '@/lib/auth';
import { checkRateLimit, getClientIP } from '@/lib/ddosProtection';

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request.headers as any);
    
    // Check rate limit
    const rateLimit = checkRateLimit('api', clientIP);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { message: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { userId, profile } = body;

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!profile || typeof profile !== 'object') {
      return NextResponse.json(
        { message: 'Profile data is required' },
        { status: 400 }
      );
    }

    // Validate profile fields
    const validFields = ['age', 'focusGoal', 'preferredMode', 'preferredFrequency', 'timezone', 'notificationsEnabled', 'theme', 'bio', 'avatar'];
    const sanitizedProfile: any = {};

    for (const [key, value] of Object.entries(profile)) {
      if (!validFields.includes(key)) {
        continue;
      }

      // Type validation
      if (key === 'age' && typeof value !== 'number') continue;
      if (key === 'focusGoal' && typeof value !== 'string') continue;
      if (key === 'preferredMode' && !['focus', 'calm', 'energize'].includes(value as string)) continue;
      if (key === 'preferredFrequency' && typeof value !== 'number') continue;
      if (key === 'timezone' && typeof value !== 'string') continue;
      if (key === 'notificationsEnabled' && typeof value !== 'boolean') continue;
      if (key === 'theme' && !['light', 'dark'].includes(value as string)) continue;
      if (key === 'bio' && typeof value !== 'string') continue;
      if (key === 'avatar' && typeof value !== 'string') continue;

      sanitizedProfile[key] = value;
    }

    // Update profile
    const updatedUser = await updateUserProfile(userId, sanitizedProfile);
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
}

