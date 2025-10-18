/**
 * NeuroFlow AI Coach
 * Analyzes session patterns and provides personalized neuroscience-based coaching
 */

export interface SessionPattern {
  focusStability: number; // 0-1
  averageFocus: number; // 0-1
  peakFocus: number; // 0-1
  fatigueOnset: number; // minutes
  optimalDuration: number; // minutes
  preferredFrequency: string; // e.g., "40 Hz"
  timeOfDay: string; // e.g., "morning", "afternoon"
}

export interface CoachingRecommendation {
  summary: string;
  patterns: string[];
  recommendations: string[];
  nextSessionTips: string[];
  estimatedOptimalDuration: number; // minutes
}

export class NeuroCoach {
  private sessionHistory: SessionPattern[] = [];
  private maxHistorySize = 30; // Last 30 sessions

  /**
   * Record session pattern
   */
  recordSession(pattern: SessionPattern) {
    this.sessionHistory.push(pattern);
    if (this.sessionHistory.length > this.maxHistorySize) {
      this.sessionHistory.shift();
    }
  }

  /**
   * Analyze focus stability patterns
   */
  private analyzeFocusStability(): {
    averageStability: number;
    trend: 'improving' | 'declining' | 'stable';
  } {
    if (this.sessionHistory.length === 0) {
      return { averageStability: 0.5, trend: 'stable' };
    }

    const recentSessions = this.sessionHistory.slice(-10);
    const averageStability = recentSessions.reduce((sum, s) => sum + s.focusStability, 0) / recentSessions.length;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentSessions.length >= 5) {
      const firstHalf = recentSessions.slice(0, Math.floor(recentSessions.length / 2));
      const secondHalf = recentSessions.slice(Math.floor(recentSessions.length / 2));
      const avgFirst = firstHalf.reduce((sum, s) => sum + s.focusStability, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((sum, s) => sum + s.focusStability, 0) / secondHalf.length;

      if (avgSecond > avgFirst + 0.1) trend = 'improving';
      else if (avgSecond < avgFirst - 0.1) trend = 'declining';
    }

    return { averageStability, trend };
  }

  /**
   * Detect fatigue patterns
   */
  private detectFatiguePatterns(): {
    averageFatigueOnset: number;
    fatiguePattern: 'early' | 'late' | 'consistent';
  } {
    if (this.sessionHistory.length === 0) {
      return { averageFatigueOnset: 22, fatiguePattern: 'consistent' };
    }

    const fatigueOnsets = this.sessionHistory.map((s) => s.fatigueOnset);
    const averageFatigueOnset = fatigueOnsets.reduce((a, b) => a + b, 0) / fatigueOnsets.length;

    const variance = fatigueOnsets.reduce((sum, val) => sum + Math.pow(val - averageFatigueOnset, 2), 0) / fatigueOnsets.length;
    const stdDev = Math.sqrt(variance);

    let fatiguePattern: 'early' | 'late' | 'consistent' = 'consistent';
    if (stdDev > 10) {
      fatiguePattern = averageFatigueOnset < 20 ? 'early' : 'late';
    }

    return { averageFatigueOnset, fatiguePattern };
  }

  /**
   * Identify optimal session duration
   */
  private identifyOptimalDuration(): number {
    if (this.sessionHistory.length === 0) return 45;

    const recentSessions = this.sessionHistory.slice(-10);
    const avgDuration = recentSessions.reduce((sum, s) => sum + s.optimalDuration, 0) / recentSessions.length;

    // Optimal duration is typically 5-10 minutes before fatigue onset
    const fatigueData = this.detectFatiguePatterns();
    return Math.max(25, Math.min(60, fatigueData.averageFatigueOnset - 5));
  }

