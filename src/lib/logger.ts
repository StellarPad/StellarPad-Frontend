/**
 * Centralized Logging System
 * Provides structured logging with different severity levels
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = process.env.NODE_ENV === "development";
  private isEnabled = true;

  /**
   * Log a debug message
   */
  debug(message: string, data?: unknown) {
    this.log("debug", message, data);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  /**
   * Log an error message
   */
  error(message: string, data?: unknown, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: "error",
      message,
      data,
      stack: error?.stack,
    };

    this.addLog(entry);
    this.outputLog(entry);
  }

  /**
   * Core log method
   */
  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
    };

    this.addLog(entry);
    this.outputLog(entry);
  }

  /**
   * Add log to internal storage
   */
  private addLog(entry: LogEntry) {
    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Output log to console
   */
  private outputLog(entry: LogEntry) {
    if (!this.isEnabled) return;

    const prefix = `[${entry.timestamp.toISOString()}] [${entry.level.toUpperCase()}]`;
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case "debug":
        if (this.isDevelopment) {
          console.debug(message, entry.data);
        }
        break;
      case "info":
        console.info(message, entry.data);
        break;
      case "warn":
        console.warn(message, entry.data);
        break;
      case "error":
        console.error(message, entry.data);
        if (entry.stack) {
          console.error(entry.stack);
        }
        break;
    }
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Get logs from the last N minutes
   */
  getRecentLogs(minutes: number): LogEntry[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.logs.filter((log) => log.timestamp > cutoff);
  }

  /**
   * Clear all logs
   */
  clear() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as a file
   */
  downloadLogs(filename = "logs.json") {
    if (typeof window === "undefined") return;

    const json = this.export();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Enable/disable logging
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * Set maximum number of logs to keep
   */
  setMaxLogs(max: number) {
    this.maxLogs = max;
  }
}

// Create singleton instance
const logger = new Logger();

// Export singleton
export default logger;

/**
 * Utility function for API logging
 */
export function logAPICall(
  method: string,
  endpoint: string,
  status?: number,
  duration?: number
) {
  const message = `${method} ${endpoint}${status ? ` - ${status}` : ""}${
    duration ? ` (${duration}ms)` : ""
  }`;

  if (status && status >= 400) {
    logger.warn(message);
  } else {
    logger.debug(message);
  }
}

/**
 * Utility function for API error logging
 */
export function logAPIError(
  method: string,
  endpoint: string,
  error: Error,
  status?: number
) {
  logger.error(
    `${method} ${endpoint} failed${status ? ` with status ${status}` : ""}`,
    { error: error.message },
    error
  );
}

/**
 * Utility function for component lifecycle logging (dev only)
 */
export function logComponentLifecycle(
  componentName: string,
  lifecycle: "mount" | "unmount" | "update"
) {
  if (process.env.NODE_ENV === "development") {
    logger.debug(`Component [${componentName}] ${lifecycle}`);
  }
}

/**
 * Utility function for user action logging
 */
export function logUserAction(action: string, details?: unknown) {
  logger.info(`User action: ${action}`, details);
}

/**
 * Utility function for transaction logging
 */
export function logTransaction(
  type: string,
  txHash?: string,
  details?: unknown
) {
  logger.info(`Transaction: ${type}${txHash ? ` (${txHash})` : ""}`, details);
}

/**
 * Utility function for wallet event logging
 */
export function logWalletEvent(event: string, address?: string) {
  logger.info(`Wallet: ${event}${address ? ` - ${address}` : ""}`);
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string) {
    this.marks.set(label, performance.now());
  }

  end(label: string) {
    const startTime = this.marks.get(label);
    if (!startTime) {
      logger.warn(`Performance mark '${label}' not found`);
      return;
    }

    const duration = performance.now() - startTime;
    logger.debug(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    this.marks.delete(label);

    return duration;
  }

  measure(label: string, fn: () => void) {
    this.start(label);
    fn();
    return this.end(label);
  }

  async measureAsync(label: string, fn: () => Promise<void>) {
    this.start(label);
    await fn();
    return this.end(label);
  }
}

export const performanceMonitor = new PerformanceMonitor();
