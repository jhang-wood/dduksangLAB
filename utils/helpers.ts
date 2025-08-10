/**
 * 공통 유틸리티 함수들
 * 애플리케이션 전반에서 재사용되는 도우미 함수들
 */

// Simplified type and functions without external dependencies
type ClassValue = string | number | boolean | undefined | null | ClassValue[]

// Simple class concatenation function
function clsx(...inputs: ClassValue[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim()
}

// Simple Tailwind merge (basic version)
function twMerge(input: string): string {
  return input
}

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * @param inputs 병합할 클래스 값들
 * @returns 병합된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 시간 지연 함수
 * @param ms 대기할 시간 (ms)
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 배열 청크 분할
 * @param array 분할할 배열
 * @param size 청크 크기
 * @returns 분할된 배열들의 배열
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * 객체 깊은 복사
 * @param obj 복사할 객체
 * @returns 복사된 객체
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const cloned: Record<string, unknown> = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone((obj as Record<string, unknown>)[key])
      }
    }
    return cloned as T
  }
  
  return obj
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
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  let options: Intl.DateTimeFormatOptions
  
  switch (format) {
    case 'short':
      options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }
      break
    case 'long':
      options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }
      break
    case 'datetime':
      options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
      break
    default:
      options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }
  }
  
  return dateObj.toLocaleDateString('ko-KR', options)
}

/**
 * 상대 시간 표시
 * @param date 날짜 객체 또는 문자열
 * @returns 상대 시간 문자열
 */
export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '방금 전'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}일 전`
  }
  
  return formatDate(dateObj, 'short')
}

/**
 * URL slug 생성
 * @param text 변환할 텍스트
 * @returns slug 문자열
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s가-힣-]/g, '') // 한글, 영문, 숫자, 공백만 유지
    .replace(/\s+/g, '-') // 공백을 하이펰으로 변경
    .replace(/-+/g, '-') // 연속된 하이펰 제거
    .replace(/^-|-$/g, '') // 앞뒤 하이펰 제거
}

/**
 * 숫자 포맷팅 (세 자리마다 쉼표)
 * @param num 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR')
}

/**
 * 바이트 크기 포맷팅
 * @param bytes 바이트 크기
 * @returns 포맷팅된 문자열 (KB, MB, GB 등)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {return '0 B'}
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * 랜덤 ID 생성
 * @param length ID 길이
 * @returns 랜덤 ID 문자열
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

/**
 * 이메일 유효성 검사
 * @param email 검사할 이메일
 * @returns 유효성 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 객체에서 빈 값 제거
 * @param obj 정리할 객체
 * @returns 빈 값이 제거된 객체
 */
export function removeEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      (result as any)[key] = value
    }
  }
  
  return result
}

/**
 * URL 처리 에러
 * @param error 에러 객체
 * @returns 사용자 친화적 에러 메시지
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  return '알 수 없는 에러가 발생했습니다.'
}