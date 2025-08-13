/**
 * 보안 블로그 자동화 시스템
 * 안전한 관리자 로그인과 블로그 자동 게시를 통합한 시스템
 */

import { logger } from '@/lib/logger';
import { getAdminAuthAutomation, AutoLoginResult } from './admin-auth-automation';
import { getAccessControlManager, getClientIP } from './access-control';
import { getBlogPublisher, BlogPostData, PublishResult } from '@/lib/automation/blog-publisher';
import { getCredentialManager } from './credential-manager';

export interface SecureBlogAutomationOptions {
  sourceIP?: string;
  userAgent?: string;
  validateContent?: boolean;
  captureScreenshot?: boolean;
  notifyOnComplete?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export interface AutomationResult {
  success: boolean;
  loginResult?: AutoLoginResult;
  publishResults?: PublishResult[];
  securityEvents?: string[];
  error?: string;
  performanceMetrics?: {
    totalTime: number;
    loginTime: number;
    publishTime: number;
    validationTime: number;
  };
}

export interface SecurityValidationResult {
  passed: boolean;
  warnings: string[];
  blockers: string[];
}

/**
 * 보안 블로그 자동화 클래스
 */
export class SecureBlogAutomation {
  private isRunning: boolean = false;

  constructor() {}

  /**
   * 안전한 블로그 자동 게시 실행
   */
  async executeSecureBlogPublish(
    posts: BlogPostData[],
    options: SecureBlogAutomationOptions = {}
  ): Promise<AutomationResult> {
    const startTime = Date.now();
    const finalOptions: Required<SecureBlogAutomationOptions> = {
      sourceIP: '127.0.0.1',
      userAgent: 'dduksangLAB-SecureBlogBot/1.0',
      validateContent: true,
      captureScreenshot: false,
      notifyOnComplete: true,
      retryCount: 3,
      retryDelay: 5000,
      ...options,
    };

    // 중복 실행 방지
    if (this.isRunning) {
      return {
        success: false,
        error: '이미 실행 중인 자동화 작업이 있습니다.',
        securityEvents: ['중복 실행 시도 차단'],
      };
    }

    this.isRunning = true;

    try {
      logger.info('보안 블로그 자동화 시작', {
        postsCount: posts.length,
        sourceIP: finalOptions.sourceIP,
      });

      // 1. 보안 검증
      const securityValidation = await this.performSecurityValidation(finalOptions);
      if (!securityValidation.passed) {
        return {
          success: false,
          error: '보안 검증 실패',
          securityEvents: [...securityValidation.warnings, ...securityValidation.blockers],
        };
      }

      // 2. 관리자 자동 로그인
      logger.info('관리자 자동 로그인 시도');
      const loginStartTime = Date.now();

      const adminAuth = getAdminAuthAutomation();
      const loginResult = await adminAuth.performSecureAutoLogin(finalOptions.sourceIP, {
        userAgent: finalOptions.userAgent,
        captureScreenshot: finalOptions.captureScreenshot,
        maxRetries: finalOptions.retryCount,
        retryDelay: finalOptions.retryDelay,
      });

      const loginTime = Date.now() - loginStartTime;

      if (!loginResult.success) {
        await this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          sourceIP: finalOptions.sourceIP,
          description: `자동 로그인 실패: ${loginResult.error}`,
          metadata: { automation: true },
        });

        return {
          success: false,
          loginResult,
          error: `로그인 실패: ${loginResult.error}`,
          securityEvents: loginResult.securityWarnings || [],
        };
      }

      logger.info('관리자 로그인 성공', { sessionId: loginResult.sessionId });

      // 3. 콘텐츠 게시
      logger.info('블로그 포스트 게시 시작');
      const publishStartTime = Date.now();

      const blogPublisher = getBlogPublisher();
      const credentialManager = getCredentialManager();
      const credentials = await credentialManager.getAdminCredentials();

      const publishResults = await blogPublisher.publishBatch(
        posts,
        {
          loginCredentials: {
            email: credentials.email,
            password: credentials.password,
          },
          validateContent: finalOptions.validateContent,
          notifyOnComplete: finalOptions.notifyOnComplete,
          captureScreenshot: finalOptions.captureScreenshot,
        },
        {
          delayBetweenPosts: 3000,
          continueOnError: true,
          maxConcurrent: 1,
        }
      );

      const publishTime = Date.now() - publishStartTime;

      // 4. 결과 분석 및 보안 이벤트 기록
      const successfulPosts = publishResults.filter(r => r.success);
      const failedPosts = publishResults.filter(r => !r.success);

      await this.logSecurityEvent({
        type: 'login_success',
        severity: 'low',
        sourceIP: finalOptions.sourceIP,
        description: `자동 블로그 게시 완료: 성공 ${successfulPosts.length}개, 실패 ${failedPosts.length}개`,
        metadata: {
          automation: true,
          total_posts: posts.length,
          successful_posts: successfulPosts.length,
          failed_posts: failedPosts.length,
          session_id: loginResult.sessionId,
        },
      });

      const totalTime = Date.now() - startTime;

      logger.info('보안 블로그 자동화 완료', {
        totalPosts: posts.length,
        successfulPosts: successfulPosts.length,
        failedPosts: failedPosts.length,
        totalTime,
        sessionId: loginResult.sessionId,
      });

