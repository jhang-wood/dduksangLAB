/**
 * SupabaseMCP 데이터 관리 컨트롤러
 * dduksangLAB의 데이터베이스 상태 관리, 자동화 로그, 성능 모니터링
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

export interface AutomationLog {
  id?: string;
  type: 'login' | 'publish' | 'error' | 'performance' | 'health_check';
  status: 'success' | 'failure' | 'warning' | 'info';
  message: string;
  metadata?: Record<string, any>;
  created_at?: string;
  user_id?: string;
}

export interface ContentItem {
  id?: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  author_id?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceMetric {
  id?: string;
  metric_type: string;
  value: number;
  unit: string;
  page_url?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HealthCheckResult {
  id?: string;
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  response_time?: number;
  error_message?: string;
  checked_at: string;
  metadata?: Record<string, any>;
}

/**
 * SupabaseMCP 데이터 관리 컨트롤러 클래스
 */
export class SupabaseController {
  private client: SupabaseClient;
  private isInitialized: boolean = false;

  constructor() {
    this.client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * 컨트롤러 초기화
   */
  async initialize(): Promise<void> {
    try {
      logger.info('SupabaseController 초기화 시작');
      
      // 연결 테스트
      const { data, error } = await this.client
        .from('automation_logs')
        .select('count')
        .limit(1);

      if (error) {
        logger.error('Supabase 연결 테스트 실패', { error });
        throw new Error(`Supabase 연결 실패: ${error.message}`);
      }

      this.isInitialized = true;
      logger.info('SupabaseController 초기화 완료');

      // 초기화 로그 기록
      await this.logAutomation({
        type: 'health_check',
        status: 'success',
        message: 'SupabaseController 초기화 완료'
      });

    } catch (error) {
      logger.error('SupabaseController 초기화 실패', { error });
      throw error;
    }
  }

  /**
   * 자동화 로그 기록
   */
  async logAutomation(log: AutomationLog): Promise<string | null> {
    try {
      const logData = {
        ...log,
        created_at: new Date().toISOString(),
        metadata: log.metadata ?? {}
      };

      const { data, error } = await this.client
        .from('automation_logs')
        .insert([logData])
        .select('id')
        .single();

      if (error) {
        logger.error('자동화 로그 기록 실패', { error, logData });
        return null;
      }

      logger.info('자동화 로그 기록 완료', { id: data.id, type: log.type });
      return data.id;

    } catch (error) {
      logger.error('자동화 로그 기록 중 예외 발생', { error });
      return null;
    }
  }

  /**
   * 자동화 로그 조회
   */
  async getAutomationLogs(
    limit: number = 100,
    type?: string,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<AutomationLog[]> {
    try {
      let query = this.client
        .from('automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (type) {
        query = query.eq('type', type);
      }

      if (status) {
        query = query.eq('status', status);
      }

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        logger.error('자동화 로그 조회 실패', { error });
        return [];
      }

      return data ?? [];

    } catch (error) {
      logger.error('자동화 로그 조회 중 예외 발생', { error });
      return [];
    }
  }

  /**
   * 콘텐츠 항목 생성/업데이트
   */
  async upsertContent(content: ContentItem): Promise<string | null> {
    try {
      const contentData = {
        ...content,
        updated_at: new Date().toISOString(),
        created_at: content.created_at ?? new Date().toISOString()
      };

      const { data, error } = await this.client
        .from('content_items')
        .upsert([contentData])
        .select('id')
        .single();

      if (error) {
        logger.error('콘텐츠 저장 실패', { error, contentData });
        return null;
      }

      logger.info('콘텐츠 저장 완료', { id: data.id, title: content.title });
      
      // 콘텐츠 작업 로그 기록
      await this.logAutomation({
        type: 'publish',
        status: 'success',
        message: `콘텐츠 저장: ${content.title}`,
        metadata: { content_id: data.id, status: content.status }
      });

      return data.id;

    } catch (error) {
      logger.error('콘텐츠 저장 중 예외 발생', { error });
      return null;
    }
  }

  /**
   * 콘텐츠 항목 조회
   */
  async getContent(
    limit: number = 50,
    status?: string,
    category?: string
  ): Promise<ContentItem[]> {
    try {
      let query = this.client
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('콘텐츠 조회 실패', { error });
        return [];
      }

      return data ?? [];

    } catch (error) {
      logger.error('콘텐츠 조회 중 예외 발생', { error });
      return [];
    }
  }

  /**
   * 성능 메트릭 기록
   */
  async recordPerformanceMetric(metric: PerformanceMetric): Promise<string | null> {
    try {
      const metricData = {
        ...metric,
        timestamp: metric.timestamp ?? new Date().toISOString()
      };

      const { data, error } = await this.client
        .from('performance_metrics')
        .insert([metricData])
        .select('id')
        .single();

      if (error) {
        logger.error('성능 메트릭 기록 실패', { error, metricData });
        return null;
      }

      logger.info('성능 메트릭 기록 완료', { 
        id: data.id, 
        type: metric.metric_type, 
        value: metric.value 
      });

      return data.id;

    } catch (error) {
      logger.error('성능 메트릭 기록 중 예외 발생', { error });
      return null;
    }
  }

