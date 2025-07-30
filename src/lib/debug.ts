/**
 * Debug utilities for the tactics application
 */

interface DebugConfig {
  enabled: boolean;
  level: 'error' | 'warn' | 'log' | 'info';
  modules: string[];
  showTimestamp: boolean;
}

interface ThrottledLogger {
  log: (category: string, action: string, data?: any) => void;
  throttledLog: (category: string, action: string, data?: any, throttleMs?: number) => void;
}

class Debug implements ThrottledLogger {
  private config: DebugConfig = {
    enabled: process.env.NODE_ENV === 'development',
    level: 'log',
    modules: [],
    showTimestamp: true
  };

  // Add throttling for high-frequency events
  private throttledLogs = new Map<string, number>();
  private throttleDelay = 100; // 100ms throttle for high-frequency logs
  private lastLogTimes = new Map<string, number>();

  private getTimestamp(): string {
    return new Date().toLocaleTimeString('no-NO', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  }

  private formatMessage(module: string, message: string): string {
    const timestamp = this.config.showTimestamp ? `[${this.getTimestamp()}]` : '';
    return `${timestamp}[${module}] ${message}`;
  }

  // Bruk queueMicrotask for å unngå setState under render
  private safeLog(logFn: Function, ...args: any[]) {
    if (typeof window !== 'undefined') {
      queueMicrotask(() => logFn(...args));
    } else {
      logFn(...args);
    }
  }

  private shouldThrottle(key: string): boolean {
    const now = Date.now();
    const lastLog = this.throttledLogs.get(key) || 0;
    
    if (now - lastLog < this.throttleDelay) {
      return true;
    }
    
    this.throttledLogs.set(key, now);
    return false;
  }

  log(module: string, message: string, data?: any) {
    if (!this.config.enabled) return;
    
    const formattedMessage = this.formatMessage(module, message);
    
    if (data !== undefined) {
      this.safeLog(console.log, formattedMessage, data);
    } else {
      this.safeLog(console.log, formattedMessage);
    }
  }

  warn(module: string, message: string, data?: any) {
    if (!this.config.enabled) return;
    
    const formattedMessage = this.formatMessage(module, `⚠️ ${message}`);
    
    if (data !== undefined) {
      this.safeLog(console.warn, formattedMessage, data);
    } else {
      this.safeLog(console.warn, formattedMessage);
    }
  }

  error(module: string, message: string, error?: any) {
    // Errors are always logged, even in production
    const formattedMessage = this.formatMessage(module, `❌ ${message}`);
    
    if (error !== undefined) {
      this.safeLog(console.error, formattedMessage, error);
    } else {
      this.safeLog(console.error, formattedMessage);
    }
  }

  info(module: string, message: string, data?: any) {
    if (!this.config.enabled) return;
    
    const formattedMessage = this.formatMessage(module, `ℹ️ ${message}`);
    
    if (data !== undefined) {
      this.safeLog(console.info, formattedMessage, data);
    } else {
      this.safeLog(console.info, formattedMessage);
    }
  }

  setConfig(config: Partial<DebugConfig>) {
    this.config = { ...this.config, ...config };
    this.log('Debug', 'Configuration updated', this.config);
  }

  getConfig(): DebugConfig {
    return { ...this.config };
  }

  throttledLog(category: string, action: string, data?: any, throttleMs: number = 100): void {
    const key = `${category}:${action}`;
    const now = Date.now();
    const lastTime = this.lastLogTimes.get(key) || 0;
    
    if (now - lastTime >= throttleMs) {
      this.log(category, action, data);
      this.lastLogTimes.set(key, now);
    }
  }
}

const debug = new Debug();

// Expose debug instance globally for BOTH development AND production for testing
if (typeof window !== 'undefined') {
  (window as any).debug = debug;
  console.log('Debug instance available globally as window.debug');
}

export default debug;

// Add named export for backward compatibility
export { debug as debugLogger };

// Helper function for SVG coordinate debugging with throttling
export const debugSVGCoordinates = (
  input: { clientX: number; clientY: number },
  svgElement: SVGSVGElement,
  output: { x: number; y: number }
): void => {
  // Only log occasionally during high-frequency operations
  debug.throttledLog('SVGCoordinates', 'transformation', {
    input,
    svgRect: {
      width: svgElement.getBoundingClientRect().width,
      height: svgElement.getBoundingClientRect().height
    },
    viewBox: svgElement.getAttribute?.('viewBox') || 'unknown',
    output
  }, 250); // Throttle to every 250ms during drag operations
};

// Element debugging
export const debugElement = (
  elementType: string,
  element: any,
  action: string,
  additionalData: any = {}
) => {
  debug.log('Element', `${elementType}-${action}`, {
    element,
    ...additionalData
  });
};

export const debugTest = (testName: string, data: any) => {
  debug.log('Test', testName, data);
};