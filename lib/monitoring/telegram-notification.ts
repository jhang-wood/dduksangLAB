/**
 * Telegram Bot 알림 시스템
 */

import { 
  NotificationMessage, 
  ErrorSeverity, 
  ServiceType, 
  NotificationChannel,
  SystemError,
  HealthCheck,
  SystemStatus
} from '../../types/monitoring';

export class TelegramNotificationService {
  private botToken: string;
  private chatId: string;
  private rateLimiter: Map<string, number[]> = new Map();
  private templates: Map<string, string> = new Map();
  private messageQueue: NotificationMessage[] = [];
  private isProcessing = false;

  constructor(botToken?: string, chatId?: string) {
    this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = chatId || process.env.TELEGRAM_CHAT_ID || '';
    
    if (!this.botToken || !this.chatId) {
      console.warn('Telegram Bot 토큰 또는 채팅 ID가 설정되지 않았습니다.');
    }
    
    this.initializeTemplates();
    this.startMessageProcessor();
  }

  /**
   * 알림 메시지 전송
   */
  async sendNotification(
    severity: ErrorSeverity,
    service: ServiceType,
    title: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Telegram Bot이 설정되지 않아 알림을 전송할 수 없습니다.');
      return false;
    }

    // 레이트 리미팅 체크
    if (!this.checkRateLimit(service, severity)) {
      console.warn();
      return false;
    }

    const notification: NotificationMessage = {
      id: this.generateNotificationId(),
      timestamp: new Date(),
      severity,
      title,
      message,
      service,
      metadata,
      channels: [NotificationChannel.TELEGRAM],
      sent: false,
      acknowledged: false
    };

