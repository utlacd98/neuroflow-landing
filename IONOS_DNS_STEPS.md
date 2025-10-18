# 🌐 IONOS DNS Setup - Step by Step

## Your Current Situation
- **Domain**: focusync.uk
- **Registrar**: IONOS
- **Current A Record**: 217.160.0.253 (IONOS default)
- **Goal**: Point to Vercel

---

## 📋 What You're Seeing in IONOS

You're currently in the DNS tab showing:
- A record pointing to 217.160.0.253
- AAAA record (IPv6)
- TXT records
- CNAME records
- MX records (mail)

---

## 🎯 Two Options to Deploy

### Option A: Use Vercel Nameservers (Recommended)

**Pros:**
- ✅ Easiest setup
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ No manual DNS records needed

**Steps:**

1. **Deploy to Vercel First**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Import your repository
   - Add environment variables
   - Click Deploy
   - Wait for build to complete

2. **Get Vercel Nameservers**
   - In Vercel dashboard
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter: focusync.uk
   - Vercel shows you 4 nameservers:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ns3.vercel-dns.com
     ns4.vercel-dns.com
     ```

3. **Update IONOS Nameservers**
   - Go to https://my.ionos.co.uk/
   - Click "Domains & SSL"
   - Select "focusync.uk"
   - Click "Nameserver" tab (NOT DNS tab)
   - Click "Change nameserver"
   - Select "Use custom nameservers"
   - Enter the 4 Vercel nameservers
   - Click "Save"

4. **Wait 24-48 Hours**
   - DNS propagation takes time
   - Check status: https://www.whatsmydns.net/
   - Enter: focusync.uk
   - Wait until all entries are green

5. **Verify**
   - Visit https://focusync.uk
   - Should load your app
   - HTTPS should work (lock icon)

---

### Option B: Update A Record (If You Have a Server)

**Only use this if you have your own server/VPS**

1. **Get Your Server IP**
   - From your hosting provider
   - Example: 123.45.67.89

2. **Update IONOS A Record**
   - Go to https://my.ionos.co.uk/
   - Domains & SSL → focusync.uk
   - Click "DNS" tab (where you are now)
   - Find the "A" record with value 217.160.0.253
   - Click the pencil icon to edit
   - Change VALUE to your server IP
   - Click "Save"

3. **Add www Subdomain**
   - Click "Add record"
   - Type: A
   - Host name: www
   - Value: your server IP
   - Click "Save"

4. **Setup SSL Certificate**
   - Use Let's Encrypt (free)
   - Or buy from IONOS

5. **Deploy Your App**
   - SSH into your server
   - Clone repository
   - Install: npm install
   - Build: npm run build
   - Start: npm run start
   - Use PM2 to keep running

---

## ✅ Recommended: Option A (Vercel)

**Why?**
- Easiest setup
- No server needed
- Automatic SSL
- Global CDN
- Free tier available
- Perfect for Next.js

---

## 🚀 Quick Vercel Deployment

### Step 1: Create Vercel Account (2 min)
```
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel
```

### Step 2: Import Project (2 min)
```
1. In Vercel dashboard, click "Add New..."
2. Select "Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL
5. Click "Import"
```

### Step 3: Add Environment Variables (2 min)
```
1. In Vercel project settings
2. Go to "Environment Variables"
3. Add:
   - STRIPE_SECRET_KEY=sk_test_YOUR_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   - STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   - NEXT_PUBLIC_OPENAI_API_KEY=your_key
   - NEXT_PUBLIC_APP_URL=https://focusync.uk
4. Click "Save"
```

### Step 4: Deploy (1 min)
```
1. Click "Deploy"
2. Wait for build to complete
3. You'll get a temporary URL
```

### Step 5: Connect Domain (5 min)
```
1. In Vercel, go to Settings → Domains
2. Enter: focusync.uk
3. Click "Add"
4. Vercel shows nameservers
5. Copy them
```

### Step 6: Update IONOS (5 min)
```
1. Go to https://my.ionos.co.uk/
2. Click "Domains & SSL"
3. Select "focusync.uk"
4. Click "Nameserver" tab
5. Click "Change nameserver"
6. Select "Use custom nameservers"
7. Enter Vercel nameservers:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
   - ns3.vercel-dns.com
   - ns4.vercel-dns.com
8. Click "Save"
```

### Step 7: Wait for DNS (24-48 hours)
```
1. Check: https://www.whatsmydns.net/
2. Enter: focusync.uk
3. Wait until all entries are green
```

### Step 8: Test (5 min)
```
1. Visit https://focusync.uk
2. Should load your app
3. HTTPS should work
4. Test all features
```

---

## 🧪 Testing Before DNS is Ready

### Use Vercel Temporary URL
```
1. Get your Vercel temporary URL
   (e.g., focusync-xyz.vercel.app)
2. Visit on desktop: https://focusync-xyz.vercel.app
3. Visit on mobile: https://focusync-xyz.vercel.app
4. Test camera tracking
5. Test paywall
6. Test free tier limit
```

---

## 📱 Mobile Testing Checklist

### Before DNS is Ready
- [ ] Visit Vercel temp URL on mobile
- [ ] Test camera tracking
- [ ] Test paywall
- [ ] Test free tier limit
- [ ] Test upgrade flow

### After DNS is Ready
- [ ] Visit https://focusync.uk on mobile
- [ ] Test camera tracking
- [ ] Test paywall
- [ ] Test all features
- [ ] Test on different devices

---

## 🆘 Troubleshooting

### DNS Not Resolving
```
1. Check: https://www.whatsmydns.net/
2. Enter: focusync.uk
3. Wait 24-48 hours
4. Clear browser cache
5. Try incognito mode
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
5. Check console for errors
```

### Paywall Not Working
```
1. Check Stripe API keys
2. Verify subscription system
3. Check browser console
4. Test with admin account
5. Clear localStorage
```

---

## 📊 Current DNS Records (IONOS)

| Type | Host | Value | Service |
|------|------|-------|---------|
| A | @ | 217.160.0.253 | Default Site |
| AAAA | @ | 2001:8d8:100f:f000:0:0:200 | Default Site |
| TXT | _dep_ws_mutex | "521c7e28bb760687e6a0d7cba55e7c8bf7..." | Mail |
| CNAME | _domainconnect | domainconnect.ionos.com | Domain Connect |
| MX | @ | mx00.ionos.co.uk | Mail |
| MX | @ | mx01.ionos.co.uk | Mail |
| TXT | @ | "v=spf1 include_spf-eu.ionos.com ~all" | Mail |
| CNAME | s1-ionos_domainkey | s1.dkim.ionos.com | Mail |
| CNAME | s2-ionos_domainkey | s2.dkim.ionos.com | Mail |
| CNAME | s42582890_domainkey | s42582890.dkim.ionos.com | Mail |
| CNAME | autodiscover | adsredir.ionos.info | Mail |

**After Vercel Setup:**
- You'll change the Nameserver (not individual DNS records)
- Vercel will manage all DNS records automatically

---

## ✨ Summary

**Recommended Path:**
1. Deploy to Vercel (15 min)
2. Update IONOS nameservers (5 min)
3. Wait for DNS (24-48 hours)
4. Test on mobile (30 min)
5. Go live! 🎉

**Total Time: ~1 day**

---

**Status**: ✅ **READY FOR DEPLOYMENT**

Let's launch FOCUSYNC! 🚀

