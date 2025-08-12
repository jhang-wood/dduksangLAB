/**
 * 자가 복구 메커니즘 (Self-Healing System)
 * 장애 감지, 자동 복구, 상태 모니터링
 */

import { queueManager } from '../queue/queue-manager';
import { logger } from '../logger';
import cron from 'node-cron';

interface HealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'critical' | 'down';
  lastCheck: Date;
  errors: string[];
  recoveryAttempts: number;
}

export class SelfHealingSystem {
  private healthStatuses: Map<string, HealthStatus> = new Map();
  private isRunning = false;
  private monitoringInterval?: NodeJS.Timer;

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    logger.info('자가 복구 시스템 시작');

    await this.performHealthCheck();

    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // 30초마다

    // 정리 작업 스케줄
    cron.schedule('0 * * * *', async () => {
      await this.performCleanup();
    });
  }

  private async performHealthCheck(): Promise<void> {
    const services = ['queue-system', 'memory', 'database'];

    for (const service of services) {
      await this.checkService(service);
    }
  }

  private async checkService(service: string): Promise<void> {
    let status: HealthStatus['status'] = 'healthy';
    const errors: string[] = [];

    try {
      switch (service) {
        case 'queue-system':
          // 큐 시스템 체크 로직
          break;
        case 'memory':
          const memUsage = process.memoryUsage();
          const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
          if (memUsageMB > 800) {
            errors.push(`높은 메모리 사용량: ${memUsageMB}MB`);
            status = 'degraded';
          }
          break;
        case 'database':
          // 데이터베이스 체크 로직
          break;
      }
    } catch (error) {
      status = 'down';
      errors.push((error as Error).message);
    }

    this.healthStatuses.set(service, {
      service,
      status,
      lastCheck: new Date(),
      errors,
      recoveryAttempts: this.healthStatuses.get(service)?.recoveryAttempts || 0,
    });

    if (status !== 'healthy') {
      await this.attemptRecovery(service);
    }
  }

  private async attemptRecovery(service: string): Promise<void> {
    const currentStatus = this.healthStatuses.get(service);
    if (!currentStatus || currentStatus.recoveryAttempts >= 3) {
      return;
    }

    logger.info(`복구 시도: ${service}`);

    try {
      switch (service) {
        case 'memory':
          if (global.gc) {
            global.gc();
            logger.info('가비지 컬렉션 실행');
          }
          break;
        case 'queue-system':
          await queueManager.initialize();
          break;
      }

      currentStatus.recoveryAttempts++;
      this.healthStatuses.set(service, currentStatus);
    } catch (error) {
      logger.error(`복구 실패: ${service}`, error);
    }
  }

  private async performCleanup(): Promise<void> {
    if (global.gc) {
      global.gc();
    }
    logger.info('정기 정리 작업 완료');
  }

  getHealthStatus(): Map<string, HealthStatus> {
    return new Map(this.healthStatuses);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    logger.info('자가 복구 시스템 정지');
  }
}

export const selfHealingSystem = new SelfHealingSystem();
EOF < /dev/llnu;
