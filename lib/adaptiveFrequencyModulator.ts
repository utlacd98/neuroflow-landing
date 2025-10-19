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
  private isPlaying = false;
  private currentState: BrainwaveState | null = null;
  private transitionDuration = 0.5; // seconds

  async initialize(): Promise<boolean> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create master gain
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Safe default volume

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
   * Update audio based on focus score
   */
  updateFrequency(focusScore: number, volume: number = 0.3) {
    if (!this.audioContext || !this.masterGain) return;

    const newState = this.mapFocusScoreToBrainwave(focusScore);

    // Smooth transition
    if (this.currentState) {
      this.transitionToState(newState, volume);
    } else {
      this.createOscillators(newState, volume);
    }

    this.currentState = newState;
  }

  /**
   * Create oscillators for the current state
   */
  private createOscillators(state: BrainwaveState, volume: number) {
    if (!this.audioContext || !this.masterGain) return;

    // Stop existing oscillators
    this.stopOscillators();

    // Create base frequency oscillator
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = state.frequency;

    const gain1 = this.audioContext.createGain();
    gain1.gain.value = volume * state.intensity * 0.6;

    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.start();

    // Create binaural beat oscillator (right channel simulation)
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = state.frequency + state.beatFrequency;

    const gain2 = this.audioContext.createGain();
    gain2.gain.value = volume * state.intensity * 0.4;

    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.start();

    // Create harmonic (adds richness)
    const osc3 = this.audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = state.frequency * 2; // Octave up

    const gain3 = this.audioContext.createGain();
    gain3.gain.value = volume * state.intensity * 0.2;

    osc3.connect(gain3);
    gain3.connect(this.masterGain);
    osc3.start();

    this.oscillators = [osc1, osc2, osc3];
    this.gainNodes = [gain1, gain2, gain3];
    this.isPlaying = true;
  }

  /**
   * Smooth transition between states
   */
  private transitionToState(newState: BrainwaveState, volume: number) {
    if (!this.audioContext || !this.masterGain) return;

    // Fade out current oscillators
    this.gainNodes.forEach((gain) => {
      gain.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + this.transitionDuration);
    });

    // Schedule new oscillators after fade
    setTimeout(() => {
      this.createOscillators(newState, volume);
    }, this.transitionDuration * 1000);
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
   * Stop audio
   */
  stop() {
    this.stopOscillators();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
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

