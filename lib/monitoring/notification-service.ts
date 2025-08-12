/**
 * 통합 알림 서비스
 * 다양한 채널(이메일, 슬랙, 텔레그램 등)을 통한 알림 발송
 */

import { logger } from '@/lib/logger';
import { getSupabaseController } from '@/lib/mcp/supabase-controller';
import { handleAutomationError } from '@/lib/mcp/error-handler';

export interface NotificationMessage {
  id?: string;
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error' | 'critical';
  channels: NotificationChannel[];
  metadata?: Record<string, any>;
  retryCount?: number;
  scheduledAt?: Date;
}

export interface NotificationChannel {
  type: 'email' | 'slack' | 'telegram' | 'webhook' | 'sms';
  config: {
    recipient?: string;
    webhook_url?: string;
    chat_id?: string;
    phone_number?: string;
    [key: string]: any;
  };
  enabled: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  template: {
    title: string;
    message: string;
    format: 'text' | 'html' | 'markdown';
  };
  defaultChannels: NotificationChannel[];
}

export interface NotificationResult {
  messageId: string;
  success: boolean;
  channel: string;
  error?: string;
  sentAt: Date;
  metadata?: Record<string, any>;
}

export interface NotificationConfig {
  enabled: boolean;
  maxRetries: number;
  retryDelay: number;
  rateLimitPerHour: number;
  defaultChannels: NotificationChannel[];
  templates: NotificationTemplate[];
}

/**
 * 통합 알림 서비스 클래스
 */
export class NotificationService {
  private config: NotificationConfig;
  private messageQueue: NotificationMessage[] = [];
  private sendCounts: Map<string, number> = new Map(); // Rate limiting
  private lastResetTime: Date = new Date();

  constructor(config?: Partial<NotificationConfig>) {
    this.config = {
      enabled: true,
      maxRetries: 3,
      retryDelay: 5000, // 5초
      rateLimitPerHour: 100,
      defaultChannels: [],
      templates: [],
      ...config,
    };

    this.initializeDefaultTemplates();
  }

