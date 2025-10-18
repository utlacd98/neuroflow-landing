/**
 * Session Storage Manager
 * Handles LocalStorage persistence of session data
 */

import type { SessionData } from './activityDetector';

export interface StoredSession extends SessionData {
  id: string;
  mode: 'focus' | 'calm' | 'energize';
  aiSummary?: string;
  savedAt: number;
}

const STORAGE_KEY = 'neuroflow_sessions';
const MAX_SESSIONS = 100;

export class SessionStorageManager {
  /**
   * Save a session to LocalStorage
   */
  static saveSession(session: SessionData, mode: 'focus' | 'calm' | 'energize', aiSummary?: string): StoredSession {
    if (typeof window === 'undefined') return {} as StoredSession;

    const storedSession: StoredSession = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mode,
      aiSummary,
      savedAt: Date.now(),
    };

    try {
      const sessions = this.getAllSessions();
      sessions.push(storedSession);

      // Keep only last MAX_SESSIONS
      if (sessions.length > MAX_SESSIONS) {
        sessions.splice(0, sessions.length - MAX_SESSIONS);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      return storedSession;
    } catch (e) {
      console.error('Failed to save session:', e);
      return storedSession;
    }
  }

  /**
   * Get all stored sessions
   */
  static getAllSessions(): StoredSession[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to retrieve sessions:', e);
      return [];
    }
  }

  /**
   * Get a specific session by ID
   */
  static getSession(id: string): StoredSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  }

  /**
   * Get sessions from last N days
   */
  static getRecentSessions(days: number = 7): StoredSession[] {
    const sessions = this.getAllSessions();
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    return sessions.filter(s => s.savedAt > cutoffTime);
  }

  /**
   * Get statistics for all sessions
   */
  static getStatistics() {
    const sessions = this.getAllSessions();

    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageFocusScore: 0,
        totalFocusTime: 0,
        averageSessionDuration: 0,
        modeBreakdown: { focus: 0, calm: 0, energize: 0 },
      };
    }

    const totalFocusScore = sessions.reduce((sum, s) => sum + s.focusScore, 0);
    const totalDuration = sessions.reduce((sum, s) => sum + s.totalTypingTime, 0);
    const modeBreakdown = {
      focus: sessions.filter(s => s.mode === 'focus').length,
      calm: sessions.filter(s => s.mode === 'calm').length,
      energize: sessions.filter(s => s.mode === 'energize').length,
    };

    return {
      totalSessions: sessions.length,
      averageFocusScore: Math.round(totalFocusScore / sessions.length),
      totalFocusTime: totalDuration,
      averageSessionDuration: Math.round(totalDuration / sessions.length),
      modeBreakdown,
    };
  }

  /**
   * Delete a session
   */
  static deleteSession(id: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const sessions = this.getAllSessions();
      const filtered = sessions.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Failed to delete session:', e);
      return false;
    }
  }

  /**
   * Clear all sessions
   */
  static clearAllSessions(): boolean {
    if (typeof window === 'undefined') return false;

    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('Failed to clear sessions:', e);
      return false;
    }
  }

  /**
   * Export sessions as JSON
   */
  static exportSessions(): string {
    const sessions = this.getAllSessions();
    return JSON.stringify(sessions, null, 2);
  }

  /**
   * Export sessions as CSV
   */
  static exportSessionsAsCSV(): string {
    const sessions = this.getAllSessions();

    if (sessions.length === 0) return '';

    const headers = ['ID', 'Mode', 'Focus Score', 'Duration (min)', 'Avg Typing Speed', 'Date'];
    const rows = sessions.map(s => [
      s.id,
      s.mode,
      s.focusScore,
      (s.totalTypingTime / 60000).toFixed(2),
      s.averageTypingSpeed.toFixed(0),
      new Date(s.savedAt).toLocaleString(),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }
}