  /**
   * 성능 메트릭 조회
   */
  async getPerformanceMetrics(
    metricType?: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<PerformanceMetric[]> {
    try {
      let query = this.client
        .from('performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      }

      if (endDate) {
        query = query.lte('timestamp', endDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        logger.error('성능 메트릭 조회 실패', { error });
        return [];
      }

      return data ?? [];

    } catch (error) {
      logger.error('성능 메트릭 조회 중 예외 발생', { error });
      return [];
    }
  }

  /**
   * 헬스체크 결과 기록
   */
  async recordHealthCheck(result: HealthCheckResult): Promise<string | null> {
    try {
      const healthData = {
        ...result,
        checked_at: result.checked_at ?? new Date().toISOString()
      };

      const { data, error } = await this.client
        .from('health_checks')
        .insert([healthData])
        .select('id')
        .single();

      if (error) {
        logger.error('헬스체크 결과 기록 실패', { error, healthData });
        return null;
      }

      // 헬스체크 로그도 함께 기록
      await this.logAutomation({
        type: 'health_check',
        status: result.status === 'healthy' ? 'success' : 
                result.status === 'unhealthy' ? 'failure' : 'warning',
        message: `헬스체크: ${result.service} - ${result.status}`,
        metadata: { 
          service: result.service, 
          response_time: result.response_time,
          error_message: result.error_message 
        }
      });

      return data.id;

    } catch (error) {
      logger.error('헬스체크 결과 기록 중 예외 발생', { error });
      return null;
    }
  }

  /**
   * 최근 헬스체크 결과 조회
   */
  async getLatestHealthChecks(): Promise<HealthCheckResult[]> {
    try {
      const { data, error } = await this.client
        .from('health_checks')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('헬스체크 결과 조회 실패', { error });
        return [];
      }

      return data ?? [];

    } catch (error) {
      logger.error('헬스체크 결과 조회 중 예외 발생', { error });
      return [];
    }
  }

  /**
   * 통계 데이터 조회
   */
  async getAutomationStats(days: number = 7): Promise<Record<string, any>> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // 자동화 로그 통계
      const { data: logStats, error: logError } = await this.client
        .from('automation_logs')
        .select('type, status, message')
        .gte('created_at', startDate.toISOString());

      if (logError) {
        logger.error('로그 통계 조회 실패', { logError });
        return {};
      }

      // 성능 메트릭 통계
      const { data: perfStats, error: perfError } = await this.client
        .from('performance_metrics')
        .select('metric_type, value, unit, timestamp')
        .gte('timestamp', startDate.toISOString());

      if (perfError) {
        logger.error('성능 통계 조회 실패', { perfError });
      }

      // 통계 계산
      const stats = {
        period_days: days,
        log_summary: this.calculateLogStats(logStats ?? []),
        performance_summary: this.calculatePerfStats(perfStats ?? []),
        generated_at: new Date().toISOString()
      };

      logger.info('자동화 통계 조회 완료', { days, totalLogs: logStats?.length });
      return stats;

    } catch (error) {
      logger.error('자동화 통계 조회 중 예외 발생', { error });
      return {};
    }
  }

  /**
   * 로그 통계 계산
   */
  private calculateLogStats(logs: AutomationLog[]): Record<string, any> {
    const stats = {
      total: logs.length,
      by_type: {} as Record<string, number>,
      by_status: {} as Record<string, number>,
      success_rate: 0
    };

    logs.forEach(log => {
      // 타입별 집계
      stats.by_type[log.type] = (stats.by_type[log.type] ?? 0) + 1;
      
      // 상태별 집계
      stats.by_status[log.status] = (stats.by_status[log.status] ?? 0) + 1;
    });

    // 성공률 계산
    const successCount = stats.by_status['success'] ?? 0;
    stats.success_rate = stats.total > 0 ? (successCount / stats.total) * 100 : 0;

    return stats;
  }

  /**
   * 성능 통계 계산
   */
  private calculatePerfStats(metrics: PerformanceMetric[]): Record<string, any> {
    const stats = {
      total_metrics: metrics.length,
      by_type: {} as Record<string, { count: number; avg: number; min: number; max: number }>
    };

    const typeGroups: Record<string, number[]> = {};
    
    metrics.forEach(metric => {
      if (!typeGroups[metric.metric_type]) {
        typeGroups[metric.metric_type] = [];
      }
      typeGroups[metric.metric_type].push(metric.value);
    });

    Object.entries(typeGroups).forEach(([type, values]) => {
      stats.by_type[type] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });

    return stats;
  }

  /**
   * 데이터베이스 정리 (오래된 로그 삭제)
   */
  async cleanupOldData(days: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // 오래된 자동화 로그 삭제
      const { error: logError } = await this.client
        .from('automation_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (logError) {
        logger.error('오래된 로그 삭제 실패', { logError });
      }

      // 오래된 성능 메트릭 삭제
      const { error: metricError } = await this.client
        .from('performance_metrics')
        .delete()
        .lt('timestamp', cutoffDate.toISOString());

      if (metricError) {
        logger.error('오래된 메트릭 삭제 실패', { metricError });
      }

      logger.info('데이터베이스 정리 완료', { cutoff_date: cutoffDate.toISOString() });

    } catch (error) {
      logger.error('데이터베이스 정리 중 예외 발생', { error });
    }
  }

  /**
   * 연결 상태 확인
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }

  /**
   * Supabase 클라이언트 반환 (필요한 경우)
   */
  getClient(): SupabaseClient {
    return this.client;
  }
}

// 싱글톤 인스턴스
let supabaseController: SupabaseController | null = null;

/**
 * SupabaseController 싱글톤 인스턴스 반환
 */
export function getSupabaseController(): SupabaseController {
  if (!supabaseController) {
    supabaseController = new SupabaseController();
  }
  return supabaseController;
}

/**
 * 컨트롤러 초기화
 */
export async function initializeSupabaseController(): Promise<SupabaseController> {
  const controller = getSupabaseController();
  if (!controller.getInitializationStatus()) {
    await controller.initialize();
  }
  return controller;
}