/**
 * 개선된 Logger 시스템 - 서버/클라이언트 호환 로깅
 * 개발: 콘솔 로그
 * 프로덕션: 콘솔 로그 + 외부 서비스 (예: Sentry)
 */
/* eslint-disable @typescript-eslint/no-explicit-any, no-alert */

// 서버 사이드에서만 파일 로깅을 위한 동적 import
let fs: any = null;
let path: any = null;
let LOG_DIR: string | null = null;

// 서버 사이드에서만 파일 시스템 모듈 로드
if (typeof window === 'undefined') {
  try {
    fs = require('fs');
    path = require('path');
    LOG_DIR = path.join(process.cwd(), 'logs');
    
    // 로그 디렉토리가 없으면 생성
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  } catch (error) {
    console.warn('파일 시스템 모듈 로드 실패 (서버 사이드에서만 필요):', error);
  }
}

// 파일 로그 작성 헬퍼 (서버 사이드 전용)
const writeToFile = (filename: string, level: string, message: string, ...args: any[]) => {
  // 클라이언트 사이드이거나 파일 시스템이 불가능한 경우 스킵
  if (typeof window !== 'undefined' || !fs || !path || !LOG_DIR) return;
  
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      data: args.length > 0 ? args : undefined,
      pid: process.pid
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    const logPath = path.join(LOG_DIR, filename);
    
    fs.appendFileSync(logPath, logLine);
    
    // 로그 파일 크기 관리 (10MB 초과 시 로테이션)
    const stats = fs.statSync(logPath);
    if (stats.size > 10 * 1024 * 1024) {
      const rotatedPath = `${logPath}.${Date.now()}`;
      fs.renameSync(logPath, rotatedPath);
    }
  } catch (error) {
    console.error('파일 로그 작성 실패:', error);
  }
};

// 개선된 로거 구현
const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    log: (...args: any[]) => {
      if (isDevelopment) console.log(...args);
      writeToFile('app.log', 'info', String(args[0]), ...args.slice(1));
    },
    
    error: (...args: any[]) => {
      console.error(...args); // 에러는 항상 콘솔에 출력
      writeToFile('error.log', 'error', String(args[0]), ...args.slice(1));
      
      if (isProduction && typeof window !== 'undefined') {
        // 프로덕션 브라우저 환경에서 에러 수집
        // TODO: Sentry.captureException() 등으로 교체
      }
    },
    
    warn: (...args: any[]) => {
      if (isDevelopment) console.warn(...args);
      writeToFile('app.log', 'warn', String(args[0]), ...args.slice(1));
    },
    
    info: (...args: any[]) => {
      if (isDevelopment) console.info(...args);
      writeToFile('app.log', 'info', String(args[0]), ...args.slice(1));
    },
    
    debug: (...args: any[]) => {
      if (isDevelopment) console.debug(...args);
      // 프로덕션에서는 디버그 로그를 파일에 저장하지 않음
      if (isDevelopment) {
        writeToFile('debug.log', 'debug', String(args[0]), ...args.slice(1));
      }
    },
    
    // 새로운 로그 메서드들
    performance: (operation: string, duration: number, metadata?: any) => {
      const logData = { operation, duration, ...metadata };
      writeToFile('performance.log', 'perf', `${operation} completed in ${duration}ms`, logData);
      if (isDevelopment) console.log(`⚡ Performance: ${operation} (${duration}ms)`, logData);
    },
    
    audit: (action: string, user: string, resource: string, metadata?: any) => {
      const logData = { action, user, resource, ...metadata };
      writeToFile('audit.log', 'audit', `${user} performed ${action} on ${resource}`, logData);
      if (isDevelopment) console.log(`🔍 Audit: ${action}`, logData);
    }
  };
};

export const logger = createLogger();

/**
 * 사용자 알림 유틸리티
 * 개발: 브라우저 alert 표시
 * 프로덕션: 커스텀 처리를 위한 인터페이스
 */
export const userNotification = {
  alert: (message: string): void => {
    if (process.env.NODE_ENV === 'development') {
      alert(message);
    } else {
      // 프로덕션에서는 Toast 알림이나 모달 사용 권장
      // TODO: Toast 알림 라이브러리 통합 (예: react-toastify)
      if (typeof window !== 'undefined') {
        // 임시: localStorage에 알림 저장
        const notifications = JSON.parse(localStorage.getItem('notifications') ?? '[]');
        notifications.push({ message, timestamp: Date.now(), type: 'alert' });
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
    }
  },
  confirm: (message: string): boolean => {
    if (process.env.NODE_ENV === 'development') {
      return confirm(message);
    } else {
      // 프로덕션에서는 커스텀 모달 사용 권장
      // TODO: 확인 모달 컴포넌트 통합
      // 현재는 사용자 안전을 위해 기본값 false 반환
      return false;
    }
  },
};
