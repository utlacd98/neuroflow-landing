/**
 * AI Insights Engine
 * Generates session narratives, progress analysis, and goal tracking
 */

export interface SessionNarrative {
  title: string;
  narrative: string;
  mentalStateJourney: string;
  keyInsights: string[];
  recommendations: string[];
}

export interface ProgressMetrics {
  weeklyAvgFocus: number;
  weeklyTrend: 'improving' | 'declining' | 'stable';
  monthlyAvgFocus: number;
  monthlyTrend: 'improving' | 'declining' | 'stable';
  timeInEachMode: Record<string, number>; // minutes
  focusDurationTrend: number[]; // Last 7 sessions
}

export interface FocusGoal {
  id: string;
  name: string;
  targetFocusLevel: number; // 0-1
  targetDuration: number; // minutes
  createdAt: number;
  completedSessions: number;
  currentStreak: number;
  bestStreak: number;
}

export class AIInsightsEngine {
  private sessionHistory: Array<{
    timestamp: number;
    duration: number;
    focusLevel: number;
    mode: string;
    frequency: number;
  }> = [];
  private goals: FocusGoal[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Record session for analysis
   */
  recordSession(duration: number, focusLevel: number, mode: string, frequency: number) {
    this.sessionHistory.push({
      timestamp: Date.now(),
      duration,
      focusLevel,
      mode,
      frequency,
    });

    if (this.sessionHistory.length > this.maxHistorySize) {
      this.sessionHistory.shift();
    }

    this.updateGoalProgress(focusLevel, duration);
    this.saveToStorage();
  }

  /**
   * Generate session narrative
   */
  generateSessionNarrative(
    duration: number,
    focusLevel: number,
    focusDropTime: number,
    mode: string
  ): SessionNarrative {
    const mentalStateJourney = this.generateMentalStateJourney(focusLevel, focusDropTime, duration);
    const keyInsights = this.extractKeyInsights(focusLevel, duration, mode);
    const recommendations = this.generateRecommendations(focusLevel, duration, focusDropTime);

    const title = this.generateTitle(focusLevel, duration);

    return {
      title,
      narrative: mentalStateJourney,
      mentalStateJourney,
      keyInsights,
      recommendations,
    };
  }

  /**
   * Generate mental state journey narrative
   */
  private generateMentalStateJourney(focusLevel: number, focusDropTime: number, duration: number): string {
    let narrative = '';

    if (focusLevel < 0.3) {
      narrative = `You began in mild distraction, but gradually found your rhythm. `;
    } else if (focusLevel < 0.6) {
      narrative = `You started with moderate focus and maintained steady concentration. `;
    } else if (focusLevel < 0.8) {
      narrative = `You began with strong focus and sustained excellent concentration. `;
    } else {
      narrative = `You entered a deep flow state with exceptional focus throughout. `;
    }

    if (focusDropTime > 0 && focusDropTime < duration) {
      narrative += `After ${Math.round(focusDropTime)} minutes, you experienced a focus dip but recovered well. `;
    } else if (focusDropTime >= duration) {
      narrative += `You maintained consistent focus throughout the entire session. `;
    }

    narrative += `Your neuro-resilience score: ${Math.round(focusLevel * 100)}%.`;

    return narrative;
  }

  /**
   * Extract key insights
   */
  private extractKeyInsights(focusLevel: number, duration: number, mode: string): string[] {
    const insights: string[] = [];

    // Focus level insights
    if (focusLevel >= 0.9) {
      insights.push('Exceptional focus stability — you\'re in peak cognitive state');
    } else if (focusLevel >= 0.75) {
      insights.push('Strong focus with good mental clarity');
    } else if (focusLevel >= 0.5) {
      insights.push('Moderate focus — consider shorter sessions next time');
    } else {
      insights.push('Low focus — try a different time of day or frequency');
    }

    // Duration insights
    if (duration >= 45) {
      insights.push('Impressive session length — you have strong endurance');
    } else if (duration >= 25) {
      insights.push('Good session duration for deep work');
    } else {
      insights.push('Short session — consider extending next time');
    }

    // Mode insights
    if (mode === 'focus') {
      insights.push('Gamma waves are supporting your peak cognitive processing');
    } else if (mode === 'calm') {
      insights.push('Alpha waves are promoting relaxed focus and creativity');
    } else if (mode === 'energize') {
      insights.push('Beta waves are enhancing active thinking and problem-solving');
    }

    return insights;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(focusLevel: number, duration: number, focusDropTime: number): string[] {
    const recommendations: string[] = [];

    if (focusLevel < 0.5) {
      recommendations.push('Try a different frequency next session — your brain might respond better to Alpha waves');
      recommendations.push('Consider a shorter session (20-25 min) to build momentum');
    }

    if (focusDropTime > 0 && focusDropTime < 20) {
      recommendations.push('Your focus dips early — try a 5-minute warm-up session first');
    }

    if (duration > 60) {
      recommendations.push('You\'re pushing hard — remember to take breaks every 25-30 minutes');
    }

    if (focusLevel >= 0.8) {
      recommendations.push('You\'re in flow — try extending your next session by 5-10 minutes');
    }

    return recommendations;
  }

  /**
   * Generate session title
   */
  private generateTitle(focusLevel: number, duration: number): string {
    if (focusLevel >= 0.9 && duration >= 45) {
      return '🔥 Peak Flow Session';
    } else if (focusLevel >= 0.8) {
      return '⚡ Strong Focus Session';
    } else if (focusLevel >= 0.6) {
      return '🎯 Solid Session';
    } else if (focusLevel >= 0.4) {
      return '🌱 Building Momentum';
    } else {
      return '🌊 Exploratory Session';
    }
  }

  /**
   * Get progress metrics
   */
  getProgressMetrics(): ProgressMetrics {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const weekSessions = this.sessionHistory.filter((s) => s.timestamp > weekAgo);
    const monthSessions = this.sessionHistory.filter((s) => s.timestamp > monthAgo);

    const weeklyAvgFocus = weekSessions.length > 0
      ? weekSessions.reduce((sum, s) => sum + s.focusLevel, 0) / weekSessions.length
      : 0;

    const monthlyAvgFocus = monthSessions.length > 0
      ? monthSessions.reduce((sum, s) => sum + s.focusLevel, 0) / monthSessions.length
      : 0;

    // Calculate trends
    const weeklyTrend = this.calculateTrend(weekSessions);
    const monthlyTrend = this.calculateTrend(monthSessions);

    // Time in each mode
    const timeInEachMode: Record<string, number> = {};
    weekSessions.forEach((s) => {
      timeInEachMode[s.mode] = (timeInEachMode[s.mode] || 0) + s.duration;
    });

    // Focus duration trend (last 7 sessions)
    const focusDurationTrend = this.sessionHistory.slice(-7).map((s) => s.focusLevel);

    return {
      weeklyAvgFocus,
      weeklyTrend,
      monthlyAvgFocus,
      monthlyTrend,
      timeInEachMode,
      focusDurationTrend,
    };
  }

  /**
   * Calculate trend
   */
  private calculateTrend(sessions: typeof this.sessionHistory): 'improving' | 'declining' | 'stable' {
    if (sessions.length < 2) return 'stable';

    const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2));
    const secondHalf = sessions.slice(Math.floor(sessions.length / 2));

    const avgFirst = firstHalf.reduce((sum, s) => sum + s.focusLevel, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, s) => sum + s.focusLevel, 0) / secondHalf.length;

