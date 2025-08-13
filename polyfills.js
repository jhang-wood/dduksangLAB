/**
 * Unified polyfills for Next.js server-side rendering
 * 통합된 polyfill: self is not defined 에러 해결
 */

// Node.js 환경에서 self 전역 객체 정의
if (typeof self === 'undefined') {
  if (typeof globalThis !== 'undefined') {
    globalThis.self = globalThis;
  } else if (typeof global !== 'undefined') {
    global.self = global;
  } else if (typeof window !== 'undefined') {
    global.self = window;
  }
}