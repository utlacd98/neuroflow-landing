/**
 * Focus Pattern Learner
 * Learns user's personal concentration rhythm and patterns
 * Predicts focus dips and suggests optimal frequencies
 */

export interface FocusPattern {
  timeOfDay: string; // 'morning', 'afternoon', 'evening'
  dayOfWeek: number; // 0-6
  averageDuration: number; // minutes
  focusDropTime: number; // minutes when focus typically drops
  optimalFrequency: number; // Hz
  successRate: number; // 0-1
}

export interface ConcentrationRhythm {
  patterns: FocusPattern[];
  peakHours: string[]; // Times when user is most focused
  lowEnergyHours: string[]; // Times when user struggles
  personalizedFrequency: number; // User's optimal frequency
  learningConfidence: number; // 0-1
}

export interface FocusDipPrediction {
  predictedTime: number; // minutes into session
  confidence: number; // 0-1
  suggestedFrequency: number; // Hz
  suggestedAction: 'break' | 'frequency_change' | 'mode_switch';
  reason: string;
}

export class FocusPatternLearner {
  private patterns: FocusPattern[] = [];
  private sessionHistory: Array<{
    timestamp: number;
    timeOfDay: string;
    dayOfWeek: number;
    duration: number;
    focusDropTime: number;
    frequency: number;
    successRate: number;
  }> = [];
  private maxHistorySize = 100;

  /**
   * Record a completed session
   */
  recordSession(
    duration: number,
    focusDropTime: number,
    frequency: number,
    successRate: number
  ) {
    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now.getHours());
    const dayOfWeek = now.getDay();

    this.sessionHistory.push({
      timestamp: Date.now(),
      timeOfDay,
      dayOfWeek,
      duration,
      focusDropTime,
      frequency,
      successRate,
    });

    if (this.sessionHistory.length > this.maxHistorySize) {
      this.sessionHistory.shift();
    }

