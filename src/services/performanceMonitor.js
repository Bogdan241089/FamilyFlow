// Performance Monitoring
export const performanceMonitor = {
  metrics: [],

  measure: (name, fn) => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    performanceMonitor.metrics.push({ name, duration, timestamp: Date.now() });
    
    if (duration > 1000) {
      console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  },

  measureAsync: async (name, fn) => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    performanceMonitor.metrics.push({ name, duration, timestamp: Date.now() });
    
    if (duration > 2000) {
      console.warn(`Slow async operation: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  },

  getMetrics: () => performanceMonitor.metrics,

  getAverageTime: (name) => {
    const filtered = performanceMonitor.metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, m) => sum + m.duration, 0) / filtered.length;
  },

  clear: () => { performanceMonitor.metrics = []; }
};
