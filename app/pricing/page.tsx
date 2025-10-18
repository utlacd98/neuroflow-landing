'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'Forever',
    description: 'Perfect for getting started',
    features: [
      '3 sessions per day',
      '30 minute session limit',
      'Basic audio modes',
      'Session history (10 max)',
      'Community support',
    ],
    notIncluded: [
      'AI insights',
      'Advanced analytics',
      'Custom audio',
      'Data export',
      'Priority support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '£3.99',
    period: 'per month',
    description: 'For serious focus enthusiasts',
    features: [
      'Unlimited daily sessions',
      '2 hour session limit',
      'All audio modes',
      'Unlimited session history',
      'AI-powered insights',
      'Advanced analytics',
      'Data export (JSON/CSV)',
      'Email support',
    ],
    notIncluded: [
      'Custom audio creation',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '£3.99',
    period: 'per month',
    description: 'For power users',
    features: [
      'Everything in Pro',
      'Unlimited session duration',
      'Custom audio creation',
      'Advanced AI coaching',
      'Frequency personalization',
      'Priority support (24/7)',
      'Early access to new features',
      'Custom integrations',
    ],
    notIncluded: [],
    cta: 'Upgrade to Premium',
    highlighted: false,
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleUpgrade = (planName: string) => {
    // In a real app, this would redirect to Stripe checkout
    console.log(`Upgrading to ${planName}`);
    // window.location.href = `/api/checkout?plan=${planName.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Choose the perfect plan for your focus journey
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingCycle === 'annual'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full flex flex-col ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-teal-900/50 to-emerald-900/50 border-teal-500/50 ring-2 ring-teal-500/30'
                    : 'bg-slate-800/50 border-slate-700'
                } p-8`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full mb-8 font-semibold ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 flex-1">
                  <p className="font-semibold text-sm text-slate-300 mb-4">Included:</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}

                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="font-semibold text-sm text-slate-400 mt-6 mb-4">Not included:</p>
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-start gap-3 opacity-50">
                          <span className="text-slate-500 text-sm">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, start with our Free plan and upgrade whenever you\'re ready. No credit card required.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) via Stripe.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely! Cancel your subscription anytime with no questions asked. Your data remains yours.',
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 p-6">
                <h3 className="font-semibold text-lg mb-2 text-teal-400">{faq.q}</h3>
                <p className="text-slate-300">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

