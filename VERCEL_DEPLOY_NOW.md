# 🚀 Deploy to Vercel - Quick Start

## ✅ You Chose Vercel!

**Why Vercel?**
- ✅ Free tier
- ✅ Perfect for Next.js
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Deploy in 10 minutes
- ✅ Keep your focusync.uk domain

---

## 📋 5-Step Deployment (10 minutes)

### Step 1: Create Vercel Account (2 minutes)

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel
5. Done!

---

### Step 2: Import Your Repository (2 minutes)

1. In Vercel dashboard, click "Add New..."
2. Select "Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL:
   ```
   https://github.com/YOUR_USERNAME/neuroflow-landing
   ```
5. Click "Import"

---

### Step 3: Add Environment Variables (2 minutes)

1. In Vercel project settings, go to "Environment Variables"
2. Add these variables:

```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
NEXT_PUBLIC_OPENAI_API_KEY=your_key
NEXT_PUBLIC_APP_URL=https://focusync.uk
```

**Get Stripe keys from:** https://dashboard.stripe.com/apikeys

3. Click "Save"

---

### Step 4: Deploy (1 minute)

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. You'll get a temporary URL like: `focusync-xyz.vercel.app`

---

### Step 5: Connect Your Domain (3 minutes)

1. In Vercel, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter: `focusync.uk`
4. Click "Add"
5. Vercel shows you 4 nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
6. Copy these

---

## 🌐 Step 6: Update IONOS Nameservers (5 minutes)

1. Go to: https://my.ionos.co.uk/
2. Click "Domains & SSL"
3. Select "focusync.uk"
4. Click "Nameserver" tab (NOT DNS tab)
5. Click "Change nameserver"
6. Select "Use custom nameservers"
7. Enter the 4 Vercel nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
8. Click "Save"

---

## ⏳ Step 7: Wait for DNS Propagation (24-48 hours)

1. Check: https://www.whatsmydns.net/
2. Enter: focusync.uk
3. Wait until all entries show Vercel's IP
4. Usually takes 24-48 hours

---

## 🧪 Step 8: Test Before DNS is Ready

**Use Vercel Temporary URL:**
1. Visit: `https://focusync-xyz.vercel.app` (your temp URL)
2. Test on desktop
3. Test on mobile
4. Test camera tracking
5. Test paywall
6. Test free tier limit

---

## ✅ Step 9: Test After DNS is Ready

**Once DNS propagates:**
1. Visit: `https://focusync.uk`
2. Should load your app
3. Lock icon should appear (HTTPS)
4. Test all features
5. Test on mobile

---

## 📱 Mobile Testing Checklist

- [ ] Camera permission prompt appears
- [ ] Camera feed displays
- [ ] Activity detection works
- [ ] Audio responds to movement
- [ ] Free users see 3 session limit
- [ ] After 3 sessions, upgrade prompt appears
- [ ] Upgrade button works
- [ ] Stripe checkout loads
- [ ] Test payment works
- [ ] Subscription updates

---

## 🎯 Admin Test Accounts

```
Owner:
  Email: owner@focusync.app
  Password: Owner@123456

Admin 1:
  Email: admin1@focusync.app
  Password: Admin@123456

Admin 2:
  Email: admin2@focusync.app
  Password: Admin@123456
```

---

## 💳 Stripe Test Card

```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

---

## 🆘 Troubleshooting

### DNS Not Resolving
```
1. Check: https://www.whatsmydns.net/
2. Wait 24-48 hours
3. Clear browser cache
4. Try incognito mode
```

### HTTPS Not Working
```
1. Wait 5-10 minutes for SSL cert
2. Check Vercel dashboard
3. Verify domain is connected
4. Try different browser
```

### App Not Loading
```
1. Check Vercel build logs
2. Verify environment variables
3. Check for deployment errors
4. Try Vercel temp URL first
```

### Camera Not Working
```
1. Check browser permissions
2. Allow camera access
3. Try different browser
4. Check mobile device camera
```

### Paywall Not Working
```
1. Check Stripe API keys
2. Verify subscription system
3. Check browser console
4. Test with admin account
```

---

## 📊 Timeline

| Step | Time | Status |
|------|------|--------|
| Create Vercel account | 2 min | ⏳ Do Now |
| Import repository | 2 min | ⏳ Do Now |
| Add environment variables | 2 min | ⏳ Do Now |
| Deploy | 1 min | ⏳ Do Now |
| Connect domain | 3 min | ⏳ Do Now |
| Update IONOS | 5 min | ⏳ Do Now |
| Wait for DNS | 24-48 hrs | ⏳ Wait |
| Test | 30 min | ⏳ After DNS |
| **Total** | **~1 day** | ✅ Live! |

---

## ✨ Summary

**You're about to:**
1. Deploy to Vercel (free)
2. Connect focusync.uk domain
3. Get automatic SSL
4. Go live in ~1 day!

**Start with Step 1 now!**

---

## 🚀 Ready?

**Go to:** https://vercel.com

**Sign up and start deploying!**

I'll be here if you need help! 🎉

---

**Status**: ✅ **READY FOR VERCEL DEPLOYMENT**

Let's launch FOCUSYNC! 🚀✨

