# 🚀 Self-Hosted Deployment Guide

## ✅ You Don't Want Vercel - Let's Self-Host!

This guide covers deploying FOCUSYNC on your own server or machine.

---

## 🎯 Deployment Options

### Option 1: Your Own VPS/Server (Recommended)
- ✅ Full control
- ✅ Scalable
- ✅ Cost-effective
- ✅ Professional setup

**Providers:**
- DigitalOcean ($5-10/month)
- Linode ($5-30/month)
- AWS ($1-50/month)
- Hetzner ($3-20/month)
- Vultr ($2.50-20/month)

### Option 2: Run Locally on Your Machine
- ✅ Free
- ✅ Easy to start
- ⚠️ Requires static IP
- ⚠️ Your machine must stay on

### Option 3: Docker Container
- ✅ Easy deployment
- ✅ Portable
- ✅ Scalable

---

## 📋 What You Need

### For VPS/Server
1. **Server IP address** (e.g., 123.45.67.89)
2. **SSH access** to your server
3. **Node.js installed** on server
4. **PM2 or similar** to keep app running

### For Local Machine
1. **Static IP address** from your ISP
2. **Port forwarding** configured on router
3. **Node.js installed** on your machine
4. **App running 24/7**

---

## 🔧 Setup Steps

### Step 1: Get Your Server IP

**If using VPS:**
```
1. Log into your VPS provider dashboard
2. Find your server's public IP
3. Example: 123.45.67.89
```

**If running locally:**
```
1. Find your public IP: https://www.whatismyipaddress.com/
2. Example: 123.45.67.89
3. Note: This might change if your ISP uses dynamic IPs
```

### Step 2: Update IONOS DNS Records

**In IONOS Dashboard:**

1. Go to https://my.ionos.co.uk/
2. Click "Domains & SSL"
3. Select "focusync.uk"
4. Click "DNS" tab
5. Find the "A" record with value "217.160.0.253"
6. Click the pencil icon to edit
7. Change VALUE to your server IP: `123.45.67.89`
8. Click "Save"

**Add www subdomain:**
1. Click "Add record"
2. Type: A
3. Host name: www
4. Value: `123.45.67.89`
5. Click "Save"

**Wait 5-30 minutes for DNS to update**

### Step 3: Setup SSL Certificate

**Option A: Let's Encrypt (Free)**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d focusync.uk -d www.focusync.uk

# Auto-renew
sudo systemctl enable certbot.timer
```

**Option B: Buy from IONOS**
1. In IONOS, go to SSL Certificates
2. Purchase certificate
3. Follow IONOS setup instructions

### Step 4: Deploy Your App

**On Your Server:**

```bash
# SSH into server
ssh root@123.45.67.89

# Clone your repository
git clone https://github.com/YOUR_USERNAME/neuroflow-landing.git
cd neuroflow-landing

# Install dependencies
npm install

# Create .env.local with your keys
nano .env.local
# Add:
# STRIPE_SECRET_KEY=sk_test_YOUR_KEY
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
# STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
# NEXT_PUBLIC_OPENAI_API_KEY=your_key
# NEXT_PUBLIC_APP_URL=https://focusync.uk

# Build the app
npm run build

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "focusync" -- start

# Make it auto-start on reboot
pm2 startup
pm2 save
```

### Step 5: Setup Nginx Reverse Proxy

**Create Nginx config:**

```bash
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

### Step 6: Setup Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

---

## 🧪 Testing

### Test DNS
```
1. Go to https://www.whatsmydns.net/
2. Enter: focusync.uk
3. Should show your server IP
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
4. Test free tier limit
```

---

## 🆘 Troubleshooting

### DNS Not Resolving
```
1. Check: https://www.whatsmydns.net/
2. Wait 5-30 minutes
3. Clear browser cache
4. Try incognito mode
```

### HTTPS Not Working
```
1. Check SSL certificate: https://www.ssllabs.com/ssltest/
2. Verify certificate path in Nginx config
3. Check Nginx logs: sudo tail -f /var/log/nginx/error.log
```

### App Not Loading
```
1. Check if app is running: pm2 list
2. Check app logs: pm2 logs focusync
3. Check Nginx logs: sudo tail -f /var/log/nginx/error.log
4. Check firewall: sudo ufw status
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

## 📊 Recommended VPS Providers

| Provider | Price | Specs | Best For |
|----------|-------|-------|----------|
| DigitalOcean | $5/mo | 1GB RAM, 1 CPU | Beginners |
| Linode | $5/mo | 1GB RAM, 1 CPU | Reliability |
| Hetzner | $3/mo | 2GB RAM, 1 CPU | Budget |
| Vultr | $2.50/mo | 512MB RAM, 1 CPU | Very Budget |
| AWS | $1-50/mo | Variable | Enterprise |

---

## 🔐 Security Checklist

- [ ] Firewall enabled
- [ ] SSH key-based auth (no password)
- [ ] SSL certificate installed
- [ ] HTTPS enforced
- [ ] Environment variables secure
- [ ] Regular backups
- [ ] Monitoring enabled

---

## 📈 Monitoring & Maintenance

### Monitor App
```bash
# Check status
pm2 list

# View logs
pm2 logs focusync

# Monitor resources
pm2 monit
```

### Update App
```bash
# Pull latest code
git pull

# Rebuild
npm run build

# Restart
pm2 restart focusync
```

### Backup
```bash
# Backup database/data
tar -czf backup.tar.gz /path/to/data

# Upload to cloud storage
```

---

## 📞 Support

- **PM2 Docs**: https://pm2.keymetrics.io/
- **Nginx Docs**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/
- **Node.js Docs**: https://nodejs.org/en/docs/

---

## ✨ Summary

**Self-Hosted Deployment:**
1. Get server IP
2. Update IONOS DNS
3. Setup SSL certificate
4. Deploy app with PM2
5. Setup Nginx reverse proxy
6. Test everything
7. Go live!

**Time to Live: 1-2 hours**

---

**Status**: ✅ **READY FOR SELF-HOSTED DEPLOYMENT**

Let me know your server setup and I'll give you exact commands!

