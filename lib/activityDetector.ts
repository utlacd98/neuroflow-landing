/**
 * Activity Detection System
 * Tracks typing rhythm and detects focus vs distraction states
 */

export interface ActivityMetrics {
  typingSpeed: number; // keystrokes per minute
  focusLevel: number; // 0-1 (1 = highly focused)
  isActive: boolean;
  lastActivityTime: number;
  sessionDuration: number; // milliseconds
}

export interface SessionData {
  startTime: number;
  endTime?: number;
  activities: ActivityEvent[];
  focusScore: number;
  totalTypingTime: number;
  averageTypingSpeed: number;
}

export interface ActivityEvent {
  timestamp: number;
  type: 'keypress' | 'idle' | 'focus_change';
  data?: any;
}

export class ActivityDetector {
  private keyPressCount = 0;
  private lastKeyPressTime = 0;
  private idleThreshold = 5000; // 5 seconds
  private focusLevel = 0.5;
  private isActive = false;
  private sessionData: SessionData;
  private listeners: ((metrics: ActivityMetrics) => void)[] = [];
  private idleTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      activities: [],
      focusScore: 0,
      totalTypingTime: 0,
      averageTypingSpeed: 0,
    };

    if (typeof window !== 'undefined') {
      this.setupListeners();
    }
  }

  private setupListeners() {
    document.addEventListener('keydown', () => this.onKeyPress());
    document.addEventListener('keyup', () => this.onKeyUp());
    document.addEventListener('mousemove', () => this.onActivity());
    document.addEventListener('touchstart', () => this.onActivity());
    document.addEventListener('touchmove', () => this.onActivity());
    document.addEventListener('click', () => this.onKeyPress());
  }

  private onKeyPress() {
    const now = Date.now();
    this.keyPressCount++;
    this.lastKeyPressTime = now;
    this.isActive = true;

    // Clear idle timer
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    // Increase focus level more aggressively when typing
    this.focusLevel = Math.min(1, this.focusLevel + 0.15);

    this.sessionData.activities.push({
      timestamp: now,
      type: 'keypress',
      data: { keyCount: this.keyPressCount },
    });

    this.notifyListeners();
  }

  private onKeyUp() {
    // Set idle timer
    this.idleTimer = setTimeout(() => {
      this.onIdle();
    }, this.idleThreshold);
  }

  private onActivity() {
    const now = Date.now();
    if (now - this.lastKeyPressTime > this.idleThreshold) {
      this.isActive = true;
      this.lastKeyPressTime = now;
    }
  }

  private onIdle() {
    this.isActive = false;
    // Decrease focus level when idle
    this.focusLevel = Math.max(0, this.focusLevel - 0.15);

    this.sessionData.activities.push({
      timestamp: Date.now(),
      type: 'idle',
    });

    this.notifyListeners();
  }

  private notifyListeners() {
    const metrics = this.getMetrics();
    this.listeners.forEach(listener => listener(metrics));
  }

  /**
   * Get current activity metrics
   */
  getMetrics(): ActivityMetrics {
    const now = Date.now();
    const sessionDuration = now - this.sessionData.startTime;

    // Calculate typing speed (keystrokes per minute)
    const minutesElapsed = sessionDuration / 60000;
    const typingSpeed = minutesElapsed > 0 ? this.keyPressCount / minutesElapsed : 0;

    return {
      typingSpeed: Math.round(typingSpeed),
      focusLevel: this.focusLevel,
      isActive: this.isActive,
      lastActivityTime: this.lastKeyPressTime,
      sessionDuration,
    };
  }

  /**
   * Subscribe to activity changes
   */
  onMetricsChange(callback: (metrics: ActivityMetrics) => void) {
    this.listeners.push(callback);
  }

  /**
   * End session and calculate final metrics
   */
  endSession(): SessionData {
    const now = Date.now();
    this.sessionData.endTime = now;

    // Calculate focus score (0-100)
    const totalTime = now - this.sessionData.startTime;
    const typingEvents = this.sessionData.activities.filter(a => a.type === 'keypress').length;
    this.sessionData.focusScore = Math.round((typingEvents / (totalTime / 1000)) * 10);
    this.sessionData.focusScore = Math.min(100, this.sessionData.focusScore);

    // Calculate average typing speed
    const minutesElapsed = totalTime / 60000;
    this.sessionData.averageTypingSpeed = minutesElapsed > 0 ? this.keyPressCount / minutesElapsed : 0;
    this.sessionData.totalTypingTime = totalTime;

    return this.sessionData;
  }

  /**
   * Get current session data
   */
  getSessionData(): SessionData {
    return this.sessionData;
  }

  /**
   * Reset detector for new session
   */
  reset() {
    this.keyPressCount = 0;
    this.lastKeyPressTime = 0;
    this.focusLevel = 0.5;
    this.isActive = false;
    this.sessionData = {
      startTime: Date.now(),
      activities: [],
      focusScore: 0,
      totalTypingTime: 0,
      averageTypingSpeed: 0,
    };
  }
}

export const activityDetector = new ActivityDetector();

