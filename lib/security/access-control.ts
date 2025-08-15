/**
 * 접근 제어 및 보안 모니터링 시스템
 * IP 화이트리스트, 접근 로그, 보안 이벤트 모니터링
 */

import { logger } from '@/lib/logger';
import { serverEnv } from '@/lib/env';
import { getSupabaseController } from '@/lib/mcp/supabase-controller';

export interface SecurityEvent {
  id?: string;
  type:
    | 'login_attempt'
    | 'login_success'
    | 'login_failure'
    | 'access_denied'
    | 'suspicious_activity'
    | 'credential_rotation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source_ip: string;
  user_agent?: string;
  user_id?: string;
  user_email?: string;
  description: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  resolved?: boolean;
  resolution_notes?: string;
}

export interface AccessAttempt {
  ip: string;
  timestamp: Date;
  success: boolean;
  user_agent?: string;
  user_email?: string;
  failure_reason?: string;
}

export interface SecurityConfig {
  maxFailedAttempts: number;
  lockoutDuration: number;
  trustedIPs: string[];
  allowedCountries?: string[];
  requireMFA?: boolean;
  sessionTimeout: number;
}

/**
 * 접근 제어 및 보안 모니터링 클래스
 */
export class AccessControlManager {
  private config: SecurityConfig;
  private failedAttempts: Map<string, AccessAttempt[]> = new Map();
  private blockedIPs: Map<string, Date> = new Map();

  constructor(config?: Partial<SecurityConfig>) {
    this.config = {
      maxFailedAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15분
      trustedIPs: ['127.0.0.1', '::1'],
      sessionTimeout: 24 * 60 * 60 * 1000, // 24시간
      ...config,
    };
  }

  /**
   * IP 주소가 허용된 범위인지 확인
   */
  async isIPAllowed(ip: string): Promise<boolean> {
    try {
      // localhost 및 신뢰할 수 있는 IP는 항상 허용
      if (this.config.trustedIPs.includes(ip)) {
        return true;
      }

      // 차단된 IP 확인
      if (this.isIPBlocked(ip)) {
        await this.logSecurityEvent({
          type: 'access_denied',
          severity: 'medium',
          source_ip: ip,
          description: `차단된 IP에서 접근 시도: ${ip}`,
          timestamp: new Date(),
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('IP 허용 여부 확인 실패', { error, ip });
      return false;
    }
  }

  /**
   * IP 차단 여부 확인
   */
  private isIPBlocked(ip: string): boolean {
    const blockTime = this.blockedIPs.get(ip);
    if (!blockTime) {
      return false;
    }

    // 차단 시간이 지났으면 해제
    if (Date.now() - blockTime.getTime() > this.config.lockoutDuration) {
      this.blockedIPs.delete(ip);
      return false;
    }

    return true;
  }

  /**
   * 로그인 시도 기록 및 검증
   */
  async recordLoginAttempt(attempt: AccessAttempt): Promise<boolean> {
    try {
      const { ip, success, user_email, failure_reason } = attempt;

      // 성공한 로그인인 경우
      if (success) {
        // 실패 기록 초기화
        this.failedAttempts.delete(ip);

        await this.logSecurityEvent({
          type: 'login_success',
          severity: 'low',
          source_ip: ip,
          user_agent: attempt.user_agent,
          user_email: user_email,
          description: `관리자 로그인 성공: ${user_email}`,
          timestamp: new Date(),
          metadata: {
            user_agent: attempt.user_agent,
          },
        });

        return true;
      }

      // 실패한 로그인인 경우
      const attempts = this.failedAttempts.get(ip) || [];
      attempts.push(attempt);
      this.failedAttempts.set(ip, attempts);

      // 최대 시도 횟수 초과 확인
      if (attempts.length >= this.config.maxFailedAttempts) {
        this.blockedIPs.set(ip, new Date());

        await this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          source_ip: ip,
          user_agent: attempt.user_agent,
          description: `반복된 로그인 실패로 IP 차단: ${ip} (시도 횟수: ${attempts.length})`,
          timestamp: new Date(),
          metadata: {
            failed_attempts: attempts.length,
            failure_reason: failure_reason,
            user_agent: attempt.user_agent,
          },
        });

        return false;
      }

      await this.logSecurityEvent({
        type: 'login_failure',
        severity: 'medium',
        source_ip: ip,
        user_agent: attempt.user_agent,
        user_email: user_email,
        description: `로그인 실패 (${attempts.length}/${this.config.maxFailedAttempts}): ${failure_reason}`,
        timestamp: new Date(),
        metadata: {
          failure_reason: failure_reason,
          attempt_count: attempts.length,
          user_agent: attempt.user_agent,
        },
      });

      return false;
    } catch (error) {
      logger.error('로그인 시도 기록 실패', { error });
      return false;
    }
  }

  /**
   * 보안 이벤트 로깅
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // 로거에 기록
      const logLevel =
        event.severity === 'critical' || event.severity === 'high' ? 'error' : 'info';
      logger[logLevel](`[SECURITY] ${event.description}`, {
        type: event.type,
        severity: event.severity,
        source_ip: event.source_ip,
        user_email: event.user_email,
        metadata: event.metadata,
      });

      // Supabase에 보안 이벤트 저장
      const supabaseController = getSupabaseController();

      await supabaseController.logAutomation({
        type: 'error',
        status: event.severity === 'critical' || event.severity === 'high' ? 'failure' : 'info',
        message: event.description,
        metadata: {
          security_event_type: event.type,
          severity: event.severity,
          source_ip: event.source_ip,
          user_agent: event.user_agent,
          user_email: event.user_email,
          ...event.metadata,
        },
      });

      // 심각한 보안 이벤트인 경우 알림 발송
      if (event.severity === 'critical' || event.severity === 'high') {
        await this.sendSecurityAlert(event);
      }
    } catch (error) {
      logger.error('보안 이벤트 로깅 실패', { error });
    }
  }

  /**
   * 보안 알림 발송
   */
  private async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    try {
      // TODO: 보안 알림 시스템 통합
      // 추천: 이메일(Nodemailer), 슬랙 웹훅, 텔레그램 봇 API
      logger.warn('보안 알림 발송', {
        type: event.type,
        severity: event.severity,
        description: event.description,
        source_ip: event.source_ip,
      });

      // 심각한 경우 텔레그램 알림 (환경변수가 있는 경우)
      if (serverEnv.telegramBotToken() && serverEnv.telegramChatId() && event.severity === 'critical') {
        // TODO: 텔레그램 보안 알림 발송 구현
        // fetch()로 telegram bot API 호출
      }
    } catch (error) {
      logger.error('보안 알림 발송 실패', { error });
    }
  }

