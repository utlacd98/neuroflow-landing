# 🎨 Rebranding Guide - NeuroFlow to Your New Name

## Step-by-Step Rebranding Process

Once you've chosen your new name, follow this guide to update everything.

---

## 📋 Files to Update

### 1. **Configuration Files**

#### `package.json`
```json
{
  "name": "my-v0-project",  // Change to: "your-new-name"
  "description": "NeuroFlow - AI-Powered Focus"  // Update description
}
```

#### `next.config.mjs`
- Update any NeuroFlow references

#### `.env.local`
- Update app name in environment variables

---

### 2. **Metadata & SEO**

#### `app/layout.tsx`
```typescript
// Change:
title: "NeuroFlow - AI-Powered Focus & Brainwave Companion"
// To:
title: "YourNewName - AI-Powered Focus & Brainwave Companion"

// Change all descriptions, keywords, etc.
```

#### `app/page.tsx`
- Update landing page title and description

---

### 3. **Components**

#### `components/NeuroFlowDashboard.tsx`
- Rename to: `components/YourNewNameDashboard.tsx`
- Update all internal references

#### All other components
- Search for "NeuroFlow" and replace with new name

---

### 4. **Pages**

#### `app/auth/page.tsx`
```typescript
// Change:
<h1 className="text-4xl font-bold text-white">NeuroFlow</h1>
// To:
<h1 className="text-4xl font-bold text-white">YourNewName</h1>
```

#### `app/profile/page.tsx`
- Update any NeuroFlow references

#### `app/dashboard/page.tsx`
- Update title and branding

---

### 5. **Documentation**

Update all markdown files:
- `README.md`
- `AUTHENTICATION_SECURITY_GUIDE.md`
- `AUTH_QUICK_START.md`
- `AUTHENTICATION_DELIVERY.md`
- All other `.md` files

Replace: `NeuroFlow` → `YourNewName`

---

### 6. **LocalStorage Keys**

#### `lib/auth.ts`
```typescript
// Change:
localStorage.getItem('neuroflow_session')
localStorage.getItem('neuroflow_user')
localStorage.getItem('neuroflow_users')

// To:
localStorage.getItem('yournewname_session')
localStorage.getItem('yournewname_user')
localStorage.getItem('yournewname_users')
```

#### `lib/sessionStorage.ts`
- Update all localStorage key references

#### All components using localStorage
- Search for 'neuroflow_' and replace

---

### 7. **API Routes**

#### `app/api/auth/login/route.ts`
- Update any NeuroFlow references in comments/messages

#### `app/api/auth/signup/route.ts`
- Update any NeuroFlow references

#### `app/api/profile/update/route.ts`
- Update any NeuroFlow references

---

### 8. **Styles & Assets**

#### `styles/globals.css`
- Update any NeuroFlow-specific styles

#### `public/`
- Update logo files
- Update favicon
- Update any branded images

---

### 9. **UI Components**

#### `components/LoginForm.tsx`
```typescript
// Change:
<CardDescription>Sign in to your NeuroFlow account</CardDescription>
// To:
<CardDescription>Sign in to your YourNewName account</CardDescription>
```

#### `components/SignupForm.tsx`
```typescript
// Change:
<CardDescription>Join NeuroFlow and start optimizing your focus</CardDescription>
// To:
<CardDescription>Join YourNewName and start optimizing your focus</CardDescription>
```

#### `components/ProfileForm.tsx`
- Update any NeuroFlow references

---

## 🔍 Find & Replace Commands

### Using VS Code

1. **Open Find & Replace**: `Ctrl+H` (Windows) or `Cmd+H` (Mac)

2. **Replace all instances**:
   - Find: `NeuroFlow`
   - Replace: `YourNewName`
   - Click "Replace All"

3. **Replace case-sensitive variations**:
   - Find: `neuroflow`
   - Replace: `yournewname`
   - Click "Replace All"

4. **Replace in localStorage keys**:
   - Find: `neuroflow_`
   - Replace: `yournewname_`
   - Click "Replace All"

---

### Using Command Line

```bash
# Find all files containing "NeuroFlow"
grep -r "NeuroFlow" .

# Replace all instances (macOS/Linux)
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.md" | xargs sed -i '' 's/NeuroFlow/YourNewName/g'

# Replace all instances (Windows PowerShell)
Get-ChildItem -Recurse -Include "*.ts","*.tsx","*.md" | ForEach-Object { (Get-Content $_) -replace 'NeuroFlow', 'YourNewName' | Set-Content $_ }
```

---

