import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// 환경 변수 로드
config({ path: '.env.local' });

/**
 * Playwright 테스트 설정
 * 2025년 최신 베스트 프랙티스 적용
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.{test,spec}.{js,ts}',
  
  // 테스트 실행 설정
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // 리포터 설정
  reporter: [
    ['html', { 
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'on-failure'
    }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],
  
  // 테스트 결과 디렉토리
  outputDir: 'test-results/',
  
  // 전역 설정
  use: {
    // 기본 URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // 브라우저 설정
    headless: !!process.env.CI,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // 스크린샷 및 비디오
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: {
      mode: 'retain-on-failure',
      size: { width: 640, height: 480 }
    },
    trace: 'retain-on-failure',
    
    // 네트워크 및 대기 설정
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    
    // 접근성 테스트를 위한 설정
    contextOptions: {
      reducedMotion: 'reduce'
    }
  },

  // 프로젝트별 브라우저 설정
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // 한국어 로케일 설정
        locale: 'ko-KR',
        timezoneId: 'Asia/Seoul'
      },
    },
    
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'ko-KR',
        timezoneId: 'Asia/Seoul'
      },
    },
    
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        locale: 'ko-KR',
        timezoneId: 'Asia/Seoul'
      },
    },

    // 모바일 테스트
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 7'],
        locale: 'ko-KR',
        timezoneId: 'Asia/Seoul'
      },
    },
    
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 14 Pro'],
        locale: 'ko-KR',
        timezoneId: 'Asia/Seoul'
      },
    },

    // 태블릿 테스트
    {
      name: 'iPad',
      use: { 
        ...devices['iPad Pro'],
        locale: 'ko-KR',
        timezoneId: 'Asia/Seoul'
      },
    },

    // 고해상도 테스트
    {
      name: 'Desktop Chrome 4K',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 3840, height: 2160 },
        deviceScaleFactor: 2,
        locale: 'ko-KR',
        timezoneId: 'Asia/Seoul'
      },
    },

    // 저사양 환경 테스트
    {
      name: 'Slow Network',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          offline: false,
          // 느린 3G 네트워크 시뮬레이션
        }
      },
    }
  ],

  // 웹 서버 설정 (개발 서버 자동 시작)
  webServer: {
    command: process.env.CI ? 'npm run build && npm start' : 'npm run dev',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe'
  },

  // 테스트 실행 제한
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    // 시각적 회귀 테스트 임계값
    toHaveScreenshot: {
      threshold: 0.2,
      maxDiffPixels: 1000,
      animations: 'disabled'
    },
    toMatchSnapshot: {
      threshold: 0.2,
      maxDiffPixels: 1000
    }
  },

  // 글로벌 설정
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  // 메타데이터 (Argos CI 연동을 위한 설정)
  metadata: {
    project: 'dduksangLAB',
    environment: process.env.NODE_ENV || 'test',
    version: process.env.npm_package_version || '1.0.0',
    // Argos CI 스크린샷 업로드를 위한 설정
    argos: {
      token: process.env.ARGOS_TOKEN,
      parallel: true,
      uploadTimeout: 120_000
    }
  }
});