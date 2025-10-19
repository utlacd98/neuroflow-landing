/**
 * Adaptive Frequency Modulator
 * Maps Focus Score (0-100) to brainwave frequencies and modulates audio in real-time
 * 
 * Focus Score → Brainwave Mapping:
 * 0-25:   Alpha (8-12 Hz) - Relax/Reset
 * 25-50:  Beta (13-20 Hz) - Light Focus
 * 50-75:  High Beta (20-30 Hz) - Deep Concentration
 * 75-100: Gamma (30-40 Hz) - Intense Learning
 */

export interface FrequencyConfig {
  baseFrequency: number; // Hz
  beatFrequency: number; // Hz (binaural beat)
  volume: number; // 0-1
  waveType: 'sine' | 'square' | 'sawtooth' | 'triangle';
  harmonic1: number; // Secondary frequency
  harmonic2: number; // Tertiary frequency
}

export interface BrainwaveState {
  focusScore: number;
  brainwaveType: 'alpha' | 'beta' | 'highbeta' | 'gamma';
  frequency: number;
  beatFrequency: number;
  intensity: number;
}

export class AdaptiveFrequencyModulator {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private masterGain: GainNode | null = null;
  private lowPassFilter: BiquadFilterNode | null = null;
  private noiseGate: GainNode | null = null;
  private isPlaying = false;
  private currentState: BrainwaveState | null = null;
  private transitionDuration = 0.8; // seconds - smoother transitions
  private lastFrequency = 0;
  private frequencyUpdateThreshold = 0.5; // Only update if frequency changes by >0.5 Hz
  private lastUpdateTime = 0;
  private minUpdateInterval = 100; // ms between updates

  async initialize(): Promise<boolean> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create noise gate (prevents static noise)
      this.noiseGate = this.audioContext.createGain();
      this.noiseGate.gain.value = 0; // Start silent

      // Create low-pass filter (removes high-frequency noise)
      this.lowPassFilter = this.audioContext.createBiquadFilter();
      this.lowPassFilter.type = 'lowpass';
      this.lowPassFilter.frequency.value = 200; // Cut off above 200 Hz
      this.lowPassFilter.Q.value = 1; // Gentle slope

      // Create master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.25; // Reduced from 0.3 to prevent clipping

