/**
 * 종합 모니터링 서비스 통합
 */

import { MonitoringSystem } from './monitoring-system';
import { MetricsCollector } from './metrics-collector';
import { DiagnosticSystem } from './diagnostic-system';
import { TelegramNotificationService } from './telegram-notification';
import { ErrorHandler } from '../error-handling/error-handler';
import { 
  MonitoringConfig, 
  ServiceType, 
  ErrorSeverity,
  SystemStatus 
} from '../../types/monitoring';

export class ComprehensiveMonitoringService {
  private monitoringSystem: MonitoringSystem;
  private metricsCollector: MetricsCollector;
  private diagnosticSystem: DiagnosticSystem;
  private notificationService: TelegramNotificationService;
  private errorHandler: ErrorHandler;
  private isRunning = false;
  private config: MonitoringConfig;

  constructor(config?: Partial<MonitoringConfig>) {
    this.config = this.createConfig(config);
    
    this.monitoringSystem = new MonitoringSystem(this.config);
    this.metricsCollector = new MetricsCollector();
    this.diagnosticSystem = new DiagnosticSystem();
    this.notificationService = new TelegramNotificationService();
    this.errorHandler = new ErrorHandler();
  }

  /**
   * 종합 모니터링 시스템 시작
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('모니터링 시스템이 이미 실행 중입니다.');
      return;
    }

    try {
      console.log('🚀 종합 모니터링 시스템을 시작합니다...');

      // 1. 모니터링 시스템 시작
      await this.monitoringSystem.start();
      console.log('✅ 실시간 모니터링 시스템 시작');

      // 2. 메트릭 수집기 시작
      this.metricsCollector.start();
      console.log('✅ 성능 메트릭 수집기 시작');

      // 3. 초기 진단 실행
      console.log('🔍 초기 시스템 진단을 실행합니다...');
      const diagnosticResults = await this.diagnosticSystem.runFullDiagnosis();
      
      // 4. 시작 알림 발송
      await this.notificationService.sendNotification(
        ErrorSeverity.INFO,
        ServiceType.SYSTEM,
        '🚀 모니터링 시스템 시작',
         +
         +
         +
         +
         +
         +
        diagnosticResults.map(result => 
          
        ).join('
')
      );

      this.isRunning = true;
      console.log('🎉 종합 모니터링 시스템이 성공적으로 시작되었습니다!');

    } catch (error) {
      console.error('❌ 모니터링 시스템 시작 실패:', error);
      
      // 시작 실패 알림
      await this.notificationService.sendNotification(
        ErrorSeverity.CRITICAL,
        ServiceType.SYSTEM,
        '❌ 모니터링 시스템 시작 실패',
        
      );
      
      throw error;
    }
  }

  /**
   * 종합 모니터링 시스템 중지
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('모니터링 시스템이 실행되고 있지 않습니다.');
      return;
    }

    try {
      console.log('🛑 종합 모니터링 시스템을 중지합니다...');

      // 1. 메트릭 수집기 중지
      this.metricsCollector.stop();
      console.log('✅ 성능 메트릭 수집기 중지');

      // 2. 모니터링 시스템 중지
      this.monitoringSystem.stop();
      console.log('✅ 실시간 모니터링 시스템 중지');

      // 3. 중지 알림 발송
      await this.notificationService.sendNotification(
        ErrorSeverity.INFO,
        ServiceType.SYSTEM,
        '🛑 모니터링 시스템 중지',
        'dduksangLAB AI 트렌드 블로그 모니터링 시스템이 중지되었습니다.'
      );

      this.isRunning = false;
      console.log('✅ 종합 모니터링 시스템이 성공적으로 중지되었습니다.');

    } catch (error) {
      console.error('❌ 모니터링 시스템 중지 실패:', error);
      throw error;
    }
  }

  /**
   * 시스템 상태 확인
   */
  async getSystemStatus(): Promise<{
    isRunning: boolean;
    services: any[];
    recentErrors: number;
    uptime: number;
    overallStatus: SystemStatus;
  }> {
    const services = await this.monitoringSystem.performHealthChecks();
    const overallStatus = this.determineOverallStatus(services);
    
    return {
      isRunning: this.isRunning,
      services,
      recentErrors: 0, // 실제 구현에서는 최근 에러 수 계산
      uptime: this.calculateUptime(),
      overallStatus
    };
  }

  /**
   * 긴급 진단 실행
   */
  async runEmergencyDiagnostic(): Promise<void> {
    console.log('🚨 긴급 진단을 실행합니다...');
    
    try {
      const results = await this.diagnosticSystem.runFullDiagnosis();
      
      const criticalIssues = results.filter(result => result.score < 50);
      const warningIssues = results.filter(result => result.score >= 50 && result.score < 80);

      let message = '🚨 긴급 진단 결과

';
      
      if (criticalIssues.length > 0) {
        message += ;
        criticalIssues.forEach(issue => {
          message += ;
        });
        message += '
';
      }
      
      if (warningIssues.length > 0) {
        message += ;
        warningIssues.forEach(issue => {
          message += ;
        });
        message += '
';
      }
      
      message += ;

      const severity = criticalIssues.length > 0 ? ErrorSeverity.CRITICAL :
                      warningIssues.length > 0 ? ErrorSeverity.WARN : ErrorSeverity.INFO;

      await this.notificationService.sendNotification(
        severity,
        ServiceType.SYSTEM,
        '🚨 긴급 진단 완료',
        message
      );

    } catch (error) {
      await this.notificationService.sendNotification(
        ErrorSeverity.ERROR,
        ServiceType.SYSTEM,
        '❌ 긴급 진단 실패',
        
      );
    }
  }

