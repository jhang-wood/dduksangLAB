/**
 * PlaywrightMCP 브라우저 자동화 컨트롤러
 * dduksangLAB의 관리자 로그인, 콘텐츠 게시 등을 자동화
 */

import { Browser, Page, chromium, firefox, webkit } from '@playwright/test';
import { logger } from '@/lib/logger';

export interface BrowserConfig {
  headless?: boolean;
  viewport?: { width: number; height: number };
  userAgent?: string;
  locale?: string;
  timeout?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  adminUrl?: string;
}

export interface ContentPublishOptions {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  publishDate?: Date;
  featured?: boolean;
}

/**
 * PlaywrightMCP 브라우저 자동화 컨트롤러 클래스
 */
export class PlaywrightController {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: BrowserConfig;

  constructor(config: BrowserConfig = {}) {
    this.config = {
      headless: true,
      viewport: { width: 1920, height: 1080 },
      locale: 'ko-KR',
      timeout: 30000,
      ...config,
    };
  }

  /**
   * 브라우저 초기화
   */
  async initialize(browserType: 'chromium' | 'firefox' | 'webkit' = 'chromium'): Promise<void> {
    try {
      logger.info('브라우저 초기화 시작', { browserType });

      const browserEngine =
        browserType === 'chromium' ? chromium : browserType === 'firefox' ? firefox : webkit;

      this.browser = await browserEngine.launch({
        headless: this.config.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      this.page = await this.browser.newPage({
        viewport: this.config.viewport,
        locale: this.config.locale,
        userAgent: this.config.userAgent,
      });

      // 기본 타임아웃 설정
      this.page.setDefaultTimeout(this.config.timeout!);

      logger.info('브라우저 초기화 완료');
    } catch (error) {
      logger.error('브라우저 초기화 실패', { error });
      throw new Error(`브라우저 초기화 실패: ${error}`);
    }
  }

  /**
   * dduksangLAB 관리자 로그인
   */
  async loginToAdmin(credentials: LoginCredentials): Promise<boolean> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      logger.info('관리자 로그인 시작', { email: credentials.email });

      const loginUrl = credentials.adminUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`;
      await this.page.goto(loginUrl);

      // 로그인 폼 요소 대기 및 입력
      await this.page.waitForSelector('input[type="email"], input[name="email"]');
      await this.page.fill('input[type="email"], input[name="email"]', credentials.email);

      await this.page.waitForSelector('input[type="password"], input[name="password"]');
      await this.page.fill('input[type="password"], input[name="password"]', credentials.password);

      // 로그인 버튼 클릭
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle' }),
        this.page.click(
          'button[type="submit"], button:has-text("로그인"), button:has-text("Login")'
        ),
      ]);

      // 로그인 성공 확인
      const isLoggedIn =
        this.page.url().includes('/dashboard') ||
        this.page.url().includes('/admin') ||
        (await this.page
          .locator('[data-testid="user-menu"]')
          .isVisible({ timeout: 5000 })
          .catch(() => false));

      if (isLoggedIn) {
        logger.info('관리자 로그인 성공');
        return true;
      } else {
        logger.error('관리자 로그인 실패 - 로그인 후 페이지 확인 실패');
        return false;
      }
    } catch (error) {
      logger.error('관리자 로그인 중 오류 발생', { error });
      return false;
    }
  }

  /**
   * 콘텐츠 자동 게시
   */
  async publishContent(options: ContentPublishOptions): Promise<boolean> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      logger.info('콘텐츠 게시 시작', { title: options.title });

      // 콘텐츠 작성 페이지로 이동
      await this.page.goto(`${process.env.NEXT_PUBLIC_APP_URL}/community/write`);

      // 제목 입력
      await this.page.waitForSelector('input[name="title"], input[placeholder*="제목"]');
      await this.page.fill('input[name="title"], input[placeholder*="제목"]', options.title);

      // 내용 입력 - 다양한 에디터 형태 지원
      const contentSelectors = [
        'textarea[name="content"]',
        '.ql-editor', // Quill 에디터
        '.CodeMirror textarea', // CodeMirror
        '[contenteditable="true"]', // 일반 contenteditable
        'textarea[placeholder*="내용"]',
      ];

      let contentFilled = false;
      for (const selector of contentSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          if (selector.includes('contenteditable') || selector.includes('ql-editor')) {
            await this.page.locator(selector).fill(options.content);
          } else {
            await this.page.fill(selector, options.content);
          }
          contentFilled = true;
          break;
        } catch {
          continue;
        }
      }

      if (!contentFilled) {
        throw new Error('콘텐츠 입력 필드를 찾을 수 없습니다');
      }

      // 카테고리 설정
      if (options.category) {
        try {
          await this.page.selectOption('select[name="category"]', options.category);
        } catch {
          logger.warn('카테고리 설정 실패', { category: options.category });
        }
      }

      // 태그 입력
      if (options.tags && options.tags.length > 0) {
        try {
          const tagInput = this.page.locator('input[name="tags"], input[placeholder*="태그"]');
          await tagInput.fill(options.tags.join(', '));
        } catch {
          logger.warn('태그 입력 실패', { tags: options.tags });
        }
      }

      // 게시일 설정
      if (options.publishDate) {
        try {
          await this.page.fill(
            'input[type="datetime-local"], input[name="publishDate"]',
            options.publishDate.toISOString().slice(0, 16)
          );
        } catch {
          logger.warn('게시일 설정 실패');
        }
      }

      // 게시 버튼 클릭
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }),
        this.page.click('button[type="submit"], button:has-text("게시"), button:has-text("발행")'),
      ]);

      // 게시 성공 확인
      const currentUrl = this.page.url();
      const isPublished = currentUrl.includes('/community/') && !currentUrl.includes('/write');

      if (isPublished) {
        logger.info('콘텐츠 게시 성공', { url: currentUrl });
        return true;
      } else {
        logger.error('콘텐츠 게시 실패 - 게시 후 URL 확인 실패');
        return false;
      }
    } catch (error) {
      logger.error('콘텐츠 게시 중 오류 발생', { error });
      return false;
    }
  }

  /**
   * 스크린샷 캡처
   */
  async captureScreenshot(path: string, fullPage: boolean = false): Promise<void> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.screenshot({
        path,
        fullPage,
        type: 'png',
      });
      logger.info('스크린샷 캡처 완료', { path });
    } catch (error) {
      logger.error('스크린샷 캡처 실패', { error, path });
      throw error;
    }
  }

  /**
   * 페이지 성능 메트릭 수집
   */
  async getPerformanceMetrics(): Promise<any> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      const metrics = await this.page.evaluate(() => {
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;
        return {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime ?? 0,
          firstContentfulPaint:
            performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0,
          timestamp: new Date().toISOString(),
        };
      });

      logger.info('성능 메트릭 수집 완료', metrics);
      return metrics;
    } catch (error) {
      logger.error('성능 메트릭 수집 실패', { error });
      return null;
    }
  }

  /**
   * 페이지 이동
   */
  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      logger.info('페이지 이동 완료', { url });
    } catch (error) {
      logger.error('페이지 이동 실패', { error, url });
      throw error;
    }
  }

  /**
   * 요소 대기 및 상호작용
   */
  async waitAndClick(selector: string, timeout?: number): Promise<void> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.waitForSelector(selector, { timeout: timeout ?? this.config.timeout });
      await this.page.click(selector);
    } catch (error) {
      logger.error('요소 클릭 실패', { error, selector });
      throw error;
    }
  }

  /**
   * 텍스트 입력
   */
  async waitAndFill(selector: string, text: string, timeout?: number): Promise<void> {
    if (!this.page) {
      throw new Error('브라우저가 초기화되지 않았습니다');
    }

    try {
      await this.page.waitForSelector(selector, { timeout: timeout ?? this.config.timeout });
      await this.page.fill(selector, text);
    } catch (error) {
      logger.error('텍스트 입력 실패', { error, selector });
      throw error;
    }
  }

  /**
   * 브라우저 정리
   */
  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      logger.info('브라우저 정리 완료');
    } catch (error) {
      logger.error('브라우저 정리 중 오류 발생', { error });
    }
  }

  /**
   * 현재 페이지 상태 확인
   */
  isInitialized(): boolean {
    return this.browser !== null && this.page !== null;
  }

  /**
   * 현재 URL 반환
   */
  async getCurrentUrl(): Promise<string | null> {
    if (!this.page) {
      return null;
    }
    return this.page.url();
  }

  /**
   * 페이지 제목 반환
   */
  async getPageTitle(): Promise<string | null> {
    if (!this.page) {
      return null;
    }
    return await this.page.title();
  }
}

// 싱글톤 인스턴스
let playwrightController: PlaywrightController | null = null;

/**
 * PlaywrightController 싱글톤 인스턴스 반환
 */
export function getPlaywrightController(config?: BrowserConfig): PlaywrightController {
  if (!playwrightController) {
    playwrightController = new PlaywrightController(config);
  }
  return playwrightController;
}

/**
 * 브라우저 정리 (앱 종료 시 호출)
 */
export async function cleanupPlaywright(): Promise<void> {
  if (playwrightController) {
    await playwrightController.cleanup();
    playwrightController = null;
  }
}
