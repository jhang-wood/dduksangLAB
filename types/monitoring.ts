/**
 * 모니터링 및 에러 핸들링 타입 정의
 */

// 에러 심각도 레벨
export enum ErrorSeverity {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// 시스템 상태
export enum SystemStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  DOWN = 'down',
}

// 서비스 타입
export enum ServiceType {
  PLAYWRIGHT = 'playwright',
  SUPABASE = 'supabase',
  AI_API = 'ai_api',
  SYSTEM = 'system',
  NETWORK = 'network',
  BLOG = 'blog',
}

// 에러 타입
export interface SystemError {
  id: string;
  timestamp: Date;
  severity: ErrorSeverity;
  service: ServiceType;
  message: string;
  details?: Record<string, any>;
  stackTrace?: string;
  context?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    metadata?: Record<string, any>;
  };
  resolved: boolean;
  resolvedAt?: Date;
  recoveryAction?: string;
}

// 성능 메트릭
export interface PerformanceMetric {
  id: string;
  timestamp: Date;
  service: ServiceType;
  metric: string;
  value: number;
  unit: string;
  threshold?: number;
  status: 'normal' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}
// 시스템 건강상태
export interface HealthCheck {
  service: ServiceType;
  status: SystemStatus;
  timestamp: Date;
  responseTime: number;
  message?: string;
  metrics?: {
    cpu?: number;
    memory?: number;
    disk?: number;
    network?: number;
  };
  dependencies?: HealthCheck[];
}

// 알림 채널
export enum NotificationChannel {
  TELEGRAM = 'telegram',
  EMAIL = 'email',
  TELEGRAM_ALTERNATIVE = 'telegram_alternative',
  WEBHOOK = 'webhook',
  DASHBOARD = 'dashboard',
}

// 알림 메시지
export interface NotificationMessage {
  id: string;
  timestamp: Date;
  severity: ErrorSeverity;
  title: string;
  message: string;
  service: ServiceType;
  metadata?: Record<string, any>;
  channels: NotificationChannel[];
  sent: boolean;
  sentAt?: Date;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

// 복구 액션
export interface RecoveryAction {
  id: string;
  errorId: string;
  action: 'retry' | 'restart' | 'rollback' | 'manual' | 'ignore';
  automated: boolean;
  timestamp: Date;
  status: 'pending' | 'running' | 'success' | 'failed';
  attempts: number;
  maxAttempts: number;
  result?: string;
  nextAttempt?: Date;
}

// 모니터링 설정
export interface MonitoringConfig {
  enabled: boolean;
  interval: number;
  thresholds: {
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
  notifications: {
    [key in NotificationChannel]?: {
      enabled: boolean;
      config: Record<string, any>;
      rateLimiting: {
        maxPerMinute: number;
        maxPerHour: number;
      };
    };
  };
  recovery: {
    autoRecovery: boolean;
    maxRetries: number;
    retryDelay: number;
    escalationDelay: number;
  };
}

// 대시보드 데이터
export interface DashboardData {
  overview: {
    systemStatus: SystemStatus;
    activeAlerts: number;
    resolvedToday: number;
    uptime: number;
  };
  services: HealthCheck[];
  recentErrors: SystemError[];
  performanceMetrics: PerformanceMetric[];
  notifications: NotificationMessage[];
  recoveryActions: RecoveryAction[];
}

// 진단 결과
export interface DiagnosticResult {
  service: ServiceType;
  timestamp: Date;
  checks: {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
    details?: Record<string, any>;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
    automated: boolean;
  }[];
  score: number;
}

// 알림 템플릿
export interface NotificationTemplate {
  severity: ErrorSeverity;
  service: ServiceType;
  title: string;
  message: string;
  emoji?: string;
  actions?: {
    label: string;
    action: string;
  }[];
}

// 모니터링 이벤트
export interface MonitoringEvent {
  id: string;
  timestamp: Date;
  type: 'error' | 'recovery' | 'threshold' | 'status_change';
  service: ServiceType;
  data: Record<string, any>;
  processed: boolean;
  processedAt?: Date;
}
