type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || import.meta.env.MODE === 'development';
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...(context && { context })
    };

    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(`[${timestamp}] ERROR:`, message, context || '');
          break;
        case 'warn':
          console.warn(`[${timestamp}] WARN:`, message, context || '');
          break;
        case 'info':
          console.info(`[${timestamp}] INFO:`, message, context || '');
          break;
        case 'debug':
          console.debug(`[${timestamp}] DEBUG:`, message, context || '');
          break;
      }
    } else {
      // In production, you could send logs to an external service
      // For now, we'll just log errors to console
      if (level === 'error') {
        console.error(JSON.stringify(logData));
      }
    }
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();
