import crypto from 'crypto';

/**
 * 안전한 난수 생성 - 브라우저/Node.js 양 환경 호환
 * @param length 난수 길이
 * @returns 안전한 난수 문자열
 */
export function generateSecureRandom(length: number = 32): string {
  if (typeof window !== 'undefined') {
    // 브라우저 환경
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js 환경
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }
}