  /**
   * 사용자 세션 검증
   */
  async validateSession(sessionData: {
    sessionId: string;
    userId: string;
    createdAt: Date;
    lastActivity: Date;
    ip: string;
  }): Promise<boolean> {
    try {
      const now = new Date();

      // 세션 만료 확인
      const sessionAge = now.getTime() - sessionData.createdAt.getTime();
      if (sessionAge > this.config.sessionTimeout) {
        await this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          source_ip: sessionData.ip,
          user_id: sessionData.userId,
          description: `만료된 세션 사용 시도: ${sessionData.sessionId}`,
          timestamp: now,
        });
        return false;
      }

      // 비활성 시간 확인 (1시간)
      const inactiveTime = now.getTime() - sessionData.lastActivity.getTime();
      if (inactiveTime > 60 * 60 * 1000) {
        await this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          source_ip: sessionData.ip,
          user_id: sessionData.userId,
          description: `비활성 세션 사용 시도: ${sessionData.sessionId}`,
          timestamp: now,
        });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('세션 검증 실패', { error });
      return false;
    }
  }

  /**
   * IP 수동 차단
   */
  async blockIP(ip: string, reason: string, duration?: number): Promise<void> {
    try {
      const blockDuration = duration || this.config.lockoutDuration;
      const unblockTime = new Date(Date.now() + blockDuration);

      this.blockedIPs.set(ip, unblockTime);

      await this.logSecurityEvent({
        type: 'access_denied',
        severity: 'high',
        source_ip: ip,
        description: `IP 수동 차단: ${ip} (사유: ${reason})`,
        timestamp: new Date(),
        metadata: {
          block_reason: reason,
          block_duration: blockDuration,
          unblock_time: unblockTime.toISOString(),
        },
      });

      logger.warn('IP 수동 차단', { ip, reason, unblockTime });
    } catch (error) {
      logger.error('IP 차단 실패', { error, ip });
    }
  }

  /**
   * IP 차단 해제
   */
  async unblockIP(ip: string, reason: string): Promise<void> {
    try {
      this.blockedIPs.delete(ip);
      this.failedAttempts.delete(ip);

      await this.logSecurityEvent({
        type: 'access_denied',
        severity: 'low',
        source_ip: ip,
        description: `IP 차단 해제: ${ip} (사유: ${reason})`,
        timestamp: new Date(),
        metadata: {
          unblock_reason: reason,
        },
      });

      logger.info('IP 차단 해제', { ip, reason });
    } catch (error) {
      logger.error('IP 차단 해제 실패', { error, ip });
    }
  }

  /**
   * 보안 통계 조회
   */
  getSecurityStats(): {
    failedAttemptsCount: number;
    blockedIPsCount: number;
    activeBlocks: string[];
    recentFailures: AccessAttempt[];
  } {
    const recentFailures: AccessAttempt[] = [];

    // 최근 1시간 내 실패한 시도들
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    for (const [_ip, attempts] of this.failedAttempts.entries()) { // 언더스코어 추가로 미사용 변수 표시
      const recentAttempts = attempts.filter(attempt => attempt.timestamp > oneHourAgo);
      recentFailures.push(...recentAttempts);
    }

    return {
      failedAttemptsCount: Array.from(this.failedAttempts.values()).flat().length,
      blockedIPsCount: this.blockedIPs.size,
      activeBlocks: Array.from(this.blockedIPs.keys()),
      recentFailures: recentFailures.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    };
  }
}

// 싱글톤 인스턴스
let accessControlManager: AccessControlManager | null = null;

/**
 * AccessControlManager 싱글톤 인스턴스 반환
 */
export function getAccessControlManager(): AccessControlManager {
  if (!accessControlManager) {
    accessControlManager = new AccessControlManager();
  }
  return accessControlManager;
}

/**
 * 요청 IP 주소 추출 헬퍼 함수 (Next.js용)
 */
export function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const clientIP = req.connection?.remoteAddress || req.socket?.remoteAddress;

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return clientIP || 'unknown';
}
