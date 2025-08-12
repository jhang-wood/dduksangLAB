/**
 * 서버사이드 렌더링 환경을 위한 필수 polyfill
 * self is not defined 에러를 해결하기 위해 전역에서 먼저 로드됨
 */

// Node.js 환경에서 self 전역 객체 정의
if (typeof global !== 'undefined' && typeof self === 'undefined') {
  global.self = global;
}

// globalThis가 있으면 사용
if (typeof globalThis !== 'undefined' && typeof self === 'undefined') {
  globalThis.self = globalThis;
}

module.exports = {};