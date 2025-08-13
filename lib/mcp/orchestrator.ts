/**
 * MCP 자동화 오케스트레이터
 * PlaywrightMCP와 SupabaseMCP를 조율하여 복합적인 자동화 워크플로우 실행
 */

import { logger } from '@/lib/logger';
import {
  getPlaywrightController,
  LoginCredentials,
  ContentPublishOptions,
} from './playwright-controller';
import {
  getSupabaseController,
  ContentItem,
  PerformanceMetric,
} from './supabase-controller';
import { getErrorHandler, withRetry, ErrorContext } from './error-handler';

export interface WorkflowConfig {
  retryCount: number;
  delayBetweenSteps: number;
  captureScreenshots: boolean;
  performanceMonitoring: boolean;
  cleanupOnFailure: boolean;
}

export interface LoginWorkflowResult {
  success: boolean;
  sessionId?: string;
  error?: string;
  screenshot?: string;
}

export interface PublishWorkflowResult {
  success: boolean;
  contentId?: string;
  publishedUrl?: string;
  error?: string;
  performanceMetrics?: any;
}

export interface HealthCheckResult {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    playwright: 'healthy' | 'degraded' | 'unhealthy';
    supabase: 'healthy' | 'degraded' | 'unhealthy';
    database: 'healthy' | 'degraded' | 'unhealthy';
  };
  details: Record<string, any>;
}

/**
 * MCP 자동화 오케스트레이터 클래스
 */
export class AutomationOrchestrator {
  private config: WorkflowConfig;
  private isInitialized: boolean = false;

  constructor(config?: Partial<WorkflowConfig>) {
    this.config = {
      retryCount: 3,
      delayBetweenSteps: 1000,
      captureScreenshots: false,
      performanceMonitoring: true,
      cleanupOnFailure: true,
      ...config,
    };
  }

  /**
   * 오케스트레이터 초기화
   */
  async initialize(): Promise<void> {
    try {
      logger.info('자동화 오케스트레이터 초기화 시작');

      // SupabaseController 초기화
      const supabaseController = getSupabaseController();
      if (!supabaseController.getInitializationStatus()) {
        await supabaseController.initialize();
      }

      // PlaywrightController는 사용 시점에 초기화
      this.isInitialized = true;

      logger.info('자동화 오케스트레이터 초기화 완료');

      // 초기화 로그 기록
      await supabaseController.logAutomation({
        type: 'health_check',
        status: 'success',
        message: '자동화 오케스트레이터 초기화 완료',
      });
    } catch (error) {
      logger.error('오케스트레이터 초기화 실패', { error });
      throw error;
    }
  }

  /**
   * 관리자 로그인 워크플로우
   */
  async executeLoginWorkflow(credentials: LoginCredentials): Promise<LoginWorkflowResult> {
    const context: Omit<ErrorContext, 'timestamp'> = {
      operation: 'login_workflow',
      component: 'orchestrator',
    };

    try {
      logger.info('관리자 로그인 워크플로우 시작', { email: credentials.email });

      const result = await withRetry(
        async () => {
          // 1. Playwright 초기화
          const playwrightController = getPlaywrightController({
            headless: !this.config.captureScreenshots,
          });

          if (!playwrightController.isInitialized()) {
            await playwrightController.initialize();
          }

          // 2. 로그인 실행
          const loginSuccess = await playwrightController.loginToAdmin(credentials);

          if (!loginSuccess) {
            throw new Error('로그인 실패');
          }

          // 3. 스크린샷 캡처 (옵션)
          let screenshotPath;
          if (this.config.captureScreenshots) {
            screenshotPath = `/tmp/login-success-${Date.now()}.png`;
            await playwrightController.captureScreenshot(screenshotPath);
          }

          // 4. 세션 정보 수집
          const currentUrl = await playwrightController.getCurrentUrl();
          const pageTitle = await playwrightController.getPageTitle();

          return {
            success: true,
            sessionId: this.generateSessionId(),
            screenshot: screenshotPath,
            url: currentUrl,
            title: pageTitle,
          };
        },
        context,
        { maxRetries: this.config.retryCount }
      );

      // 성공 로그 기록
      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'login',
        status: 'success',
        message: '관리자 로그인 성공',
        metadata: {
          email: credentials.email,
          session_id: result.sessionId,
        },
      });

