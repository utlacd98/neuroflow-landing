# 🚀 Authentication Quick Start Guide

## What's New

✅ **User Registration** - Create accounts with secure passwords
✅ **User Login** - Sign in with email/password
✅ **Profile Management** - Customize your NeuroFlow experience
✅ **DDoS Protection** - Rate limiting and security
✅ **Session Management** - Secure session tokens

---

## 🎯 Quick Start (5 minutes)

### 1. Start the Dev Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 2. Navigate to Auth Page

```
http://localhost:3000/auth
```

### 3. Create an Account

- Click "Sign up"
- Enter name, email, password
- Password must have:
  - 8+ characters
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters (!@#$%^&*)
- Click "Create Account"

### 4. Complete Your Profile

- You'll be redirected to `/profile`
- Fill in your preferences:
  - Age, timezone
  - Focus goals
  - Preferred mode (Focus/Calm/Energize)
  - Theme (Light/Dark)
  - Notifications
- Click "Save Profile"

### 5. Go to Dashboard

- Click "Continue to Dashboard"
- Start using NeuroFlow!

---

## 📝 Test Accounts

For testing, you can create accounts with:

**Email**: test@example.com
**Password**: TestPass123!

---

## 🔐 Security Features

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 attempts | 15 min |
| Signup | 3 attempts | 1 hour |
| API | 30 requests | 1 min |

### Password Security

- Bcrypt hashing with 10 salt rounds
- Password strength validation
- No plaintext storage

### Session Security

- 24-hour expiration
- 30-minute idle timeout
- Secure tokens
- HTTPS only (production)

---

## 📁 File Structure

```
New Files Created:

lib/
├── auth.ts                    # Auth logic (150 lines)
└── ddosProtection.ts          # Security (300 lines)

components/
├── LoginForm.tsx              # Login UI (100 lines)
├── SignupForm.tsx             # Signup UI (150 lines)
└── ProfileForm.tsx            # Profile UI (200 lines)

app/
├── auth/page.tsx              # Auth page (80 lines)
├── profile/page.tsx           # Profile page (150 lines)
└── api/
    ├── auth/
    │   ├── login/route.ts     # Login API (60 lines)
    │   └── signup/route.ts    # Signup API (70 lines)
    └── profile/
        └── update/route.ts    # Profile API (80 lines)

Documentation:
├── AUTHENTICATION_SECURITY_GUIDE.md
└── AUTH_QUICK_START.md
```

---

## 🔗 URLs

| Page | URL | Purpose |
|------|-----|---------|
| Auth | `/auth` | Login/Signup |
| Profile | `/profile` | Profile settings |
| Dashboard | `/dashboard` | Main app |

---

## 💻 API Endpoints

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### Update Profile
```
POST /api/profile/update
Content-Type: application/json

{
  "userId": "user_123",
  "profile": {
    "age": 25,
    "timezone": "EST",
    "preferredMode": "focus",
    "theme": "dark"
  }
}
```

---

## 🧪 Testing

### Test Login Rate Limiting

1. Go to `/auth`
2. Try logging in with wrong password 5 times
3. You'll see: "Too many login attempts"
4. Wait 15 minutes or clear localStorage

### Test Password Strength

1. Go to `/auth` → Sign up
2. Try weak passwords:
   - "password" → Too weak
   - "Pass123" → Too weak
   - "Pass123!" → Strong ✓

### Test Profile Update

1. Login
2. Go to `/profile`
3. Update settings
4. Click "Save Profile"
5. Check localStorage for updates

---

## 🔄 User Flow

```
Landing Page
    ↓
/auth (Login/Signup)
    ↓
/profile (Complete Profile)
    ↓
/dashboard (Main App)
```

---

## 💾 Data Storage

### Client-Side (LocalStorage)

```typescript
// Session
localStorage.getItem('neuroflow_session')
// {
//   "token": "abc123...",
//   "userId": "user_123",
//   "expiresAt": 1729270800000
// }

// User
localStorage.getItem('neuroflow_user')
// {
//   "id": "user_123",
//   "email": "user@example.com",
//   "name": "John Doe",
//   "profile": { ... }
// }

// All Users (for demo)
localStorage.getItem('neuroflow_users')
// { "user_123": { ... }, "user_456": { ... } }
```

---

## 🚀 Next Steps

1. **Integrate with Dashboard**
   - Check user session before showing dashboard
   - Redirect to /auth if not logged in

2. **Add 2FA** (Optional)
   - Email verification
   - SMS verification
   - Authenticator app

3. **Add Social Login** (Optional)
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth

4. **Add Password Reset** (Optional)
   - Email verification
   - Reset token
   - New password confirmation

5. **Database Integration** (Production)
   - Replace localStorage with database
   - Use PostgreSQL or MongoDB
   - Add migrations

---

## ⚠️ Important Notes

### Development vs Production

**Development**:
- Uses localStorage for user storage
- No HTTPS required
- Rate limits are in-memory

**Production**:
- Use database (PostgreSQL, MongoDB)
- Enable HTTPS
- Use Redis for rate limiting
- Add email verification
- Add 2FA

### Security Considerations

1. **Never commit secrets** to git
2. **Use environment variables** for API keys
3. **Enable HTTPS** in production
4. **Implement CORS** properly
5. **Add request logging** for audit trail
6. **Monitor suspicious activity**
7. **Regular security audits**

---

## 🐛 Troubleshooting

### "Cannot find module 'bcryptjs'"
```bash
npm install bcryptjs --legacy-peer-deps
```

### "Rate limit exceeded"
- Clear localStorage: `localStorage.clear()`
- Or wait for window to reset

### "Email already registered"
- Use different email
- Or login with existing account

### "Password not strong enough"
- Add uppercase: A-Z
- Add lowercase: a-z
- Add numbers: 0-9
- Add special: !@#$%^&*
- Use 8+ characters

---

## 📞 Support

For issues or questions:
1. Check AUTHENTICATION_SECURITY_GUIDE.md
2. Review code comments
3. Check browser console for errors
4. Check network tab for API responses

---

## ✅ Checklist

- [x] User registration
- [x] User login
- [x] Profile management
- [x] Rate limiting
- [x] Password hashing
- [x] Session management
- [x] Security headers
- [x] Input validation
- [x] Error handling
- [x] Documentation

---

**Status**: ✅ Ready to Use

**Version**: 1.0.0

**Last Updated**: 2025-10-18

Let's secure NeuroFlow! 🔐✨

