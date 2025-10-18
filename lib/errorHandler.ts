/**
 * NeuroFlow Error Handler
 * Centralized error handling and logging
 */

export interface ErrorLog {
  timestamp: Date;
  type: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorHandler {
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100;

  /**
   * Log an error with context
   */
  logError(
    type: string,
    message: string,
    context?: Record<string, any>,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    const error: ErrorLog = {
      timestamp: new Date(),
      type,
      message,
      context,
      severity,
    };

    this.errorLogs.push(error);

    // Keep only recent logs
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${type}] ${message}`, context);
    }

    // Log critical errors to external service in production
    if (severity === 'critical' && process.env.NODE_ENV === 'production') {
      this.reportToService(error);
    }

    return error;
  }

  /**
   * Handle API errors
   */
  handleAPIError(error: any, context?: Record<string, any>) {
    const message = error?.message || 'Unknown API error';
    const status = error?.status || error?.response?.status;

    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
    if (status === 401 || status === 403) severity = 'high';
    if (status === 500 || status === 503) severity = 'critical';

    return this.logError('API_ERROR', message, { ...context, status }, severity);
  }

  /**
   * Handle audio errors
   */
  handleAudioError(error: any, context?: Record<string, any>) {
    const message = error?.message || 'Unknown audio error';
    return this.logError('AUDIO_ERROR', message, context, 'high');
  }

  /**
   * Handle activity detection errors
   */
  handleActivityError(error: any, context?: Record<string, any>) {
    const message = error?.message || 'Unknown activity error';
    return this.logError('ACTIVITY_ERROR', message, context, 'medium');
  }

  /**
   * Handle session storage errors
   */
  handleStorageError(error: any, context?: Record<string, any>) {
    const message = error?.message || 'Unknown storage error';
    return this.logError('STORAGE_ERROR', message, context, 'high');
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: ErrorLog): string {
    switch (error.type) {
      case 'API_ERROR':
        if (error.context?.status === 401) {
          return 'Authentication failed. Please check your API key.';
        }
        if (error.context?.status === 429) {
          return 'Too many requests. Please wait a moment and try again.';
        }
        if (error.context?.status >= 500) {
          return 'Server error. Please try again later.';
        }
        return 'Failed to get AI feedback. Please try again.';

      case 'AUDIO_ERROR':
        return 'Audio playback failed. Please check your audio settings.';

      case 'ACTIVITY_ERROR':
        return 'Activity tracking error. Please refresh the page.';

      case 'STORAGE_ERROR':
        return 'Failed to save session. Please check your browser storage.';

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Get all error logs
   */
  getLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): ErrorLog[] {
    return this.errorLogs.filter(log => log.severity === severity);
  }

  /**
   * Clear error logs
   */
  clearLogs() {
    this.errorLogs = [];
  }

  /**
   * Export logs for debugging
   */
  exportLogs(): string {
    return JSON.stringify(this.errorLogs, null, 2);
  }

  /**
   * Report error to external service (Sentry, LogRocket, etc.)
   */
  private reportToService(error: ErrorLog) {
    // TODO: Implement external error reporting
    // Example: Sentry.captureException(error);
    console.warn('Critical error - should be reported to monitoring service:', error);
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Wrap async functions with error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorType: string
): (...args: T) => Promise<R | null> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.logError(errorType, (error as Error).message, { args });
      return null;
    }
  };
}

/**
 * Wrap sync functions with error handling
 */
export function withSyncErrorHandling<T extends any[], R>(
  fn: (...args: T) => R,
  errorType: string
): (...args: T) => R | null {
  return (...args: T) => {
    try {
      return fn(...args);
    } catch (error) {
      errorHandler.logError(errorType, (error as Error).message, { args });
      return null;
    }
  };
}

