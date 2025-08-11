/**
 * MCP 자동화 시스템용 에러 핸들링 및 복구 시스템
 */

import { logger } from '@/lib/logger';
import { getSupabaseController } from './supabase-controller';

export interface ErrorContext {
  operation: string;
  component: 'playwright' | 'supabase' | 'orchestrator' | 'automation';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffFactor: number;
  maxDelayMs: number;
}

export interface RecoveryAction {
  type: 'retry' | 'fallback' | 'alert' | 'cleanup' | 'restart';
  description: string;
  handler: () => Promise<boolean>;
}

/**
 * 커스텀 에러 클래스들
 */
export class AutomationError extends Error {
  constructor(
    message: string,
    public readonly context: ErrorContext,
    public readonly recoverable: boolean = true,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AutomationError';
  }
}

export class PlaywrightError extends AutomationError {
  constructor(message: string, context: Omit<ErrorContext, 'component'>, cause?: Error) {
    super(message, { ...context, component: 'playwright' }, true, cause);
    this.name = 'PlaywrightError';
  }
}

export class SupabaseError extends AutomationError {
  constructor(message: string, context: Omit<ErrorContext, 'component'>, recoverable = true, cause?: Error) {
    super(message, { ...context, component: 'supabase' }, recoverable, cause);
    this.name = 'SupabaseError';
  }
}

export class OrchestrationError extends AutomationError {
  constructor(message: string, context: Omit<ErrorContext, 'component'>, cause?: Error) {
    super(message, { ...context, component: 'orchestrator' }, true, cause);
    this.name = 'OrchestrationError';
  }
}

/**
 * 에러 핸들러 및 복구 시스템
 */
export class ErrorHandler {
  private retryConfig: RetryConfig;
  private recoveryActions: Map<string, RecoveryAction[]> = new Map();
  private errorHistory: AutomationError[] = [];
  private maxHistorySize = 100;

  constructor(retryConfig?: Partial<RetryConfig>) {
    this.retryConfig = {
      maxRetries: 3,
      delayMs: 1000,
      backoffFactor: 2,
      maxDelayMs: 30000,
      ...retryConfig
    };

    this.initializeRecoveryActions();
  }

  /**
   * 복구 액션 초기화
   */
  private initializeRecoveryActions(): void {
    // Playwright 브라우저 관련 복구 액션
    this.recoveryActions.set('playwright:browser_crash', [
      {
        type: 'restart',
        description: '브라우저 재시작',
        handler: async () => {
          try {
            const { getPlaywrightController } = await import('./playwright-controller');
            const controller = getPlaywrightController();
            await controller.cleanup();
            await controller.initialize();
            return true;
          } catch {
            return false;
          }
        }
      }
    ]);

    // Playwright 네트워크 에러 복구 액션
    this.recoveryActions.set('playwright:network_error', [
      {
        type: 'retry',
        description: '네트워크 재시도',
        handler: async () => {
          await this.delay(2000);
          return true;
        }
      }
    ]);

    // Supabase 연결 에러 복구 액션
    this.recoveryActions.set('supabase:connection_error', [
      {
        type: 'retry',
        description: 'Supabase 연결 재시도',
        handler: async () => {
          try {
            const controller = getSupabaseController();
            await controller.initialize();
            return true;
          } catch {
            return false;
          }
        }
      }
    ]);

    // 일반적인 타임아웃 복구 액션
    this.recoveryActions.set('common:timeout', [
      {
        type: 'retry',
        description: '타임아웃 재시도',
        handler: async () => {
          await this.delay(5000);
          return true;
        }
      }
    ]);
  }

  /**
   * 에러 처리 및 복구 시도
   */
  async handleError(error: Error, context: ErrorContext): Promise<boolean> {
    const automationError = this.normalizeError(error, context);
    this.addToHistory(automationError);

    logger.error('자동화 에러 발생', {
      error: automationError.message,
      context: automationError.context,
      recoverable: automationError.recoverable,
      cause: automationError.cause?.message
    });

    // 데이터베이스에 에러 로그 기록
    await this.logErrorToDatabase(automationError);

    if (!automationError.recoverable) {
      logger.error('복구 불가능한 에러', { error: automationError.message });
      return false;
    }

    // 복구 시도
    return await this.attemptRecovery(automationError);
  }

