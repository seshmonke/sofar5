import { env } from '../config/env';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

class Logger {
  private isDevelopment = env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase();
    
    if (data) {
      return `[${timestamp}] ${levelUpper}: ${message} ${JSON.stringify(data)}`;
    }
    
    return `[${timestamp}] ${levelUpper}: ${message}`;
  }

  info(message: string, data?: any): void {
    console.log(this.formatMessage('info', message, data));
  }

  error(message: string, data?: any): void {
    console.error(this.formatMessage('error', message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.formatMessage('warn', message, data));
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }
}

export const logger = new Logger();
