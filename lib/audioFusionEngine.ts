/**
 * Audio Fusion Engine
 * Blends multiple sound types and adapts to environment
 */

export interface AudioLayer {
  type: 'binaural' | 'ambient' | 'instrumental' | 'nature';
  frequency: number;
  volume: number;
  intensity: number; // 0-1, increases with focus depth
}

export interface AudioFusion {
  layers: AudioLayer[];
  complexity: number; // 0-1
  environmentAdapted: boolean;
}

export interface FrequencySignature {
  name: string;
  frequency: number;
  description: string;
  bestFor: string;
  icon: string;
}

export interface EnvironmentMetrics {
  noiseLevel: number; // 0-1
  ambientFrequency: number; // Hz
  recommendedComplexity: number; // 0-1
}

export class AudioFusionEngine {
  private currentFusion: AudioFusion = {
    layers: [],
    complexity: 0.5,
    environmentAdapted: false,
  };

  private frequencySignatures: Record<string, FrequencySignature> = {
    delta_deep: {
      name: 'Delta Deep',
      frequency: 2,
      description: 'Deep sleep and recovery',
      bestFor: 'Night sessions, meditation',
      icon: '😴',
    },
    theta_creative: {
      name: 'Theta Creative',
      frequency: 6,
      description: 'Creativity and flow',
      bestFor: 'Brainstorming, artistic work',
      icon: '🎨',
    },
    alpha_calm: {
      name: 'Alpha Calm',
      frequency: 10,
      description: 'Relaxed focus',
      bestFor: 'Reading, learning, stress relief',
      icon: '🧘',
    },
    beta_active: {
      name: 'Beta Active',
      frequency: 20,
      description: 'Active thinking',
      bestFor: 'Problem-solving, coding',
      icon: '⚙️',
    },
    gamma_peak: {
      name: 'Gamma Peak',
      frequency: 40,
      description: 'Peak focus',
      bestFor: 'Deep work, complex tasks',
      icon: '🔥',
    },
  };

  private userFrequencyPreferences: Map<string, number> = new Map();
  private savedPlaylists: Map<string, AudioFusion> = new Map();

  constructor() {
    this.loadPreferences();
  }

  /**
   * Create adaptive audio fusion based on focus depth
   */
  createAdaptiveFusion(focusLevel: number, frequency: number): AudioFusion {
    const layers: AudioLayer[] = [];

    // Base binaural layer
    layers.push({
      type: 'binaural',
      frequency,
      volume: 0.6,
      intensity: focusLevel,
    });

    // Add ambient layer as focus deepens
    if (focusLevel > 0.4) {
      layers.push({
        type: 'ambient',
        frequency: frequency * 0.5, // Harmonic relationship
        volume: 0.3 * focusLevel,
        intensity: focusLevel,
      });
    }

    // Add instrumental layer for deep focus
    if (focusLevel > 0.7) {
      layers.push({
        type: 'instrumental',
        frequency: frequency * 2, // Harmonic overtone
        volume: 0.2 * focusLevel,
        intensity: focusLevel,
      });
    }

    // Add nature sounds for very deep focus
    if (focusLevel > 0.85) {
      layers.push({
        type: 'nature',
        frequency: frequency * 0.25, // Sub-harmonic
        volume: 0.15 * focusLevel,
        intensity: focusLevel,
      });
    }

    const complexity = Math.min(1, focusLevel * 1.5);

    this.currentFusion = {
      layers,
      complexity,
      environmentAdapted: false,
    };

    return this.currentFusion;
  }