  /**
   * 에러를 AutomationError로 정규화
   */
  private normalizeError(error: Error, context: ErrorContext): AutomationError {
    if (error instanceof AutomationError) {
      return error;
    }

    // 에러 타입별 분류
    if (error.message.includes('Browser closed') || 
        error.message.includes('Target closed') ||
        error.message.includes('Protocol error')) {
      return new PlaywrightError(error.message, context, error);
    }

    if (error.message.includes('network') || 
        error.message.includes('timeout') ||
        error.message.includes('NETWORK_ERROR')) {
      return new PlaywrightError(error.message, { 
        ...context, 
        metadata: { ...context.metadata, errorType: 'network' }
      }, error);
    }

    if (error.message.includes('supabase') || 
        error.message.includes('database') ||
        error.message.includes('PostgreSQL')) {
      return new SupabaseError(error.message, context, true, error);
    }

    // 기본 자동화 에러로 처리
    return new AutomationError(error.message, context, true, error);
  }

  /**
   * 복구 시도
   */
  private async attemptRecovery(error: AutomationError): Promise<boolean> {
    const errorKey = this.getErrorKey(error);
    const actions = this.recoveryActions.get(errorKey) || 
                   this.recoveryActions.get(`${error.context.component}:generic`) ||
                   this.getDefaultRecoveryActions();

    logger.info('에러 복구 시도 시작', { 
      errorKey, 
      actionsCount: actions.length,
      operation: error.context.operation 
    });

    for (const action of actions) {
      try {
        logger.info(`복구 액션 실행: ${action.description}`, { type: action.type });
        
        const success = await action.handler();
        
        if (success) {
          logger.info('복구 성공', { 
            action: action.description,
            operation: error.context.operation 
          });

          // 성공 로그 기록
          await this.logRecoveryToDatabase(error, action.description, true);
          return true;
        }
      } catch (recoveryError) {
        logger.error('복구 액션 실행 실패', { 
          action: action.description,
          error: recoveryError 
        });
      }
    }

    logger.error('모든 복구 시도 실패', { 
      operation: error.context.operation,
      errorMessage: error.message 
    });

    // 복구 실패 로그 기록
    await this.logRecoveryToDatabase(error, 'all_recovery_actions', false);
    return false;
  }

  /**
   * 에러 키 생성
   */
  private getErrorKey(error: AutomationError): string {
    const component = error.context.component;
    const operation = error.context.operation;

    // 특정 에러 패턴 매칭
    if (error.message.includes('Browser closed') || error.message.includes('Target closed')) {
      return 'playwright:browser_crash';
    }

    if (error.message.includes('network') || error.message.includes('timeout')) {
      return 'playwright:network_error';
    }

    if (error.message.includes('connection') && component === 'supabase') {
      return 'supabase:connection_error';
    }

    if (error.message.includes('timeout')) {
      return 'common:timeout';
    }

    return `${component}:${operation}`;
  }

  /**
   * 기본 복구 액션
   */
  private getDefaultRecoveryActions(): RecoveryAction[] {
    return [
      {
        type: 'retry',
        description: '기본 재시도',
        handler: async () => {
          await this.delay(1000);
          return true;
        }
      }
    ];
  }

  /**
   * 재시도 메커니즘
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    config?: Partial<RetryConfig>
  ): Promise<T> {
    const finalConfig = { ...this.retryConfig, ...config };
    let lastError: Error | null = null;
    let delay = finalConfig.delayMs;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          logger.info(`재시도 ${attempt}/${finalConfig.maxRetries}`, { 
            operation: context.operation,
            delay 
          });
          await this.delay(delay);
        }

        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === finalConfig.maxRetries) {
          // 최종 실패
          logger.error('최대 재시도 횟수 초과', { 
            operation: context.operation,
            attempts: attempt + 1,
            error: lastError.message 
          });
          break;
        }

        // 다음 재시도를 위한 지연 시간 증가
        delay = Math.min(delay * finalConfig.backoffFactor, finalConfig.maxDelayMs);
      }
    }

    // 복구 시도
    if (lastError) {
      const recovered = await this.handleError(lastError, context);
      if (!recovered) {
        throw lastError;
      }

      // 복구 후 한 번 더 시도
      try {
        return await operation();
      } catch (error) {
        throw error;
      }
    }

    throw new Error('예상치 못한 재시도 로직 오류');
  }

  /**
   * 에러 히스토리에 추가
   */
  private addToHistory(error: AutomationError): void {
    this.errorHistory.push(error);
    
    // 히스토리 크기 제한
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }

