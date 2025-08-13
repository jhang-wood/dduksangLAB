/**
 * 보안 관련 유틸리티 함수들
 * XSS, SQL 인젝션, 입력 검증 등 보안 기능 제공
 */

import crypto from 'crypto';

/**
 * HTML 특수 문자 이스케이프 (XSS 방지)
 * @param text 이스케이프할 텍스트
 * @returns 이스케이프된 텍스트
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return text.replace(/[&<>"'/`=]/g, (s) => map[s]);
}

/**
 * 기본 HTML 태그 제거 (심플한 살균)
 * @param html 살균할 HTML 문자열
 * @returns 살균된 텍스트
 */
export function stripHtml(html: string): string {
  // 모든 HTML 태그 제거
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 안전한 HTML 살균 (허용된 태그만)
 * @param html 살균할 HTML 문자열
 * @returns 살균된 HTML 문자열
 */
export function sanitizeHtml(html: string): string {
  const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote'];
  const tagRegex = /<(\/?)([\w-]+)([^>]*)>/gi;
  
  return html.replace(tagRegex, (match, slash, tag, attrs) => {
    const tagName = tag.toLowerCase();
    
    if (allowedTags.includes(tagName)) {
      // 허용된 태그는 속성 제거하고 유지
      return `<${slash}${tagName}>`;
    }
    
    // 허용되지 않은 태그는 제거
    return '';
  });
}

/**
 * SQL 인젝션 위험 패턴 검사
 * @param input 검사할 입력값
 * @returns 위험 패턴 존재 여부
 */
export function hasSqlInjectionRisk(input: string): boolean {
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /('|('')|;|--|\/\*|\*\/)/i,
    /(INFORMATION_SCHEMA|SYSOBJECTS|SYSCOLUMNS)/i,
    /(\bOR\b.*=.*\bOR\b|\bAND\b.*=.*\bAND\b)/i,
    /(xp_|sp_)/i,
    /(0x[0-9a-f]+)/i
  ];
  
  return sqlInjectionPatterns.some(pattern => pattern.test(input));
}

/**
 * XSS 위험 패턴 검사
 * @param input 검사할 입력값
 * @returns 위험 패턴 존재 여부
 */
export function hasXssRisk(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe|<object|<embed|<form/gi,
    /eval\s*\(|setTimeout\s*\(|setInterval\s*\(/gi,
    /document\.cookie|document\.write/gi,
    /window\.location|location\.href/gi,
    /alert\s*\(|confirm\s*\(|prompt\s*\(/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * 안전한 입력값 검증
 * @param input 검사할 입력값
 * @param maxLength 최대 길이 (기본: 1000)
 * @returns 검증 결과 및 에러 메시지
 */
export function validateSecureInput(
  input: string, 
  maxLength: number = 1000
): { isValid: boolean; error?: string; sanitized?: string } {
  // null/undefined 체크
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      error: '입력값이 필요합니다.'
    };
  }
  
  // 길이 검증
  if (input.length > maxLength) {
    return {
      isValid: false,
      error: `입력값이 최대 허용 길이(${maxLength})를 초과했습니다.`
    };
  }
  
  // SQL 인젝션 위험 검사
  if (hasSqlInjectionRisk(input)) {
    return {
      isValid: false,
      error: '보안 위험이 감지된 입력값입니다. (SQL Injection)'
    };
  }
  
  // XSS 위험 검사
  if (hasXssRisk(input)) {
    return {
      isValid: false,
      error: '보안 위험이 감지된 입력값입니다. (XSS)'
    };
  }
  
  // 입력값 살균
  const sanitized = escapeHtml(input.trim());
  
  return {
    isValid: true,
    sanitized
  };
}

/**
 * 비밀번호 강도 검사
 * @param password 검사할 비밀번호
 * @returns 강도 점수 및 피드백
 */
export function validatePasswordStrength(password: string): {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  // 길이 검사
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('최소 8자 이상이어야 합니다.');
  }
  
  if (password.length >= 12) {
    score += 1;
  }
  
  // 대소문자 검사
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('소문자를 포함해야 합니다.');
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('대문자를 포함해야 합니다.');
  }
  
  // 숫자 검사
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('숫자를 포함해야 합니다.');
  }
  
  // 특수문자 검사
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('특수문자를 포함해야 합니다.');
  }
  
  // 연속된 문자 검사
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    feedback.push('연속된 같은 문자를 피해주세요.');
  }
  
  let strength: 'weak' | 'fair' | 'good' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'fair';
  } else if (score <= 6) {
    strength = 'good';
  } else {
    strength = 'strong';
  }
  
  return { score, strength, feedback };
}

