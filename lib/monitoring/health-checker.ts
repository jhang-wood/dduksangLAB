/**
 * 시스템 헬스체커
 * 전체 시스템의 상태를 실시간으로 모니터링하고 문제를 감지
 */

import { logger } from '@/lib/logger';
import { getSupabaseController } from '@/lib/mcp/supabase-controller';
import { getOrchestrator } from '@/lib/mcp/orchestrator';
import { getPlaywrightController } from '@/lib/mcp/playwright-controller';
import { handleAutomationError } from '@/lib/mcp/error-handler';

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: ServiceHealth[];
  alerts: HealthAlert[];
  recommendations: string[];
}

export interface HealthAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  service: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface HealthCheckConfig {
  interval: number; // milliseconds
  timeout: number;
  retryCount: number;
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    failureCount: number;
  };
  services: {
    [key: string]: {
      enabled: boolean;
      customTimeout?: number;
      healthEndpoint?: string;
    };
  };
}

/**
 * 시스템 헬스체커 클래스
 */
export class HealthChecker {
  private config: HealthCheckConfig;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private lastHealthCheck: SystemHealth | null = null;
  private activeAlerts: Map<string, HealthAlert> = new Map();
  private serviceFailureCounts: Map<string, number> = new Map();

  constructor(config?: Partial<HealthCheckConfig>) {
    this.config = {
      interval: 60000, // 1분
      timeout: 10000, // 10초
      retryCount: 2,
      alertThresholds: {
        responseTime: 5000, // 5초
        errorRate: 10, // 10%
        failureCount: 3,
      },
      services: {
        supabase: { enabled: true },
        playwright: { enabled: true, customTimeout: 15000 },
        database: { enabled: true },
        automation: { enabled: true },
        orchestrator: { enabled: true },
      },
      ...config,
    };
  }

  /**
   * 헬스체커 시작
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('헬스체커가 이미 실행 중입니다');
      return;
    }

    try {
      logger.info('시스템 헬스체커 시작', { interval: this.config.interval });

      this.isRunning = true;

      // 초기 헬스체크 실행
      await this.performHealthCheck();

      // 정기 헬스체크 스케줄링
      this.intervalId = setInterval(async () => {
        try {
          await this.performHealthCheck();
        } catch (error) {
          logger.error('정기 헬스체크 실행 실패', { error });
        }
      }, this.config.interval);

      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'health_check',
        status: 'success',
        message: '시스템 헬스체커 시작됨',
        metadata: {
          interval: this.config.interval,
          enabled_services: Object.keys(this.config.services).filter(
            key => this.config.services[key].enabled
          ),
        },
      });

      logger.info('시스템 헬스체커 시작 완료');
    } catch (error) {
      logger.error('헬스체커 시작 실패', { error });
      throw error;
    }
  }

  /**
   * 헬스체커 정지
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      logger.warn('헬스체커가 실행 중이 아닙니다');
      return;
    }

    try {
      logger.info('시스템 헬스체커 정지 시작');

      this.isRunning = false;

      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }

      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'health_check',
        status: 'success',
        message: '시스템 헬스체커 정지됨',
      });

      logger.info('시스템 헬스체커 정지 완료');
    } catch (error) {
      logger.error('헬스체커 정지 실패', { error });
    }
  }

  /**
   * 전체 시스템 헬스체크 수행
   */
  async performHealthCheck(): Promise<SystemHealth> {
    const startTime = Date.now();

    try {
      logger.debug('시스템 헬스체크 시작');

      const services: ServiceHealth[] = [];
      const newAlerts: HealthAlert[] = [];

      // 각 서비스 헬스체크
      for (const [serviceName, serviceConfig] of Object.entries(this.config.services)) {
        if (!serviceConfig.enabled) {
          continue;
        }

        try {
          const serviceHealth = await this.checkServiceHealth(serviceName, serviceConfig);
          services.push(serviceHealth);

          // 알림 체크
          const alerts = this.checkServiceAlerts(serviceHealth);
          newAlerts.push(...alerts);
        } catch (error) {
          logger.error(`서비스 헬스체크 실패: ${serviceName}`, { error });

          services.push({
            name: serviceName,
            status: 'unhealthy',
            responseTime: 0,
            lastCheck: new Date(),
            errorMessage: (error as Error).message,
          });

          // 실패 카운트 증가
          const currentCount = this.serviceFailureCounts.get(serviceName) || 0;
          this.serviceFailureCounts.set(serviceName, currentCount + 1);
        }
      }

      // 전체 상태 평가
      const overall = this.evaluateOverallHealth(services);

      // 추천사항 생성
      const recommendations = this.generateRecommendations(services);

      const systemHealth: SystemHealth = {
        overall,
        timestamp: new Date(),
        services,
        alerts: newAlerts,
        recommendations,
      };

      // 알림 처리
      await this.processAlerts(newAlerts);

      // 헬스체크 결과 저장
      await this.saveHealthCheckResult(systemHealth);

      this.lastHealthCheck = systemHealth;

      const duration = Date.now() - startTime;
      logger.info('시스템 헬스체크 완료', {
        overall: systemHealth.overall,
        services: services.length,
        alerts: newAlerts.length,
        duration,
      });

      return systemHealth;
    } catch (error) {
      logger.error('시스템 헬스체크 실패', { error });

      await handleAutomationError(error as Error, {
        operation: 'health_check',
        component: 'automation',
      });

      // 기본 실패 상태 반환
      return {
        overall: 'unhealthy',
        timestamp: new Date(),
        services: [],
        alerts: [],
        recommendations: ['시스템 헬스체크를 수행할 수 없습니다'],
      };
    }
  }

