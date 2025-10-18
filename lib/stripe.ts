/**
 * Stripe Payment Integration
 * Handles payment processing and subscription management
 */

import Stripe from 'stripe';

// Initialize Stripe (server-side only)
const stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2024-04-10' }) : null;

// Stripe product IDs (configure these in your Stripe dashboard)
export const STRIPE_PRODUCTS = {
  PRO: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_1SJd6wFbb6V4jtxGvzt9W2NY',
    productId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID || 'prod_TG9PDvsLAtzLL5',
    name: 'Pro',
    price: 3.99,
    currency: 'GBP',
    description: 'Unlimited sessions, AI insights, and more',
  },
  PREMIUM: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_1SJd6wFbb6V4jtxGvzt9W2NY',
    productId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRODUCT_ID || 'prod_TG9PDvsLAtzLL5',
    name: 'Premium',
    price: 3.99,
    currency: 'GBP',
    description: 'Everything in Pro + custom audio and priority support',
  },
};

/**
 * Create a checkout session
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        userId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Create a payment intent for one-time payments
 */
export async function createPaymentIntent(
  userId: string,
  amount: number,
  currency: string = 'usd'
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Update subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });
    return updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const customers = await stripe.customers.list({ email });
    return customers.data[0] || null;
  } catch (error) {
    console.error('Error retrieving customer:', error);
    throw error;
  }
}

/**
 * Create customer
 */
export async function createCustomer(email: string, name: string) {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name,
    });
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

