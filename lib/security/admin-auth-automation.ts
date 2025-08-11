/**
 * 관리자 인증 자동화 시스템
 * 안전한 자동 로그인 및 세션 관리
 */

import { logger } from '@/lib/logger';
import { getCredentialManager } from './credential-manager';
import { getAccessControlManager, getClientIP } from './access-control';
import { getOrchestrator } from '@/lib/mcp/orchestrator';
import { getPlaywrightController } from '@/lib/mcp/playwright-controller';

export interface AutoLoginOptions {
  maxRetries?: number;
  retryDelay?: number;
  captureScreenshot?: boolean;
  validateSession?: boolean;
  ipWhitelist?: string[];
  userAgent?: string;
}

export interface AutoLoginResult {
  success: boolean;
  sessionId?: string;
  sessionExpiry?: Date;
  error?: string;
  securityWarnings?: string[];
  performanceMetrics?: {
    loginTime: number;
    validationTime: number;
    totalTime: number;
  };
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  email: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  sourceIP: string;
  userAgent?: string;
  isActive: boolean;
}

/**
 * 관리자 인증 자동화 클래스
 */
export class AdminAuthAutomation {
  private activeSession: SessionInfo | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {}

  /**
   * 안전한 자동 로그인 실행
   */
  async performSecureAutoLogin(
    sourceIP: string,
    options: AutoLoginOptions = {}
  ): Promise<AutoLoginResult> {
    const startTime = Date.now();
    const finalOptions: Required<AutoLoginOptions> = {
      maxRetries: 3,
      retryDelay: 5000,
      captureScreenshot: false,
      validateSession: true,
      ipWhitelist: [],
      userAgent: 'dduksangLAB-AutoBot/1.0',
      ...options
    };

    try {
      logger.info('관리자 자동 로그인 시작', { sourceIP });

      // 1. 보안 검증
      const securityCheck = await this.performSecurityValidation(sourceIP, finalOptions);
      if (!securityCheck.passed) {
        return {
          success: false,
          error: '보안 검증 실패',
          securityWarnings: securityCheck.warnings
        };
      }

      // 2. 기존 세션 확인
      if (this.activeSession && await this.validateExistingSession()) {
        logger.info('기존 세션 재사용', { sessionId: this.activeSession.sessionId });
        return {
          success: true,
          sessionId: this.activeSession.sessionId,
          sessionExpiry: this.activeSession.expiresAt
        };
      }

      // 3. 자격증명 로드
      const credentialManager = getCredentialManager();
      const credentials = await credentialManager.getAdminCredentials();

      // 4. 자동 로그인 실행 (재시도 로직 포함)
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= finalOptions.maxRetries; attempt++) {
        try {
          logger.info(`로그인 시도 ${attempt}/${finalOptions.maxRetries}`);

          const loginResult = await this.executeLogin(credentials, sourceIP, finalOptions);
          
          if (loginResult.success) {
            // 5. 세션 정보 저장
            this.activeSession = {
              sessionId: loginResult.sessionId!,
              userId: 'admin',
              email: credentials.email,
              createdAt: new Date(),
              lastActivity: new Date(),
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24시간
              sourceIP: sourceIP,
              userAgent: finalOptions.userAgent,
              isActive: true
            };

            // 6. 세션 모니터링 시작
            this.startSessionMonitoring();

            // 7. 성공 로깅
            const accessControlManager = getAccessControlManager();
            await accessControlManager.recordLoginAttempt({
              ip: sourceIP,
              timestamp: new Date(),
              success: true,
              user_agent: finalOptions.userAgent,
              user_email: credentials.email
            });

            const totalTime = Date.now() - startTime;
            logger.info('관리자 자동 로그인 성공', {
              sessionId: this.activeSession.sessionId,
              totalTime,
              attempt
            });

            return {
              success: true,
              sessionId: this.activeSession.sessionId,
              sessionExpiry: this.activeSession.expiresAt,
              performanceMetrics: {
                loginTime: loginResult.performanceMetrics?.loginTime || 0,
                validationTime: 0,
                totalTime
              }
            };
          }

          lastError = new Error(loginResult.error || '로그인 실패');

        } catch (error) {
          lastError = error as Error;
          logger.warn(`로그인 시도 ${attempt} 실패`, { error: lastError.message });

          if (attempt < finalOptions.maxRetries) {
            await this.delay(finalOptions.retryDelay);
          }
        }
      }

      // 모든 시도 실패
      const accessControlManager = getAccessControlManager();
      await accessControlManager.recordLoginAttempt({
        ip: sourceIP,
        timestamp: new Date(),
        success: false,
        user_agent: finalOptions.userAgent,
        user_email: credentials.email,
        failure_reason: lastError?.message || '알 수 없는 오류'
      });

      return {
        success: false,
        error: `모든 로그인 시도 실패: ${lastError?.message}`
      };

    } catch (error) {
      logger.error('관리자 자동 로그인 오류', { error });
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 보안 검증 수행
   */
  private async performSecurityValidation(
    sourceIP: string,
    options: Required<AutoLoginOptions>
  ): Promise<{ passed: boolean; warnings: string[] }> {
    const warnings: string[] = [];

    try {
      const accessControlManager = getAccessControlManager();

      // IP 허용 여부 확인
      const isIPAllowed = await accessControlManager.isIPAllowed(sourceIP);
      if (!isIPAllowed) {
        return {
          passed: false,
          warnings: ['차단된 IP에서의 접근 시도']
        };
      }

      // IP 화이트리스트 확인 (설정된 경우)
      if (options.ipWhitelist.length > 0 && !options.ipWhitelist.includes(sourceIP)) {
        warnings.push('허용되지 않은 IP에서의 접근');
      }

      // 보안 통계 확인
      const securityStats = accessControlManager.getSecurityStats();
      if (securityStats.recentFailures.length > 10) {
        warnings.push('최근 로그인 실패 시도가 많음');
      }

      return {
        passed: true,
        warnings
      };

    } catch (error) {
      logger.error('보안 검증 오류', { error });
      return {
        passed: false,
        warnings: ['보안 검증 중 오류 발생']
      };
    }
  }

  /**
   * 실제 로그인 실행
   */
  private async executeLogin(
    credentials: { email: string; password: string },
    sourceIP: string,
    options: Required<AutoLoginOptions>
  ): Promise<AutoLoginResult> {
    const loginStartTime = Date.now();

    try {
      // PlaywrightMCP를 통한 로그인
      const orchestrator = getOrchestrator({
        captureScreenshots: options.captureScreenshot,
        performanceMonitoring: true
      });

      if (!orchestrator.isReady()) {
        await orchestrator.initialize();
      }

      const loginResult = await orchestrator.executeLoginWorkflow({
        email: credentials.email,
        password: credentials.password
      });

      const loginTime = Date.now() - loginStartTime;

      if (loginResult.success) {
        return {
          success: true,
          sessionId: loginResult.sessionId,
          performanceMetrics: {
            loginTime,
            validationTime: 0,
            totalTime: loginTime
          }
        };
      }

      return {
        success: false,
        error: loginResult.error || '로그인 실패'
      };

    } catch (error) {
      logger.error('로그인 실행 오류', { error });
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * 기존 세션 유효성 검증
   */
  private async validateExistingSession(): Promise<boolean> {
    if (!this.activeSession) {return false;}

    try {
      const accessControlManager = getAccessControlManager();
      
      const isValid = await accessControlManager.validateSession({
        sessionId: this.activeSession.sessionId,
        userId: this.activeSession.userId,
        createdAt: this.activeSession.createdAt,
        lastActivity: this.activeSession.lastActivity,
        ip: this.activeSession.sourceIP
      });

      if (!isValid) {
        this.activeSession = null;
        this.stopSessionMonitoring();
        return false;
      }

      // 마지막 활동 시간 업데이트
      this.activeSession.lastActivity = new Date();
      return true;

    } catch (error) {
      logger.error('세션 검증 오류', { error });
      return false;
    }
  }

  /**
   * 세션 모니터링 시작
   */
  private startSessionMonitoring(): void {
    if (this.sessionCheckInterval) {return;}

    this.sessionCheckInterval = setInterval(async () => {
      try {
        const isValid = await this.validateExistingSession();
        if (!isValid) {
          logger.warn('세션이 만료되어 모니터링을 중지합니다');
          this.stopSessionMonitoring();
        }
      } catch (error) {
        logger.error('세션 모니터링 오류', { error });
      }
    }, 5 * 60 * 1000); // 5분마다 체크

    logger.info('세션 모니터링 시작');
  }

  /**
   * 세션 모니터링 중지
   */
  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
      logger.info('세션 모니터링 중지');
    }
  }

  /**
   * 현재 세션 정보 반환
   */
  getCurrentSession(): SessionInfo | null {
    return this.activeSession;
  }

  /**
   * 수동 로그아웃
   */
  async logout(): Promise<void> {
    try {
      if (this.activeSession) {
        logger.info('관리자 세션 로그아웃', { sessionId: this.activeSession.sessionId });
        
        const accessControlManager = getAccessControlManager();
        await accessControlManager.logSecurityEvent({
          type: 'login_success', // 정상적인 로그아웃
          severity: 'low',
          source_ip: this.activeSession.sourceIP,
          user_email: this.activeSession.email,
          description: '관리자 세션 로그아웃',
          timestamp: new Date(),
          metadata: {
            session_duration: Date.now() - this.activeSession.createdAt.getTime()
          }
        });

        this.activeSession = null;
      }

      this.stopSessionMonitoring();

    } catch (error) {
      logger.error('로그아웃 오류', { error });
    }
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 소멸자
   */
  destroy(): void {
    this.stopSessionMonitoring();
    this.activeSession = null;
  }
}

// 싱글톤 인스턴스
let adminAuthAutomation: AdminAuthAutomation | null = null;

/**
 * AdminAuthAutomation 싱글톤 인스턴스 반환
 */
export function getAdminAuthAutomation(): AdminAuthAutomation {
  if (!adminAuthAutomation) {
    adminAuthAutomation = new AdminAuthAutomation();
  }
  return adminAuthAutomation;
}

/**
 * 자동 로그인 헬퍼 함수 (Express/Next.js 호환)
 */
export async function performAutoLogin(req: any): Promise<AutoLoginResult> {
  const sourceIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'dduksangLAB-AutoBot/1.0';
  
  const automation = getAdminAuthAutomation();
  
  return await automation.performSecureAutoLogin(sourceIP, {
    userAgent,
    captureScreenshot: false,
    validateSession: true
  });
}