/**
 * Centralized logging utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private static isDevelopment = import.meta.env?.MODE === 'development';

  private static log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, send to monitoring service (Sentry, Datadog, etc.)
    if (!this.isDevelopment) {
      // TODO: Send to monitoring service
      this.sendToMonitoring(logEntry);
    }

    // Console logging
    const consoleMethod = console[level] || console.log;
    consoleMethod(`[${timestamp}] [${level.toUpperCase()}]`, message, context || '');
  }

  private static sendToMonitoring(_logEntry: unknown): void {
    // TODO: Implement monitoring service integration
    // Example: Sentry.captureMessage() or Datadog API
  }

  static debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  static info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  static warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  static error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
    this.log('error', message, errorContext);
  }
}

export default Logger;
