import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, stripe } from '@/lib/stripe';
import { upgradeSubscription } from '@/lib/subscription';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;

        if (userId && session.subscription) {
          // Get subscription details
          const subscription = await stripe?.subscriptions.retrieve(session.subscription);
          
          // Determine tier based on price ID
          let tier: 'pro' | 'premium' = 'pro';
          if (subscription?.items.data[0]?.price?.id?.includes('premium')) {
            tier = 'premium';
          }

          // Upgrade user subscription
          upgradeSubscription(userId, tier);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;

        if (userId) {
          // Determine tier based on price ID
          let tier: 'pro' | 'premium' = 'pro';
          if (subscription.items.data[0]?.price?.id?.includes('premium')) {
            tier = 'premium';
          }

          // Update user subscription
          upgradeSubscription(userId, tier);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;

        if (userId) {
          // Downgrade to free tier
          upgradeSubscription(userId, 'free');
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        // Handle successful payment
        console.log('Payment succeeded:', event.data.object);
        break;
      }

      case 'invoice.payment_failed': {
        // Handle failed payment
        console.log('Payment failed:', event.data.object);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}

