/**
 * 전역 상수 정의
 * 애플리케이션 전반에서 사용되는 상수값들
 */

// 애플리케이션 기본 설정
export const APP_CONFIG = {
  NAME: 'dduksangLAB',
  DESCRIPTION: 'AI 트렌드 및 강의 플랫폼',
  VERSION: '1.0.0',
  AUTHOR: 'dduksangLAB Team'
} as const

// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  MIN_PAGE_SIZE: 5
} as const

// 캐시 설정
export const CACHE_TIMES = {
  SHORT: 1 * 60 * 1000, // 1분
  MEDIUM: 5 * 60 * 1000, // 5분
  LONG: 30 * 60 * 1000, // 30분
  VERY_LONG: 60 * 60 * 1000 // 1시간
} as const

// API 엔드포인트
export const API_ENDPOINTS = {
  AI_TRENDS: '/api/ai-trends',
  PAYMENT: '/api/payment',
  WEBHOOK: '/api/webhook',
  ADMIN: '/api/admin'
} as const

// 사용자 역할
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
} as const

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const

// 에러 메시지
export const ERROR_MESSAGES = {
  // 인증 에러
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 부족합니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 잘못되었습니다.',
  
  // 데이터 에러
  NOT_FOUND: '요청하신 데이터를 찾을 수 없습니다.',
  DUPLICATE_CONTENT: '이미 존재하는 컨텐츠입니다.',
  INVALID_INPUT: '입력값이 잘못되었습니다.',
  
  // 서버 에러
  INTERNAL_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
} as const

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CREATED: '성공적으로 생성되었습니다.',
  UPDATED: '성공적으로 수정되었습니다.',
  DELETED: '성공적으로 삭제되었습니다.',
  SAVED: '성공적으로 저장되었습니다.'
} as const

// 에니메이션 설정
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
} as const

// 브레이크포인트
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const

// 파일 업로드 제한
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ]
} as const

// Type definitions for constants
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]
export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]