/**
 * Jest 테스트 설정 - dduksangLAB
 * Next.js와 TypeScript 환경에 최적화됨
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 Jest에서 next.config.js와 .env 파일을 로드할 수 있도록 합니다
  dir: './'
});

// Jest에 전달할 사용자 정의 설정 옵션
const customJestConfig = {
  // 추가 설정 옵션을 여기에 추가하세요
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 테스트 환경 설정
  testEnvironment: 'jsdom',
  
  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.{js,ts,tsx}',
    '**/*.(test|spec).{js,ts,tsx}'
  ],
  
  // 무시할 파일/디렉토리 패턴
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/logs/',
    '<rootDir>/test-results/',
    '<rootDir>/playwright-report/'
  ],
  
  // 모듈 맵핑 (정적 자산 처리)
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    // CSS/SCSS 모듈 모킹
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // 환경 변수 설정
  setupFiles: ['<rootDir>/jest.env.js'],
  
  // 커버리지 설정
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.{js,ts,tsx}',
    'components/**/*.{js,ts,tsx}',
    'app/**/*.{js,ts,tsx}',
    'utils/**/*.{js,ts,tsx}',
    'hooks/**/*.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/logs/**',
    '!**/.eslintrc.js',
    '!**/jest.*.js',
    '!**/playwright.config.ts'
  ],
  
  // 커버리지 리포터
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json-summary'
  ],
  
  // 커버리지 디렉토리
  coverageDirectory: 'coverage',
  
  // 커버리지 임계값
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70
    }
  },
  
  // 트랜스포머 설정 (Next.js에서 자동으로 처리되지만 명시적으로 설정)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  
  // 타임아웃 설정
  testTimeout: 10000,
  
  // 병렬 실행 설정
  maxWorkers: '50%',
  
  // Verbose 출력
  verbose: true
};

// createJestConfig은 next/jest에서 비동기이므로 export 전에 기다려야 합니다
module.exports = createJestConfig(customJestConfig);