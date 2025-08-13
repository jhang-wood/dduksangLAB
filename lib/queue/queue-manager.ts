/**
 * 안정적이고 확장 가능한 큐 시스템
 * Redis 기반 BullMQ 사용으로 고성능 작업 처리
 */

import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { logger } from '../logger';

export interface JobData {
  id: string;
  type: 'content_generation' | 'blog_publish' | 'ai_analysis' | 'health_check' | 'cleanup';
  payload: any;
  priority?: number;
  retries?: number;
  delay?: number;
  createdAt: Date;
}

export interface JobResult {
  success: boolean;
  data?: any;
  error?: string;
  duration?: number;
  completedAt: Date;
}

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 1000,
  lazyConnect: true,
};

export class QueueManager {
  private redis: Redis;
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private queueEvents: Map<string, QueueEvents> = new Map();
  private healthCheckInterval?: NodeJS.Timer;

  constructor() {
    this.redis = new Redis(redisConfig);
    this.setupRedisErrorHandling();
  }

  async initialize(): Promise<void> {
    try {
      await this.redis.ping();
      logger.info('Redis 연결 성공');

      await this.createQueue('content-generation', {
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
        },
      });

      await this.createQueue('blog-publishing');
      await this.createQueue('system-maintenance');

      this.startHealthCheck();
      // Queue system initialized successfully
      logger.info('큐 시스템 초기화 완료');
    } catch (error) {
      logger.error('큐 시스템 초기화 실패:', error);
      throw error;
    }
  }

  private async createQueue(name: string, options: any = {}): Promise<Queue> {
    const queue = new Queue(name, { connection: this.redis, ...options });
    const queueEvents = new QueueEvents(name, { connection: this.redis });

    queueEvents.on('completed', ({ jobId }) => {
      logger.info(`작업 완료: ${name}/${jobId}`);
    });

    queueEvents.on('failed', ({ jobId, failedReason }) => {
      logger.error(`작업 실패: ${name}/${jobId}`, { error: failedReason });
    });

    this.queues.set(name, queue);
    this.queueEvents.set(name, queueEvents);
    return queue;
  }

  async addJob(queueName: string, jobData: JobData): Promise<Job<JobData> | null> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      return null;
    }

    try {
      const job = await queue.add(jobData.type, jobData, {
        priority: jobData.priority || 0,
        attempts: jobData.retries || 3,
        delay: jobData.delay || 0,
      });

      logger.info(`작업 추가됨: ${queueName}/${job.id}`);
      return job;
    } catch (error) {
      logger.error(`작업 추가 실패: ${queueName}`, { error });
      return null;
    }
  }

  private setupRedisErrorHandling(): void {
    this.redis.on('error', error => logger.error('Redis 오류:', error));
    this.redis.on('connect', () => logger.info('Redis 연결됨'));
  }

  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.redis.ping();
      } catch (error) {
        logger.error('헬스체크 실패:', error);
      }
    }, 30000);
  }

  async shutdown(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval as NodeJS.Timeout);
    }

    for (const [, worker] of this.workers) {
      await worker.close();
    }

    for (const [, queue] of this.queues) {
      await queue.close();
    }

    await this.redis.quit();
    logger.info('큐 시스템 종료 완료');
  }
}

export const queueManager = new QueueManager();
