import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, STRIPE_PRODUCTS } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, plan, successUrl, cancelUrl } = await request.json();

    // Validate required fields
    if (!userId || !email || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the price ID for the plan
    const planKey = plan.toUpperCase() as keyof typeof STRIPE_PRODUCTS;
    if (!STRIPE_PRODUCTS[planKey]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const priceId = STRIPE_PRODUCTS[planKey].priceId;

    // Create checkout session
    const session = await createCheckoutSession(
      userId,
      email,
      priceId,
      successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