      // Connect chain: noiseGate → lowPassFilter → masterGain → destination
      this.noiseGate.connect(this.lowPassFilter);
      this.lowPassFilter.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);

      return true;
    } catch (error) {
      console.error('Audio context initialization failed:', error);
      return false;
    }
  }

  /**
   * Map focus score to brainwave state
   */
  private mapFocusScoreToBrainwave(focusScore: number): BrainwaveState {
    let brainwaveType: 'alpha' | 'beta' | 'highbeta' | 'gamma';
    let frequency: number;
    let beatFrequency: number;
    let intensity: number;

    if (focusScore < 25) {
      // Alpha: Relax/Reset
      brainwaveType = 'alpha';
      frequency = 8 + (focusScore / 25) * 4; // 8-12 Hz
      beatFrequency = 10;
      intensity = 0.3;
    } else if (focusScore < 50) {
      // Beta: Light Focus
      brainwaveType = 'beta';
      frequency = 13 + ((focusScore - 25) / 25) * 7; // 13-20 Hz
      beatFrequency = 16;
      intensity = 0.5;
    } else if (focusScore < 75) {
      // High Beta: Deep Concentration
      brainwaveType = 'highbeta';
      frequency = 20 + ((focusScore - 50) / 25) * 10; // 20-30 Hz
      beatFrequency = 25;
      intensity = 0.7;
    } else {
      // Gamma: Intense Learning
      brainwaveType = 'gamma';
      frequency = 30 + ((focusScore - 75) / 25) * 10; // 30-40 Hz
      beatFrequency = 35;
      intensity = 0.9;
    }

    return {
      focusScore,
      brainwaveType,
      frequency,
      beatFrequency,
      intensity,
    };
  }

  /**
   * Update audio based on focus score with debouncing
   */
  updateFrequency(focusScore: number, volume: number = 0.25) {
    if (!this.audioContext || !this.masterGain) return;

    const now = Date.now();

    // Debounce: only update if enough time has passed
    if (now - this.lastUpdateTime < this.minUpdateInterval) {
      return;
    }

    const newState = this.mapFocusScoreToBrainwave(focusScore);

    // Only update if frequency changed significantly
    if (Math.abs(newState.frequency - this.lastFrequency) < this.frequencyUpdateThreshold) {
      return;
    }

    this.lastFrequency = newState.frequency;
    this.lastUpdateTime = now;

    // Smooth transition
    if (this.currentState) {
      this.transitionToState(newState, volume);
    } else {
      this.createOscillators(newState, volume);
    }

    this.currentState = newState;
  }

  /**
   * Create oscillators for the current state with smooth gain ramping
   */
  private createOscillators(state: BrainwaveState, volume: number) {
    if (!this.audioContext || !this.masterGain || !this.noiseGate) return;

    // Stop existing oscillators
    this.stopOscillators();

    const now = this.audioContext.currentTime;
    const rampTime = 0.1; // 100ms ramp-in

    // Create base frequency oscillator
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(state.frequency, now);

    const gain1 = this.audioContext.createGain();
    gain1.gain.setValueAtTime(0, now); // Start at 0
    gain1.gain.linearRampToValueAtTime(volume * state.intensity * 0.6, now + rampTime);

    osc1.connect(gain1);
    gain1.connect(this.noiseGate);
    osc1.start();

    // Create binaural beat oscillator (right channel simulation)
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(state.frequency + state.beatFrequency, now);

    const gain2 = this.audioContext.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(volume * state.intensity * 0.4, now + rampTime);

    osc2.connect(gain2);
    gain2.connect(this.noiseGate);
    osc2.start();

    // Create harmonic (adds richness)
    const osc3 = this.audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(state.frequency * 2, now); // Octave up

    const gain3 = this.audioContext.createGain();
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(volume * state.intensity * 0.2, now + rampTime);

    osc3.connect(gain3);
    gain3.connect(this.noiseGate);
    osc3.start();

    // Enable noise gate
    this.noiseGate.gain.setValueAtTime(1, now);

    this.oscillators = [osc1, osc2, osc3];
    this.gainNodes = [gain1, gain2, gain3];
    this.isPlaying = true;
  }

  /**
   * Smooth transition between states with exponential ramping
   */
  private transitionToState(newState: BrainwaveState, volume: number) {
    if (!this.audioContext || !this.masterGain || !this.noiseGate) return;

    const now = this.audioContext.currentTime;
    const fadeOutTime = this.transitionDuration * 0.7; // 70% of transition for fade out
    const fadeInTime = this.transitionDuration * 0.3; // 30% of transition for fade in

    // Fade out current oscillators
    this.gainNodes.forEach((gain) => {
      gain.gain.exponentialRampToValueAtTime(0.01, now + fadeOutTime);
    });

    // Disable noise gate during transition
    this.noiseGate.gain.linearRampToValueAtTime(0, now + fadeOutTime);

    // Schedule new oscillators after fade
    setTimeout(() => {
      this.createOscillators(newState, volume);
    }, fadeOutTime * 1000);
  }

  /**
   * Stop all oscillators
   */
  private stopOscillators() {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.oscillators = [];
    this.gainNodes = [];
    this.isPlaying = false;
  }

  /**
   * Set master volume
   */
  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(volume, this.audioContext!.currentTime + 0.1);
    }
  }

  /**
   * Get current brainwave state
   */
  getCurrentState(): BrainwaveState | null {
    return this.currentState;
  }

  /**
   * Stop audio with proper cleanup
   */
  stop() {
    if (this.audioContext && this.noiseGate) {
      const now = this.audioContext.currentTime;
      // Fade out noise gate
      this.noiseGate.gain.linearRampToValueAtTime(0, now + 0.2);
    }

    // Stop oscillators after fade
    setTimeout(() => {
      this.stopOscillators();
    }, 200);

    // Close audio context after cleanup
    setTimeout(() => {
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
        this.audioContext = null;
      }
    }, 300);
  }

  /**
   * Resume audio context (required for user interaction)
   */
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

export const adaptiveFrequencyModulator = new AdaptiveFrequencyModulator();