  /**
   * 개별 서비스 헬스체크
   */
  private async checkServiceHealth(
    serviceName: string,
    serviceConfig: any
  ): Promise<ServiceHealth> {
    const startTime = Date.now();
    const timeout = serviceConfig.customTimeout || this.config.timeout;

    try {
      let result: any;

      switch (serviceName) {
        case 'supabase':
          result = await this.checkSupabaseHealth(timeout);
          break;
        case 'playwright':
          result = await this.checkPlaywrightHealth(timeout);
          break;
        case 'database':
          result = await this.checkDatabaseHealth(timeout);
          break;
        case 'automation':
          result = await this.checkAutomationHealth(timeout);
          break;
        case 'orchestrator':
          result = await this.checkOrchestratorHealth(timeout);
          break;
        default:
          throw new Error(`Unknown service: ${serviceName}`);
      }

      const responseTime = Date.now() - startTime;

      // 성공 시 실패 카운트 리셋
      this.serviceFailureCounts.delete(serviceName);

      return {
        name: serviceName,
        status: responseTime > this.config.alertThresholds.responseTime ? 'degraded' : 'healthy',
        responseTime,
        lastCheck: new Date(),
        metadata: result,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      return {
        name: serviceName,
        status: 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        errorMessage: (error as Error).message,
      };
    }
  }

  /**
   * Supabase 헬스체크
   */
  private async checkSupabaseHealth(timeout: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Supabase health check timeout')), timeout);

      try {
        const supabaseController = getSupabaseController();

        // 간단한 쿼리 실행으로 연결 테스트
        const logs = await supabaseController.getAutomationLogs(1);

        clearTimeout(timer);
        resolve({
          connection: 'active',
          last_log_count: logs.length,
        });
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * Playwright 헬스체크
   */
  private async checkPlaywrightHealth(timeout: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Playwright health check timeout')), timeout);

      try {
        const playwrightController = getPlaywrightController({ headless: true });

        // 브라우저 초기화 및 간단한 페이지 로드 테스트
        await playwrightController.initialize();
        await playwrightController.navigateTo('data:text/html,<h1>Health Check</h1>');
        const _title = await playwrightController.getPageTitle(); // 언더스코어 추가로 미사용 변수 표시
        void _title; // Suppress unused variable warning
        await playwrightController.cleanup();

        clearTimeout(timer);
        resolve({
          browser_status: 'functional',
          test_page_loaded: true,
        });
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * 데이터베이스 헬스체크
   */
  private async checkDatabaseHealth(timeout: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Database health check timeout')), timeout);

      try {
        const supabaseController = getSupabaseController();

        // 데이터베이스 상태 및 성능 확인
        const startTime = Date.now();
        const stats = await supabaseController.getAutomationStats(1);
        const queryTime = Date.now() - startTime;

        clearTimeout(timer);
        resolve({
          query_time: queryTime,
          recent_logs: stats.log_summary?.total || 0,
          connection: 'active',
        });
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * 자동화 시스템 헬스체크
   */
  private async checkAutomationHealth(timeout: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Automation health check timeout')), timeout);

      try {
        // 스케줄러 상태 확인
        const { getScheduler } = await import('../automation/scheduler');
        const scheduler = getScheduler();

        const isRunning = scheduler.isSchedulerRunning();
        const runningTasks = scheduler.getRunningTaskCount();
        const taskStatus = scheduler.getTaskStatus();

        clearTimeout(timer);
        resolve({
          scheduler_running: isRunning,
          running_tasks: runningTasks,
          total_tasks: taskStatus.length,
          enabled_tasks: taskStatus.filter(t => t.enabled).length,
        });
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * 오케스트레이터 헬스체크
   */
  private async checkOrchestratorHealth(timeout: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Orchestrator health check timeout')),
        timeout
      );

      try {
        const orchestrator = getOrchestrator();

        const isReady = orchestrator.isReady();

        clearTimeout(timer);
        resolve({
          orchestrator_ready: isReady,
          status: 'active',
        });
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * 전체 시스템 상태 평가
   */
  private evaluateOverallHealth(services: ServiceHealth[]): 'healthy' | 'degraded' | 'unhealthy' {
    if (services.length === 0) {
      return 'unhealthy';
    }

    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;

    const healthRatio = healthyServices / services.length;

    if (unhealthyServices > 0 && healthRatio < 0.7) {
      return 'unhealthy';
    } else if (degradedServices > 0 || unhealthyServices > 0) {
      return 'degraded';
    } else {
      return 'healthy';
    }
  }

  /**
   * 서비스별 알림 체크
   */
  private checkServiceAlerts(serviceHealth: ServiceHealth): HealthAlert[] {
    const alerts: HealthAlert[] = [];

    // 응답 시간 알림
    if (serviceHealth.responseTime > this.config.alertThresholds.responseTime) {
      alerts.push({
        id: `${serviceHealth.name}-slow-response-${Date.now()}`,
        severity: 'warning',
        service: serviceHealth.name,
        message: `서비스 응답 시간이 느립니다: ${serviceHealth.responseTime}ms`,
        timestamp: new Date(),
        resolved: false,
        metadata: { responseTime: serviceHealth.responseTime },
      });
    }

    // 서비스 다운 알림
    if (serviceHealth.status === 'unhealthy') {
      const failureCount = this.serviceFailureCounts.get(serviceHealth.name) || 1;

      alerts.push({
        id: `${serviceHealth.name}-unhealthy-${Date.now()}`,
        severity: failureCount >= this.config.alertThresholds.failureCount ? 'critical' : 'warning',
        service: serviceHealth.name,
        message: `서비스가 비정상 상태입니다: ${serviceHealth.errorMessage}`,
        timestamp: new Date(),
        resolved: false,
        metadata: {
          failureCount,
          errorMessage: serviceHealth.errorMessage,
        },
      });
    }

    return alerts;
  }

  /**
   * 추천사항 생성
   */
  private generateRecommendations(services: ServiceHealth[]): string[] {
    const recommendations: string[] = [];

    // 응답 시간이 느린 서비스
    const slowServices = services.filter(
      s => s.responseTime > this.config.alertThresholds.responseTime
    );
    if (slowServices.length > 0) {
      recommendations.push(
        `응답 시간이 느린 서비스들을 확인하세요: ${slowServices.map(s => s.name).join(', ')}`
      );
    }

    // 다운된 서비스
    const downServices = services.filter(s => s.status === 'unhealthy');
    if (downServices.length > 0) {
      recommendations.push(
        `다운된 서비스들을 재시작하세요: ${downServices.map(s => s.name).join(', ')}`
      );
    }

    // 전체 시스템 상태에 따른 추천
    const healthyCount = services.filter(s => s.status === 'healthy').length;
    const healthRatio = healthyCount / services.length;

    if (healthRatio < 0.5) {
      recommendations.push('시스템 전체적으로 문제가 많습니다. 긴급 점검이 필요합니다.');
    } else if (healthRatio < 0.8) {
      recommendations.push('일부 서비스에 문제가 있습니다. 모니터링을 강화하세요.');
    }

    if (recommendations.length === 0) {
      recommendations.push('모든 시스템이 정상적으로 작동하고 있습니다.');
    }

    return recommendations;
  }

  /**
   * 알림 처리
   */
  private async processAlerts(alerts: HealthAlert[]): Promise<void> {
    for (const alert of alerts) {
      // 중복 알림 방지
      if (!this.activeAlerts.has(alert.id)) {
        this.activeAlerts.set(alert.id, alert);

        // 알림 발송 (실제 구현에서는 노티피케이션 서비스 연동)
        await this.sendAlert(alert);
      }
    }

    // 해결된 알림 정리
    this.cleanupResolvedAlerts();
  }

  /**
   * 알림 발송
   */
  private async sendAlert(alert: HealthAlert): Promise<void> {
    try {
      logger.warn(`헬스체크 알림: ${alert.message}`, {
        severity: alert.severity,
        service: alert.service,
        metadata: alert.metadata,
      });

      // TODO: 실제 알림 발송 (이메일, 슬랙, 텔레그램 등)
    } catch (error) {
      logger.error('알림 발송 실패', { error, alert });
    }
  }

  /**
   * 해결된 알림 정리
   */
  private cleanupResolvedAlerts(): void {
    const now = Date.now();
    const alertTtl = 60 * 60 * 1000; // 1시간

    for (const [alertId, alert] of this.activeAlerts.entries()) {
      // 1시간 이상 된 알림은 자동으로 정리
      if (now - alert.timestamp.getTime() > alertTtl) {
        this.activeAlerts.delete(alertId);
      }
    }
  }

  /**
   * 헬스체크 결과 저장
   */
  private async saveHealthCheckResult(systemHealth: SystemHealth): Promise<void> {
    try {
      const supabaseController = getSupabaseController();

      // 각 서비스별 헬스체크 결과 저장
      for (const service of systemHealth.services) {
        await supabaseController.recordHealthCheck({
          service: service.name,
          status: service.status,
          response_time: service.responseTime,
          error_message: service.errorMessage,
          checked_at: service.lastCheck.toISOString(),
          metadata: service.metadata,
        });
      }

      // 전체 시스템 상태 로그
      await supabaseController.logAutomation({
        type: 'health_check',
        status:
          systemHealth.overall === 'healthy'
            ? 'success'
            : systemHealth.overall === 'degraded'
              ? 'warning'
              : 'failure',
        message: `시스템 헬스체크 완료 - ${systemHealth.overall}`,
        metadata: {
          overall_status: systemHealth.overall,
          services_count: systemHealth.services.length,
          alerts_count: systemHealth.alerts.length,
          healthy_services: systemHealth.services.filter(s => s.status === 'healthy').length,
        },
      });
    } catch (error) {
      logger.error('헬스체크 결과 저장 실패', { error });
    }
  }

  /**
   * 현재 시스템 상태 조회
   */
  getCurrentHealth(): SystemHealth | null {
    return this.lastHealthCheck;
  }

  /**
   * 활성 알림 조회
   */
  getActiveAlerts(): HealthAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  /**
   * 헬스체커 실행 상태 확인
   */
  isHealthCheckerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * 설정 업데이트
   */
  updateConfig(newConfig: Partial<HealthCheckConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('헬스체커 설정 업데이트됨', { config: this.config });
  }
}

// 싱글톤 인스턴스
let healthChecker: HealthChecker | null = null;

/**
 * HealthChecker 싱글톤 인스턴스 반환
 */
export function getHealthChecker(config?: Partial<HealthCheckConfig>): HealthChecker {
  if (!healthChecker) {
    healthChecker = new HealthChecker(config);
  }
  return healthChecker;
}

/**
 * 헬스체커 시작
 */
export async function startHealthChecker(
  config?: Partial<HealthCheckConfig>
): Promise<HealthChecker> {
  const checker = getHealthChecker(config);

  if (!checker.isHealthCheckerRunning()) {
    await checker.start();
  }

  return checker;
}

/**
 * 헬스체커 정지
 */
export async function stopHealthChecker(): Promise<void> {
  if (healthChecker && healthChecker.isHealthCheckerRunning()) {
    await healthChecker.stop();
  }
}
