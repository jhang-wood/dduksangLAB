/**
 * 공통 상수 정의
 * 프로젝트 전체에서 사용되는 상수들을 중앙 집중화하여 관리
 */

// AI 트렌드 카테고리
export const AI_TRENDS_CATEGORIES = [
  'AI/ML',
  '자동화',
  '데이터분석',
  '프롬프트엔지니어링',
  '노코드',
  '생산성도구',
] as const;

// 커뮤니티 카테고리
export const COMMUNITY_CATEGORIES = ['질문', '정보공유', '프로젝트', '스터디', '기타'] as const;

// 강의 카테고리
export const LECTURE_CATEGORIES = ['AI', '노코드', '자동화', '마케팅', '개발'] as const;

// 터미널 색상 코드 (스크립트용)
export const TERMINAL_COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
} as const;

// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

// 파일 업로드 제한
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

// API 응답 상태
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
  LOADING: 'loading',
} as const;

// 사용자 역할
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

// 애플리케이션 메타데이터
export const APP_METADATA = {
  TITLE: '떡상연구소',
  DESCRIPTION: 'AI와 노코드로 함께 성장하는 커뮤니티',
  URL: 'https://dduksang.com',
  KEYWORDS: ['AI', '노코드', '자동화', '프롬프트엔지니어링', '생산성'],
} as const;

// Type exports for TypeScript
export type AITrendsCategory = (typeof AI_TRENDS_CATEGORIES)[number];
export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number];
export type LectureCategory = (typeof LECTURE_CATEGORIES)[number];
export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
