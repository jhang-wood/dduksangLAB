/**
 * Logger utility for development and production environments
 * 개발: 모든 로그 표시
 * 프로덕션: 에러와 경고만 표시
 */
/* eslint-disable @typescript-eslint/no-explicit-any, no-alert */

// 프로덕션 환경을 위한 로그 수집 시스템 (추후 Sentry, LogRocket 등으로 교체)
const productionLogger = {
  log: (..._args: any[]) => {
    // 프로덕션에서는 로그를 수집 시스템으로 전송
    // 현재는 무시
  },
  error: (..._args: any[]) => {
    // 프로덕션에서는 에러 추적 시스템으로 전송
    // 추후 Sentry.captureException() 등으로 교체
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // 브라우저 환경에서만 에러 수집
      // TODO: 에러 추적 서비스 통합
    }
  },
  warn: (..._args: any[]) => {
    // 프로덕션에서는 경고를 모니터링 시스템으로 전송
    // 추후 구현 필요
  },
  info: (..._args: any[]) => {
    // 프로덕션에서는 정보성 로그 무시
  },
  debug: (..._args: any[]) => {
    // 프로덕션에서는 디버그 로그 무시
  }
}

// 개발 환경을 위한 console 래퍼
const developmentLogger = {
  // eslint-disable-next-line no-console
  log: process.env.NODE_ENV === 'development' ? console.log.bind(console) : () => {},
  // eslint-disable-next-line no-console
  error: console.error.bind(console),
  // eslint-disable-next-line no-console
  warn: console.warn.bind(console),
  // eslint-disable-next-line no-console
  info: console.info.bind(console),
  // eslint-disable-next-line no-console
  debug: console.debug.bind(console)
}

export const logger = process.env.NODE_ENV === 'development' 
  ? developmentLogger 
  : productionLogger

/**
 * 사용자 알림 유틸리티
 * 개발: 브라우저 alert 표시
 * 프로덕션: 커스텀 처리를 위한 인터페이스
 */
export const userNotification = {
  alert: (message: string): void => {
    if (process.env.NODE_ENV === 'development') {
      alert(message)
    } else {
      // 프로덕션에서는 Toast 알림이나 모달 사용 권장
      // TODO: Toast 알림 라이브러리 통합 (예: react-toastify)
      if (typeof window !== 'undefined') {
        // 임시: localStorage에 알림 저장
        const notifications = JSON.parse(localStorage.getItem('notifications') ?? '[]')
        notifications.push({ message, timestamp: Date.now(), type: 'alert' })
        localStorage.setItem('notifications', JSON.stringify(notifications))
      }
    }
  },
  confirm: (message: string): boolean => {
    if (process.env.NODE_ENV === 'development') {
      return confirm(message)
    } else {
      // 프로덕션에서는 커스텀 모달 사용 권장
      // TODO: 확인 모달 컴포넌트 통합
      // 현재는 사용자 안전을 위해 기본값 false 반환
      return false
    }
  }
}