      logger.info('관리자 로그인 워크플로우 완료', { sessionId: result.sessionId });

      return {
        success: true,
        sessionId: result.sessionId,
        screenshot: result.screenshot,
      };
    } catch (error) {
      logger.error('로그인 워크플로우 실패', { error });

      // 실패 로그 기록
      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'login',
        status: 'failure',
        message: `로그인 실패: ${(error as Error).message}`,
        metadata: {
          email: credentials.email,
          error_message: (error as Error).message,
        },
      });

      if (this.config.cleanupOnFailure) {
        await this.cleanup();
      }

      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * 콘텐츠 게시 워크플로우
   */
  async executePublishWorkflow(
    options: ContentPublishOptions,
    ensureLogin?: LoginCredentials
  ): Promise<PublishWorkflowResult> {
    const context: Omit<ErrorContext, 'timestamp'> = {
      operation: 'publish_workflow',
      component: 'orchestrator',
    };

    try {
      logger.info('콘텐츠 게시 워크플로우 시작', { title: options.title });

      const result = await withRetry(
        async () => {
          const playwrightController = getPlaywrightController();
          const supabaseController = getSupabaseController();

          // 1. 브라우저 초기화
          if (!playwrightController.isInitialized()) {
            await playwrightController.initialize();
          }

          // 2. 로그인 확인/실행 (필요한 경우)
          if (ensureLogin) {
            await this.delay(this.config.delayBetweenSteps);
            const loginResult = await playwrightController.loginToAdmin(ensureLogin);
            if (!loginResult) {
              throw new Error('사전 로그인 실패');
            }
          }

          // 3. 성능 모니터링 시작
          let performanceMetrics;
          if (this.config.performanceMonitoring) {
            const startTime = Date.now();

            // 콘텐츠 게시 실행
            const publishSuccess = await playwrightController.publishContent(options);

            if (!publishSuccess) {
              throw new Error('콘텐츠 게시 실패');
            }

            // 성능 메트릭 수집
            const endTime = Date.now();
            performanceMetrics = await playwrightController.getPerformanceMetrics();
            performanceMetrics.totalTime = endTime - startTime;

            // 성능 데이터 저장
            await supabaseController.recordPerformanceMetric({
              metric_type: 'content_publish_time',
              value: performanceMetrics.totalTime,
              unit: 'ms',
              page_url: (await playwrightController.getCurrentUrl()) || undefined,
              timestamp: new Date().toISOString(),
              metadata: {
                title: options.title,
                category: options.category,
                tags_count: options.tags?.length || 0,
              },
            });
          } else {
            // 성능 모니터링 없이 게시
            const publishSuccess = await playwrightController.publishContent(options);
            if (!publishSuccess) {
              throw new Error('콘텐츠 게시 실패');
            }
          }

          // 4. 콘텐츠 정보 데이터베이스 저장
          const contentItem: ContentItem = {
            title: options.title,
            content: options.content,
            category: options.category,
            tags: options.tags,
            status: 'published',
            published_at: new Date().toISOString(),
            metadata: {
              featured: options.featured,
              publish_date: options.publishDate?.toISOString(),
              automated: true,
            },
          };

          const contentId = await supabaseController.upsertContent(contentItem);

          // 5. 게시 후 URL 수집
          const publishedUrl = await playwrightController.getCurrentUrl();

          return {
            success: true,
            contentId: contentId || undefined,
            publishedUrl: publishedUrl || undefined,
            performanceMetrics,
          };
        },
        context,
        { maxRetries: this.config.retryCount }
      );

      logger.info('콘텐츠 게시 워크플로우 완료', {
        contentId: result.contentId,
        title: options.title,
      });

      return result;
    } catch (error) {
      logger.error('게시 워크플로우 실패', { error, title: options.title });

      // 실패 로그 기록
      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'publish',
        status: 'failure',
        message: `게시 실패: ${(error as Error).message}`,
        metadata: {
          title: options.title,
          category: options.category,
          error_message: (error as Error).message,
        },
      });

      if (this.config.cleanupOnFailure) {
        await this.cleanup();
      }

      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * 종합 헬스체크 실행
   */
  async executeHealthCheck(): Promise<HealthCheckResult> {
    logger.info('종합 헬스체크 시작');

    const results: HealthCheckResult = {
      overall: 'healthy',
      services: {
        playwright: 'healthy',
        supabase: 'healthy',
        database: 'healthy',
      },
      details: {},
    };

    try {
      // 1. Supabase 연결 테스트
      const supabaseController = getSupabaseController();
      const supabaseStartTime = Date.now();

      try {
        await supabaseController.getAutomationLogs(1);
        results.details.supabase_response_time = Date.now() - supabaseStartTime;

        await supabaseController.recordHealthCheck({
          service: 'supabase',
          status: 'healthy',
          response_time: results.details.supabase_response_time,
          checked_at: new Date().toISOString(),
        });
      } catch (error) {
        results.services.supabase = 'unhealthy';
        results.details.supabase_error = (error as Error).message;
        logger.error('Supabase 헬스체크 실패', { error });
      }

      // 2. Playwright 브라우저 테스트
      try {
        const playwrightController = getPlaywrightController();
        const browserStartTime = Date.now();

        if (!playwrightController.isInitialized()) {
          await playwrightController.initialize();
        }

        await playwrightController.navigateTo('data:text/html,<h1>Health Check</h1>');
        const title = await playwrightController.getPageTitle();

        results.details.playwright_response_time = Date.now() - browserStartTime;
        results.details.browser_test = title === '' ? 'success' : 'warning';

        await supabaseController.recordHealthCheck({
          service: 'playwright',
          status: 'healthy',
          response_time: results.details.playwright_response_time,
          checked_at: new Date().toISOString(),
          metadata: { test_page_loaded: true },
        });

        await playwrightController.cleanup();
      } catch (error) {
        results.services.playwright = 'unhealthy';
        results.details.playwright_error = (error as Error).message;
        logger.error('Playwright 헬스체크 실패', { error });
      }

      // 3. 데이터베이스 성능 테스트
      try {
        const dbStartTime = Date.now();
        const stats = await supabaseController.getAutomationStats(1);
        results.details.database_response_time = Date.now() - dbStartTime;
        results.details.recent_logs_count = stats.log_summary?.total || 0;

        if (results.details.database_response_time > 5000) {
          results.services.database = 'degraded';
        }
      } catch (error) {
        results.services.database = 'unhealthy';
        results.details.database_error = (error as Error).message;
        logger.error('데이터베이스 헬스체크 실패', { error });
      }

      // 4. 전체 상태 평가
      const unhealthyServices = Object.values(results.services).filter(
        s => s === 'unhealthy'
      ).length;
      const degradedServices = Object.values(results.services).filter(s => s === 'degraded').length;

      if (unhealthyServices > 0) {
        results.overall = 'unhealthy';
      } else if (degradedServices > 0) {
        results.overall = 'degraded';
      }

      // 헬스체크 결과 로깅
      await supabaseController.logAutomation({
        type: 'health_check',
        status:
          results.overall === 'healthy'
            ? 'success'
            : results.overall === 'degraded'
              ? 'warning'
              : 'failure',
        message: `시스템 헬스체크 완료 - ${results.overall}`,
        metadata: {
          services: results.services,
          details: results.details,
        },
      });

      logger.info('종합 헬스체크 완료', { overall: results.overall, services: results.services });
    } catch (error) {
      results.overall = 'unhealthy';
      results.details.general_error = (error as Error).message;
      logger.error('헬스체크 중 예상치 못한 오류', { error });
    }

    return results;
  }

  /**
   * 자동화 통계 및 분석 수집
   */
  async getAutomationAnalytics(days: number = 7): Promise<Record<string, any>> {
    try {
      const supabaseController = getSupabaseController();
      const errorHandler = getErrorHandler();

      // 기본 통계
      const stats = await supabaseController.getAutomationStats(days);

      // 에러 분석
      const errorAnalysis = errorHandler.getErrorAnalysis(days);

      // 성능 메트릭
      const performanceMetrics = await supabaseController.getPerformanceMetrics(
        undefined, // all metric types
        new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        new Date(),
        100
      );

      // 헬스체크 히스토리
      const healthChecks = await supabaseController.getLatestHealthChecks();

      const analytics = {
        period_days: days,
        automation_stats: stats,
        error_analysis: errorAnalysis,
        performance_summary: this.summarizePerformanceMetrics(performanceMetrics),
        health_summary: this.summarizeHealthChecks(healthChecks),
        generated_at: new Date().toISOString(),
      };

      logger.info('자동화 분석 완료', {
        days,
        totalLogs: stats.log_summary?.total,
        totalErrors: errorAnalysis.total_errors,
      });

      return analytics;
    } catch (error) {
      logger.error('자동화 분석 수집 실패', { error });
      return { error: (error as Error).message };
    }
  }

  /**
   * 성능 메트릭 요약
   */
  private summarizePerformanceMetrics(metrics: PerformanceMetric[]): Record<string, any> {
    const summary: Record<string, any> = {
      total_metrics: metrics.length,
      by_type: {} as Record<string, { count: number; avg: number; min: number; max: number }>,
    };

    const typeGroups: Record<string, number[]> = {};

    metrics.forEach(metric => {
      if (!typeGroups[metric.metric_type]) {
        typeGroups[metric.metric_type] = [];
      }
      typeGroups[metric.metric_type].push(metric.value);
    });

    Object.entries(typeGroups).forEach(([type, values]) => {
      summary.by_type[type] = {
        count: values.length,
        avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    return summary;
  }

  /**
   * 헬스체크 요약
   */
  private summarizeHealthChecks(healthChecks: any[]): Record<string, any> {
    const summary = {
      total_checks: healthChecks.length,
      by_service: {} as Record<string, Record<string, number>>,
      overall_health_rate: 0,
    };

    healthChecks.forEach(check => {
      if (!summary.by_service[check.service]) {
        summary.by_service[check.service] = {
          healthy: 0,
          degraded: 0,
          unhealthy: 0,
        };
      }

      if (summary.by_service[check.service][check.status] !== undefined) {
        summary.by_service[check.service][check.status]++;
      }
    });

    // 전체 건강도 계산
    const healthyCount = healthChecks.filter(c => c.status === 'healthy').length;
    summary.overall_health_rate =
      healthChecks.length > 0 ? (healthyCount / healthChecks.length) * 100 : 0;

    return summary;
  }

  /**
   * 세션 ID 생성
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 정리 작업
   */
  async cleanup(): Promise<void> {
    try {
      logger.info('자동화 시스템 정리 시작');

      // Playwright 정리
      const { cleanupPlaywright } = await import('./playwright-controller');
      await cleanupPlaywright();

      logger.info('자동화 시스템 정리 완료');
    } catch (error) {
      logger.error('정리 작업 중 오류', { error });
    }
  }

  /**
   * 초기화 상태 확인
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * 설정 업데이트
   */
  updateConfig(newConfig: Partial<WorkflowConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// 싱글톤 인스턴스
let orchestrator: AutomationOrchestrator | null = null;

/**
 * AutomationOrchestrator 싱글톤 인스턴스 반환
 */
export function getOrchestrator(config?: Partial<WorkflowConfig>): AutomationOrchestrator {
  if (!orchestrator) {
    orchestrator = new AutomationOrchestrator(config);
  }
  return orchestrator;
}

/**
 * 오케스트레이터 초기화
 */
export async function initializeOrchestrator(
  config?: Partial<WorkflowConfig>
): Promise<AutomationOrchestrator> {
  const orc = getOrchestrator(config);
  if (!orc.isReady()) {
    await orc.initialize();
  }
  return orc;
}