## 📝 Checklist

### Code Updates
- [ ] `package.json` - Update name and description
- [ ] `app/layout.tsx` - Update metadata
- [ ] `app/page.tsx` - Update landing page
- [ ] `app/auth/page.tsx` - Update auth page
- [ ] `app/profile/page.tsx` - Update profile page
- [ ] `app/dashboard/page.tsx` - Update dashboard
- [ ] All components - Replace NeuroFlow references
- [ ] All API routes - Update messages/comments
- [ ] `lib/auth.ts` - Update localStorage keys
- [ ] `lib/sessionStorage.ts` - Update localStorage keys
- [ ] All other lib files - Update references

### Documentation Updates
- [ ] `README.md`
- [ ] `AUTHENTICATION_SECURITY_GUIDE.md`
- [ ] `AUTH_QUICK_START.md`
- [ ] `AUTHENTICATION_DELIVERY.md`
- [ ] `00_AUTH_START_HERE.md`
- [ ] All other `.md` files

### Branding Updates
- [ ] Logo files
- [ ] Favicon
- [ ] Color scheme (if needed)
- [ ] Fonts (if needed)
- [ ] Images and assets

### Domain & Hosting
- [ ] Register domain (.com, .ai, or .app)
- [ ] Update DNS records
- [ ] Update hosting configuration
- [ ] Update SSL certificate

### Social Media & Legal
- [ ] Create social media accounts
- [ ] Update privacy policy
- [ ] Update terms of service
- [ ] Update legal documents
- [ ] File trademark (optional)

### Testing
- [ ] Test login/signup
- [ ] Test profile management
- [ ] Test all pages
- [ ] Test localStorage
- [ ] Test API endpoints
- [ ] Test on mobile
- [ ] Test on different browsers

---

## 🚀 Rebranding Steps

### Step 1: Choose Name
- [ ] Decide on new name
- [ ] Verify domain availability
- [ ] Check UK trademark
- [ ] Check global trademark

### Step 2: Update Code
- [ ] Use Find & Replace
- [ ] Update all files
- [ ] Test compilation
- [ ] Run dev server

### Step 3: Update Documentation
- [ ] Update all markdown files
- [ ] Update code comments
- [ ] Update README

### Step 4: Update Branding
- [ ] Update logo
- [ ] Update favicon
- [ ] Update colors (if needed)
- [ ] Update fonts (if needed)

### Step 5: Update Domain
- [ ] Register new domain
- [ ] Update DNS
- [ ] Update hosting
- [ ] Update SSL

### Step 6: Update Social Media
- [ ] Create accounts
- [ ] Update profiles
- [ ] Update links

### Step 7: Testing
- [ ] Test all features
- [ ] Test on mobile
- [ ] Test on different browsers
- [ ] Test API endpoints

### Step 8: Deploy
- [ ] Build project
- [ ] Deploy to production
- [ ] Verify everything works
- [ ] Monitor for issues

---

## 💡 Tips

1. **Use Find & Replace carefully** - Review changes before committing
2. **Test thoroughly** - Ensure nothing breaks
3. **Update localStorage keys** - Users may have old data
4. **Update documentation** - Keep docs in sync with code
5. **Backup before changes** - Use git to track changes
6. **Commit changes** - Use meaningful commit messages
7. **Test on production** - Verify everything works

---

## 🔄 Git Workflow

```bash
# Create new branch for rebranding
git checkout -b rebrand/new-name

# Make all changes
# ... (update files)

# Stage changes
git add .

# Commit changes
git commit -m "rebrand: NeuroFlow → YourNewName"

# Push to remote
git push origin rebrand/new-name

# Create pull request
# Review and merge
```

---

## ⚠️ Important Notes

1. **LocalStorage Migration**
   - Old data uses `neuroflow_` keys
   - New app uses `yournewname_` keys
   - Consider migration script for existing users

2. **Backward Compatibility**
   - Update API endpoints if needed
   - Update database schema if using database
   - Update any external integrations

3. **SEO Impact**
   - Domain change may affect SEO
   - Update sitemap
   - Update robots.txt
   - Submit to search engines

4. **User Communication**
   - Notify users of rebranding
   - Provide migration guide
   - Update help documentation

---

## 📞 Support

If you need help with rebranding:
1. Check this guide
2. Use Find & Replace
3. Test thoroughly
4. Review git diff
5. Ask for help if needed

---

**Status**: Ready for rebranding

**Estimated Time**: 2-4 hours

**Difficulty**: Easy to Medium

Let's rebrand! 🚀

