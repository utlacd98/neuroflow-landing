/**
 * Brain Wave Analyzer
 * Analyzes and visualizes brain wave frequencies
 */

export interface BrainWaveData {
  type: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  frequency: number;
  intensity: number;
  label: string;
  description: string;
  color: string;
}

export interface SpectrumData {
  frequency: number;
  magnitude: number;
}

export interface WaveformPoint {
  time: number;
  amplitude: number;
}

const BRAIN_WAVE_TYPES: Record<string, BrainWaveData> = {
  delta: {
    type: 'delta',
    frequency: 2,
    intensity: 0,
    label: 'Delta',
    description: 'Deep sleep, meditation',
    color: '#8B5CF6', // Purple
  },
  theta: {
    type: 'theta',
    frequency: 6,
    intensity: 0,
    label: 'Theta',
    description: 'Drowsy, creative',
    color: '#3B82F6', // Blue
  },
  alpha: {
    type: 'alpha',
    frequency: 10,
    intensity: 0,
    label: 'Alpha',
    description: 'Relaxed, calm focus',
    color: '#06B6D4', // Cyan
  },
  beta: {
    type: 'beta',
    frequency: 20,
    intensity: 0,
    label: 'Beta',
    description: 'Active thinking, alert',
    color: '#F59E0B', // Amber
  },
  gamma: {
    type: 'gamma',
    frequency: 40,
    intensity: 0,
    label: 'Gamma',
    description: 'Peak focus, insight',
    color: '#EF4444', // Red
  },
};

export class BrainWaveAnalyzer {
  private waveformBuffer: WaveformPoint[] = [];
  private spectrumData: SpectrumData[] = [];
  private currentBrainWave: BrainWaveData = BRAIN_WAVE_TYPES.alpha;
  private bufferSize = 512;

  constructor() {
    this.initializeSpectrum();
  }

  private initializeSpectrum() {
    // Create frequency spectrum from 0 to 100 Hz
    for (let i = 0; i < 100; i++) {
      this.spectrumData.push({
        frequency: i,
        magnitude: Math.random() * 0.3, // Start with low noise
      });
    }
  }

  /**
   * Generate waveform data based on frequency
   */
  generateWaveform(frequency: number, duration: number = 1000): WaveformPoint[] {
    const points: WaveformPoint[] = [];
    const sampleRate = 44100; // Hz
    const samples = (sampleRate * duration) / 1000;

    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      // Generate sine wave with some harmonics for realism
      const amplitude =
        Math.sin(2 * Math.PI * frequency * time) * 0.7 +
        Math.sin(2 * Math.PI * frequency * 2 * time) * 0.2 +
        Math.sin(2 * Math.PI * frequency * 0.5 * time) * 0.1;

      points.push({
        time: time * 1000,
        amplitude: amplitude + (Math.random() - 0.5) * 0.1, // Add slight noise
      });
    }

    return points;
  }

  /**
   * Analyze current frequency and determine brain wave type
   */
  analyzeBrainWave(frequency: number): BrainWaveData {
    let closestWave = BRAIN_WAVE_TYPES.alpha;
    let minDiff = Math.abs(frequency - closestWave.frequency);

    Object.values(BRAIN_WAVE_TYPES).forEach((wave) => {
      const diff = Math.abs(frequency - wave.frequency);
      if (diff < minDiff) {
        minDiff = diff;
        closestWave = wave;
      }
    });

    this.currentBrainWave = closestWave;
    return closestWave;
  }

  /**
   * Get frequency spectrum data
   */
  getSpectrum(frequency: number, intensity: number): SpectrumData[] {
    return this.spectrumData.map((point) => {
      // Peak at the current frequency
      const distance = Math.abs(point.frequency - frequency);
      const peak = Math.exp(-((distance * distance) / (2 * 10 * 10))) * intensity;

      // Add harmonics
      const harmonic1 = Math.exp(-((Math.abs(point.frequency - frequency * 2) ** 2) / (2 * 8 * 8))) * intensity * 0.5;
      const harmonic2 = Math.exp(-((Math.abs(point.frequency - frequency * 0.5) ** 2) / (2 * 8 * 8))) * intensity * 0.3;

      return {
        frequency: point.frequency,
        magnitude: Math.min(1, peak + harmonic1 + harmonic2 + Math.random() * 0.05),
      };
    });
  }

  /**
   * Get current brain wave info
   */
  getCurrentBrainWave(): BrainWaveData {
    return this.currentBrainWave;
  }

  /**
   * Get all brain wave types
   */
  getAllBrainWaves(): BrainWaveData[] {
    return Object.values(BRAIN_WAVE_TYPES);
  }

  /**
   * Get brain wave by type
   */
  getBrainWaveByType(type: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'): BrainWaveData {
    return BRAIN_WAVE_TYPES[type];
  }

  /**
   * Calculate intensity based on activity
   */
  calculateIntensity(focusLevel: number, typingSpeed: number): number {
    // Combine focus level and typing speed for intensity
    const focusIntensity = focusLevel * 0.6;
    const typingIntensity = Math.min(typingSpeed / 100, 1) * 0.4;
    return Math.min(1, focusIntensity + typingIntensity);
  }
}

export const brainWaveAnalyzer = new BrainWaveAnalyzer();