  /**
   * 데이터베이스에 에러 로그 기록
   */
  private async logErrorToDatabase(error: AutomationError): Promise<void> {
    try {
      const controller = getSupabaseController();
      await controller.logAutomation({
        type: 'error',
        status: 'failure',
        message: `${error.context.operation}: ${error.message}`,
        metadata: {
          component: error.context.component,
          operation: error.context.operation,
          recoverable: error.recoverable,
          errorName: error.name,
          cause: error.cause?.message,
          ...error.context.metadata
        }
      });
    } catch (dbError) {
      logger.error('에러 로그 데이터베이스 기록 실패', { dbError });
    }
  }

  /**
   * 복구 시도 결과 로그 기록
   */
  private async logRecoveryToDatabase(
    originalError: AutomationError, 
    recoveryAction: string, 
    success: boolean
  ): Promise<void> {
    try {
      const controller = getSupabaseController();
      await controller.logAutomation({
        type: 'error',
        status: success ? 'success' : 'failure',
        message: `복구 ${success ? '성공' : '실패'}: ${recoveryAction}`,
        metadata: {
          original_error: originalError.message,
          recovery_action: recoveryAction,
          component: originalError.context.component,
          operation: originalError.context.operation
        }
      });
    } catch (dbError) {
      logger.error('복구 로그 데이터베이스 기록 실패', { dbError });
    }
  }

  /**
   * 에러 패턴 분석
   */
  getErrorAnalysis(days: number = 7): Record<string, any> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const recentErrors = this.errorHistory.filter(
      error => error.context.timestamp >= cutoff
    );

    const analysis = {
      total_errors: recentErrors.length,
      by_component: {} as Record<string, number>,
      by_operation: {} as Record<string, number>,
      recoverable_rate: 0,
      most_common_errors: [] as Array<{ message: string; count: number }>
    };

    // 컴포넌트별 집계
    recentErrors.forEach(error => {
      const component = error.context.component;
      analysis.by_component[component] = (analysis.by_component[component] || 0) + 1;

      const operation = error.context.operation;
      analysis.by_operation[operation] = (analysis.by_operation[operation] || 0) + 1;
    });

    // 복구 가능률 계산
    const recoverableCount = recentErrors.filter(e => e.recoverable).length;
    analysis.recoverable_rate = recentErrors.length > 0 ? 
      (recoverableCount / recentErrors.length) * 100 : 0;

    // 가장 흔한 에러 메시지
    const errorCounts: Record<string, number> = {};
    recentErrors.forEach(error => {
      errorCounts[error.message] = (errorCounts[error.message] || 0) + 1;
    });

    analysis.most_common_errors = Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([message, count]) => ({ message, count }));

    return analysis;
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 커스텀 복구 액션 추가
   */
  addRecoveryAction(errorKey: string, action: RecoveryAction): void {
    const existing = this.recoveryActions.get(errorKey) || [];
    existing.push(action);
    this.recoveryActions.set(errorKey, existing);
  }

  /**
   * 에러 히스토리 조회
   */
  getErrorHistory(limit?: number): AutomationError[] {
    if (limit) {
      return this.errorHistory.slice(-limit);
    }
    return [...this.errorHistory];
  }

  /**
   * 에러 히스토리 초기화
   */
  clearErrorHistory(): void {
    this.errorHistory = [];
  }
}

// 싱글톤 인스턴스
let errorHandler: ErrorHandler | null = null;

/**
 * ErrorHandler 싱글톤 인스턴스 반환
 */
export function getErrorHandler(config?: Partial<RetryConfig>): ErrorHandler {
  if (!errorHandler) {
    errorHandler = new ErrorHandler(config);
  }
  return errorHandler;
}

/**
 * 에러 처리 헬퍼 함수
 */
export async function handleAutomationError(
  error: Error,
  context: Omit<ErrorContext, 'timestamp'>
): Promise<boolean> {
  const handler = getErrorHandler();
  return await handler.handleError(error, {
    ...context,
    timestamp: new Date()
  });
}

/**
 * 재시도 헬퍼 함수
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  context: Omit<ErrorContext, 'timestamp'>,
  config?: Partial<RetryConfig>
): Promise<T> {
  const handler = getErrorHandler();
  return await handler.withRetry(operation, {
    ...context,
    timestamp: new Date()
  }, config);
}