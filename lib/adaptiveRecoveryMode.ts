/**
 * Adaptive Recovery Mode
 * Detects low focus for extended periods and automatically fades into theta/relaxation soundscape
 * Helps users recover from fatigue and maintain sustainable focus sessions
 */

export interface RecoveryState {
  isActive: boolean;
  lowFocusDuration: number; // ms
  recoveryIntensity: number; // 0-1
  targetFrequency: number; // Hz (theta: 4-8)
  message: string;
}

export class AdaptiveRecoveryMode {
  private lowFocusThreshold = 30; // Focus score below this triggers recovery
  private recoveryTriggerDuration = 120000; // 2 minutes of low focus
  private lowFocusStartTime: number | null = null;
  private isRecoveryActive = false;
  private recoveryIntensity = 0;
  private maxRecoveryIntensity = 1;
  private recoveryFadeInDuration = 5000; // 5 seconds to fade in
  private recoveryFadeOutDuration = 3000; // 3 seconds to fade out
  private recoveryStartTime: number | null = null;
  private listeners: ((state: RecoveryState) => void)[] = [];

  /**
   * Update recovery mode based on focus score
   */
  updateFocusScore(focusScore: number): RecoveryState {
    const now = Date.now();

    // Check if focus is low
    if (focusScore < this.lowFocusThreshold) {
      // Start tracking low focus time
      if (!this.lowFocusStartTime) {
        this.lowFocusStartTime = now;
      }

      const lowFocusDuration = now - this.lowFocusStartTime;

      // Trigger recovery if low focus persists
      if (lowFocusDuration >= this.recoveryTriggerDuration && !this.isRecoveryActive) {
        this.activateRecovery();
      }

      // Update recovery intensity if active
      if (this.isRecoveryActive && this.recoveryStartTime) {
        const recoveryElapsed = now - this.recoveryStartTime;
        this.recoveryIntensity = Math.min(
          this.maxRecoveryIntensity,
          recoveryElapsed / this.recoveryFadeInDuration
        );
      }

      return this.getRecoveryState(lowFocusDuration);
    } else {
      // Focus recovered - deactivate recovery mode
      if (this.isRecoveryActive) {
        this.deactivateRecovery();
      }

      // Reset low focus tracking
      this.lowFocusStartTime = null;

      return {
        isActive: false,
        lowFocusDuration: 0,
        recoveryIntensity: 0,
        targetFrequency: 0,
        message: 'Focus recovered',
      };
    }
  }

  /**
   * Activate recovery mode
   */
  private activateRecovery() {
    this.isRecoveryActive = true;
    this.recoveryStartTime = Date.now();
    this.recoveryIntensity = 0;

    this.notifyListeners(this.getRecoveryState(this.recoveryTriggerDuration));
  }

  /**
   * Deactivate recovery mode
   */
  private deactivateRecovery() {
    this.isRecoveryActive = false;
    this.recoveryIntensity = 0;
    this.recoveryStartTime = null;

    this.notifyListeners({
      isActive: false,
      lowFocusDuration: 0,
      recoveryIntensity: 0,
      targetFrequency: 0,
      message: 'Recovery mode deactivated',
    });
  }

  /**
   * Get current recovery state
   */
  private getRecoveryState(lowFocusDuration: number): RecoveryState {
    let message = '';
    let targetFrequency = 0;

    if (!this.isRecoveryActive) {
      const secondsUntilRecovery = Math.ceil(
        (this.recoveryTriggerDuration - lowFocusDuration) / 1000
      );
      message = `Low focus detected. Recovery in ${secondsUntilRecovery}s...`;
    } else {
      // Theta frequency (4-8 Hz) for relaxation
      targetFrequency = 4 + this.recoveryIntensity * 4; // 4-8 Hz
      const recoveryPercent = Math.round(this.recoveryIntensity * 100);
      message = `Recovery mode active (${recoveryPercent}%) - Theta waves (${targetFrequency.toFixed(1)} Hz)`;
    }

    return {
      isActive: this.isRecoveryActive,
      lowFocusDuration,
      recoveryIntensity: this.recoveryIntensity,
      targetFrequency,
      message,
    };
  }

  /**
   * Get target frequency for recovery mode
   */
  getTargetFrequency(): number {
    if (!this.isRecoveryActive) return 0;
    return 4 + this.recoveryIntensity * 4; // 4-8 Hz theta
  }

  /**
   * Get recovery intensity (0-1)
   */
  getRecoveryIntensity(): number {
    return this.recoveryIntensity;
  }

  /**
   * Check if recovery mode is active
   */
  isActive(): boolean {
    return this.isRecoveryActive;
  }

  /**
   * Listen for recovery state changes
   */
  onRecoveryStateChange(callback: (state: RecoveryState) => void) {
    this.listeners.push(callback);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(state: RecoveryState) {
    this.listeners.forEach((listener) => listener(state));
  }

  /**
   * Reset recovery mode
   */
  reset() {
    this.lowFocusStartTime = null;
    this.isRecoveryActive = false;
    this.recoveryIntensity = 0;
    this.recoveryStartTime = null;
  }

  /**
   * Set custom thresholds
   */
  setThresholds(lowFocusThreshold: number, triggerDuration: number) {
    this.lowFocusThreshold = lowFocusThreshold;
    this.recoveryTriggerDuration = triggerDuration;
  }
}

export const adaptiveRecoveryMode = new AdaptiveRecoveryMode();

