/**
 * Gamification Engine
 * Implements XP system, badges, achievements, and streak tracking
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  progress?: number; // 0-1
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  unlockedAt?: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalFocusTime: number; // minutes
  averageFocusLevel: number; // 0-1
  badges: Badge[];
  achievements: Achievement[];
}

export class GamificationEngine {
  private userStats: UserStats = {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    totalFocusTime: 0,
    averageFocusLevel: 0,
    badges: [],
    achievements: [],
  };

  private lastSessionDate: number = 0;
  private xpPerLevel = 1000;

  // Badge definitions
  private badgeDefinitions: Record<string, Badge> = {
    zen_master: {
      id: 'zen_master',
      name: 'Zen Master',
      description: '5 Calm sessions in a row',
      icon: '🧘',
    },
    focus_forge: {
      id: 'focus_forge',
      name: 'Focus Forge',
      description: '3 sessions above 90% focus',
      icon: '⚡',
    },
    brainwave_rider: {
      id: 'brainwave_rider',
      name: 'Brainwave Rider',
      description: 'Tried all frequency bands',
      icon: '🌊',
    },
    marathon_master: {
      id: 'marathon_master',
      name: 'Marathon Master',
      description: 'Total 10 hours of focus time',
      icon: '🏃',
    },
    consistency_king: {
      id: 'consistency_king',
      name: 'Consistency King',
      description: '30-day streak',
      icon: '👑',
    },
    early_bird: {
      id: 'early_bird',
      name: 'Early Bird',
      description: '10 morning sessions',
      icon: '🌅',
    },
    night_owl: {
      id: 'night_owl',
      name: 'Night Owl',
      description: '10 evening sessions',
      icon: '🌙',
    },
    flow_state: {
      id: 'flow_state',
      name: 'Flow State',
      description: 'Maintain 80% focus for 30 minutes',
      icon: '🎯',
    },
  };

  constructor() {
    this.loadStats();
  }

  /**
   * Complete a session and award XP
   */
  completeSession(
    duration: number,
    focusLevel: number,
    mode: string,
    frequency: number
  ): {
    xpEarned: number;
    levelUp: boolean;
    newBadges: Badge[];
    streakContinued: boolean;
  } {
    const xpEarned = this.calculateXP(duration, focusLevel);
    const levelUp = this.addXP(xpEarned);

    this.userStats.totalSessions++;
    this.userStats.totalFocusTime += duration;
    this.userStats.averageFocusLevel =
      (this.userStats.averageFocusLevel * (this.userStats.totalSessions - 1) + focusLevel) /
      this.userStats.totalSessions;

    // Update streak
    const streakContinued = this.updateStreak();

    // Check for new badges
    const newBadges = this.checkBadges(mode, focusLevel, duration, frequency);

    this.saveStats();

    return {
      xpEarned,
      levelUp,
      newBadges,
      streakContinued,
    };
  }

  /**
   * Calculate XP earned from session
   */
  private calculateXP(duration: number, focusLevel: number): number {
    const baseXP = Math.round(duration * 10); // 10 XP per minute
    const focusBonus = Math.round(focusLevel * 100); // Up to 100 bonus XP
    const totalXP = baseXP + focusBonus;

    return Math.max(50, totalXP); // Minimum 50 XP
  }

  /**
   * Add XP and check for level up
   */
  private addXP(xp: number): boolean {
    this.userStats.totalXP += xp;
    const newLevel = Math.floor(this.userStats.totalXP / this.xpPerLevel) + 1;

    if (newLevel > this.userStats.level) {
      this.userStats.level = newLevel;
      return true;
    }

    return false;
  }

  /**
   * Update streak
   */
  private updateStreak(): boolean {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    if (this.lastSessionDate === 0) {
      // First session
      this.currentStreak = 1;
      this.lastSessionDate = now;
      return true;
    }

    const daysSinceLastSession = Math.floor((now - this.lastSessionDate) / dayInMs);

    if (daysSinceLastSession === 0) {
      // Same day, no streak change
      return true;
    } else if (daysSinceLastSession === 1) {
      // Next day, continue streak
      this.userStats.currentStreak++;
      if (this.userStats.currentStreak > this.userStats.longestStreak) {
        this.userStats.longestStreak = this.userStats.currentStreak;
      }
      this.lastSessionDate = now;
      return true;
    } else {
      // Streak broken
      this.userStats.currentStreak = 1;
      this.lastSessionDate = now;
      return false;
    }
  }

  /**
   * Check for badge unlocks
   */
  private checkBadges(mode: string, focusLevel: number, duration: number, frequency: number): Badge[] {
    const newBadges: Badge[] = [];

    // Zen Master: 5 Calm sessions in a row
    if (mode === 'calm') {
      const calmCount = this.userStats.totalSessions; // Simplified
      if (calmCount >= 5 && !this.hasBadge('zen_master')) {
        newBadges.push(this.unlockBadge('zen_master'));
      }
    }

    // Focus Forge: 3 sessions above 90%
    if (focusLevel >= 0.9) {
      const highFocusSessions = Math.floor(this.userStats.totalSessions * this.userStats.averageFocusLevel);
      if (highFocusSessions >= 3 && !this.hasBadge('focus_forge')) {
        newBadges.push(this.unlockBadge('focus_forge'));
      }
    }

    // Marathon Master: 10 hours total
    if (this.userStats.totalFocusTime >= 600 && !this.hasBadge('marathon_master')) {
      newBadges.push(this.unlockBadge('marathon_master'));
    }

    // Consistency King: 30-day streak
    if (this.userStats.currentStreak >= 30 && !this.hasBadge('consistency_king')) {
      newBadges.push(this.unlockBadge('consistency_king'));
    }

    // Flow State: 80% focus for 30 minutes
    if (focusLevel >= 0.8 && duration >= 30 && !this.hasBadge('flow_state')) {
      newBadges.push(this.unlockBadge('flow_state'));
    }

    return newBadges;
  }

  /**
   * Unlock a badge
   */
  private unlockBadge(badgeId: string): Badge {
    const badgeDef = this.badgeDefinitions[badgeId];
    const badge: Badge = {
      ...badgeDef,
      unlockedAt: Date.now(),
    };

    this.userStats.badges.push(badge);
    return badge;
  }

  /**
   * Check if badge is already unlocked
   */
  private hasBadge(badgeId: string): boolean {
    return this.userStats.badges.some((b) => b.id === badgeId);
  }

  /**
   * Get current level progress
   */
  getLevelProgress(): {
    currentLevel: number;
    currentXP: number;
    xpToNextLevel: number;
    progress: number; // 0-1
  } {
    const xpInCurrentLevel = this.userStats.totalXP % this.xpPerLevel;
    const xpToNextLevel = this.xpPerLevel - xpInCurrentLevel;
    const progress = xpInCurrentLevel / this.xpPerLevel;

    return {
      currentLevel: this.userStats.level,
      currentXP: xpInCurrentLevel,
      xpToNextLevel,
      progress,
    };
  }

  /**
   * Get streak info
   */
  getStreakInfo(): {
    currentStreak: number;
    longestStreak: number;
    streakMessage: string;
  } {
    let streakMessage = '';

    if (this.userStats.currentStreak === 0) {
      streakMessage = 'Start your first session to begin a streak!';
    } else if (this.userStats.currentStreak === 1) {
      streakMessage = 'You\'re on fire! Keep it going.';
    } else if (this.userStats.currentStreak < 7) {
      streakMessage = `${this.userStats.currentStreak} days in a row — your neural rhythm is evolving!`;
    } else if (this.userStats.currentStreak < 30) {
      streakMessage = `${this.userStats.currentStreak} days! You're building serious focus muscle.`;
    } else {
      streakMessage = `${this.userStats.currentStreak} days! You're a focus legend!`;
    }

    return {
      currentStreak: this.userStats.currentStreak,
      longestStreak: this.userStats.longestStreak,
      streakMessage,
    };
  }

  /**
   * Get user stats
   */
  getStats(): UserStats {
    return { ...this.userStats };
  }

  /**
   * Save stats to localStorage
   */
  private saveStats() {
    try {
      localStorage.setItem('neuroflow_gamification', JSON.stringify(this.userStats));
    } catch (error) {
      console.error('Failed to save gamification stats:', error);
    }
  }

  /**
   * Load stats from localStorage
   */
  private loadStats() {
    try {
      const saved = localStorage.getItem('neuroflow_gamification');
      if (saved) {
        this.userStats = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load gamification stats:', error);
    }
  }

  /**
   * Reset all stats
   */
  reset() {
    this.userStats = {
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      totalFocusTime: 0,
      averageFocusLevel: 0,
      badges: [],
      achievements: [],
    };
    this.lastSessionDate = 0;
    this.saveStats();
  }
}

// Export singleton instance
export const gamificationEngine = new GamificationEngine();

