/**
 * Adaptive Audio Engine
 * Dynamically modulates audio based on focus metrics and brain state
 * Implements reward signals, calming signals, and resonance sweeps
 */

export interface AdaptiveAudioConfig {
  baseFrequency: number;
  beatFrequency: number;
  volume: number;
  targetVolume?: number;
  volumeTransitionTime?: number; // ms
  tempoMultiplier?: number; // 0.5 - 2.0
  resonanceSweep?: boolean;
  rewardSignal?: boolean;
}

export interface FocusMetricsWindow {
  focusValues: number[];
  timestamps: number[];
  maxWindow: number;
}

export class AdaptiveAudioController {
  private focusWindow: FocusMetricsWindow;
  private lastAdaptationTime = 0;
  private adaptationInterval = 2000; // ms
  private volumeTransitionInProgress = false;
  private currentVolume = 0.6;

  constructor(windowSize: number = 30) {
    this.focusWindow = {
      focusValues: [],
      timestamps: [],
      maxWindow: windowSize,
    };
  }

  /**
   * Add focus metric to rolling window
   */
  addFocusMetric(focusLevel: number, timestamp: number = Date.now()) {
    this.focusWindow.focusValues.push(focusLevel);
    this.focusWindow.timestamps.push(timestamp);

    // Keep window size limited
    if (this.focusWindow.focusValues.length > this.focusWindow.maxWindow) {
      this.focusWindow.focusValues.shift();
      this.focusWindow.timestamps.shift();
    }
  }

  /**
   * Calculate rolling average of focus
   */
  getRollingAverage(windowSize: number = 10): number {
    if (this.focusWindow.focusValues.length === 0) return 0.5;
    const recentValues = this.focusWindow.focusValues.slice(-windowSize);
    return recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
  }

  /**
   * Detect focus surge (sudden increase)
   */
  detectFocusSurge(threshold: number = 0.25): boolean {
    if (this.focusWindow.focusValues.length < 2) return false;
    const current = this.focusWindow.focusValues[this.focusWindow.focusValues.length - 1];
    const previous = this.focusWindow.focusValues[this.focusWindow.focusValues.length - 2];
    return current - previous > threshold;
  }

  /**
   * Detect focus drop (sudden decrease)
   */
  detectFocusDrop(threshold: number = 0.25): boolean {
    if (this.focusWindow.focusValues.length < 2) return false;
    const current = this.focusWindow.focusValues[this.focusWindow.focusValues.length - 1];
    const previous = this.focusWindow.focusValues[this.focusWindow.focusValues.length - 2];
    return previous - current > threshold;
  }

  /**
   * Detect focus stabilization (low variance)
   */
  detectFocusStabilization(windowSize: number = 10, varianceThreshold: number = 0.05): boolean {
    if (this.focusWindow.focusValues.length < windowSize) return false;
    const recentValues = this.focusWindow.focusValues.slice(-windowSize);
    const mean = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const variance = recentValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentValues.length;
    return variance < varianceThreshold;
  }

  /**
   * Detect chaotic rhythm (high variance)
   */
  detectChaoticRhythm(windowSize: number = 10, varianceThreshold: number = 0.15): boolean {
    if (this.focusWindow.focusValues.length < windowSize) return false;
    const recentValues = this.focusWindow.focusValues.slice(-windowSize);
    const mean = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
    const variance = recentValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentValues.length;
    return variance > varianceThreshold;
  }

  /**
   * Calculate adaptive audio config based on focus metrics
   */
  calculateAdaptiveConfig(
    baseBeatFrequency: number,
    baseVolume: number,
    focusLevel: number
  ): AdaptiveAudioConfig {
    const rollingAvg = this.getRollingAverage();
    const surge = this.detectFocusSurge();
    const drop = this.detectFocusDrop();
    const stabilized = this.detectFocusStabilization();
    const chaotic = this.detectChaoticRhythm();

    let config: AdaptiveAudioConfig = {
      baseFrequency: 200,
      beatFrequency: baseBeatFrequency,
      volume: baseVolume,
    };

    // Reward signal: increase frequency slightly during focus peaks
    if (surge && focusLevel > 0.75) {
      config.beatFrequency = baseBeatFrequency * 1.1; // Slight increase
      config.rewardSignal = true;
      config.targetVolume = Math.min(1, baseVolume * 1.15);
      config.volumeTransitionTime = 500;
    }

    // Calming signal: lower tempo when idle
    if (drop && focusLevel < 0.4) {
      config.beatFrequency = baseBeatFrequency * 0.85; // Slight decrease
      config.tempoMultiplier = 0.8;
      config.targetVolume = baseVolume * 0.8;
      config.volumeTransitionTime = 1000;
    }

    // Resonance sweep: when focus stabilizes
    if (stabilized && focusLevel > 0.6) {
      config.resonanceSweep = true;
      config.beatFrequency = baseBeatFrequency * 1.05;
    }

    // Chaos detection: nudge to energize
    if (chaotic) {
      config.beatFrequency = baseBeatFrequency * 1.2; // More energetic
      config.tempoMultiplier = 1.2;
    }

    // Adaptive volume based on rolling average
    if (rollingAvg >= 0.8) {
      config.targetVolume = Math.min(1, baseVolume * 1.2); // Boost for high focus
    } else if (rollingAvg <= 0.4) {
      config.targetVolume = baseVolume * 0.7; // Reduce for low focus
    }

    return config;
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    if (this.focusWindow.focusValues.length === 0) {
      return {
        averageFocus: 0,
        maxFocus: 0,
        minFocus: 0,
        focusStability: 0,
        sessionDuration: 0,
      };
    }

    const values = this.focusWindow.focusValues;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stability = 1 - Math.min(1, variance * 2); // Inverse of variance
    const duration = this.focusWindow.timestamps.length > 0
      ? this.focusWindow.timestamps[this.focusWindow.timestamps.length - 1] - this.focusWindow.timestamps[0]
      : 0;

    return {
      averageFocus: avg,
      maxFocus: max,
      minFocus: min,
      focusStability: stability,
      sessionDuration: duration,
    };
  }

  /**
   * Reset window
   */
  reset() {
    this.focusWindow.focusValues = [];
    this.focusWindow.timestamps = [];
    this.lastAdaptationTime = 0;
  }
}

