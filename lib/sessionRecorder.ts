/**
 * Session Recorder & Playback
 * Records waveform data and enables playback visualization
 */

export interface RecordedDataPoint {
  timestamp: number;
  focusLevel: number;
  calmLevel: number;
  frequency: number;
  mode: string;
}

export interface RecordedSession {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number; // ms
  mode: string;
  dataPoints: RecordedDataPoint[];
  stats: {
    averageFocus: number;
    maxFocus: number;
    minFocus: number;
    averageFrequency: number;
    focusStability: number;
  };
}

export class SessionRecorder {
  private currentRecording: RecordedDataPoint[] = [];
  private recordings: RecordedSession[] = [];
  private maxRecordings = 50;
  private isRecording = false;
  private recordingStartTime = 0;
  private recordingMode = '';

  /**
   * Start recording a session
   */
  startRecording(mode: string) {
    this.currentRecording = [];
    this.isRecording = true;
    this.recordingStartTime = Date.now();
    this.recordingMode = mode;
  }

  /**
   * Add data point to current recording
   */
  addDataPoint(focusLevel: number, calmLevel: number, frequency: number) {
    if (!this.isRecording) return;

    this.currentRecording.push({
      timestamp: Date.now() - this.recordingStartTime,
      focusLevel,
      calmLevel,
      frequency,
      mode: this.recordingMode,
    });
  }

  /**
   * Stop recording and save session
   */
  stopRecording(sessionName?: string): RecordedSession | null {
    if (!this.isRecording || this.currentRecording.length === 0) {
      this.isRecording = false;
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - this.recordingStartTime;

    // Calculate statistics
    const focusLevels = this.currentRecording.map((p) => p.focusLevel);
    const frequencies = this.currentRecording.map((p) => p.frequency);

    const averageFocus = focusLevels.reduce((a, b) => a + b, 0) / focusLevels.length;
    const maxFocus = Math.max(...focusLevels);
    const minFocus = Math.min(...focusLevels);
    const averageFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;

    // Calculate focus stability (inverse of variance)
    const variance = focusLevels.reduce((sum, val) => sum + Math.pow(val - averageFocus, 2), 0) / focusLevels.length;
    const focusStability = 1 - Math.min(1, variance * 2);

    const session: RecordedSession = {
      id: `session_${Date.now()}`,
      name: sessionName || `Session ${new Date().toLocaleString()}`,
      startTime: this.recordingStartTime,
      endTime,
      duration,
      mode: this.recordingMode,
      dataPoints: this.currentRecording,
      stats: {
        averageFocus,
        maxFocus,
        minFocus,
        averageFrequency,
        focusStability,
      },
    };

    this.recordings.push(session);
    if (this.recordings.length > this.maxRecordings) {
      this.recordings.shift();
    }

    this.isRecording = false;
    this.currentRecording = [];

    // Save to localStorage
    this.saveToLocalStorage();

    return session;
  }

  /**
   * Get all recorded sessions
   */
  getSessions(): RecordedSession[] {
    return this.recordings;
  }

  /**
   * Get session by ID
   */
  getSession(id: string): RecordedSession | undefined {
    return this.recordings.find((s) => s.id === id);
  }

  /**
   * Delete session
   */
  deleteSession(id: string) {
    this.recordings = this.recordings.filter((s) => s.id !== id);
    this.saveToLocalStorage();
  }

  /**
   * Export session as JSON
   */
  exportSession(id: string): string | null {
    const session = this.getSession(id);
    if (!session) return null;
    return JSON.stringify(session, null, 2);
  }

  /**
   * Import session from JSON
   */
  importSession(jsonData: string): RecordedSession | null {
    try {
      const session = JSON.parse(jsonData) as RecordedSession;
      this.recordings.push(session);
      if (this.recordings.length > this.maxRecordings) {
        this.recordings.shift();
      }
      this.saveToLocalStorage();
      return session;
    } catch (error) {
      console.error('Failed to import session:', error);
      return null;
    }
  }

  /**
   * Get playback data for visualization
   */
  getPlaybackData(id: string): RecordedDataPoint[] | null {
    const session = this.getSession(id);
    return session ? session.dataPoints : null;
  }

  /**
   * Calculate playback speed multiplier
   */
  getPlaybackSpeedMultiplier(sessionDuration: number, targetDuration: number = 30000): number {
    return sessionDuration / targetDuration;
  }

  /**
   * Save recordings to localStorage
   */
  private saveToLocalStorage() {
    try {
      const data = JSON.stringify(this.recordings);
      localStorage.setItem('neuroflow_recordings', data);
    } catch (error) {
      console.error('Failed to save recordings to localStorage:', error);
    }
  }

  /**
   * Load recordings from localStorage
   */
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('neuroflow_recordings');
      if (data) {
        this.recordings = JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load recordings from localStorage:', error);
    }
  }

  /**
   * Get session statistics summary
   */
  getStatisticsSummary() {
    if (this.recordings.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageFocus: 0,
        bestSession: null,
      };
    }

    const totalDuration = this.recordings.reduce((sum, s) => sum + s.duration, 0);
    const averageFocus = this.recordings.reduce((sum, s) => sum + s.stats.averageFocus, 0) / this.recordings.length;
    const bestSession = this.recordings.reduce((best, current) =>
      current.stats.focusStability > best.stats.focusStability ? current : best
    );

    return {
      totalSessions: this.recordings.length,
      totalDuration,
      averageFocus,
      bestSession,
    };
  }

  /**
   * Clear all recordings
   */
  clearAll() {
    this.recordings = [];
    this.currentRecording = [];
    this.isRecording = false;
    localStorage.removeItem('neuroflow_recordings');
  }
}

// Export singleton instance
export const sessionRecorder = new SessionRecorder();