    // 즉시 전송 또는 큐에 추가
    if (severity === ErrorSeverity.CRITICAL) {
      return await this.sendImmediately(notification);
    } else {
      this.messageQueue.push(notification);
      return true;
    }
  }

  /**
   * 시스템 에러 알림 전송
   */
  async sendErrorNotification(error: SystemError): Promise<boolean> {
    const emoji = this.getEmojiForSeverity(error.severity);
    const title = ;
    
    let message = ;
    message += ;
    message += ;
    
    if (error.context?.userId) {
      message += ;
    }
    
    if (error.details) {
      message += ;
      Object.entries(error.details).forEach(([key, value]) => {
        message += ;
      });
    }

    return await this.sendNotification(
      error.severity,
      error.service,
      title,
      message,
      { errorId: error.id }
    );
  }

  /**
   * 건강상태 변화 알림 전송
   */
  async sendHealthChangeNotification(
    service: ServiceType,
    previousStatus: SystemStatus,
    currentStatus: SystemStatus,
    healthCheck: HealthCheck
  ): Promise<boolean> {
    const emoji = this.getEmojiForStatus(currentStatus);
    const title = ;
    
    let message = ;
    message += ;
    message += ;
    
    if (healthCheck.message) {
      message += ;
    }
    
    if (healthCheck.metrics) {
      message += ;
      Object.entries(healthCheck.metrics).forEach(([key, value]) => {
        message += ;
      });
    }

    const severity = this.getSeverityForStatusChange(previousStatus, currentStatus);
    
    return await this.sendNotification(
      severity,
      service,
      title,
      message,
      { 
        previousStatus, 
        currentStatus,
        responseTime: healthCheck.responseTime 
      }
    );
  }

  /**
   * 복구 성공 알림 전송
   */
  async sendRecoveryNotification(
    service: ServiceType,
    recoveryAction: string,
    duration: number
  ): Promise<boolean> {
    const title = ;
    
    let message = ;
    message += ;
    message += ;
    message += ;

    return await this.sendNotification(
      ErrorSeverity.INFO,
      service,
      title,
      message,
      { recoveryAction, duration }
    );
  }

  /**
   * 성능 임계값 초과 알림
   */
  async sendPerformanceAlert(
    service: ServiceType,
    metric: string,
    currentValue: number,
    threshold: number,
    unit: string
  ): Promise<boolean> {
    const title = ;
    
    let message = ;
    message += ;
    message += ;
    message += ;
    message += ;

    const severity = currentValue > threshold * 1.5 ? 
                    ErrorSeverity.ERROR : ErrorSeverity.WARN;

    return await this.sendNotification(
      severity,
      service,
      title,
      message,
      { metric, currentValue, threshold, unit }
    );
  }

  /**
   * 일별/주별 요약 보고서 전송
   */
  async sendSummaryReport(
    period: 'daily' | 'weekly',
    data: {
      totalErrors: number;
      resolvedErrors: number;
      avgResponseTime: number;
      uptime: number;
      topIssues: string[];
    }
  ): Promise<boolean> {
    const title = ;
    
    let message = ;
    message += ;
    message += ;
    message += ;
    message += ;
    message += ;
    message += ;
    
    if (data.topIssues.length > 0) {
      message += ;
      data.topIssues.forEach((issue, index) => {
        message += ;
      });
    }

    return await this.sendNotification(
      ErrorSeverity.INFO,
      ServiceType.SYSTEM,
      title,
      message,
      { period, ...data }
    );
  }

  /**
   * 즉시 메시지 전송
   */
  private async sendImmediately(notification: NotificationMessage): Promise<boolean> {
    try {
      const telegramMessage = this.formatTelegramMessage(notification);
      const success = await this.sendToTelegram(telegramMessage);
      
      notification.sent = success;
      notification.sentAt = success ? new Date() : undefined;
      
      // 레이트 리미터 업데이트
      this.updateRateLimit(notification.service, notification.severity);
      
      return success;
    } catch (error) {
      console.error('Telegram 알림 전송 실패:', error);
      return false;
    }
  }

  /**
   * Telegram API 메시지 전송
   */
  private async sendToTelegram(message: string): Promise<boolean> {
    try {
      const response = await fetch(, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Telegram API 오류:', result);
        return false;
      }

      return result.ok;
    } catch (error) {
      console.error('Telegram 전송 중 네트워크 오류:', error);
      return false;
    }
  }

  /**
   * 메시지 큐 처리기
   */
  private startMessageProcessor(): void {
    setInterval(async () => {
      if (this.isProcessing || this.messageQueue.length === 0) {
        return;
      }

      this.isProcessing = true;
      
      try {
        const message = this.messageQueue.shift();
        if (message) {
          await this.sendImmediately(message);
          
          // 메시지 간 간격 유지 (Telegram 레이트 리미팅 고려)
          await this.wait(1000);
        }
      } catch (error) {
        console.error('메시지 처리 중 오류:', error);
      } finally {
        this.isProcessing = false;
      }
    }, 2000);
  }

  /**
   * 레이트 리미팅 체크
   */
  private checkRateLimit(service: ServiceType, severity: ErrorSeverity): boolean {
    const key = ;
    const now = Date.now();
    const timeWindow = 60 * 1000; // 1분
    
    const timestamps = this.rateLimiter.get(key) || [];
    
    // 1분 이내의 타임스탬프만 유지
    const recentTimestamps = timestamps.filter(ts => now - ts < timeWindow);
    
    // 심각도별 제한 수
    const limits = {
      [ErrorSeverity.CRITICAL]: 10, // 1분에 10개
      [ErrorSeverity.ERROR]: 5,     // 1분에 5개
      [ErrorSeverity.WARN]: 3,      // 1분에 3개
      [ErrorSeverity.INFO]: 1       // 1분에 1개
    };

    const limit = limits[severity];
    
    if (recentTimestamps.length >= limit) {
      return false;
    }

    return true;
  }

  /**
   * 레이트 리미터 업데이트
   */
  private updateRateLimit(service: ServiceType, severity: ErrorSeverity): void {
    const key = ;
    const now = Date.now();
    const timeWindow = 60 * 1000;
    
    const timestamps = this.rateLimiter.get(key) || [];
    const recentTimestamps = timestamps.filter(ts => now - ts < timeWindow);
    recentTimestamps.push(now);
    
    this.rateLimiter.set(key, recentTimestamps);
  }

  /**
   * Telegram 메시지 포맷팅
   */
  private formatTelegramMessage(notification: NotificationMessage): string {
    let message = ;
    message += notification.message;
    
    if (notification.metadata) {
      message += ;
      Object.entries(notification.metadata).forEach(([key, value]) => {
        message += ;
      });
    }
    
    message += ;
    
    return message;
  }

  /**
   * 유틸리티 메서드들
   */
  private isConfigured(): boolean {
    return Boolean(this.botToken && this.chatId);
  }

  private generateNotificationId(): string {
    return ;
  }

  private getEmojiForSeverity(severity: ErrorSeverity): string {
    const emojis = {
      [ErrorSeverity.CRITICAL]: '🚨',
      [ErrorSeverity.ERROR]: '❌',
      [ErrorSeverity.WARN]: '⚠️',
      [ErrorSeverity.INFO]: 'ℹ️'
    };
    return emojis[severity];
  }

  private getEmojiForStatus(status: SystemStatus): string {
    const emojis = {
      [SystemStatus.HEALTHY]: '✅',
      [SystemStatus.DEGRADED]: '⚠️',
      [SystemStatus.UNHEALTHY]: '❌',
      [SystemStatus.DOWN]: '🚨'
    };
    return emojis[status];
  }

  private getSeverityText(severity: ErrorSeverity): string {
    const texts = {
      [ErrorSeverity.CRITICAL]: '심각한 오류',
      [ErrorSeverity.ERROR]: '오류',
      [ErrorSeverity.WARN]: '경고',
      [ErrorSeverity.INFO]: '정보'
    };
    return texts[severity];
  }

  private getSeverityForStatusChange(
    previous: SystemStatus,
    current: SystemStatus
  ): ErrorSeverity {
    if (current === SystemStatus.DOWN) {
      return ErrorSeverity.CRITICAL;
    }
    if (current === SystemStatus.UNHEALTHY) {
      return ErrorSeverity.ERROR;
    }
    if (current === SystemStatus.DEGRADED) {
      return ErrorSeverity.WARN;
    }
    return ErrorSeverity.INFO;
  }

  private formatTimestamp(date: Date): string {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return ;
    }
    if (minutes > 0) {
      return ;
    }
    return ;
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private initializeTemplates(): void {
    // 템플릿 초기화 로직
  }
}
