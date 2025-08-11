import crypto from 'crypto';

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
