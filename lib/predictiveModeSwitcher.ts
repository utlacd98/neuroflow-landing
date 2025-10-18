/**
 * Predictive Mode Switcher
 * Analyzes focus patterns and suggests optimal mode transitions
 * Uses rolling averages to detect focus trends
 */

export type BrainWaveMode = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
export type UserMode = 'focus' | 'calm' | 'energize';

export interface ModeSuggestion {
  suggestedMode: UserMode;
  confidence: number; // 0-1
  reason: string;
  action: 'auto-switch' | 'suggest' | 'fade';
}

export interface FocusTrend {
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number; // 0-1
  volatility: number; // 0-1
}

export class PredictiveModeSwitcher {
  private focusHistory: number[] = [];
  private maxHistorySize = 180; // 3 minutes at 1 sample/second
  private lastSuggestionTime = 0;
  private suggestionCooldown = 30000; // 30 seconds

  /**
   * Add focus metric to history
   */
  addFocusMetric(focusLevel: number) {
    this.focusHistory.push(focusLevel);
    if (this.focusHistory.length > this.maxHistorySize) {
      this.focusHistory.shift();
    }
  }

  /**
   * Calculate rolling average over specified window
   */
  private getRollingAverage(windowSize: number): number {
    if (this.focusHistory.length === 0) return 0.5;
    const window = this.focusHistory.slice(-windowSize);
    return window.reduce((a, b) => a + b, 0) / window.length;
  }

  /**
   * Analyze focus trend
   */
  analyzeFocusTrend(windowSize: number = 60): FocusTrend {
    if (this.focusHistory.length < windowSize) {
      return { direction: 'stable', magnitude: 0, volatility: 0 };
    }

    const window = this.focusHistory.slice(-windowSize);
    const firstHalf = window.slice(0, Math.floor(windowSize / 2));
    const secondHalf = window.slice(Math.floor(windowSize / 2));

    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const direction = avgSecond > avgFirst + 0.05 ? 'increasing' : avgSecond < avgFirst - 0.05 ? 'decreasing' : 'stable';
    const magnitude = Math.abs(avgSecond - avgFirst);

    // Calculate volatility (variance)
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / window.length;
    const volatility = Math.sqrt(variance);

    return { direction, magnitude, volatility };
  }

  /**
   * Get mode suggestion based on focus metrics
   */
  getSuggestion(currentMode: UserMode): ModeSuggestion | null {
    const now = Date.now();
    if (now - this.lastSuggestionTime < this.suggestionCooldown) {
      return null;
    }

    const avg2min = this.getRollingAverage(120);
    const avg3min = this.getRollingAverage(180);
    const trend = this.analyzeFocusTrend();

    // Focus drops >25% → suggest Calm Mode
    if (avg2min < avg3min - 0.25 && avg2min < 0.5) {
      this.lastSuggestionTime = now;
      return {
        suggestedMode: 'calm',
        confidence: Math.min(1, (avg3min - avg2min) / 0.5),
        reason: 'Focus dropping detected. Calm mode can help reset.',
        action: 'suggest',
      };
    }

    // Focus peaks & stabilizes → fade into Flow Mode (energize)
    if (avg2min > 0.75 && trend.volatility < 0.1 && trend.direction === 'stable') {
      this.lastSuggestionTime = now;
      return {
        suggestedMode: 'energize',
        confidence: 0.8,
        reason: 'You\'re in a flow state! Energize mode can sustain momentum.',
        action: 'fade',
      };
    }

    // Rhythm becomes chaotic → nudge to Energize Mode
    if (trend.volatility > 0.15) {
      this.lastSuggestionTime = now;
      return {
        suggestedMode: 'energize',
        confidence: Math.min(1, trend.volatility),
        reason: 'Chaotic rhythm detected. Energize mode can stabilize focus.',
        action: 'suggest',
      };
    }

    // Sustained high focus → stay in Focus Mode
    if (avg2min > 0.8 && trend.direction === 'stable') {
      this.lastSuggestionTime = now;
      return {
        suggestedMode: 'focus',
        confidence: 0.9,
        reason: 'Excellent focus! Maintaining current mode.',
        action: 'auto-switch',
      };
    }

    return null;
  }

  /**
   * Predict fatigue based on session duration and focus patterns
   */
  predictFatigue(sessionDurationMs: number): {
    fatigueLevel: number; // 0-1
    estimatedTimeToFatigue: number; // ms
    recommendation: string;
  } {
    const sessionMinutes = sessionDurationMs / 60000;
    const avg5min = this.getRollingAverage(300);
    const trend = this.analyzeFocusTrend(300);

    // Base fatigue increases with session duration
    let fatigueLevel = Math.min(1, sessionMinutes / 60); // Full fatigue at 60 minutes

    // Adjust based on focus trend
    if (trend.direction === 'decreasing') {
      fatigueLevel += 0.2;
    }

    // Adjust based on current focus level
    if (avg5min < 0.4) {
      fatigueLevel += 0.15;
    }

    fatigueLevel = Math.min(1, fatigueLevel);

    // Estimate time to critical fatigue (0.8)
    const estimatedTimeToFatigue = fatigueLevel >= 0.8 ? 0 : Math.max(0, (0.8 - fatigueLevel) * 60000);

    let recommendation = '';
    if (fatigueLevel >= 0.8) {
      recommendation = 'Critical fatigue detected. Take a 5-10 minute break.';
    } else if (fatigueLevel >= 0.6) {
      recommendation = 'Moderate fatigue. Consider a 3-minute reset tone.';
    } else if (fatigueLevel >= 0.4) {
      recommendation = 'Light fatigue building. Stay hydrated and take breaks.';
    } else {
      recommendation = 'Energy levels good. Keep up the momentum!';
    }

    return { fatigueLevel, estimatedTimeToFatigue, recommendation };
  }

  /**
   * Get detailed session analysis
   */
  analyzeSession(sessionDurationMs: number) {
    const trend = this.analyzeFocusTrend();
    const avg2min = this.getRollingAverage(120);
    const fatigue = this.predictFatigue(sessionDurationMs);

    return {
      focusTrend: trend,
      currentFocusAvg: avg2min,
      fatigueAnalysis: fatigue,
      sessionDurationMinutes: sessionDurationMs / 60000,
    };
  }

  /**
   * Reset history
   */
  reset() {
    this.focusHistory = [];
    this.lastSuggestionTime = 0;
  }
}

// Export singleton instance
export const predictiveModeSwitcher = new PredictiveModeSwitcher();

