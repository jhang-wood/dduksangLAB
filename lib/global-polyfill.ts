/**
 * Global polyfill for server-side rendering
 * Prevents "self is not defined" errors during Next.js build
 */

// 서버 사이드에서 글로벌 객체 정의
if (typeof globalThis === 'undefined') {
  // Node.js 환경
  if (typeof global !== 'undefined') {
    module.exports = global;
  }
  // 웹 워커 환경
  else if (typeof self !== 'undefined') {
    module.exports = self;
  }
  // 브라우저 환경
  else if (typeof window !== 'undefined') {
    module.exports = window;
  }
  // 기본 빈 객체
  else {
    module.exports = {};
  }
} else {
  module.exports = globalThis;
}

// self 객체가 없는 경우 글로벌 객체로 폴백
if (typeof self === 'undefined' && typeof global !== 'undefined') {
  (global as any).self = global;
}