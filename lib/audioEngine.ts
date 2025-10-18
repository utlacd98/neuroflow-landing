/**
 * FOCUSYNC Audio Engine
 * Generates binaural beats and adaptive soundscapes using Web Audio API
 */

export interface AudioConfig {
  baseFrequency: number; // Hz
  beatFrequency: number; // Hz (difference between left and right channels)
  volume: number; // 0-1
  mode: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  brainWaveType: string; // Human-readable name
  frequencyRange: string; // e.g., "0.5-4 Hz"
}

export class FocusyncAudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isPlaying = false;
  private currentConfig: AudioConfig | null = null;

  constructor() {
    // Initialize on first user interaction
    if (typeof window !== 'undefined') {
      const initOnInteraction = () => {
        this.initAudioContext();
        document.removeEventListener('click', initOnInteraction);
      };
      document.addEventListener('click', initOnInteraction);
    }
  }

  private initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
      }
    }
  }

  /**
   * Start playing adaptive soundscape
   */
  async play(config: AudioConfig) {
    if (!this.audioContext) {
      this.initAudioContext();
    }

    if (!this.audioContext) {
      console.error('AudioContext is not available');
      return;
    }

    this.currentConfig = config;
    this.isPlaying = true;

    // Create stereo oscillators for binaural beats
    const leftOsc = this.audioContext.createOscillator();
    const rightOsc = this.audioContext.createOscillator();

    // Create gain nodes for volume control
    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();
    const masterGain = this.audioContext.createGain();

    // Create stereo splitter
    const splitter = this.audioContext.createChannelSplitter(2);
    const merger = this.audioContext.createChannelMerger(2);

    // Set frequencies (binaural beat effect)
    leftOsc.frequency.value = config.baseFrequency;
    rightOsc.frequency.value = config.baseFrequency + config.beatFrequency;

    // Set oscillator types for smoother sound
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';

    // Set volumes
    leftGain.gain.value = config.volume * 0.5;
    rightGain.gain.value = config.volume * 0.5;
    masterGain.gain.value = 0.3; // Safety limit

    // Connect nodes
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(masterGain);
    masterGain.connect(this.audioContext.destination);

    // Start oscillators
    leftOsc.start();
    rightOsc.start();

    this.oscillators = [leftOsc, rightOsc];
    this.gainNodes = [leftGain, rightGain, masterGain];
  }

  /**
   * Stop playing audio
   */
  stop() {
    this.oscillators.forEach(osc => {
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
   * Adapt audio based on focus level (0-1)
   */
  adaptToFocusLevel(focusLevel: number) {
    if (!this.audioContext || !this.currentConfig) return;

    const config = this.currentConfig;
    const now = this.audioContext.currentTime;

    // Smoothly transition volume based on focus
    if (this.gainNodes.length > 2) {
      const targetVolume = config.volume * focusLevel;
      this.gainNodes[2].gain.linearRampToValueAtTime(targetVolume, now + 0.5);
    }

    // Adjust beat frequency based on focus level
    if (this.oscillators.length > 1) {
      const adaptedBeatFreq = config.beatFrequency * (0.5 + focusLevel * 0.5);
      this.oscillators[1].frequency.linearRampToValueAtTime(
        config.baseFrequency + adaptedBeatFreq,
        now + 0.5
      );
    }
  }

  /**
   * Map user-friendly modes to brain wave frequencies
   */
  private static mapModeToFrequency(mode: string): 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' {
    const modeMap: Record<string, 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'> = {
      focus: 'gamma',      // Focus mode uses Gamma waves (40 Hz)
      calm: 'alpha',       // Calm mode uses Alpha waves (10 Hz)
      energize: 'beta',    // Energize mode uses Beta waves (20 Hz)
      // Also support direct brain wave names
      delta: 'delta',
      theta: 'theta',
      alpha: 'alpha',
      beta: 'beta',
      gamma: 'gamma',
    };
    return modeMap[mode] || 'gamma';
  }

  /**
   * Get predefined config for each brain wave mode
   * Supports all 5 brain wave frequencies
   */
  static getConfigForMode(mode: string): AudioConfig | undefined {
    const frequencyMode = this.mapModeToFrequency(mode);
    const configs: Record<string, AudioConfig> = {
      delta: {
        baseFrequency: 200,
        beatFrequency: 2, // Delta: 0.5-4 Hz (using 2 Hz for binaural effect)
        volume: 0.4,
        mode: 'delta',
        brainWaveType: 'Delta',
        frequencyRange: '0.5-4 Hz',
      },
      theta: {
        baseFrequency: 200,
        beatFrequency: 6, // Theta: 4-8 Hz (using 6 Hz)
        volume: 0.5,
        mode: 'theta',
        brainWaveType: 'Theta',
        frequencyRange: '4-8 Hz',
      },
      alpha: {
        baseFrequency: 200,
        beatFrequency: 10, // Alpha: 8-12 Hz (using 10 Hz)
        volume: 0.5,
        mode: 'alpha',
        brainWaveType: 'Alpha',
        frequencyRange: '8-12 Hz',
      },
      beta: {
        baseFrequency: 200,
        beatFrequency: 20, // Beta: 12-30 Hz (using 20 Hz)
        volume: 0.6,
        mode: 'beta',
        brainWaveType: 'Beta',
        frequencyRange: '12-30 Hz',
      },
      gamma: {
        baseFrequency: 200,
        beatFrequency: 40, // Gamma: 30-100 Hz (using 40 Hz)
        volume: 0.6,
        mode: 'gamma',
        brainWaveType: 'Gamma',
        frequencyRange: '30-100 Hz',
      },
    };
    return configs[frequencyMode];
  }

  isAudioPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new FocusyncAudioEngine();

