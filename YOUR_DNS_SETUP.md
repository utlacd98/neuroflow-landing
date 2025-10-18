# 🎯 Your DNS Setup - focusync.uk

## ✅ Your Information

**Domain**: focusync.uk
**Your IP**: 188.29.223.227
**Registrar**: IONOS

---

## 🚀 Step 1: Update IONOS DNS Records (5 minutes)

### Go to IONOS Dashboard
1. Visit: https://my.ionos.co.uk/
2. Click "Domains & SSL"
3. Select "focusync.uk"
4. Click "DNS" tab

### Update the A Record

**Find the existing A record:**
- Type: A
- Host name: @ (or blank)
- Current Value: 217.160.0.253

**Edit it:**
1. Click the pencil icon
2. Change VALUE to: **188.29.223.227**
3. Click "Save"

### Add www Subdomain

1. Click "Add record"
2. Type: **A**
3. Host name: **www**
4. Value: **188.29.223.227**
5. Click "Save"

### Verify DNS Updated
- Wait 5-10 minutes
- Check: https://www.whatsmydns.net/
- Enter: focusync.uk
- Should show: 188.29.223.227

---

## 🔐 Step 2: Setup SSL Certificate (Free - 10 minutes)

### Option A: Let's Encrypt (Recommended - Free)

**On your machine:**

```bash
# Install Certbot
npm install -g certbot

# Or if you have Linux/Mac:
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d focusync.uk -d www.focusync.uk

# Follow prompts:
# - Enter email
# - Agree to terms
# - Enter domain: focusync.uk
```

**Certificate will be saved at:**
```
/etc/letsencrypt/live/focusync.uk/
- fullchain.pem (certificate)
- privkey.pem (private key)
```

### Option B: Buy from IONOS (Paid)
1. In IONOS, go to SSL Certificates
2. Purchase certificate
3. Follow IONOS setup

---

## 🚀 Step 3: Deploy Your App (15 minutes)

### On Your Machine

```bash
# Navigate to your project
cd Downloads/neuroflow-landing

# Install dependencies
npm install

# Create .env.local with your keys
# Add these:
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
NEXT_PUBLIC_OPENAI_API_KEY=your_key
NEXT_PUBLIC_APP_URL=https://focusync.uk

# Build the app
npm run build

# Install PM2 (keeps app running)
npm install -g pm2

# Start with PM2
pm2 start npm --name "focusync" -- start

# Make it auto-start on reboot
pm2 startup
pm2 save
```

---

## 🌐 Step 4: Setup Nginx Reverse Proxy (10 minutes)

### Create Nginx Config

**On your machine (if Linux/Mac):**

```bash
# Create config file
sudo nano /etc/nginx/sites-available/focusync.uk
```

**Add this config:**

```nginx
server {
    listen 80;
    server_name focusync.uk www.focusync.uk;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name focusync.uk www.focusync.uk;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/focusync.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/focusync.uk/privkey.pem;
    
    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable the site:**

```bash
sudo ln -s /etc/nginx/sites-available/focusync.uk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🧪 Step 5: Test Everything (10 minutes)

### Test DNS
```
1. Go to: https://www.whatsmydns.net/
2. Enter: focusync.uk
3. Should show: 188.29.223.227
```

### Test HTTPS
```
1. Visit: https://focusync.uk
2. Should load your app
3. Lock icon should appear
4. No SSL errors
```

### Test on Mobile
```
1. Visit: https://focusync.uk on mobile
2. Test camera tracking
3. Test paywall
4. Test free tier limit (3 sessions)
5. Test upgrade flow
```

### Check App Status
```bash
# View app status
pm2 list

# View logs
pm2 logs focusync

# Monitor resources
pm2 monit
```

---

## 📊 Your DNS Records Summary

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 188.29.223.227 | 3600 |
| A | www | 188.29.223.227 | 3600 |

---

## 🆘 Troubleshooting

### DNS Not Resolving
```
1. Check: https://www.whatsmydns.net/
2. Wait 5-10 minutes
3. Clear browser cache
4. Try incognito mode
```

### HTTPS Not Working
```
1. Check SSL certificate installed
2. Verify certificate path in Nginx
3. Check Nginx logs: sudo tail -f /var/log/nginx/error.log
```

### App Not Loading
```
1. Check if app is running: pm2 list
2. Check app logs: pm2 logs focusync
3. Check Nginx logs: sudo tail -f /var/log/nginx/error.log
```

### Camera Not Working
```
1. Check browser permissions
2. Allow camera access
3. Try different browser
4. Check console for errors
```

### Paywall Not Working
```
1. Check Stripe API keys in .env.local
2. Verify subscription system
3. Check browser console
4. Check app logs: pm2 logs focusync
```

---

## 📋 Checklist

### DNS Setup
- [ ] Updated A record to 188.29.223.227
- [ ] Added www subdomain
- [ ] DNS propagated (check whatsmydns.net)

### SSL Certificate
- [ ] Let's Encrypt certificate installed
- [ ] Certificate files in /etc/letsencrypt/live/focusync.uk/

### App Deployment
- [ ] npm install completed
- [ ] .env.local created with API keys
- [ ] npm run build completed
- [ ] PM2 started app
- [ ] App running on port 3000

### Nginx Setup
- [ ] Nginx config created
- [ ] Site enabled
- [ ] Nginx restarted
- [ ] HTTP redirects to HTTPS

### Testing
- [ ] DNS resolves to 188.29.223.227
- [ ] HTTPS works (lock icon)
- [ ] App loads at https://focusync.uk
- [ ] Camera tracking works
- [ ] Paywall works
- [ ] Free tier limit works

---

## 🎯 Quick Commands Reference

```bash
# Check app status
pm2 list

# View logs
pm2 logs focusync

# Restart app
pm2 restart focusync

# Stop app
pm2 stop focusync

# Start app
pm2 start focusync

# Update app
git pull
npm run build
pm2 restart focusync

# Check Nginx
sudo nginx -t
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## ✨ Timeline

| Step | Time | Status |
|------|------|--------|
| Update DNS | 5 min | ⏳ Do Now |
| Setup SSL | 10 min | ⏳ Do Now |
| Deploy App | 15 min | ⏳ Do Now |
| Setup Nginx | 10 min | ⏳ Do Now |
| Test | 10 min | ⏳ Do Now |
| **Total** | **50 min** | ⏳ Ready |

---

## 🚀 You're Ready!

**Your IP**: 188.29.223.227
**Your Domain**: focusync.uk
**Status**: ✅ Ready to Deploy

**Next Steps:**
1. Update IONOS DNS records
2. Setup SSL certificate
3. Deploy your app
4. Test on mobile
5. Go live! 🎉

---

**Status**: ✅ **READY FOR DEPLOYMENT**

Let's launch FOCUSYNC! 🚀✨

