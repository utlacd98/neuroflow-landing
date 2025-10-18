/**
 * Subscription & Tier Management System
 * Handles free tier limitations and premium features
 */

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface SubscriptionLimits {
  maxSessionsPerDay: number;
  maxSessionDurationMinutes: number;
  maxStoredSessions: number;
  features: {
    aiInsights: boolean;
    advancedAnalytics: boolean;
    customAudio: boolean;
    exportData: boolean;
    prioritySupport: boolean;
  };
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  startDate: number;
  renewalDate: number;
  sessionsUsedToday: number;
  totalSessionsThisMonth: number;
  lastResetDate: number;
}

// Subscription tier limits
const TIER_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  free: {
    maxSessionsPerDay: 3,
    maxSessionDurationMinutes: 30,
    maxStoredSessions: 10,
    features: {
      aiInsights: false,
      advancedAnalytics: false,
      customAudio: false,
      exportData: false,
      prioritySupport: false,
    },
  },
  pro: {
    maxSessionsPerDay: 20,
    maxSessionDurationMinutes: 120,
    maxStoredSessions: 100,
    features: {
      aiInsights: true,
      advancedAnalytics: true,
      customAudio: false,
      exportData: true,
      prioritySupport: false,
    },
  },
  premium: {
    maxSessionsPerDay: 999,
    maxSessionDurationMinutes: 999,
    maxStoredSessions: 999,
    features: {
      aiInsights: true,
      advancedAnalytics: true,
      customAudio: true,
      exportData: true,
      prioritySupport: true,
    },
  },
};

// In-memory subscription storage
const subscriptions: Map<string, UserSubscription> = new Map();

/**
 * Get or create subscription for user
 */
export function getOrCreateSubscription(userId: string): UserSubscription {
  if (subscriptions.has(userId)) {
    return subscriptions.get(userId)!;
  }

  const subscription: UserSubscription = {
    userId,
    tier: 'free',
    startDate: Date.now(),
    renewalDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    sessionsUsedToday: 0,
    totalSessionsThisMonth: 0,
    lastResetDate: Date.now(),
  };

  subscriptions.set(userId, subscription);
  saveSubscriptionToStorage(subscription);
  return subscription;
}

/**
 * Get subscription limits for tier
 */
export function getTierLimits(tier: SubscriptionTier): SubscriptionLimits {
  return TIER_LIMITS[tier];
}

/**
 * Check if user can start a session
 */
export function canStartSession(userId: string): { allowed: boolean; reason?: string } {
  const subscription = getOrCreateSubscription(userId);
  const limits = getTierLimits(subscription.tier);

  // Reset daily counter if needed
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  if (now - subscription.lastResetDate > dayInMs) {
    subscription.sessionsUsedToday = 0;
    subscription.lastResetDate = now;
  }

  if (subscription.sessionsUsedToday >= limits.maxSessionsPerDay) {
    return {
      allowed: false,
      reason: `You've reached your daily limit of ${limits.maxSessionsPerDay} sessions. Upgrade to Pro for more!`,
    };
  }

  return { allowed: true };
}

/**
 * Check if session duration is allowed
 */
export function isSessionDurationAllowed(userId: string, durationMinutes: number): boolean {
  const subscription = getOrCreateSubscription(userId);
  const limits = getTierLimits(subscription.tier);
  return durationMinutes <= limits.maxSessionDurationMinutes;
}

/**
 * Record session usage
 */
export function recordSessionUsage(userId: string): void {
  const subscription = getOrCreateSubscription(userId);
  subscription.sessionsUsedToday++;
  subscription.totalSessionsThisMonth++;
  saveSubscriptionToStorage(subscription);
}

/**
 * Upgrade subscription tier
 */
export function upgradeSubscription(userId: string, newTier: SubscriptionTier): UserSubscription {
  const subscription = getOrCreateSubscription(userId);
  subscription.tier = newTier;
  subscription.renewalDate = Date.now() + 30 * 24 * 60 * 60 * 1000;
  saveSubscriptionToStorage(subscription);
  return subscription;
}

/**
 * Get subscription status
 */
export function getSubscriptionStatus(userId: string) {
  const subscription = getOrCreateSubscription(userId);
  const limits = getTierLimits(subscription.tier);

  return {
    tier: subscription.tier,
    limits,
    usage: {
      sessionsUsedToday: subscription.sessionsUsedToday,
      maxSessionsPerDay: limits.maxSessionsPerDay,
      sessionsRemaining: Math.max(0, limits.maxSessionsPerDay - subscription.sessionsUsedToday),
      totalSessionsThisMonth: subscription.totalSessionsThisMonth,
    },
    renewalDate: subscription.renewalDate,
  };
}

/**
 * Save subscription to localStorage
 */
function saveSubscriptionToStorage(subscription: UserSubscription): void {
  if (typeof window !== 'undefined') {
    const allSubscriptions = JSON.parse(localStorage.getItem('focusync_subscriptions') || '{}');
    allSubscriptions[subscription.userId] = subscription;
    localStorage.setItem('focusync_subscriptions', JSON.stringify(allSubscriptions));
  }
}

/**
 * Load subscriptions from localStorage
 */
export function loadSubscriptionsFromStorage(): void {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('focusync_subscriptions');
    if (stored) {
      try {
        const allSubscriptions = JSON.parse(stored);
        Object.values(allSubscriptions).forEach((sub: any) => {
          subscriptions.set(sub.userId, sub);
        });
      } catch (error) {
        console.error('Failed to load subscriptions from storage:', error);
      }
    }
  }
}

/**
 * Get all subscriptions (for admin)
 */
export function getAllSubscriptions(): UserSubscription[] {
  return Array.from(subscriptions.values());
}

