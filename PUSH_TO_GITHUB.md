# 📤 Push Your Project to GitHub

## ✅ Do You Have a GitHub Account?

If not:
1. Go to: https://github.com
2. Click "Sign up"
3. Create account
4. Verify email

---

## 📋 Push Your Project (5 minutes)

### Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `neuroflow-landing`
3. Description: `FOCUSYNC - AI-powered focus app`
4. Choose "Public" or "Private"
5. Click "Create repository"

---

### Step 2: Push Your Code

**Open Terminal/Command Prompt in your project folder:**

```bash
cd Downloads/neuroflow-landing
```

**Initialize git (if not already done):**

```bash
git init
```

**Add all files:**

```bash
git add .
```

**Commit:**

```bash
git commit -m "Initial commit - FOCUSYNC app"
```

**Add remote (replace YOUR_USERNAME):**

```bash
git remote add origin https://github.com/YOUR_USERNAME/neuroflow-landing.git
```

**Push to GitHub:**

```bash
git branch -M main
git push -u origin main
```

**You might be asked for credentials:**
- Use your GitHub username
- Use a Personal Access Token (not password)

---

## 🔑 Create Personal Access Token (If Needed)

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token"
3. Select scopes: `repo`, `workflow`
4. Click "Generate token"
5. Copy the token
6. Use it as password when pushing

---

## ✅ Verify on GitHub

1. Go to: https://github.com/YOUR_USERNAME/neuroflow-landing
2. You should see your code
3. Copy the repository URL

---

## 🚀 Now Import to Vercel

1. Go to: https://vercel.com/new
2. Click "Import Third-Party Git Repository"
3. Paste your GitHub URL
4. Click "Import"
5. Configure and deploy!

---

**Status**: ✅ **READY TO PUSH**

Let me know if you need help! 🚀