  /**
   * Generate personalized coaching recommendations
   */
  generateRecommendations(currentSessionStats: {
    focusStability: number;
    averageFocus: number;
    peakFocus: number;
    fatigueOnset: number;
    sessionDuration: number;
  }): CoachingRecommendation {
    const stabilityAnalysis = this.analyzeFocusStability();
    const fatigueAnalysis = this.detectFatiguePatterns();
    const optimalDuration = this.identifyOptimalDuration();

    const patterns: string[] = [];
    const recommendations: string[] = [];
    const nextSessionTips: string[] = [];

    // Pattern analysis
    if (stabilityAnalysis.averageStability > 0.75) {
      patterns.push(`You maintained ${Math.round(stabilityAnalysis.averageStability * 100)}% focus stability - excellent consistency!`);
    } else if (stabilityAnalysis.averageStability > 0.6) {
      patterns.push(`Your focus stability is ${Math.round(stabilityAnalysis.averageStability * 100)}% - room for improvement.`);
    } else {
      patterns.push(`Focus stability at ${Math.round(stabilityAnalysis.averageStability * 100)}% - consider shorter sessions.`);
    }

    if (stabilityAnalysis.trend === 'improving') {
      patterns.push('Your focus stability is improving over time - great progress!');
    } else if (stabilityAnalysis.trend === 'declining') {
      patterns.push('Your focus stability is declining - consider taking more breaks.');
    }

    patterns.push(`Fatigue typically sets in after ${Math.round(fatigueAnalysis.averageFatigueOnset)} minutes.`);

    // Recommendations
    if (currentSessionStats.focusStability > 0.8) {
      recommendations.push('Your rhythm suggests you\'re in an optimal state. Maintain this momentum!');
    } else if (currentSessionStats.focusStability < 0.5) {
      recommendations.push('Consider switching to Calm mode to reset your focus rhythm.');
    }

    if (currentSessionStats.fatigueOnset < 15) {
      recommendations.push('Fatigue is setting in quickly. Try shorter, more frequent sessions.');
      nextSessionTips.push('Start with a 15-minute session and take a 5-minute break.');
    } else if (currentSessionStats.fatigueOnset > 30) {
      recommendations.push('You have good endurance. You can extend sessions to 45-50 minutes.');
      nextSessionTips.push('Try a 45-minute focused session with a 10-minute break midway.');
    }

    if (currentSessionStats.sessionDuration > optimalDuration + 10) {
      recommendations.push(`You worked ${Math.round(currentSessionStats.sessionDuration - optimalDuration)} minutes past optimal duration. Take a longer break next time.`);
    }

    // Next session tips
    if (!nextSessionTips.length) {
      nextSessionTips.push(`Aim for ${optimalDuration}-minute sessions based on your patterns.`);
      nextSessionTips.push('Start with Focus mode and switch to Calm if focus drops below 50%.');
      nextSessionTips.push('Take a 5-minute break every 25-30 minutes for best results.');
    }

    const summary = `You maintained ${Math.round(currentSessionStats.focusStability * 100)}% focus stability for ${Math.round(currentSessionStats.sessionDuration)} minutes. Your rhythm suggests ${fatigueAnalysis.fatiguePattern} fatigue onset around ${Math.round(fatigueAnalysis.averageFatigueOnset)} minutes.`;

    return {
      summary,
      patterns,
      recommendations,
      nextSessionTips,
      estimatedOptimalDuration: optimalDuration,
    };
  }

  /**
   * Get frequency preference based on history
   */
  getFrequencyPreference(): string {
    if (this.sessionHistory.length === 0) return '40 Hz (Gamma)';

    const frequencies = this.sessionHistory.map((s) => s.preferredFrequency);
    const frequencyCount: Record<string, number> = {};

    frequencies.forEach((freq) => {
      frequencyCount[freq] = (frequencyCount[freq] || 0) + 1;
    });

    const mostCommon = Object.entries(frequencyCount).sort((a, b) => b[1] - a[1])[0];
    return mostCommon ? mostCommon[0] : '40 Hz (Gamma)';
  }

  /**
   * Get time-of-day analysis
   */
  getTimeOfDayAnalysis() {
    if (this.sessionHistory.length === 0) {
      return { bestTime: 'morning', focusByTime: {} };
    }

    const focusByTime: Record<string, number[]> = {};
    this.sessionHistory.forEach((session) => {
      if (!focusByTime[session.timeOfDay]) {
        focusByTime[session.timeOfDay] = [];
      }
      focusByTime[session.timeOfDay].push(session.averageFocus);
    });

    const avgByTime: Record<string, number> = {};
    Object.entries(focusByTime).forEach(([time, values]) => {
      avgByTime[time] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    const bestTime = Object.entries(avgByTime).sort((a, b) => b[1] - a[1])[0]?.[0] || 'morning';

    return { bestTime, focusByTime: avgByTime };
  }

  /**
   * Clear history
   */
  reset() {
    this.sessionHistory = [];
  }
}

// Export singleton instance
export const neuroCoach = new NeuroCoach();

