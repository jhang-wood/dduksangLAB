/**
 * 공통 유틸리티 함수들
 * 애플리케이션 전반에서 재사용되는 도우미 함수들
 */

// Simplified type and functions without external dependencies
type ClassValue = string | number | boolean | undefined | null | ClassValue[];

// Simple class concatenation function
function clsx(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ').trim();
}

// Simple Tailwind merge (basic version)
function twMerge(input: string): string {
  return input;
}

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * @param inputs 병합할 클래스 값들
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 디바운스 함수
 * @param func 디바운스할 함수
 * @param wait 대기 시간 (ms)
 * @returns 디바운스된 함수
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * 시간 지연 함수
 * @param ms 대기할 시간 (ms)
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 배열 청크 분할
 * @param array 분할할 배열
 * @param size 청크 크기
 * @returns 분할된 배열들의 배열
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * 객체 깊은 복사
 * @param obj 복사할 객체
 * @returns 복사된 객체
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned: Record<string, unknown> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return cloned as T;
  }

  return obj;
}

/**
 * 날짜 포맷팅
 * @param date 날짜 객체 또는 문자열
 * @param format 포맷 옵션
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'datetime' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  let options: Intl.DateTimeFormatOptions;

  switch (format) {
    case 'short':
      options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      break;
    case 'long':
      options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      };
      break;
    case 'datetime':
      options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      break;
    default:
      options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
  }

  return dateObj.toLocaleDateString('ko-KR', options);
}

/**
 * 상대 시간 표시
 * @param date 날짜 객체 또는 문자열
 * @returns 상대 시간 문자열
 */
export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  return formatDate(dateObj, 'short');
}

/**
 * URL slug 생성
 * @param text 변환할 텍스트
 * @returns slug 문자열
 */
export function generateSlug(text: string, maxLength: number = 100): string {
  // 한글을 영문 키워드로 변환하는 맵핑
  const koreanToEnglish: Record<string, string> = {
    // AI 관련
    '인공지능': 'artificial-intelligence',
    '머신러닝': 'machine-learning',
    '딥러닝': 'deep-learning',
    '자동화': 'automation',
    '로봇': 'robot',
    '챗봇': 'chatbot',
    '생성형': 'generative',
    // 기업/제품명
    '오픈에이아이': 'openai',
    '앤트로픽': 'anthropic',
    '구글': 'google',
    '마이크로소프트': 'microsoft',
    '메타': 'meta',
    '테슬라': 'tesla',
    'claude': 'claude',
    'chatgpt': 'chatgpt',
    'gpt': 'gpt',
    // 기술 용어
    '혁신': 'innovation',
    '기술': 'technology',
    '서비스': 'service',
    '플랫폼': 'platform',
    '솔루션': 'solution',
    '개발': 'development',
    '분석': 'analysis',
    '예측': 'prediction',
    '최적화': 'optimization',
    '효율성': 'efficiency',
    // 산업 분야
    '금융': 'finance',
    '의료': 'healthcare',
    '교육': 'education',
    '제조': 'manufacturing',
    '유통': 'retail',
    '물류': 'logistics',
    '마케팅': 'marketing',
    // 일반 용어
    '비즈니스': 'business',
    '전략': 'strategy',
    '미래': 'future',
    '트렌드': 'trend',
    '시장': 'market',
    '산업': 'industry',
    '회사': 'company',
    '기업': 'enterprise',
    '스타트업': 'startup',
    '투자': 'investment',
    '성장': 'growth',
    '성과': 'performance',
    '수익': 'revenue',
    '이익': 'profit',
    '고객': 'customer',
    '사용자': 'user',
    '데이터': 'data',
    '보안': 'security',
    '프라이버시': 'privacy',
    // 일반 단어
    '새로운': 'new',
    '최신': 'latest',
    '완전': 'complete',
    '전체': 'all',
    '위한': 'for',
    '활용': 'using',
    '방법': 'method',
    '가이드': 'guide'
  };

  let slug = text.toLowerCase().trim();
  
  // 한글 단어를 영문으로 변환
  Object.entries(koreanToEnglish).forEach(([korean, english]) => {
    const regex = new RegExp(korean, 'g');
    slug = slug.replace(regex, english);
  });
  
  // 남은 한글과 특수문자 제거, 영문/숫자/공백/하이픈만 유지
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  
  // 공백을 하이픈으로 변경
  slug = slug.replace(/\s+/g, '-');
  
  // 연속된 하이픈 제거
  slug = slug.replace(/-+/g, '-');
  
  // 앞뒤 하이픈 제거
  slug = slug.replace(/^-|-$/g, '');
  
  // 길이 제한
  if (slug.length > maxLength) {
    // 하이픈으로 잘라서 완전한 단어 유지
    slug = slug.substring(0, maxLength);
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > maxLength * 0.7) {
      slug = slug.substring(0, lastHyphen);
    }
  }
  
  // 빈 문자열인 경우 기본값 반환
  if (!slug) {
    slug = 'ai-trend-' + Date.now();
  }
  
  return slug;
}

/**
 * 중복 방지를 위한 고유 slug 생성
 * @param baseSlug 기본 slug
 * @param existingSlugs 기존 slug 목록
 * @returns 고유한 slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let uniqueSlug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

/**
 * URL 안전성 검증
 * @param slug 검증할 slug
 * @returns 유효성 여부
 */
export function validateSlug(slug: string): boolean {
  // 영문, 숫자, 하이픈만 허용, 3-100자 제한
  const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
}

/**
 * 안전한 slug 정리
 * @param slug 정리할 slug
 * @returns 정리된 slug
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // 영문, 숫자, 하이픈만 유지
    .replace(/-+/g, '-') // 연속 하이픈 제거
    .replace(/^-|-$/g, '') // 시작/끝 하이픈 제거
    .substring(0, 100); // 길이 제한
}

/**
 * 숫자 포맷팅 (세 자리마다 쉼표)
 * @param num 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 바이트 크기 포맷팅
 * @param bytes 바이트 크기
 * @returns 포맷팅된 문자열 (KB, MB, GB 등)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * 랜덤 ID 생성
 * @param length ID 길이
 * @returns 랜덤 ID 문자열
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 이메일 유효성 검사
 * @param email 검사할 이메일
 * @returns 유효성 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 객체에서 빈 값 제거
 * @param obj 정리할 객체
 * @returns 빈 값이 제거된 객체
 */
export function removeEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      (result as any)[key] = value;
    }
  }

  return result;
}

/**
 * URL 처리 에러
 * @param error 에러 객체
 * @returns 사용자 친화적 에러 메시지
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return '알 수 없는 에러가 발생했습니다.';
}
