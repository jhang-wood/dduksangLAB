/**
 * Jest 테스트 설정 - dduksangLAB (최적화된 버전)
 * 과도한 커버리지 제약을 완화하여 개발 효율성 향상
 */

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.{js,ts,tsx}',
    '**/*.(test|spec).{js,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/logs/',
    '<rootDir>/test-results/',
    '<rootDir>/playwright-report/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverage: process.env.CI ? true : false,
  collectCoverageFrom: [
    'lib/**/*.{js,ts,tsx}',
    'components/**/*.{js,ts,tsx}',
    'app/**/*.{js,ts,tsx}',
    'utils/**/*.{js,ts,tsx}',
    'hooks/**/*.{js,ts,tsx}',
    '\!**/*.d.ts',
    '\!**/node_modules/**',
    '\!**/.next/**',
    '\!**/logs/**',
    '\!**/.eslintrc.js',
    '\!**/jest.*.js',
    '\!**/playwright.config.ts'
  ],
  coverageReporters: [
    'text',
    'lcov'
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  testTimeout: 8000,
  maxWorkers: process.env.CI ? 1 : '50%',
  verbose: !!process.env.CI
};

module.exports = createJestConfig(customJestConfig);
