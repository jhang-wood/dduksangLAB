/**
 * Polyfills for Next.js server-side rendering
 * 이 파일은 애플리케이션이 시작되기 전에 로드됩니다.
 */

// self가 정의되지 않은 서버 환경에서 글로벌 객체로 설정
if (typeof self === 'undefined') {
  if (typeof globalThis !== 'undefined') {
    global.self = globalThis;
  } else if (typeof global !== 'undefined') {
    global.self = global;
  } else if (typeof window !== 'undefined') {
    global.self = window;
  }
}