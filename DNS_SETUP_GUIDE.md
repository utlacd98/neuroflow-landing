# 🌐 DNS Setup Guide for focusync.uk

## ✅ Your Domain Information
- **Domain**: focusync.uk
- **Registrar**: IONOS
- **Status**: Ready for DNS configuration

---

## 🎯 DNS Setup Options

### Option 1: Deploy to Vercel (Recommended - Easiest)

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic SSL/HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Easy deployment
- ✅ Perfect for Next.js

**Steps:**

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub/Google
   - Import your repository

2. **Deploy Your App**
   - Connect your GitHub repo
   - Click "Deploy"
   - Vercel builds and deploys automatically

3. **Connect Domain to Vercel**
   - In Vercel dashboard, go to Settings → Domains
   - Add domain: `focusync.uk`
   - Vercel shows you the nameservers to use

4. **Update IONOS Nameservers**
   - Go to IONOS DNS settings (where you are now)
   - Click "Nameserver" tab
   - Replace current nameservers with Vercel's:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ns3.vercel-dns.com
     ns4.vercel-dns.com
     ```
   - Save changes
   - Wait 24-48 hours for DNS propagation

5. **Verify Domain**
   - Vercel will verify automatically
   - You'll get HTTPS certificate
   - Your app is live at https://focusync.uk

---

### Option 2: Deploy to Netlify

**Steps:**

1. **Create Netlify Account**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Deploy Your App**
   - Connect your GitHub repo
   - Click "Deploy"

3. **Connect Domain**
   - In Netlify, go to Domain settings
   - Add domain: `focusync.uk`
   - Get Netlify nameservers

4. **Update IONOS Nameservers**
   - Go to IONOS DNS settings
   - Click "Nameserver" tab
   - Replace with Netlify nameservers
   - Save and wait 24-48 hours

---

### Option 3: Deploy to Your Own Server

**If you have a VPS/Server:**

1. **Get Your Server IP**
   - From your hosting provider
   - Example: `123.45.67.89`

2. **Update IONOS A Record**
   - Go to IONOS DNS settings (DNS tab)
   - Find the "A" record with value `217.160.0.253`
   - Click edit (pencil icon)
   - Change VALUE to your server IP: `123.45.67.89`
   - Save

3. **Add www Subdomain**
   - Click "Add record"
   - Type: A
   - Host name: www
   - Value: `123.45.67.89`
   - Save

4. **Setup SSL Certificate**
   - Use Let's Encrypt (free)
   - Or buy from IONOS

5. **Deploy Your App**
   - SSH into your server
   - Clone your repository
   - Install dependencies: `npm install`
   - Build: `npm run build`
   - Start: `npm run start`
   - Use PM2 to keep it running

---

## 🚀 Recommended: Vercel Setup (Step-by-Step)

### Step 1: Create Vercel Account (2 minutes)
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Your Project (2 minutes)
1. In Vercel dashboard, click "Add New..."
2. Select "Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL
5. Click "Import"

### Step 3: Configure Environment Variables (2 minutes)
1. In Vercel project settings, go to "Environment Variables"
2. Add your variables:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   NEXT_PUBLIC_OPENAI_API_KEY=your_key
   NEXT_PUBLIC_APP_URL=https://focusync.uk
   ```
3. Click "Save"

### Step 4: Deploy (1 minute)
1. Click "Deploy"
2. Wait for build to complete
3. You'll get a temporary URL like `focusync-xyz.vercel.app`

### Step 5: Connect Your Domain (5 minutes)
1. In Vercel, go to Settings → Domains
2. Enter: `focusync.uk`
3. Click "Add"
4. Vercel shows nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```

### Step 6: Update IONOS Nameservers (5 minutes)
1. Go to https://my.ionos.co.uk/
2. Click "Domains & SSL"
3. Select `focusync.uk`
4. Click "Nameserver" tab
5. Click "Change nameserver"
6. Select "Use custom nameservers"
7. Enter Vercel nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ```
8. Click "Save"

### Step 7: Wait for DNS Propagation (24-48 hours)
- DNS changes take time to propagate
- Check status: https://www.whatsmydns.net/
- Enter: `focusync.uk`
- Wait until all green

### Step 8: Verify & Test (5 minutes)
1. Visit https://focusync.uk
2. Your app should load
3. Test all features
4. Test on mobile

---

## 📱 Testing on Mobile

### Before DNS is Ready
1. Get your Vercel temporary URL (e.g., `focusync-xyz.vercel.app`)
2. Visit on mobile: `https://focusync-xyz.vercel.app`
3. Test camera tracking
4. Test paywall

### After DNS is Ready
1. Visit: `https://focusync.uk`
2. Test camera tracking
3. Test paywall
4. Test all features

---

## 🔐 SSL/HTTPS

### Vercel (Automatic)
- ✅ Automatic SSL certificate
- ✅ HTTPS enabled by default
- ✅ Auto-renewal

### Netlify (Automatic)
- ✅ Automatic SSL certificate
- ✅ HTTPS enabled by default
- ✅ Auto-renewal

### Your Own Server
- Use Let's Encrypt (free)
- Or buy from IONOS

---

## 🧪 Testing Checklist

### Before Going Live
- [ ] App builds successfully
- [ ] All pages load
- [ ] Admin login works
- [ ] Free tier limit works (3 sessions)
- [ ] Upgrade button works
- [ ] Stripe checkout works (test card)
- [ ] Camera tracking works on mobile
- [ ] Paywall blocks free users

### After DNS is Ready
- [ ] Domain resolves: `focusync.uk`
- [ ] HTTPS works: `https://focusync.uk`
- [ ] All features work
- [ ] Mobile testing complete
- [ ] Camera tracking works
- [ ] Paywall works

---

## 📊 Current Pricing (Updated)

| Plan | Price | Features |
|------|-------|----------|
| Free | £0 | 3 sessions/day, 30 min limit |
| Pro | £3.99/month | 20 sessions/day, 2 hour limit, AI insights |
| Premium | £3.99/month | Unlimited everything |

---

## 🆘 Troubleshooting

### Domain Not Resolving
- Check DNS propagation: https://www.whatsmydns.net/
- Wait 24-48 hours
- Clear browser cache
- Try incognito mode

### HTTPS Not Working
- Wait for SSL certificate (usually 5-10 minutes)
- Check Vercel/Netlify dashboard
- Verify domain is connected

### App Not Loading
- Check Vercel/Netlify build logs
- Verify environment variables are set
- Check for deployment errors

### Camera Not Working on Mobile
- Check browser permissions
- Allow camera access
- Try different browser
- Check mobile device camera

### Paywall Not Working
- Check Stripe API keys
- Verify subscription system
- Check browser console for errors
- Test with admin account

---

## 📞 Support Links

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **IONOS Support**: https://www.ionos.co.uk/help
- **Stripe Docs**: https://stripe.com/docs
- **DNS Checker**: https://www.whatsmydns.net/

---

## ✨ Summary

**Recommended Path:**
1. Deploy to Vercel (easiest)
2. Update IONOS nameservers
3. Wait 24-48 hours
4. Test on mobile
5. Go live!

**Time to Live:**
- Setup: 15 minutes
- DNS propagation: 24-48 hours
- Total: ~1 day

**Status**: ✅ **READY FOR DEPLOYMENT**

Let's launch FOCUSYNC! 🚀