      return {
        success: true,
        loginResult,
        publishResults,
        securityEvents: securityValidation.warnings,
        performanceMetrics: {
          totalTime,
          loginTime,
          publishTime,
          validationTime: 0,
        },
      };
    } catch (error) {
      logger.error('보안 블로그 자동화 오류', { error });

      await this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        sourceIP: finalOptions.sourceIP,
        description: `자동화 시스템 오류: ${(error as Error).message}`,
        metadata: {
          automation: true,
          error_type: (error as Error).constructor.name,
        },
      });

      return {
        success: false,
        error: (error as Error).message,
        securityEvents: ['시스템 오류 발생'],
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * 단일 포스트 안전 게시
   */
  async publishSinglePostSecurely(
    post: BlogPostData,
    options: SecureBlogAutomationOptions = {}
  ): Promise<AutomationResult> {
    return await this.executeSecureBlogPublish([post], options);
  }

  /**
   * 예약된 포스트 자동 실행 (Cron Job용)
   */
  async executeScheduledPosts(): Promise<AutomationResult> {
    try {
      logger.info('예약된 포스트 자동 실행 시작');

      const blogPublisher = getBlogPublisher();
      await blogPublisher.executeScheduledPosts();

      await this.logSecurityEvent({
        type: 'login_success',
        severity: 'low',
        sourceIP: '127.0.0.1',
        description: '예약된 포스트 자동 실행 완료',
        metadata: {
          automation: true,
          scheduled_execution: true,
        },
      });

      return {
        success: true,
        securityEvents: ['예약된 포스트 실행 완료'],
      };
    } catch (error) {
      logger.error('예약된 포스트 실행 오류', { error });

      await this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        sourceIP: '127.0.0.1',
        description: `예약된 포스트 실행 오류: ${(error as Error).message}`,
        metadata: {
          automation: true,
          scheduled_execution: true,
        },
      });

      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * 보안 검증 수행
   */
  private async performSecurityValidation(
    options: Required<SecureBlogAutomationOptions>
  ): Promise<SecurityValidationResult> {
    const warnings: string[] = [];
    const blockers: string[] = [];

    try {
      const accessControlManager = getAccessControlManager();

      // IP 허용 여부 확인
      const isIPAllowed = await accessControlManager.isIPAllowed(options.sourceIP);
      if (!isIPAllowed) {
        blockers.push('차단된 IP에서의 자동화 시도');
      }

      // 보안 통계 확인
      const securityStats = accessControlManager.getSecurityStats();

      if (securityStats.recentFailures.length > 20) {
        warnings.push('최근 로그인 실패 시도가 매우 많음');
      }

      if (securityStats.blockedIPsCount > 0) {
        warnings.push(`현재 ${securityStats.blockedIPsCount}개의 IP가 차단됨`);
      }

      // 자격증명 검증
      const credentialManager = getCredentialManager();
      const credentials = await credentialManager.getAdminCredentials();

      if (credentialManager.needsCredentialRotation(credentials)) {
        warnings.push('관리자 자격증명 회전 필요');
      }

      // 시스템 리소스 확인 (예: 메모리, CPU 등)
      const memoryUsage = process.memoryUsage();
      if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9) {
        warnings.push('시스템 메모리 사용량이 높음');
      }

      return {
        passed: blockers.length === 0,
        warnings,
        blockers,
      };
    } catch (error) {
      logger.error('보안 검증 오류', { error });
      return {
        passed: false,
        warnings: ['보안 검증 중 오류 발생'],
        blockers: ['보안 검증 실패'],
      };
    }
  }

  /**
   * 보안 이벤트 로깅
   */
  private async logSecurityEvent(event: {
    type: string;
    severity: string;
    sourceIP: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      const accessControlManager = getAccessControlManager();

      await accessControlManager.logSecurityEvent({
        type: event.type as any,
        severity: event.severity as any,
        source_ip: event.sourceIP,
        description: event.description,
        timestamp: new Date(),
        metadata: event.metadata,
      });
    } catch (error) {
      logger.error('보안 이벤트 로깅 실패', { error });
    }
  }

  /**
   * 자동화 상태 확인
   */
  getAutomationStatus(): {
    isRunning: boolean;
    lastExecutionTime?: Date;
    systemHealth: string;
  } {
    return {
      isRunning: this.isRunning,
      systemHealth: 'healthy', // TODO: 실제 시스템 헬스 체크 구현
    };
  }

  /**
   * 긴급 중지
   */
  async emergencyStop(reason: string): Promise<void> {
    try {
      logger.warn('자동화 시스템 긴급 중지', { reason });

      this.isRunning = false;

      await this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        sourceIP: '127.0.0.1',
        description: `자동화 시스템 긴급 중지: ${reason}`,
        metadata: {
          emergency_stop: true,
          reason,
        },
      });

      // 활성 세션 종료
      const adminAuth = getAdminAuthAutomation();
      await adminAuth.logout();
    } catch (error) {
      logger.error('긴급 중지 처리 오류', { error });
    }
  }
}

// 싱글톤 인스턴스
let secureBlogAutomation: SecureBlogAutomation | null = null;

/**
 * SecureBlogAutomation 싱글톤 인스턴스 반환
 */
export function getSecureBlogAutomation(): SecureBlogAutomation {
  if (!secureBlogAutomation) {
    secureBlogAutomation = new SecureBlogAutomation();
  }
  return secureBlogAutomation;
}

/**
 * API 라우트용 헬퍼 함수
 */
export async function executeSecureBlogAutomation(
  posts: BlogPostData[],
  req?: any
): Promise<AutomationResult> {
  const sourceIP = req ? getClientIP(req) : '127.0.0.1';
  const userAgent = req?.headers['user-agent'] || 'dduksangLAB-API/1.0';

  const automation = getSecureBlogAutomation();

  return await automation.executeSecureBlogPublish(posts, {
    sourceIP,
    userAgent,
    validateContent: true,
    notifyOnComplete: true,
    captureScreenshot: false,
  });
}
