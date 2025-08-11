/**
 * 자동화 작업 스케줄러
 * cron 작업, 주기적 작업, 이벤트 기반 자동화를 관리
 */

import { logger } from '@/lib/logger';
import { getSupabaseController } from '@/lib/mcp/supabase-controller';
import { getContentManager } from './content-manager';
import { getBlogPublisher } from './blog-publisher';
import { getOrchestrator } from '@/lib/mcp/orchestrator';
import { handleAutomationError } from '@/lib/mcp/error-handler';

export interface ScheduledTask {
  id: string;
  name: string;
  description: string;
  schedule: string; // cron 표현식
  handler: string; // 실행할 함수명
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  failureCount: number;
  maxRetries: number;
  timeout: number; // milliseconds
  metadata?: Record<string, any>;
}

export interface TaskExecutionResult {
  taskId: string;
  success: boolean;
  startTime: Date;
  endTime: Date;
  duration: number;
  error?: string;
  output?: any;
}

export interface ScheduleConfig {
  timezone: string;
  maxConcurrentTasks: number;
  defaultTimeout: number;
  defaultMaxRetries: number;
  healthCheckInterval: number;
}

/**
 * 자동화 작업 스케줄러 클래스
 */
export class AutomationScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private runningTasks: Map<string, Promise<TaskExecutionResult>> = new Map();
  private config: ScheduleConfig;
  private isRunning: boolean = false;
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();

  constructor(config?: Partial<ScheduleConfig>) {
    this.config = {
      timezone: 'Asia/Seoul',
      maxConcurrentTasks: 5,
      defaultTimeout: 300000, // 5분
      defaultMaxRetries: 3,
      healthCheckInterval: 60000, // 1분
      ...config
    };

    this.initializeDefaultTasks();
  }

  /**
   * 기본 작업들 초기화
   */
  private initializeDefaultTasks(): void {
    // 1. 예약된 콘텐츠 게시 (매 시간)
    this.addTask({
      id: 'scheduled-content-publish',
      name: '예약된 콘텐츠 게시',
      description: '예약된 블로그 포스트를 자동으로 게시합니다',
      schedule: '0 * * * *', // 매 시간 정각
      handler: 'processScheduledContent',
      enabled: true,
      failureCount: 0,
      maxRetries: this.config.defaultMaxRetries,
      timeout: this.config.defaultTimeout
    });

    // 2. AI 콘텐츠 자동 생성 (매일 오전 9시)
    this.addTask({
      id: 'ai-content-generation',
      name: 'AI 콘텐츠 자동 생성',
      description: '트렌드 기반 AI 콘텐츠를 자동으로 생성합니다',
      schedule: '0 9 * * *', // 매일 오전 9시
      handler: 'generateDailyContent',
      enabled: false, // 기본적으로 비활성화
      failureCount: 0,
      maxRetries: this.config.defaultMaxRetries,
      timeout: 600000, // 10분
      metadata: {
        contentCount: 3,
        strategy: 'daily-trends'
      }
    });

    // 3. 시스템 헬스체크 (매 30분)
    this.addTask({
      id: 'system-health-check',
      name: '시스템 헬스체크',
      description: '전체 시스템의 상태를 점검합니다',
      schedule: '*/30 * * * *', // 매 30분
      handler: 'performHealthCheck',
      enabled: true,
      failureCount: 0,
      maxRetries: 2,
      timeout: 120000, // 2분
    });

    // 4. 데이터베이스 정리 (매일 새벽 2시)
    this.addTask({
      id: 'database-cleanup',
      name: '데이터베이스 정리',
      description: '오래된 로그와 임시 데이터를 정리합니다',
      schedule: '0 2 * * *', // 매일 새벽 2시
      handler: 'cleanupDatabase',
      enabled: true,
      failureCount: 0,
      maxRetries: 1,
      timeout: 300000, // 5분
      metadata: {
        retentionDays: 30
      }
    });

    // 5. 콘텐츠 분석 및 리포트 (매주 월요일 오전 8시)
    this.addTask({
      id: 'weekly-content-report',
      name: '주간 콘텐츠 리포트',
      description: '콘텐츠 성과 분석 및 주간 리포트 생성',
      schedule: '0 8 * * 1', // 매주 월요일 오전 8시
      handler: 'generateWeeklyReport',
      enabled: false,
      failureCount: 0,
      maxRetries: 2,
      timeout: 180000, // 3분
      metadata: {
        reportDays: 7
      }
    });
  }

  /**
   * 스케줄러 시작
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('스케줄러가 이미 실행 중입니다');
      return;
    }

    try {
      logger.info('자동화 스케줄러 시작');

      this.isRunning = true;

      // 모든 활성 작업에 대해 스케줄 설정
      for (const task of this.tasks.values()) {
        if (task.enabled) {
          this.scheduleTask(task);
        }
      }

      // 헬스체크 타이머 시작
      this.startHealthCheckTimer();

      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'health_check',
        status: 'success',
        message: '자동화 스케줄러 시작됨',
        metadata: {
          enabled_tasks: Array.from(this.tasks.values()).filter(t => t.enabled).length,
          total_tasks: this.tasks.size
        }
      });

      logger.info('자동화 스케줄러 시작 완료', {
        totalTasks: this.tasks.size,
        enabledTasks: Array.from(this.tasks.values()).filter(t => t.enabled).length
      });

    } catch (error) {
      logger.error('스케줄러 시작 실패', { error });
      throw error;
    }
  }

  /**
   * 스케줄러 정지
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      logger.warn('스케줄러가 실행 중이 아닙니다');
      return;
    }

    try {
      logger.info('자동화 스케줄러 정지 시작');

      this.isRunning = false;

      // 모든 타이머 정리
      for (const [taskId, intervalId] of this.intervalIds) {
        clearTimeout(intervalId);
        this.intervalIds.delete(taskId);
      }

      // 실행 중인 작업들 완료 대기
      if (this.runningTasks.size > 0) {
        logger.info(`${this.runningTasks.size}개의 실행 중인 작업 완료 대기`);
        await Promise.allSettled(Array.from(this.runningTasks.values()));
      }

      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'health_check',
        status: 'success',
        message: '자동화 스케줄러 정지됨'
      });

      logger.info('자동화 스케줄러 정지 완료');

    } catch (error) {
      logger.error('스케줄러 정지 실패', { error });
    }
  }

  /**
   * 작업 추가
   */
  addTask(task: ScheduledTask): void {
    this.tasks.set(task.id, task);
    
    if (this.isRunning && task.enabled) {
      this.scheduleTask(task);
    }

    logger.info('스케줄 작업 추가됨', { 
      id: task.id, 
      name: task.name, 
      schedule: task.schedule 
    });
  }

  /**
   * 작업 제거
   */
  removeTask(taskId: string): boolean {
    const removed = this.tasks.delete(taskId);
    
    if (this.intervalIds.has(taskId)) {
      clearTimeout(this.intervalIds.get(taskId));
      this.intervalIds.delete(taskId);
    }

    if (removed) {
      logger.info('스케줄 작업 제거됨', { taskId });
    }

    return removed;
  }

  /**
   * 작업 활성화/비활성화
   */
  setTaskEnabled(taskId: string, enabled: boolean): boolean {
    const task = this.tasks.get(taskId);
    if (!task) {
      return false;
    }

    task.enabled = enabled;

    if (this.isRunning) {
      if (enabled) {
        this.scheduleTask(task);
      } else {
        const intervalId = this.intervalIds.get(taskId);
        if (intervalId) {
          clearTimeout(intervalId);
          this.intervalIds.delete(taskId);
        }
      }
    }

    logger.info('스케줄 작업 상태 변경', { taskId, enabled });
    return true;
  }

  /**
   * 개별 작업 스케줄링
   */
  private scheduleTask(task: ScheduledTask): void {
    const nextRunTime = this.calculateNextRun(task.schedule);
    const delay = nextRunTime.getTime() - Date.now();

    if (delay <= 0) {
      // 즉시 실행
      this.executeTask(task);
      // 다음 실행 예약
      this.scheduleTask(task);
      return;
    }

    const timeoutId = setTimeout(() => {
      this.executeTask(task);
      // 다음 실행 예약
      this.scheduleTask(task);
    }, delay);

    this.intervalIds.set(task.id, timeoutId);
    
    // 다음 실행 시간 업데이트
    task.nextRun = nextRunTime;

    logger.debug('작업 스케줄링 완료', { 
      taskId: task.id, 
      nextRun: nextRunTime.toISOString(),
      delay 
    });
  }

  /**
   * cron 표현식에서 다음 실행 시간 계산
   */
  private calculateNextRun(cronExpression: string): Date {
    // 간단한 cron 파서 (실제로는 node-cron 등의 라이브러리 사용 권장)
    const now = new Date();
    const parts = cronExpression.split(' ');
    
    // [분, 시, 일, 월, 요일] 형태
    if (parts.length !== 5) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    const [minute, hour, day, month, dayOfWeek] = parts;
    
    // 다음 실행 시간 계산 (기본적인 구현)
    const next = new Date(now);
    
    // 매 시간 정각 (0 * * * *)
    if (minute === '0' && hour === '*') {
      next.setMinutes(0, 0, 0);
      next.setHours(next.getHours() + 1);
    }
    // 매일 특정 시간 (0 9 * * *)
    else if (minute === '0' && !hour.includes('*')) {
      const targetHour = parseInt(hour);
      next.setHours(targetHour, 0, 0, 0);
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
    }
    // 매 30분 (*/30 * * * *)
    else if (minute.startsWith('*/')) {
      const interval = parseInt(minute.substring(2));
      const currentMinute = now.getMinutes();
      const nextMinute = Math.ceil(currentMinute / interval) * interval;
      
      if (nextMinute >= 60) {
        next.setHours(next.getHours() + 1, 0, 0, 0);
      } else {
        next.setMinutes(nextMinute, 0, 0);
      }
    }
    // 기본값: 1분 후
    else {
      next.setMinutes(next.getMinutes() + 1, 0, 0);
    }

    return next;
  }

  /**
   * 작업 실행
   */
  private async executeTask(task: ScheduledTask): Promise<TaskExecutionResult> {
    const startTime = new Date();
    
    logger.info('스케줄 작업 실행 시작', { 
      taskId: task.id, 
      name: task.name 
    });

    // 동시 실행 제한 체크
    if (this.runningTasks.size >= this.config.maxConcurrentTasks) {
      logger.warn('동시 실행 작업 수 제한으로 작업 지연', { 
        taskId: task.id,
        runningTasks: this.runningTasks.size 
      });
      
      // 잠시 대기 후 재시도
      setTimeout(() => this.executeTask(task), 10000);
      
      return {
        taskId: task.id,
        success: false,
        startTime,
        endTime: new Date(),
        duration: 0,
        error: '동시 실행 제한'
      };
    }

    const executionPromise = this.performTaskExecution(task, startTime);
    this.runningTasks.set(task.id, executionPromise);

    try {
      const result = await executionPromise;
      this.runningTasks.delete(task.id);
      
      // 실행 결과 로깅
      await this.logTaskExecution(result);
      
      // 성공 시 실패 횟수 리셋
      if (result.success) {
        task.failureCount = 0;
      } else {
        task.failureCount++;
      }

      task.lastRun = startTime;
      
      return result;

    } catch (error) {
      this.runningTasks.delete(task.id);
      
      const result: TaskExecutionResult = {
        taskId: task.id,
        success: false,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        error: (error as Error).message
      };

      await this.logTaskExecution(result);
      
      task.failureCount++;
      task.lastRun = startTime;

      return result;
    }
  }

  /**
   * 실제 작업 실행
   */
  private async performTaskExecution(task: ScheduledTask, startTime: Date): Promise<TaskExecutionResult> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Task timeout')), task.timeout);
    });

    try {
      let output: any;
      
      const executionPromise = this.callTaskHandler(task);
      output = await Promise.race([executionPromise, timeoutPromise]);

      return {
        taskId: task.id,
        success: true,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        output
      };

    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        error: (error as Error).message
      };
    }
  }

  /**
   * 작업 핸들러 호출
   */
  private async callTaskHandler(task: ScheduledTask): Promise<any> {
    switch (task.handler) {
      case 'processScheduledContent':
        return await this.processScheduledContent();
        
      case 'generateDailyContent':
        return await this.generateDailyContent(task.metadata);
        
      case 'performHealthCheck':
        return await this.performHealthCheck();
        
      case 'cleanupDatabase':
        return await this.cleanupDatabase(task.metadata);
        
      case 'generateWeeklyReport':
        return await this.generateWeeklyReport(task.metadata);
        
      default:
        throw new Error(`Unknown task handler: ${task.handler}`);
    }
  }

  /**
   * 예약된 콘텐츠 처리 핸들러
   */
  private async processScheduledContent(): Promise<any> {
    const contentManager = getContentManager();
    await contentManager.processScheduledContent();
    return { message: '예약된 콘텐츠 처리 완료' };
  }

  /**
   * 일일 AI 콘텐츠 생성 핸들러
   */
  private async generateDailyContent(metadata?: Record<string, any>): Promise<any> {
    const contentManager = getContentManager();
    
    const result = await contentManager.generateAndManageContent({
      strategy: metadata?.strategy || 'daily-trends',
      count: metadata?.contentCount || 3,
      publishMode: 'draft'
    });

    return {
      message: '일일 AI 콘텐츠 생성 완료',
      generated: result.generated,
      success: result.success
    };
  }

  /**
   * 헬스체크 핸들러
   */
  private async performHealthCheck(): Promise<any> {
    const orchestrator = getOrchestrator();
    const healthResult = await orchestrator.executeHealthCheck();
    
    return {
      message: '시스템 헬스체크 완료',
      overall: healthResult.overall,
      services: healthResult.services
    };
  }

  /**
   * 데이터베이스 정리 핸들러
   */
  private async cleanupDatabase(metadata?: Record<string, any>): Promise<any> {
    const supabaseController = getSupabaseController();
    const retentionDays = metadata?.retentionDays || 30;
    
    await supabaseController.cleanupOldData(retentionDays);
    
    return {
      message: '데이터베이스 정리 완료',
      retention_days: retentionDays
    };
  }

  /**
   * 주간 리포트 생성 핸들러
   */
  private async generateWeeklyReport(metadata?: Record<string, any>): Promise<any> {
    const contentManager = getContentManager();
    const days = metadata?.reportDays || 7;
    
    const analytics = await contentManager.getContentAnalytics(days);
    
    // TODO: 실제 리포트 생성 및 발송 로직 구현
    
    return {
      message: '주간 리포트 생성 완료',
      analytics,
      period_days: days
    };
  }

  /**
   * 작업 실행 결과 로깅
   */
  private async logTaskExecution(result: TaskExecutionResult): Promise<void> {
    try {
      const supabaseController = getSupabaseController();
      
      await supabaseController.logAutomation({
        type: 'health_check',
        status: result.success ? 'success' : 'failure',
        message: `스케줄 작업 ${result.success ? '성공' : '실패'}: ${result.taskId}`,
        metadata: {
          task_id: result.taskId,
          duration: result.duration,
          error: result.error,
          output: result.output
        }
      });

    } catch (error) {
      logger.error('작업 실행 결과 로깅 실패', { error });
    }
  }

  /**
   * 헬스체크 타이머 시작
   */
  private startHealthCheckTimer(): void {
    const checkHealth = async () => {
      try {
        // 실행 중인 작업 수 모니터링
        if (this.runningTasks.size > this.config.maxConcurrentTasks * 0.8) {
          logger.warn('높은 작업 부하 감지됨', { 
            runningTasks: this.runningTasks.size,
            maxConcurrent: this.config.maxConcurrentTasks 
          });
        }

        // 실패한 작업 모니터링
        const failedTasks = Array.from(this.tasks.values())
          .filter(task => task.failureCount >= task.maxRetries);
          
        if (failedTasks.length > 0) {
          logger.error('최대 재시도 횟수를 초과한 작업들', {
            failedTasks: failedTasks.map(t => ({ id: t.id, name: t.name, failureCount: t.failureCount }))
          });
        }

      } catch (error) {
        logger.error('헬스체크 타이머 오류', { error });
      }
    };

    setInterval(checkHealth, this.config.healthCheckInterval);
  }

  /**
   * 작업 상태 조회
   */
  getTaskStatus(): Array<{
    id: string;
    name: string;
    enabled: boolean;
    lastRun?: Date;
    nextRun?: Date;
    failureCount: number;
    isRunning: boolean;
  }> {
    return Array.from(this.tasks.values()).map(task => ({
      id: task.id,
      name: task.name,
      enabled: task.enabled,
      lastRun: task.lastRun,
      nextRun: task.nextRun,
      failureCount: task.failureCount,
      isRunning: this.runningTasks.has(task.id)
    }));
  }

  /**
   * 실행 중인 작업 수 반환
   */
  getRunningTaskCount(): number {
    return this.runningTasks.size;
  }

  /**
   * 스케줄러 실행 상태 반환
   */
  isSchedulerRunning(): boolean {
    return this.isRunning;
  }
}

// 싱글톤 인스턴스
let scheduler: AutomationScheduler | null = null;

/**
 * AutomationScheduler 싱글톤 인스턴스 반환
 */
export function getScheduler(config?: Partial<ScheduleConfig>): AutomationScheduler {
  if (!scheduler) {
    scheduler = new AutomationScheduler(config);
  }
  return scheduler;
}

/**
 * 스케줄러 시작
 */
export async function startScheduler(config?: Partial<ScheduleConfig>): Promise<AutomationScheduler> {
  const schedulerInstance = getScheduler(config);
  
  if (!schedulerInstance.isSchedulerRunning()) {
    await schedulerInstance.start();
  }
  
  return schedulerInstance;
}

/**
 * 스케줄러 정지
 */
export async function stopScheduler(): Promise<void> {
  if (scheduler && scheduler.isSchedulerRunning()) {
    await scheduler.stop();
  }
}