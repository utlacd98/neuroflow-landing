# 🎯 Stripe Setup Guide for FOCUSYNC

## ✅ Your Stripe Configuration

### Product Information
- **Product ID**: `prod_TG9PDvsLAtzLL5`
- **Price ID**: `price_1SJd6wFbb6V4jtxGvzt9W2NY`
- **Plan**: Pro
- **Price**: £3.99 per month
- **Currency**: GBP (British Pounds)

---

## 📋 What You Need to Do

### Step 1: Get Your Stripe API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)
3. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### Step 2: Update .env.local
Edit `.env.local` and add your keys:
```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

### Step 3: Create Premium Product (Optional)
If you want to offer Premium tier (£7.99/month):
1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Name: "Premium"
4. Price: £7.99/month
5. Copy the Price ID
6. Update `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PREMIUM_PRODUCT_ID=prod_YOUR_PREMIUM_ID
   NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_YOUR_PREMIUM_PRICE_ID
   ```

### Step 4: Setup Webhook (For Production)
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the Signing Secret
6. Update `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
   ```

---

## 🧪 Testing Locally

### Without Real Payments
1. Pricing page shows £3.99 and £7.99
2. Checkout button is ready
3. Stripe integration is configured
4. No real charges will occur

### With Test Payments
1. Use Stripe test cards: https://stripe.com/docs/testing
2. Test card: `4242 4242 4242 4242`
3. Any future date for expiry
4. Any 3-digit CVC

---

## 🚀 Deployment Checklist

### Before Going Live
- [ ] Get live Stripe API keys
- [ ] Update `.env.local` with live keys (sk_live_, pk_live_)
- [ ] Create Premium product if needed
- [ ] Setup webhook with live URL
- [ ] Test payment flow with real card
- [ ] Verify subscription updates work
- [ ] Test cancellation flow

### Environment Variables for Production
```
STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 📊 Current Pricing

| Plan | Price | Features |
|------|-------|----------|
| Free | £0 | 3 sessions/day, 30 min limit |
| Pro | £3.99/mo | 20 sessions/day, 2 hour limit, AI insights |
| Premium | £7.99/mo | Unlimited, all features |

---

## 🔗 Useful Links

- **Stripe Dashboard**: https://dashboard.stripe.com
- **API Keys**: https://dashboard.stripe.com/apikeys
- **Products**: https://dashboard.stripe.com/products
- **Webhooks**: https://dashboard.stripe.com/webhooks
- **Test Cards**: https://stripe.com/docs/testing
- **Documentation**: https://stripe.com/docs

---

## 🆘 Troubleshooting

### Checkout Not Working
- Check API keys are correct
- Verify price ID exists in Stripe
- Check browser console for errors
- Ensure NEXT_PUBLIC_APP_URL is set

### Webhook Not Firing
- Verify webhook URL is correct
- Check webhook signing secret
- Ensure endpoint is publicly accessible
- Check Stripe webhook logs

### Subscription Not Updating
- Check webhook is receiving events
- Verify webhook signature verification
- Check browser console for errors
- Check server logs

---

## 📝 Current Configuration

### .env.local
```
# Pro Plan (£3.99/month)
NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID=prod_TG9PDvsLAtzLL5
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1SJd6wFbb6V4jtxGvzt9W2NY

# Premium Plan (£7.99/month) - Create in Stripe
NEXT_PUBLIC_STRIPE_PREMIUM_PRODUCT_ID=prod_premium
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_premium_monthly

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✨ You're All Set!

Your Stripe integration is ready to go. Just add your API keys and you're ready to accept payments! 🎉

**Status**: ✅ **READY FOR TESTING**

**Next Step**: Add your Stripe API keys to `.env.local`