  /**
   * 기본 알림 템플릿 초기화
   */
  private initializeDefaultTemplates(): void {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'system-alert',
        name: '시스템 알림',
        description: '시스템 문제 발생 시 알림',
        template: {
          title: '🚨 시스템 알림: {{title}}',
          message: `
**문제 상황:** {{message}}
**발생 시간:** {{timestamp}}
**심각도:** {{severity}}
{{#if metadata.service}}**서비스:** {{metadata.service}}{{/if}}
{{#if metadata.error}}**오류:** {{metadata.error}}{{/if}}

즉시 확인이 필요합니다.
          `.trim(),
          format: 'markdown',
        },
        defaultChannels: [],
      },
      {
        id: 'health-check',
        name: '헬스체크 알림',
        description: '시스템 상태 변경 알림',
        template: {
          title: '💊 헬스체크: {{title}}',
          message: `
**시스템 상태:** {{metadata.overall_status}}
**확인 시간:** {{timestamp}}
{{#if metadata.unhealthy_services}}**문제 서비스:** {{metadata.unhealthy_services}}{{/if}}
{{#if metadata.recommendations}}**권장사항:** {{metadata.recommendations}}{{/if}}
          `.trim(),
          format: 'markdown',
        },
        defaultChannels: [],
      },
      {
        id: 'automation-success',
        name: '자동화 성공',
        description: '자동화 작업 성공 알림',
        template: {
          title: '✅ 자동화 완료: {{title}}',
          message: `
**작업:** {{message}}
**완료 시간:** {{timestamp}}
{{#if metadata.duration}}**소요 시간:** {{metadata.duration}}ms{{/if}}
{{#if metadata.result}}**결과:** {{metadata.result}}{{/if}}
          `.trim(),
          format: 'markdown',
        },
        defaultChannels: [],
      },
      {
        id: 'automation-failure',
        name: '자동화 실패',
        description: '자동화 작업 실패 알림',
        template: {
          title: '❌ 자동화 실패: {{title}}',
          message: `
**실패한 작업:** {{message}}
**실패 시간:** {{timestamp}}
{{#if metadata.error}}**오류 메시지:** {{metadata.error}}{{/if}}
{{#if metadata.retry_count}}**재시도 횟수:** {{metadata.retry_count}}{{/if}}

수동 확인이 필요합니다.
          `.trim(),
          format: 'markdown',
        },
        defaultChannels: [],
      },
      {
        id: 'content-published',
        name: '콘텐츠 게시',
        description: '블로그 콘텐츠 게시 완료 알림',
        template: {
          title: '📝 콘텐츠 게시: {{title}}',
          message: `
**게시된 글:** {{message}}
**게시 시간:** {{timestamp}}
{{#if metadata.url}}**URL:** {{metadata.url}}{{/if}}
{{#if metadata.category}}**카테고리:** {{metadata.category}}{{/if}}
          `.trim(),
          format: 'markdown',
        },
        defaultChannels: [],
      },
    ];

    this.config.templates.push(...defaultTemplates);
  }

  /**
   * 알림 발송
   */
  async sendNotification(notification: NotificationMessage): Promise<NotificationResult[]> {
    try {
      if (!this.config.enabled) {
        logger.debug('알림 서비스가 비활성화됨');
        return [];
      }

      // Rate limiting 체크
      if (!this.checkRateLimit()) {
        logger.warn('알림 발송 속도 제한 초과');
        return [];
      }

      const messageId = notification.id || this.generateMessageId();
      const results: NotificationResult[] = [];

      logger.info('알림 발송 시작', {
        messageId,
        title: notification.title,
        channels: notification.channels.length,
      });

      // 각 채널별로 알림 발송
      for (const channel of notification.channels) {
        if (!channel.enabled) {
          continue;
        }

        try {
          const result = await this.sendToChannel(messageId, notification, channel);
          results.push(result);
        } catch (error) {
          logger.error(`채널 발송 실패: ${channel.type}`, { error, messageId });

          results.push({
            messageId,
            success: false,
            channel: channel.type,
            error: (error as Error).message,
            sentAt: new Date(),
          });
        }
      }

      // 발송 결과 로깅
      await this.logNotificationResult(messageId, notification, results);

      const successCount = results.filter(r => r.success).length;
      logger.info('알림 발송 완료', {
        messageId,
        totalChannels: results.length,
        successCount,
        failureCount: results.length - successCount,
      });

      return results;
    } catch (error) {
      logger.error('알림 발송 실패', { error, notification });

      await handleAutomationError(error as Error, {
        operation: 'notification_send',
        component: 'automation',
        metadata: { title: notification.title },
      });

      return [];
    }
  }

  /**
   * 템플릿 기반 알림 발송
   */
  async sendTemplatedNotification(
    templateId: string,
    data: Record<string, any>,
    channels?: NotificationChannel[]
  ): Promise<NotificationResult[]> {
    try {
      const template = this.config.templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`알림 템플릿을 찾을 수 없습니다: ${templateId}`);
      }

      // 템플릿 렌더링
      const renderedTitle = this.renderTemplate(template.template.title, data);
      const renderedMessage = this.renderTemplate(template.template.message, data);

      const notification: NotificationMessage = {
        title: renderedTitle,
        message: renderedMessage,
        severity: data.severity || 'info',
        channels: channels || template.defaultChannels,
        metadata: data.metadata,
      };

      return await this.sendNotification(notification);
    } catch (error) {
      logger.error('템플릿 알림 발송 실패', { error, templateId });
      return [];
    }
  }

  /**
   * 채널별 알림 발송
   */
  private async sendToChannel(
    messageId: string,
    notification: NotificationMessage,
    channel: NotificationChannel
  ): Promise<NotificationResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (channel.type) {
        case 'telegram':
          result = await this.sendTelegramMessage(notification, channel.config);
          break;
        case 'slack':
          result = await this.sendSlackMessage(notification, channel.config);
          break;
        case 'email':
          result = await this.sendEmailMessage(notification, channel.config);
          break;
        case 'webhook':
          result = await this.sendWebhookMessage(notification, channel.config);
          break;
        case 'sms':
          result = await this.sendSMSMessage(notification, channel.config);
          break;
        default:
          throw new Error(`지원되지 않는 채널 타입: ${channel.type}`);
      }

      return {
        messageId,
        success: true,
        channel: channel.type,
        sentAt: new Date(),
        metadata: {
          duration: Date.now() - startTime,
          result,
        },
      };
    } catch (error) {
      return {
        messageId,
        success: false,
        channel: channel.type,
        error: (error as Error).message,
        sentAt: new Date(),
        metadata: {
          duration: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 텔레그램 메시지 발송
   */
  private async sendTelegramMessage(notification: NotificationMessage, config: any): Promise<any> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = config.chat_id || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('Telegram 설정이 누락됨');
    }

    // 심각도별 이모지 추가
    const severityEmojis = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      critical: '🚨',
    };

    const emoji = severityEmojis[notification.severity] || 'ℹ️';
    const message = `${emoji} **${notification.title}**\n\n${notification.message}`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Telegram API 오류: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  /**
   * 슬랙 메시지 발송
   */
  private async sendSlackMessage(notification: NotificationMessage, config: any): Promise<any> {
    const webhookUrl = config.webhook_url || process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      throw new Error('Slack webhook URL이 누락됨');
    }

    // 심각도별 색상 설정
    const severityColors = {
      info: '#36a64f',
      success: '#36a64f',
      warning: '#ffeb3b',
      error: '#f44336',
      critical: '#d32f2f',
    };

    const color = severityColors[notification.severity] || '#36a64f';

    const payload = {
      text: notification.title,
      attachments: [
        {
          color,
          title: notification.title,
          text: notification.message,
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Slack API 오류: ${response.status} - ${errorData}`);
    }

    return { status: 'sent' };
  }

  /**
   * 이메일 메시지 발송
   */
  private async sendEmailMessage(notification: NotificationMessage, config: any): Promise<any> {
    // 실제 구현에서는 SendGrid, AWS SES 등의 서비스 사용
    logger.info('이메일 발송 (모의)', {
      to: config.recipient,
      subject: notification.title,
      message: notification.message,
    });

    return { status: 'sent', provider: 'mock' };
  }

  /**
   * 웹훅 메시지 발송
   */
  private async sendWebhookMessage(notification: NotificationMessage, config: any): Promise<any> {
    const webhookUrl = config.webhook_url;

    if (!webhookUrl) {
      throw new Error('Webhook URL이 누락됨');
    }

    const payload = {
      title: notification.title,
      message: notification.message,
      severity: notification.severity,
      timestamp: new Date().toISOString(),
      metadata: notification.metadata,
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Webhook 오류: ${response.status} - ${errorData}`);
    }

    return await response.json();
  }

  /**
   * SMS 메시지 발송
   */
  private async sendSMSMessage(notification: NotificationMessage, config: any): Promise<any> {
    // 실제 구현에서는 Twilio, AWS SNS 등의 서비스 사용
    logger.info('SMS 발송 (모의)', {
      to: config.phone_number,
      message: `${notification.title}\n${notification.message}`,
    });

    return { status: 'sent', provider: 'mock' };
  }

  /**
   * 템플릿 렌더링
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    let rendered = template;

    // 간단한 템플릿 엔진 (실제로는 handlebars 등 사용 권장)
    // {{variable}} 형태 변수 치환
    rendered = rendered.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
      const value = this.getNestedValue(data, path);
      return value !== undefined ? String(value) : match;
    });

    // {{#if condition}} 조건부 블록
    rendered = rendered.replace(
      /\{\{#if\s+(\w+(?:\.\w+)*)\}\}(.*?)\{\{\/if\}\}/gs,
      (match, path, content) => {
        const value = this.getNestedValue(data, path);
        return value ? content : '';
      }
    );

    // 타임스탬프 추가
    if (rendered.includes('{{timestamp}}')) {
      rendered = rendered.replace(/\{\{timestamp\}\}/g, new Date().toLocaleString('ko-KR'));
    }

    return rendered.trim();
  }

  /**
   * 중첩된 객체 값 가져오기
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Rate limiting 체크
   */
  private checkRateLimit(): boolean {
    const now = new Date();
    const hoursSinceReset = (now.getTime() - this.lastResetTime.getTime()) / (1000 * 60 * 60);

    // 1시간마다 카운터 리셋
    if (hoursSinceReset >= 1) {
      this.sendCounts.clear();
      this.lastResetTime = now;
    }

    const currentCount = this.sendCounts.get('total') || 0;

    if (currentCount >= this.config.rateLimitPerHour) {
      return false;
    }

    this.sendCounts.set('total', currentCount + 1);
    return true;
  }

  /**
   * 알림 결과 로깅
   */
  private async logNotificationResult(
    messageId: string,
    notification: NotificationMessage,
    results: NotificationResult[]
  ): Promise<void> {
    try {
      const supabaseController = getSupabaseController();

      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      await supabaseController.logAutomation({
        type: 'health_check',
        status:
          failureCount === 0 ? 'success' : failureCount === results.length ? 'failure' : 'warning',
        message: `알림 발송: ${notification.title}`,
        metadata: {
          message_id: messageId,
          title: notification.title,
          severity: notification.severity,
          channels_total: results.length,
          channels_success: successCount,
          channels_failure: failureCount,
          results: results.map(r => ({
            channel: r.channel,
            success: r.success,
            error: r.error,
          })),
        },
      });
    } catch (error) {
      logger.error('알림 결과 로깅 실패', { error });
    }
  }

  /**
   * 메시지 ID 생성
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 큐 기반 알림 발송
   */
  async queueNotification(notification: NotificationMessage): Promise<void> {
    this.messageQueue.push({
      ...notification,
      id: notification.id || this.generateMessageId(),
    });

    logger.info('알림 큐에 추가됨', {
      messageId: notification.id,
      queueSize: this.messageQueue.length,
    });
  }

  /**
   * 큐 처리
   */
  async processNotificationQueue(): Promise<void> {
    if (this.messageQueue.length === 0) {
      return;
    }

    logger.info('알림 큐 처리 시작', { queueSize: this.messageQueue.length });

    const messages = [...this.messageQueue];
    this.messageQueue = [];

    for (const message of messages) {
      try {
        await this.sendNotification(message);
        await this.delay(100); // 100ms 간격
      } catch (error) {
        logger.error('큐 알림 발송 실패', { error, messageId: message.id });

        // 재시도 로직
        if ((message.retryCount || 0) < this.config.maxRetries) {
          message.retryCount = (message.retryCount || 0) + 1;
          this.messageQueue.push(message);
        }
      }
    }
  }

  /**
   * 채널 설정 검증
   */
  validateChannelConfig(channel: NotificationChannel): boolean {
    switch (channel.type) {
      case 'telegram':
        return !!(
          process.env.TELEGRAM_BOT_TOKEN &&
          (channel.config.chat_id || process.env.TELEGRAM_CHAT_ID)
        );

      case 'slack':
        return !!(channel.config.webhook_url || process.env.SLACK_WEBHOOK_URL);

      case 'email':
        return !!channel.config.recipient;

      case 'webhook':
        return !!channel.config.webhook_url;

      case 'sms':
        return !!channel.config.phone_number;

      default:
        return false;
    }
  }

  /**
   * 설정 업데이트
   */
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('알림 서비스 설정 업데이트됨');
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 서비스 상태 조회
   */
  getServiceStatus(): {
    enabled: boolean;
    queueSize: number;
    rateLimitRemaining: number;
    lastResetTime: Date;
  } {
    const currentCount = this.sendCounts.get('total') || 0;

    return {
      enabled: this.config.enabled,
      queueSize: this.messageQueue.length,
      rateLimitRemaining: this.config.rateLimitPerHour - currentCount,
      lastResetTime: this.lastResetTime,
    };
  }
}

// 싱글톤 인스턴스
let notificationService: NotificationService | null = null;

/**
 * NotificationService 싱글톤 인스턴스 반환
 */
export function getNotificationService(config?: Partial<NotificationConfig>): NotificationService {
  if (!notificationService) {
    notificationService = new NotificationService(config);
  }
  return notificationService;
}

/**
 * 빠른 알림 발송 헬퍼
 */
export async function sendQuickNotification(
  title: string,
  message: string,
  severity: 'info' | 'success' | 'warning' | 'error' | 'critical' = 'info',
  channels?: NotificationChannel[]
): Promise<NotificationResult[]> {
  const service = getNotificationService();

  return await service.sendNotification({
    title,
    message,
    severity,
    channels: channels || service['config'].defaultChannels,
  });
}

/**
 * 템플릿 기반 빠른 알림
 */
export async function sendTemplatedAlert(
  templateId: string,
  data: Record<string, any>,
  channels?: NotificationChannel[]
): Promise<NotificationResult[]> {
  const service = getNotificationService();

  return await service.sendTemplatedNotification(templateId, data, channels);
}