    this.updatePatterns();
  }

  /**
   * Get time of day category
   */
  private getTimeOfDay(hour: number): string {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    return 'evening';
  }

  /**
   * Update learned patterns
   */
  private updatePatterns() {
    const patterns: Record<string, FocusPattern> = {};

    this.sessionHistory.forEach((session) => {
      const key = `${session.timeOfDay}_${session.dayOfWeek}`;

      if (!patterns[key]) {
        patterns[key] = {
          timeOfDay: session.timeOfDay,
          dayOfWeek: session.dayOfWeek,
          averageDuration: 0,
          focusDropTime: 0,
          optimalFrequency: 0,
          successRate: 0,
        };
      }

      const pattern = patterns[key];
      const count = this.sessionHistory.filter((s) => `${s.timeOfDay}_${s.dayOfWeek}` === key).length;

      pattern.averageDuration = (pattern.averageDuration * (count - 1) + session.duration) / count;
      pattern.focusDropTime = (pattern.focusDropTime * (count - 1) + session.focusDropTime) / count;
      pattern.optimalFrequency = (pattern.optimalFrequency * (count - 1) + session.frequency) / count;
      pattern.successRate = (pattern.successRate * (count - 1) + session.successRate) / count;
    });

    this.patterns = Object.values(patterns);
  }

  /**
   * Get current concentration rhythm
   */
  getConcentrationRhythm(): ConcentrationRhythm {
    if (this.patterns.length === 0) {
      return {
        patterns: [],
        peakHours: [],
        lowEnergyHours: [],
        personalizedFrequency: 40, // Default to Gamma
        learningConfidence: 0,
      };
    }

    // Find peak and low energy times
    const morningPatterns = this.patterns.filter((p) => p.timeOfDay === 'morning');
    const afternoonPatterns = this.patterns.filter((p) => p.timeOfDay === 'afternoon');
    const eveningPatterns = this.patterns.filter((p) => p.timeOfDay === 'evening');

    const avgMorning = morningPatterns.length > 0
      ? morningPatterns.reduce((sum, p) => sum + p.successRate, 0) / morningPatterns.length
      : 0;
    const avgAfternoon = afternoonPatterns.length > 0
      ? afternoonPatterns.reduce((sum, p) => sum + p.successRate, 0) / afternoonPatterns.length
      : 0;
    const avgEvening = eveningPatterns.length > 0
      ? eveningPatterns.reduce((sum, p) => sum + p.successRate, 0) / eveningPatterns.length
      : 0;

    const peakHours: string[] = [];
    const lowEnergyHours: string[] = [];

    if (avgMorning > 0.7) peakHours.push('morning');
    if (avgAfternoon > 0.7) peakHours.push('afternoon');
    if (avgEvening > 0.7) peakHours.push('evening');

    if (avgMorning < 0.5) lowEnergyHours.push('morning');
    if (avgAfternoon < 0.5) lowEnergyHours.push('afternoon');
    if (avgEvening < 0.5) lowEnergyHours.push('evening');

    // Calculate personalized frequency
    const avgFrequency = this.patterns.reduce((sum, p) => sum + p.optimalFrequency, 0) / this.patterns.length;

    // Calculate learning confidence
    const learningConfidence = Math.min(1, this.patterns.length / 20);

    return {
      patterns: this.patterns,
      peakHours,
      lowEnergyHours,
      personalizedFrequency: Math.round(avgFrequency),
      learningConfidence,
    };
  }

  /**
   * Predict when focus will dip
   */
  predictFocusDip(): FocusDipPrediction | null {
    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now.getHours());
    const dayOfWeek = now.getDay();

    const relevantPatterns = this.patterns.filter(
      (p) => p.timeOfDay === timeOfDay && p.dayOfWeek === dayOfWeek
    );

    if (relevantPatterns.length === 0) {
      return null;
    }

    const avgPattern = relevantPatterns[0];
    const predictedTime = Math.round(avgPattern.focusDropTime);
    const confidence = Math.min(1, relevantPatterns.length / 10);

    // Suggest frequency adjustment
    let suggestedFrequency = avgPattern.optimalFrequency;
    let suggestedAction: 'break' | 'frequency_change' | 'mode_switch' = 'frequency_change';

    if (avgPattern.successRate < 0.5) {
      suggestedAction = 'break';
      suggestedFrequency = 10; // Alpha for relaxation
    } else if (avgPattern.successRate < 0.7) {
      suggestedAction = 'frequency_change';
      suggestedFrequency = Math.max(10, avgPattern.optimalFrequency - 5);
    }

    return {
      predictedTime,
      confidence,
      suggestedFrequency,
      suggestedAction,
      reason: `Based on your ${timeOfDay} patterns, focus typically dips around ${predictedTime} minutes.`,
    };
  }

  /**
   * Get personalized frequency recommendation
   */
  getPersonalizedFrequency(): number {
    const rhythm = this.getConcentrationRhythm();
    return rhythm.personalizedFrequency;
  }

  /**
   * Get pre-session recommendations
   */
  getPreSessionRecommendations(): {
    suggestedFrequency: number;
    expectedDuration: number;
    tip: string;
  } {
    const now = new Date();
    const timeOfDay = this.getTimeOfDay(now.getHours());
    const dayOfWeek = now.getDay();

    const relevantPatterns = this.patterns.filter(
      (p) => p.timeOfDay === timeOfDay && p.dayOfWeek === dayOfWeek
    );

    if (relevantPatterns.length === 0) {
      return {
        suggestedFrequency: 40,
        expectedDuration: 45,
        tip: 'Starting to learn your patterns. Keep tracking sessions!',
      };
    }

    const pattern = relevantPatterns[0];
    const rhythm = this.getConcentrationRhythm();

    let tip = '';
    if (rhythm.peakHours.includes(timeOfDay)) {
      tip = `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} is your peak focus time. Great choice!`;
    } else if (rhythm.lowEnergyHours.includes(timeOfDay)) {
      tip = `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} is typically challenging for you. Consider a shorter session.`;
    }

    return {
      suggestedFrequency: Math.round(pattern.optimalFrequency),
      expectedDuration: Math.round(pattern.averageDuration),
      tip,
    };
  }

  /**
   * Get learning progress
   */
  getLearningProgress() {
    const rhythm = this.getConcentrationRhythm();
    return {
      sessionsAnalyzed: this.sessionHistory.length,
      patternsLearned: this.patterns.length,
      learningConfidence: Math.round(rhythm.learningConfidence * 100),
      personalizedFrequency: rhythm.personalizedFrequency,
      peakHours: rhythm.peakHours,
      lowEnergyHours: rhythm.lowEnergyHours,
    };
  }

  /**
   * Reset learning
   */
  reset() {
    this.patterns = [];
    this.sessionHistory = [];
  }
}

// Export singleton instance
export const focusPatternLearner = new FocusPatternLearner();