    if (avgSecond > avgFirst + 0.1) return 'improving';
    if (avgSecond < avgFirst - 0.1) return 'declining';
    return 'stable';
  }

  /**
   * Create focus goal
   */
  createGoal(name: string, targetFocusLevel: number, targetDuration: number): FocusGoal {
    const goal: FocusGoal = {
      id: `goal_${Date.now()}`,
      name,
      targetFocusLevel,
      targetDuration,
      createdAt: Date.now(),
      completedSessions: 0,
      currentStreak: 0,
      bestStreak: 0,
    };

    this.goals.push(goal);
    this.saveToStorage();
    return goal;
  }

  /**
   * Update goal progress
   */
  private updateGoalProgress(focusLevel: number, duration: number) {
    this.goals.forEach((goal) => {
      if (focusLevel >= goal.targetFocusLevel && duration >= goal.targetDuration) {
        goal.completedSessions++;
        goal.currentStreak++;
        if (goal.currentStreak > goal.bestStreak) {
          goal.bestStreak = goal.currentStreak;
        }
      } else {
        goal.currentStreak = 0;
      }
    });
  }

  /**
   * Get goals
   */
  getGoals(): FocusGoal[] {
    return this.goals;
  }

  /**
   * Save to storage
   */
  private saveToStorage() {
    try {
      localStorage.setItem('neuroflow_insights', JSON.stringify({
        sessionHistory: this.sessionHistory,
        goals: this.goals,
      }));
    } catch (error) {
      console.error('Failed to save insights:', error);
    }
  }

  /**
   * Load from storage
   */
  private loadFromStorage() {
    try {
      const saved = localStorage.getItem('neuroflow_insights');
      if (saved) {
        const data = JSON.parse(saved);
        this.sessionHistory = data.sessionHistory || [];
        this.goals = data.goals || [];
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  }

  /**
   * Reset
   */
  reset() {
    this.sessionHistory = [];
    this.goals = [];
    localStorage.removeItem('neuroflow_insights');
  }
}

// Export singleton instance
export const aiInsightsEngine = new AIInsightsEngine();

