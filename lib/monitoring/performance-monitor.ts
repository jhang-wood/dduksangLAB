export class PerformanceMonitor {
  private metrics: any[] = [];
  private isMonitoring = false;

  start(): void {
    if (this.isMonitoring) {
      return;
    }
    this.isMonitoring = true;

    setInterval(() => {
      this.collectMetrics();
    }, 15000);
  }

  private collectMetrics(): void {
    const metrics = {
      timestamp: new Date(),
      cpu: { usage: 0 },
      memory: { usage: 0 },
      performance: { responseTime: 0, errorRate: 0 },
    };

    this.metrics.push(metrics);
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  recordRequest(responseTime: number, isError = false): void {
    // 요청 기록
  }

  getCurrentMetrics() {
    return this.metrics[this.metrics.length - 1] || null;
  }

  stop(): void {
    this.isMonitoring = false;
  }
}

export const performanceMonitor = new PerformanceMonitor();
