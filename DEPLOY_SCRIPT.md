# 🚀 Deployment Script - Copy & Paste

## ✅ DNS Saved!

Your A record is now pointing to: **188.29.223.227**

---

## 📋 Next: Deploy Your App

### Step 1: Add www Subdomain (2 minutes)

**In IONOS DNS tab, add:**
- Type: A
- Host name: www
- Points to: 188.29.223.227
- Click Save

---

### Step 2: Get SSL Certificate (10 minutes)

**Open Terminal/Command Prompt and run:**

```bash
npm install -g certbot
```

**Then run:**

```bash
sudo certbot certonly --standalone -d focusync.uk -d www.focusync.uk
```

**Follow prompts:**
- Enter email
- Agree to terms
- Done!

---

### Step 3: Deploy Your App (15 minutes)

**Copy and paste these commands one by one:**

```bash
cd Downloads/neuroflow-landing
```

```bash
npm install
```

```bash
npm run build
```

```bash
npm install -g pm2
```

```bash
pm2 start npm --name "focusync" -- start
```

```bash
pm2 startup
```

```bash
pm2 save
```

**Check if running:**

```bash
pm2 list
```

You should see "focusync" with status "online"

---

### Step 4: Setup Nginx (10 minutes)

**Create Nginx config:**

```bash
sudo nano /etc/nginx/sites-available/focusync.uk
```

**Paste this entire config:**

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

**Save (Ctrl+X, then Y, then Enter)**

**Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/focusync.uk /etc/nginx/sites-enabled/
```

**Test Nginx:**

```bash
sudo nginx -t
```

**Restart Nginx:**

```bash
sudo systemctl restart nginx
```

---

### Step 5: Test Everything (10 minutes)

**Check DNS:**
1. Go to: https://www.whatsmydns.net/
2. Enter: focusync.uk
3. Should show: 188.29.223.227

**Check HTTPS:**
1. Visit: https://focusync.uk
2. Should load your app
3. Lock icon should appear

**Check App Status:**

```bash
pm2 list
```

**View Logs:**

```bash
pm2 logs focusync
```

**Check Nginx:**

```bash
sudo tail -f /var/log/nginx/error.log
```

---

## 🎯 Quick Reference

### Your Setup
```
Domain: focusync.uk
IP: 188.29.223.227
App Port: 3000
Nginx Port: 443 (HTTPS)
```

### SSL Certificate Location
```
/etc/letsencrypt/live/focusync.uk/fullchain.pem
/etc/letsencrypt/live/focusync.uk/privkey.pem
```

### Useful Commands
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

# Check Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

## 🆘 Troubleshooting

### If certbot fails
```bash
# Make sure port 80 is free
sudo lsof -i :80

# Or use different method
sudo certbot certonly --webroot -w /var/www/html -d focusync.uk -d www.focusync.uk
```

### If Nginx fails
```bash
# Check syntax
sudo nginx -t

# View errors
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

### If app won't start
```bash
# Check if port 3000 is in use
sudo lsof -i :3000

# View PM2 logs
pm2 logs focusync

# Restart
pm2 restart focusync
```

---

## ✨ Timeline

| Step | Time | Command |
|------|------|---------|
| Add www DNS | 2 min | IONOS |
| Get SSL | 10 min | certbot |
| Deploy App | 15 min | npm + pm2 |
| Setup Nginx | 10 min | nginx config |
| Test | 10 min | browser |
| **Total** | **47 min** | Ready! |

---

## 🚀 You're Ready!

**Follow the steps above in order and you'll be live in ~50 minutes!**

**Status**: ✅ **READY TO DEPLOY**

Let's launch FOCUSYNC! 🚀✨