/**
 * 안전한 난수 생성
 * @param length 난수 길이
 * @returns 안전한 난수 문자열
 */
export function generateSecureRandom(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * CSRF 토큰 생성
 * @returns CSRF 토큰
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * CSRF 토큰 검증
 * @param token 검증할 토큰
 * @param sessionToken 세션에 저장된 토큰
 * @returns 검증 결과
 */
export function verifyCsrfToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(sessionToken)
  );
}

/**
 * 이메일 주소 검증 (더 엄격한 버전)
 * @param email 검증할 이메일
 * @returns 검증 결과
 */
export function validateSecureEmail(email: string): { isValid: boolean; error?: string } {
  // null/undefined 체크
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: '이메일 주소가 필요합니다.' };
  }
  
  // 길이 제한
  if (email.length > 254) {
    return { isValid: false, error: '이메일 주소가 너무 깁니다.' };
  }
  
  // 기본 형식 검증
  const emailRegex = /^[a-zA-Z0-9.\!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '올바른 이메일 형식이 아닙니다.' };
  }
  
  // 악성 패턴 검사
  if (hasXssRisk(email) || hasSqlInjectionRisk(email)) {
    return { isValid: false, error: '보안 위험이 감지된 이메일 주소입니다.' };
  }
  
  return { isValid: true };
}

/**
 * URL 검증 및 살균
 * @param url 검증할 URL
 * @returns 검증 결과 및 살균된 URL
 */
export function validateSecureUrl(url: string): { isValid: boolean; error?: string; sanitized?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL이 필요합니다.' };
  }
  
  try {
    const parsedUrl = new URL(url);
    
    // 허용된 프로토콜만 허용
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return { isValid: false, error: '허용되지 않은 프로토콜입니다.' };
    }
    
    // 악성 패턴 검사
    if (hasXssRisk(url)) {
      return { isValid: false, error: '보안 위험이 감지된 URL입니다.' };
    }
    
    return { isValid: true, sanitized: parsedUrl.toString() };
  } catch (error) {
    return { isValid: false, error: '올바른 URL 형식이 아닙니다.' };
  }
}

/**
 * 파일 업로드 보안 검증
 * @param file 파일 정보
 * @param allowedTypes 허용된 MIME 타입들
 * @param maxSize 최대 파일 크기 (바이트)
 * @returns 검증 결과
 */
export function validateSecureFileUpload(
  file: { name: string; type: string; size: number },
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): { isValid: boolean; error?: string } {
  // 파일 존재 검사
  if (!file || !file.name || !file.type) {
    return { isValid: false, error: '파일 정보가 누락되었습니다.' };
  }
  
  // 파일 크기 검사
  if (file.size > maxSize) {
    return { isValid: false, error: '파일 크기가 제한을 초과했습니다.' };
  }
  
  // MIME 타입 검사
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: '허용되지 않은 파일 형식입니다.' };
  }
  
  // 파일 확장자 검사 (더블 확장자 공격 방지)
  const fileName = file.name.toLowerCase();
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.php'];
  
  if (dangerousExtensions.some(ext => fileName.includes(ext))) {
    return { isValid: false, error: '위험한 파일 확장자가 감지되었습니다.' };
  }
  
  return { isValid: true };
}

/**
 * IP 주소 검증
 * @param ip 검증할 IP 주소
 * @returns 검증 결과
 */
export function validateIpAddress(ip: string): { isValid: boolean; type?: 'ipv4' | 'ipv6'; error?: string } {
  if (!ip || typeof ip !== 'string') {
    return { isValid: false, error: 'IP 주소가 필요합니다.' };
  }
  
  // IPv4 검증
  const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/;
  if (ipv4Regex.test(ip)) {
    return { isValid: true, type: 'ipv4' };
  }
  
  // IPv6 검증
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  if (ipv6Regex.test(ip)) {
    return { isValid: true, type: 'ipv6' };
  }
  
  return { isValid: false, error: '올바른 IP 주소 형식이 아닙니다.' };
}
