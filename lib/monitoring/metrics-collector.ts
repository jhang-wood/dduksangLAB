/**
 * 성능 메트릭 수집 및 분석 시스템
 */

import { 
  PerformanceMetric, 
  ServiceType,
  SystemStatus,
  ErrorSeverity 
} from '../../types/monitoring';
import { TelegramNotificationService } from './telegram-notification';

export class MetricsCollector {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private thresholds: Map<string, MetricThreshold> = new Map();
  private collectors: Map<ServiceType, MetricCollector> = new Map();
  private notificationService: TelegramNotificationService;
  private analysisInterval: NodeJS.Timeout | null = null;
  private collectionInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.notificationService = new TelegramNotificationService();
    this.initializeCollectors();
    this.initializeThresholds();
  }

  /**
   * 메트릭 수집 시작
   */
  start(): void {
    console.log('성능 메트릭 수집을 시작합니다...');

    // 메트릭 수집 (매 10초)
    this.collectionInterval = setInterval(async () => {
      await this.collectAllMetrics();
    }, 10000);

    // 분석 및 알림 (매 1분)
    this.analysisInterval = setInterval(async () => {
      await this.analyzeMetrics();
    }, 60000);
  }

  /**
   * 메트릭 수집 중지
   */
  stop(): void {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }

    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }

    console.log('성능 메트릭 수집이 중지되었습니다.');
  }

  /**
   * 모든 서비스 메트릭 수집
   */
  private async collectAllMetrics(): Promise<void> {
    const services = Object.values(ServiceType);

    for (const service of services) {
      try {
        const collector = this.collectors.get(service);
        if (collector) {
          const metrics = await collector.collect();
          for (const metric of metrics) {
            await this.storeMetric(metric);
          }
        }
      } catch (error) {
        console.error(, error);
      }
    }
  }

  /**
   * 메트릭 저장
   */
  private async storeMetric(metric: PerformanceMetric): Promise<void> {
    const key = ;
    const history = this.metrics.get(key) || [];

    history.push(metric);

    // 최근 1000개만 유지
    if (history.length > 1000) {
      history.shift();
    }

    this.metrics.set(key, history);

    // 임계값 체크
    await this.checkThreshold(metric);
  }

  /**
   * 임계값 체크
   */
  private async checkThreshold(metric: PerformanceMetric): Promise<void> {
    const thresholdKey = ;
    const threshold = this.thresholds.get(thresholdKey);

    if (!threshold) return;

    const status = this.evaluateMetricStatus(metric.value, threshold);
    
    // 상태 업데이트
    metric.status = status;
    metric.threshold = threshold.critical;

    // 알림 필요 여부 확인
    if (status === 'critical' || status === 'warning') {
      await this.sendMetricAlert(metric, threshold, status);
    }
  }

  /**
   * 메트릭 상태 평가
   */
  private evaluateMetricStatus(
    value: number, 
    threshold: MetricThreshold
  ): 'normal' | 'warning' | 'critical' {
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning) return 'warning';
    return 'normal';
  }

  /**
   * 메트릭 알림 전송
   */
  private async sendMetricAlert(
    metric: PerformanceMetric,
    threshold: MetricThreshold,
    status: 'warning' | 'critical'
  ): Promise<void> {
    const severity = status === 'critical' ? ErrorSeverity.ERROR : ErrorSeverity.WARN;

    await this.notificationService.sendPerformanceAlert(
      metric.service,
      metric.metric,
      metric.value,
      threshold[status],
      metric.unit
    );
  }

  /**
   * 메트릭 분석
   */
  private async analyzeMetrics(): Promise<void> {
    const analysisResults = await this.performMetricsAnalysis();
    
    // 이상 패턴 감지
    const anomalies = this.detectAnomalies();
    
    // 성능 트렌드 분석
    const trends = this.analyzeTrends();
    
    // 예측 분석
    const predictions = this.predictMetrics();

    // 종합 분석 보고서 생성
    if (anomalies.length > 0 || trends.some(t => t.concerning)) {
      await this.sendAnalysisReport({
        anomalies,
        trends,
        predictions,
        timestamp: new Date()
      });
    }
  }

  /**
   * 이상 패턴 감지
   */
  private detectAnomalies(): MetricAnomaly[] {
    const anomalies: MetricAnomaly[] = [];

    for (const [key, history] of this.metrics.entries()) {
      if (history.length < 10) continue; // 최소 데이터 필요

      const recent = history.slice(-10);
      const baseline = this.calculateBaseline(history.slice(-50, -10));

      for (const metric of recent) {
        const anomaly = this.checkForAnomaly(metric, baseline);
        if (anomaly) {
          anomalies.push({
            metric,
            type: anomaly.type,
            severity: anomaly.severity,
            description: anomaly.description,
            baseline: baseline
          });
        }
      }
    }

    return anomalies;
  }

  /**
   * 기준선 계산
   */
  private calculateBaseline(metrics: PerformanceMetric[]): MetricBaseline {
    if (metrics.length === 0) {
      return { mean: 0, stdDev: 0, min: 0, max: 0 };
    }

    const values = metrics.map(m => m.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean,
      stdDev,
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  /**
   * 이상 징후 체크
   */
  private checkForAnomaly(
    metric: PerformanceMetric, 
    baseline: MetricBaseline
  ): AnomalyResult | null {
    const zScore = Math.abs((metric.value - baseline.mean) / baseline.stdDev);

    // Z-Score가 3 이상이면 심각한 이상
    if (zScore > 3) {
      return {
        type: 'statistical_outlier',
        severity: 'high',
        description: 
      };
    }

    // Z-Score가 2 이상이면 경미한 이상
    if (zScore > 2) {
      return {
        type: 'statistical_outlier',
        severity: 'medium',
        description: 
      };
    }

    // 급격한 변화 감지
    const recentHistory = this.getRecentHistory(metric.service, metric.metric, 5);
    if (recentHistory.length >= 3) {
      const trend = this.calculateTrend(recentHistory);
      if (Math.abs(trend) > baseline.stdDev * 2) {
        return {
          type: 'sudden_change',
          severity: 'medium',
          description: 
        };
      }
    }

    return null;
  }

  /**
   * 트렌드 분석
   */
  private analyzeTrends(): MetricTrend[] {
    const trends: MetricTrend[] = [];

    for (const [key, history] of this.metrics.entries()) {
      if (history.length < 20) continue;

      const recent = history.slice(-20);
      const trendValue = this.calculateTrend(recent);
      const [service, metric] = key.split('_');

      const trend: MetricTrend = {
        service: service as ServiceType,
        metric,
        trend: trendValue,
        direction: trendValue > 0 ? 'increasing' : trendValue < 0 ? 'decreasing' : 'stable',
        concerning: this.isTrendConcerning(service as ServiceType, metric, trendValue),
        confidence: this.calculateTrendConfidence(recent)
      };

      trends.push(trend);
    }

    return trends;
  }

  /**
   * 트렌드 계산 (선형 회귀)
   */
  private calculateTrend(metrics: PerformanceMetric[]): number {
    if (metrics.length < 2) return 0;

    const n = metrics.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = metrics.map(m => m.value);

    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  /**
   * 메트릭 예측
   */
  private predictMetrics(): MetricPrediction[] {
    const predictions: MetricPrediction[] = [];

    for (const [key, history] of this.metrics.entries()) {
      if (history.length < 30) continue;

      const recent = history.slice(-30);
      const [service, metric] = key.split('_');
      
      const prediction = this.predictNextValue(recent);
      const threshold = this.thresholds.get(key);

      if (threshold && prediction.value >= threshold.warning) {
        predictions.push({
          service: service as ServiceType,
          metric,
          currentValue: recent[recent.length - 1].value,
          predictedValue: prediction.value,
          confidence: prediction.confidence,
          timeHorizon: '10분',
          riskLevel: prediction.value >= threshold.critical ? 'high' : 'medium'
        });
      }
    }

    return predictions;
  }

  /**
   * 다음 값 예측 (단순 선형 외삽)
   */
  private predictNextValue(metrics: PerformanceMetric[]): {
    value: number;
    confidence: number;
  } {
    const trend = this.calculateTrend(metrics);
    const lastValue = metrics[metrics.length - 1].value;
    const predictedValue = lastValue + trend;
    
    // 예측 신뢰도 계산 (R² 기반)
    const confidence = this.calculateTrendConfidence(metrics);

    return {
      value: Math.max(0, predictedValue), // 음수 방지
      confidence
    };
  }

  /**
   * 트렌드 신뢰도 계산
   */
  private calculateTrendConfidence(metrics: PerformanceMetric[]): number {
    if (metrics.length < 3) return 0;

    const values = metrics.map(m => m.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const totalVariance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    
    if (totalVariance === 0) return 1;

    // 선형 회귀 잔차 계산
    const trend = this.calculateTrend(metrics);
    const intercept = mean - trend * (values.length - 1) / 2;
    
    const residualSum = values.reduce((sum, val, i) => {
      const predicted = intercept + trend * i;
      return sum + Math.pow(val - predicted, 2);
    }, 0);

    const rSquared = 1 - (residualSum / totalVariance);
    return Math.max(0, Math.min(1, rSquared));
  }

  /**
   * 메트릭 수집기 초기화
   */
  private initializeCollectors(): void {
    // Playwright 메트릭 수집기
    this.collectors.set(ServiceType.PLAYWRIGHT, {
      collect: async (): Promise<PerformanceMetric[]> => {
        const timestamp = new Date();
        return [
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.PLAYWRIGHT,
            metric: 'response_time',
            value: await this.measurePlaywrightResponseTime(),
            unit: 'ms',
            status: 'normal'
          },
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.PLAYWRIGHT,
            metric: 'memory_usage',
            value: await this.measurePlaywrightMemoryUsage(),
            unit: 'MB',
            status: 'normal'
          },
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.PLAYWRIGHT,
            metric: 'browser_instances',
            value: await this.countBrowserInstances(),
            unit: 'count',
            status: 'normal'
          }
        ];
      }
    });

    // Supabase 메트릭 수집기
    this.collectors.set(ServiceType.SUPABASE, {
      collect: async (): Promise<PerformanceMetric[]> => {
        const timestamp = new Date();
        return [
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.SUPABASE,
            metric: 'query_time',
            value: await this.measureSupabaseQueryTime(),
            unit: 'ms',
            status: 'normal'
          },
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.SUPABASE,
            metric: 'connection_pool',
            value: await this.getSupabaseConnectionCount(),
            unit: 'connections',
            status: 'normal'
          }
        ];
      }
    });

    // AI API 메트릭 수집기
    this.collectors.set(ServiceType.AI_API, {
      collect: async (): Promise<PerformanceMetric[]> => {
        const timestamp = new Date();
        return [
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.AI_API,
            metric: 'response_time',
            value: await this.measureAIAPIResponseTime(),
            unit: 'ms',
            status: 'normal'
          },
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.AI_API,
            metric: 'rate_limit_remaining',
            value: await this.getAIAPIRateLimit(),
            unit: 'requests',
            status: 'normal'
          }
        ];
      }
    });

    // System 메트릭 수집기
    this.collectors.set(ServiceType.SYSTEM, {
      collect: async (): Promise<PerformanceMetric[]> => {
        const timestamp = new Date();
        const systemMetrics = await this.getSystemResourceMetrics();
        
        return [
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.SYSTEM,
            metric: 'cpu_usage',
            value: systemMetrics.cpu,
            unit: 'percent',
            status: 'normal'
          },
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.SYSTEM,
            metric: 'memory_usage',
            value: systemMetrics.memory,
            unit: 'percent',
            status: 'normal'
          },
          {
            id: this.generateMetricId(),
            timestamp,
            service: ServiceType.SYSTEM,
            metric: 'disk_usage',
            value: systemMetrics.disk,
            unit: 'percent',
            status: 'normal'
          }
        ];
      }
    });
  }

  /**
   * 임계값 초기화
   */
  private initializeThresholds(): void {
    // Playwright 임계값
    this.thresholds.set('playwright_response_time', {
      warning: 3000,
      critical: 5000
    });
    this.thresholds.set('playwright_memory_usage', {
      warning: 500,
      critical: 800
    });

    // Supabase 임계값
    this.thresholds.set('supabase_query_time', {
      warning: 200,
      critical: 500
    });
    this.thresholds.set('supabase_connection_pool', {
      warning: 80,
      critical: 95
    });

    // AI API 임계값
    this.thresholds.set('ai_api_response_time', {
      warning: 5000,
      critical: 10000
    });
    this.thresholds.set('ai_api_rate_limit_remaining', {
      warning: 100,
      critical: 10
    });

    // System 임계값
    this.thresholds.set('system_cpu_usage', {
      warning: 70,
      critical: 90
    });
    this.thresholds.set('system_memory_usage', {
      warning: 80,
      critical: 95
    });
    this.thresholds.set('system_disk_usage', {
      warning: 85,
      critical: 95
    });
  }

  // 유틸리티 메서드들
  private generateMetricId(): string {
    return ;
  }

  private getRecentHistory(
    service: ServiceType, 
    metric: string, 
    count: number
  ): PerformanceMetric[] {
    const key = ;
    const history = this.metrics.get(key) || [];
    return history.slice(-count);
  }

  private isTrendConcerning(
    service: ServiceType, 
    metric: string, 
    trend: number
  ): boolean {
    // 증가 트렌드가 우려스러운 메트릭들
    const increasingConcerns = [
      'response_time', 'memory_usage', 'cpu_usage', 
      'disk_usage', 'error_rate', 'query_time'
    ];

    // 감소 트렌드가 우려스러운 메트릭들
    const decreasingConcerns = [
      'rate_limit_remaining', 'available_memory', 
      'disk_free_space', 'connection_pool'
    ];

    if (increasingConcerns.includes(metric) && trend > 0) return true;
    if (decreasingConcerns.includes(metric) && trend < 0) return true;

    return false;
  }

  private async sendAnalysisReport(report: {
    anomalies: MetricAnomaly[];
    trends: MetricTrend[];
    predictions: MetricPrediction[];
    timestamp: Date;
  }): Promise<void> {
    // 분석 보고서 알림 발송
    let message = '📊 성능 분석 보고서

';
    
    if (report.anomalies.length > 0) {
      message += ;
    }
    
    if (report.trends.some(t => t.concerning)) {
      message += ;
    }
    
    if (report.predictions.some(p => p.riskLevel === 'high')) {
      message += ;
    }

    await this.notificationService.sendNotification(
      ErrorSeverity.WARN,
      ServiceType.SYSTEM,
      '성능 분석 알림',
      message
    );
  }

  // 실제 메트릭 측정 메서드들 (구현 필요)
  private async measurePlaywrightResponseTime(): Promise<number> {
    return Math.random() * 1000 + 500; // 모킹
  }

  private async measurePlaywrightMemoryUsage(): Promise<number> {
    return Math.random() * 200 + 300; // 모킹
  }

  private async countBrowserInstances(): Promise<number> {
    return Math.floor(Math.random() * 3) + 1; // 모킹
  }

  private async measureSupabaseQueryTime(): Promise<number> {
    return Math.random() * 100 + 50; // 모킹
  }

  private async getSupabaseConnectionCount(): Promise<number> {
    return Math.floor(Math.random() * 20) + 10; // 모킹
  }

  private async measureAIAPIResponseTime(): Promise<number> {
    return Math.random() * 2000 + 1000; // 모킹
  }

  private async getAIAPIRateLimit(): Promise<number> {
    return Math.floor(Math.random() * 500) + 100; // 모킹
  }

  private async getSystemResourceMetrics(): Promise<{
    cpu: number;
    memory: number;
    disk: number;
  }> {
    return {
      cpu: Math.random() * 50 + 20,
      memory: Math.random() * 40 + 30,
      disk: Math.random() * 30 + 40
    };
  }
}

// 타입 정의
interface MetricThreshold {
  warning: number;
  critical: number;
}

interface MetricCollector {
  collect(): Promise<PerformanceMetric[]>;
}

interface MetricAnomaly {
  metric: PerformanceMetric;
  type: 'statistical_outlier' | 'sudden_change' | 'pattern_break';
  severity: 'low' | 'medium' | 'high';
  description: string;
  baseline: MetricBaseline;
}

interface MetricBaseline {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
}

interface AnomalyResult {
  type: string;
  severity: string;
  description: string;
}

interface MetricTrend {
  service: ServiceType;
  metric: string;
  trend: number;
  direction: 'increasing' | 'decreasing' | 'stable';
  concerning: boolean;
  confidence: number;
}

interface MetricPrediction {
  service: ServiceType;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeHorizon: string;
  riskLevel: 'low' | 'medium' | 'high';
}