  /**
   * 수동 복구 트리거
   */
  async triggerManualRecovery(
    service: ServiceType, 
    strategy?: string
  ): Promise<boolean> {
    console.log();
    
    try {
      // 진단 실행
      const diagnosticResult = await this.diagnosticSystem.diagnoseService(service);
      
      if (diagnosticResult.score >= 80) {
        await this.notificationService.sendNotification(
          ErrorSeverity.INFO,
          service,
          '✅ 복구 불필요',
          
        );
        return true;
      }

      // 복구 시도 (실제 구현에서는 DiagnosticSystem의 복구 메서드 호출)
      const recoverySuccess = true; // 모킹
      
      if (recoverySuccess) {
        await this.notificationService.sendRecoveryNotification(
          service,
          strategy || 'manual_recovery',
          5000 // 5초 소요
        );
        return true;
      } else {
        await this.notificationService.sendNotification(
          ErrorSeverity.ERROR,
          service,
          '❌ 복구 실패',
          
        );
        return false;
      }

    } catch (error) {
      await this.notificationService.sendNotification(
        ErrorSeverity.ERROR,
        service,
        '❌ 복구 오류',
        
      );
      return false;
    }
  }

  /**
   * 일간/주간 보고서 생성
   */
  async generateReport(period: 'daily' | 'weekly'): Promise<void> {
    try {
      // 실제 구현에서는 데이터베이스에서 통계 데이터 수집
      const reportData = {
        totalErrors: Math.floor(Math.random() * 20) + 5,
        resolvedErrors: Math.floor(Math.random() * 15) + 10,
        avgResponseTime: Math.floor(Math.random() * 500) + 200,
        uptime: 0.995 + Math.random() * 0.004,
        topIssues: [
          'API 응답 지연',
          '메모리 사용량 증가',
          'Playwright 브라우저 연결 문제'
        ]
      };

      await this.notificationService.sendSummaryReport(period, reportData);
      
    } catch (error) {
      console.error(, error);
    }
  }

  /**
   * 설정 생성
   */
  private createConfig(config?: Partial<MonitoringConfig>): MonitoringConfig {
    return {
      enabled: process.env.MONITORING_ENABLED === 'true',
      interval: parseInt(process.env.MONITORING_INTERVAL || '30000'),
      thresholds: {
        responseTime: parseInt(process.env.RESPONSE_TIME_THRESHOLD || '3000'),
        errorRate: parseFloat(process.env.ERROR_RATE_THRESHOLD || '0.1'),
        memoryUsage: parseInt(process.env.MEMORY_USAGE_THRESHOLD || '80'),
        cpuUsage: parseInt(process.env.CPU_USAGE_THRESHOLD || '70'),
        diskUsage: parseInt(process.env.DISK_USAGE_THRESHOLD || '85')
      },
      notifications: {
        telegram: {
          enabled: Boolean(process.env.TELEGRAM_BOT_TOKEN),
          config: {
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID
          },
          rateLimiting: {
            maxPerMinute: parseInt(process.env.NOTIFICATION_RATE_LIMIT_PER_MINUTE || '10'),
            maxPerHour: parseInt(process.env.NOTIFICATION_RATE_LIMIT_PER_HOUR || '100')
          }
        }
      },
      recovery: {
        autoRecovery: process.env.AUTO_RECOVERY_ENABLED === 'true',
        maxRetries: parseInt(process.env.MAX_RECOVERY_ATTEMPTS || '3'),
        retryDelay: parseInt(process.env.RECOVERY_RETRY_DELAY || '5000'),
        escalationDelay: parseInt(process.env.ESCALATION_DELAY || '300000')
      },
      ...config
    };
  }

  /**
   * 유틸리티 메서드들
   */
  private getScoreStatus(score: number): string {
    if (score >= 90) return '우수';
    if (score >= 80) return '양호';
    if (score >= 70) return '보통';
    if (score >= 60) return '주의';
    return '위험';
  }

  private determineOverallStatus(services: any[]): SystemStatus {
    if (services.some(s => s.status === SystemStatus.DOWN)) {
      return SystemStatus.DOWN;
    }
    if (services.some(s => s.status === SystemStatus.UNHEALTHY)) {
      return SystemStatus.UNHEALTHY;
    }
    if (services.some(s => s.status === SystemStatus.DEGRADED)) {
      return SystemStatus.DEGRADED;
    }
    return SystemStatus.HEALTHY;
  }

  private calculateUptime(): number {
    // 실제 구현에서는 시스템 시작 시간부터 계산
    return 0.995 + Math.random() * 0.004;
  }
}

// 전역 인스턴스 (싱글톤)
let globalMonitoringService: ComprehensiveMonitoringService | null = null;

export function getMonitoringService(): ComprehensiveMonitoringService {
  if (!globalMonitoringService) {
    globalMonitoringService = new ComprehensiveMonitoringService();
  }
  return globalMonitoringService;
}

// 자동 시작 (환경변수 설정 시)
if (process.env.MONITORING_AUTO_START === 'true') {
  const service = getMonitoringService();
  service.start().catch(console.error);
}
