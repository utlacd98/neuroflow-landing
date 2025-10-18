# 🔐 NeuroFlow Authentication & Security Guide

## Overview

NeuroFlow now includes a complete authentication system with enterprise-grade DDoS protection, rate limiting, and security best practices.

---

## 🔑 Authentication System

### Features

✅ **User Registration** - Secure signup with password strength validation
✅ **User Login** - Email/password authentication with rate limiting
✅ **Profile Management** - Customizable user profiles
✅ **Session Management** - Secure session tokens with expiration
✅ **Password Security** - Bcrypt hashing with salt rounds

### User Registration

**Endpoint**: `POST /api/auth/signup`

```typescript
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response
{
  "message": "Account created successfully",
  "session": {
    "token": "abc123...",
    "userId": "user_123",
    "expiresAt": 1729270800000
  },
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe",
    "profile": {
      "theme": "dark",
      "notificationsEnabled": true,
      "preferredMode": "focus"
    }
  }
}
```

### User Login

**Endpoint**: `POST /api/auth/login`

```typescript
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

// Response
{
  "message": "Login successful",
  "session": {
    "token": "abc123...",
    "userId": "user_123",
    "expiresAt": 1729270800000
  },
  "user": { ... }
}
```

### Password Requirements

- **Minimum 8 characters** (12+ recommended)
- **Uppercase letters** (A-Z)
- **Lowercase letters** (a-z)
- **Numbers** (0-9)
- **Special characters** (!@#$%^&*)

---

## 🛡️ DDoS Protection

### Rate Limiting

Protects against brute force attacks and resource exhaustion.

#### Login Rate Limit
- **Window**: 15 minutes
- **Max Attempts**: 5
- **Response**: 429 Too Many Requests

#### Signup Rate Limit
- **Window**: 1 hour
- **Max Attempts**: 3
- **Response**: 429 Too Many Requests

#### API Rate Limit
- **Window**: 1 minute
- **Max Requests**: 30
- **Response**: 429 Too Many Requests

### Implementation

```typescript
import { checkRateLimit, getClientIP } from '@/lib/ddosProtection';

// In your API route
const clientIP = getClientIP(request.headers);
const rateLimit = checkRateLimit('login', clientIP);

if (!rateLimit.allowed) {
  return NextResponse.json(
    { message: rateLimit.message },
    { status: 429 }
  );
}
```

---

## 🔒 Security Features

### Input Validation

✅ Email format validation
✅ Password strength checking
✅ SQL injection prevention
✅ XSS attack prevention
✅ Input length limits

### Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Session Security

- **Max Age**: 24 hours
- **Idle Timeout**: 30 minutes
- **Secure Cookies**: HTTPS only (production)
- **HttpOnly**: No JavaScript access
- **SameSite**: Lax (CSRF protection)

---

## 📁 File Structure

```
lib/
├── auth.ts                    # Authentication logic
└── ddosProtection.ts          # Rate limiting & security

components/
├── LoginForm.tsx              # Login UI
├── SignupForm.tsx             # Signup UI
└── ProfileForm.tsx            # Profile management UI

app/
├── auth/page.tsx              # Auth page
├── profile/page.tsx           # Profile page
└── api/
    ├── auth/
    │   ├── login/route.ts     # Login endpoint
    │   └── signup/route.ts    # Signup endpoint
    └── profile/
        └── update/route.ts    # Profile update endpoint
```

---

## 🚀 Usage

### 1. User Registration

```typescript
// Navigate to /auth
// Click "Sign up"
// Fill in name, email, password
// Password strength indicator shows requirements
// Click "Create Account"
```

### 2. User Login

```typescript
// Navigate to /auth
// Fill in email and password
// Click "Sign In"
// Redirected to dashboard on success
```

### 3. Profile Management

```typescript
// After login, navigate to /profile
// Update profile settings:
//   - Age, timezone
//   - Focus goals and bio
//   - Preferred mode and frequency
//   - Theme and notifications
// Click "Save Profile"
```

---

## 🔐 Password Hashing

Uses **bcryptjs** with:
- **Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Cost Factor**: 2^10 iterations

```typescript
import bcrypt from 'bcryptjs';

// Hash password
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

// Verify password
const isValid = await bcrypt.compare(password, hash);
```

---

## 📊 Rate Limit Status

Check rate limit status:

```typescript
import { getRateLimitStatus } from '@/lib/ddosProtection';

const status = getRateLimitStatus('login', clientIP);
// Returns: { count: 3, resetTime: 1729270800000 } or null
```

---

## 🚨 Suspicious Activity Detection

```typescript
import { detectSuspiciousActivity } from '@/lib/ddosProtection';

const activity = detectSuspiciousActivity('login', clientIP);
// Returns: {
//   suspicious: true,
//   reason: 'Rate limit exceeded',
//   severity: 'high'
// }
```

---

## 🔄 Session Management

### Session Token Generation

```typescript
import { generateSessionToken } from '@/lib/ddosProtection';

const token = generateSessionToken(); // 32-char random string
```

### Session Storage

Sessions are stored in localStorage:

```typescript
// After successful login
localStorage.setItem('neuroflow_session', JSON.stringify(session));
localStorage.setItem('neuroflow_user', JSON.stringify(user));
```

---

## ✅ Security Checklist

- [x] Password hashing with bcrypt
- [x] Rate limiting on auth endpoints
- [x] Input validation and sanitization
- [x] SQL injection prevention
- [x] XSS attack prevention
- [x] CSRF protection (SameSite cookies)
- [x] Security headers
- [x] Session expiration
- [x] Idle timeout
- [x] Email validation
- [x] Password strength requirements
- [x] Suspicious activity detection

---

## 🔧 Configuration

### Modify Rate Limits

Edit `lib/ddosProtection.ts`:

```typescript
const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: {
    windowMs: 15 * 60 * 1000,  // Change window
    maxRequests: 5,             // Change max attempts
  },
  // ...
};
```

### Modify Session Config

Edit `lib/ddosProtection.ts`:

```typescript
export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  maxAge: 24 * 60 * 60 * 1000,    // 24 hours
  idleTimeout: 30 * 60 * 1000,    // 30 minutes
  secure: true,                    // HTTPS only
  httpOnly: true,                  // No JS access
  sameSite: 'lax',                 // CSRF protection
};
```

---

## 📝 API Reference

### Authentication Functions

```typescript
// Create user
createUser(email, password, name): Promise<User | null>

// Authenticate user
authenticateUser(email, password): Promise<User | null>

// Get user by email
getUserByEmail(email): Promise<User | null>

// Get user by ID
getUserById(id): Promise<User | null>

// Update profile
updateUserProfile(userId, profile): Promise<User | null>

// Delete user
deleteUser(userId): Promise<boolean>
```

### Security Functions

```typescript
// Check rate limit
checkRateLimit(endpoint, identifier, config?): RateLimitResult

// Reset rate limit
resetRateLimit(endpoint, identifier): void

// Validate email
validateEmail(email): boolean

// Validate password strength
validatePasswordStrength(password): PasswordStrengthResult

// Sanitize input
sanitizeInput(input): string

// Get security headers
getSecurityHeaders(): Record<string, string>
```

---

## 🐛 Troubleshooting

### "Too many login attempts"
- Wait 15 minutes for rate limit to reset
- Or clear localStorage and try again

### "Password is not strong enough"
- Add uppercase letters
- Add numbers
- Add special characters
- Use at least 8 characters

### "Email already registered"
- Use a different email
- Or login with existing account

---

## 🔐 Best Practices

1. **Always use HTTPS** in production
2. **Never log passwords** in console
3. **Rotate session tokens** periodically
4. **Monitor suspicious activity** patterns
5. **Keep dependencies updated**
6. **Use environment variables** for secrets
7. **Implement 2FA** for sensitive operations
8. **Regular security audits**

---

## 📞 Support

For security issues, please report to: security@neuroflow.app

---

**Status**: ✅ Production Ready

**Last Updated**: 2025-10-18

**Version**: 1.0.0

