/**
 * DDoS Protection & Rate Limiting System
 * Protects against brute force attacks, spam, and resource exhaustion
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

// Rate limit stores for different endpoints
const rateLimitStores = new Map<string, Map<string, RequestRecord>>();

// Default configurations
const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts
    message: 'Too many login attempts. Please try again later.',
  },
  signup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 signups per hour
    message: 'Too many signup attempts. Please try again later.',
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    message: 'Too many requests. Please slow down.',
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 attempts per hour
    message: 'Too many password reset attempts. Please try again later.',
  },
};

/**
 * Check if request is allowed based on rate limit
 */
export function checkRateLimit(
  endpoint: string,
  identifier: string, // IP address or user ID
  config?: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number; message?: string } {
  const cfg = config || DEFAULT_CONFIGS[endpoint] || DEFAULT_CONFIGS.api;
  
  // Get or create store for this endpoint
  if (!rateLimitStores.has(endpoint)) {
    rateLimitStores.set(endpoint, new Map());
  }
  const store = rateLimitStores.get(endpoint)!;

  const now = Date.now();
  const record = store.get(identifier);

  // Create new record if doesn't exist
  if (!record) {
    store.set(identifier, {
      count: 1,
      resetTime: now + cfg.windowMs,
    });
    return {
      allowed: true,
      remaining: cfg.maxRequests - 1,
      resetTime: now + cfg.windowMs,
    };
  }

  // Reset if window has passed
  if (now > record.resetTime) {
    store.set(identifier, {
      count: 1,
      resetTime: now + cfg.windowMs,
    });
    return {
      allowed: true,
      remaining: cfg.maxRequests - 1,
      resetTime: now + cfg.windowMs,
    };
  }

  // Check if limit exceeded
  if (record.count >= cfg.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      message: cfg.message,
    };
  }

  // Increment counter
  record.count++;
  return {
    allowed: true,
    remaining: cfg.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(endpoint: string, identifier: string): void {
  const store = rateLimitStores.get(endpoint);
  if (store) {
    store.delete(identifier);
  }
}

/**
 * Clear all rate limits (for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStores.clear();
}

/**
 * Get rate limit status
 */
export function getRateLimitStatus(endpoint: string, identifier: string) {
  const store = rateLimitStores.get(endpoint);
  if (!store) {
    return null;
  }
  return store.get(identifier) || null;
}

/**
 * Detect suspicious patterns
 */
export function detectSuspiciousActivity(
  endpoint: string,
  identifier: string
): { suspicious: boolean; reason?: string; severity: 'low' | 'medium' | 'high' } {
  const store = rateLimitStores.get(endpoint);
  if (!store) {
    return { suspicious: false, severity: 'low' };
  }

  const record = store.get(identifier);
  if (!record) {
    return { suspicious: false, severity: 'low' };
  }

  const cfg = DEFAULT_CONFIGS[endpoint] || DEFAULT_CONFIGS.api;
  const percentageUsed = (record.count / cfg.maxRequests) * 100;

  if (percentageUsed >= 100) {
    return {
      suspicious: true,
      reason: 'Rate limit exceeded',
      severity: 'high',
    };
  }

  if (percentageUsed >= 80) {
    return {
      suspicious: true,
      reason: 'Approaching rate limit',
      severity: 'medium',
    };
  }

  if (percentageUsed >= 50) {
    return {
      suspicious: false,
      reason: 'Normal activity',
      severity: 'low',
    };
  }

  return { suspicious: false, severity: 'low' };
}

/**
 * Get IP address from request headers
 */
export function getClientIP(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return headers['x-real-ip'] as string || 'unknown';
}

/**
 * Validate input to prevent injection attacks
 */
export function validateInput(input: string, maxLength: number = 1000): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  if (input.length > maxLength) {
    return false;
  }

  // Check for common injection patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return false;
    }
  }

  return true;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .trim();
}

/**
 * Generate security headers
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

/**
 * Session security
 */
export interface SessionConfig {
  maxAge: number; // Session max age in milliseconds
  idleTimeout: number; // Idle timeout in milliseconds
  secure: boolean; // HTTPS only
  httpOnly: boolean; // No JavaScript access
  sameSite: 'strict' | 'lax' | 'none';
}

export const DEFAULT_SESSION_CONFIG: SessionConfig = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  idleTimeout: 30 * 60 * 1000, // 30 minutes
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax',
};

/**
 * Generate secure session token
 */
export function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Password should be at least 8 characters');

  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*]/.test(password)) score++;
  else feedback.push('Add special characters (!@#$%^&*)');

  return {
    valid: score >= 3,
    score,
    feedback,
  };
}