  /**
   * Adapt audio to environment
   */
  async adaptToEnvironment(): Promise<EnvironmentMetrics> {
    try {
      const noiseLevel = await this.detectNoiseLevel();
      const ambientFrequency = this.estimateAmbientFrequency(noiseLevel);
      const recommendedComplexity = this.calculateRecommendedComplexity(noiseLevel);

      // Adjust current fusion based on environment
      if (noiseLevel > 0.6) {
        // Noisy environment - increase carrier frequency strength
        this.currentFusion.layers.forEach((layer) => {
          if (layer.type === 'binaural') {
            layer.volume = Math.min(1, layer.volume * 1.2);
          }
        });
      } else if (noiseLevel < 0.3) {
        // Quiet environment - can use softer harmonics
        this.currentFusion.complexity = Math.min(1, this.currentFusion.complexity * 1.1);
      }

      this.currentFusion.environmentAdapted = true;

      return {
        noiseLevel,
        ambientFrequency,
        recommendedComplexity,
      };
    } catch (error) {
      console.error('Failed to adapt to environment:', error);
      return {
        noiseLevel: 0.5,
        ambientFrequency: 0,
        recommendedComplexity: 0.5,
      };
    }
  }

  /**
   * Detect noise level via microphone
   */
  private async detectNoiseLevel(): Promise<number> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      microphone.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const noiseLevel = Math.min(1, average / 255);

      // Clean up
      stream.getTracks().forEach((track) => track.stop());
      audioContext.close();

      return noiseLevel;
    } catch (error) {
      console.warn('Microphone access denied or unavailable');
      return 0.5; // Default to medium noise
    }
  }

  /**
   * Estimate ambient frequency
   */
  private estimateAmbientFrequency(noiseLevel: number): number {
    // Higher noise levels typically have higher frequency content
    return 100 + noiseLevel * 400; // 100-500 Hz range
  }

  /**
   * Calculate recommended complexity
   */
  private calculateRecommendedComplexity(noiseLevel: number): number {
    // Noisy environments benefit from simpler, more focused audio
    return 1 - noiseLevel * 0.5;
  }

  /**
   * Set user frequency preference
   */
  setFrequencyPreference(mode: string, frequency: number) {
    this.userFrequencyPreferences.set(mode, frequency);
    this.savePreferences();
  }

  /**
   * Get user frequency preference
   */
  getFrequencyPreference(mode: string): number {
    return this.userFrequencyPreferences.get(mode) || 40; // Default to Gamma
  }

  /**
   * Save audio state as playlist
   */
  savePlaylist(name: string, fusion: AudioFusion) {
    this.savedPlaylists.set(name, JSON.parse(JSON.stringify(fusion)));
    this.savePreferences();
  }

  /**
   * Load saved playlist
   */
  loadPlaylist(name: string): AudioFusion | null {
    return this.savedPlaylists.get(name) || null;
  }

  /**
   * Get all saved playlists
   */
  getSavedPlaylists(): Array<{ name: string; fusion: AudioFusion }> {
    return Array.from(this.savedPlaylists.entries()).map(([name, fusion]) => ({
      name,
      fusion,
    }));
  }

  /**
   * Get frequency signatures
   */
  getFrequencySignatures(): FrequencySignature[] {
    return Object.values(this.frequencySignatures);
  }

  /**
   * Get current fusion
   */
  getCurrentFusion(): AudioFusion {
    return this.currentFusion;
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences() {
    try {
      const data = {
        frequencyPreferences: Array.from(this.userFrequencyPreferences.entries()),
        playlists: Array.from(this.savedPlaylists.entries()),
      };
      localStorage.setItem('neuroflow_audio_fusion', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save audio preferences:', error);
    }
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences() {
    try {
      const saved = localStorage.getItem('neuroflow_audio_fusion');
      if (saved) {
        const data = JSON.parse(saved);
        this.userFrequencyPreferences = new Map(data.frequencyPreferences || []);
        this.savedPlaylists = new Map(data.playlists || []);
      }
    } catch (error) {
      console.error('Failed to load audio preferences:', error);
    }
  }

  /**
   * Reset
   */
  reset() {
    this.userFrequencyPreferences.clear();
    this.savedPlaylists.clear();
    localStorage.removeItem('neuroflow_audio_fusion');
  }
}

// Export singleton instance
export const audioFusionEngine = new AudioFusionEngine();

