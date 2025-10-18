# 🚀 DEPLOY NOW - Quick Start

## ✅ Your Setup

**Domain**: focusync.uk
**Your IP**: 188.29.223.227
**Time to Live**: ~50 minutes

---

## 📋 Do This NOW (In Order)

### STEP 1: Update IONOS DNS (5 minutes)

1. Go to: https://my.ionos.co.uk/
2. Click "Domains & SSL"
3. Select "focusync.uk"
4. Click "DNS" tab
5. Find A record with value "217.160.0.253"
6. Click pencil icon to edit
7. Change VALUE to: **188.29.223.227**
8. Click "Save"
9. Add www subdomain:
   - Click "Add record"
   - Type: A
   - Host: www
   - Value: 188.29.223.227
   - Click "Save"

✅ **DNS Updated!**

---

### STEP 2: Get SSL Certificate (10 minutes)

**On your machine, open Terminal/Command Prompt:**

```bash
# Install certbot
npm install -g certbot

# Get certificate
sudo certbot certonly --standalone -d focusync.uk -d www.focusync.uk
```

**Follow prompts:**
- Enter email
- Agree to terms
- Done!

✅ **SSL Certificate Ready!**

---

### STEP 3: Deploy Your App (15 minutes)

**In Terminal/Command Prompt:**

```bash
# Go to your project
cd Downloads/neuroflow-landing

# Install dependencies
npm install

# Build the app
npm run build

# Install PM2
npm install -g pm2

# Start the app
pm2 start npm --name "focusync" -- start

# Make it auto-start
pm2 startup
pm2 save
```

✅ **App Running!**

---

### STEP 4: Setup Nginx (10 minutes)

**If you're on Linux/Mac:**

```bash
# Create config
sudo nano /etc/nginx/sites-available/focusync.uk
```

**Paste this:**

```nginx
server {
    listen 80;
    server_name focusync.uk www.focusync.uk;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name focusync.uk www.focusync.uk;
    
    ssl_certificate /etc/letsencrypt/live/focusync.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/focusync.uk/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
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

**Save and enable:**

```bash
sudo ln -s /etc/nginx/sites-available/focusync.uk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

✅ **Nginx Ready!**

---

### STEP 5: Test Everything (10 minutes)

**Test DNS:**
1. Go to: https://www.whatsmydns.net/
2. Enter: focusync.uk
3. Should show: 188.29.223.227

**Test HTTPS:**
1. Visit: https://focusync.uk
2. Should load your app
3. Lock icon should appear

**Test on Mobile:**
1. Visit: https://focusync.uk on mobile
2. Test camera tracking
3. Test paywall
4. Test free tier limit

✅ **All Tests Pass!**

---

## 🎯 Quick Reference

### Your DNS Records
```
Type: A
Host: @
Value: 188.29.223.227

Type: A
Host: www
Value: 188.29.223.227
```

### Your SSL Certificate
```
Location: /etc/letsencrypt/live/focusync.uk/
Certificate: fullchain.pem
Private Key: privkey.pem
```

### Your App
```
Running on: http://localhost:3000
Proxied through: Nginx on port 443 (HTTPS)
Domain: https://focusync.uk
```

---

## 📊 Admin Test Accounts

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

## 🆘 If Something Goes Wrong

### DNS Not Working
```
1. Check: https://www.whatsmydns.net/
2. Wait 5-10 minutes
3. Clear browser cache
```

### HTTPS Not Working
```
1. Check certificate: sudo ls -la /etc/letsencrypt/live/focusync.uk/
2. Check Nginx: sudo nginx -t
3. Check logs: sudo tail -f /var/log/nginx/error.log
```

### App Not Loading
```
1. Check status: pm2 list
2. Check logs: pm2 logs focusync
3. Check Nginx: sudo tail -f /var/log/nginx/error.log
```

---

## ✨ You're All Set!

**Everything is ready to deploy!**

**Your IP**: 188.29.223.227
**Your Domain**: focusync.uk
**Time to Live**: ~50 minutes

**Start with Step 1 and follow through!**

---

**Status**: ✅ **READY TO DEPLOY**

Let's launch FOCUSYNC! 🚀✨

