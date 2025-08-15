/**
 * 블로그 콘텐츠 자동 게시 서비스
 * AI 생성 콘텐츠를 dduksangLAB에 자동으로 게시
 */

import { logger } from '@/lib/logger';
import { getOrchestrator } from '@/lib/mcp/orchestrator';
import { LoginCredentials } from '@/lib/mcp/playwright-controller';
import { getSupabaseController } from '@/lib/mcp/supabase-controller';
import { ContentPublishOptions } from '@/lib/mcp/playwright-controller';
import { handleAutomationError } from '@/lib/mcp/error-handler';

export interface BlogPostData {
  id?: string;
  title: string;
  content: string;
  summary?: string;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  featured?: boolean;
  publishDate?: Date;
  authorId?: string;
  status?: 'draft' | 'scheduled' | 'published';
}

export interface PublishOptions {
  loginCredentials: LoginCredentials;
  validateContent?: boolean;
  schedulePublish?: boolean;
  notifyOnComplete?: boolean;
  captureScreenshot?: boolean;
}

export interface PublishResult {
  success: boolean;
  publishedId?: string;
  publishedUrl?: string;
  scheduledFor?: Date;
  error?: string;
  validationErrors?: string[];
  performanceMetrics?: any;
}

export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * 블로그 게시 자동화 서비스
 */
export class BlogPublisher {
  private defaultOptions: Partial<PublishOptions> = {
    validateContent: true,
    schedulePublish: false,
    notifyOnComplete: false,
    captureScreenshot: false,
  };

  constructor() {}

  /**
   * 단일 블로그 포스트 게시
   */
  async publishPost(postData: BlogPostData, options: PublishOptions): Promise<PublishResult> {
    const finalOptions = { ...this.defaultOptions, ...options };

    try {
      logger.info('블로그 포스트 게시 시작', {
        title: postData.title,
        category: postData.category,
      });

      // 1. 콘텐츠 검증
      if (finalOptions.validateContent) {
        const validation = await this.validateContent(postData);
        if (!validation.isValid) {
          return {
            success: false,
            error: '콘텐츠 검증 실패',
            validationErrors: validation.errors,
          };
        }

        if (validation.warnings.length > 0) {
          logger.warn('콘텐츠 검증 경고', {
            warnings: validation.warnings,
            title: postData.title,
          });
        }
      }

      // 2. 게시 일정 확인
      if (finalOptions.schedulePublish && postData.publishDate) {
        const now = new Date();
        if (postData.publishDate > now) {
          return await this.schedulePost(postData, options);
        }
      }

      // 3. 오케스트레이터를 통한 실제 게시
      const orchestrator = getOrchestrator({
        captureScreenshots: finalOptions.captureScreenshot,
        performanceMonitoring: true,
      });

      if (!orchestrator.isReady()) {
        await orchestrator.initialize();
      }

      const publishOptions: ContentPublishOptions = {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        publishDate: postData.publishDate,
        featured: postData.featured,
      };

      const result = await orchestrator.executePublishWorkflow(
        publishOptions,
        finalOptions.loginCredentials
      );

      if (!result.success) {
        throw new Error(result.error || '게시 실패');
      }

      // 4. 게시 완료 처리
      const publishResult: PublishResult = {
        success: true,
        publishedId: result.contentId,
        publishedUrl: result.publishedUrl,
        performanceMetrics: result.performanceMetrics,
      };

      // 5. 알림 발송 (옵션)
      if (finalOptions.notifyOnComplete) {
        await this.sendPublishNotification(postData, publishResult);
      }

      logger.info('블로그 포스트 게시 완료', {
        title: postData.title,
        publishedId: publishResult.publishedId,
        publishedUrl: publishResult.publishedUrl,
      });

      return publishResult;
    } catch (error) {
      logger.error('블로그 포스트 게시 실패', {
        error,
        title: postData.title,
      });

      await handleAutomationError(error as Error, {
        operation: 'blog_publish',
        component: 'automation',
        metadata: { title: postData.title },
      });

      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * 여러 블로그 포스트 일괄 게시
   */
  async publishBatch(
    posts: BlogPostData[],
    options: PublishOptions,
    batchOptions?: {
      delayBetweenPosts?: number;
      continueOnError?: boolean;
      maxConcurrent?: number;
    }
  ): Promise<PublishResult[]> {
    const defaultBatchOptions = {
      delayBetweenPosts: 5000,
      continueOnError: true,
      maxConcurrent: 1,
    };

    const finalBatchOptions = { ...defaultBatchOptions, ...batchOptions };
    const results: PublishResult[] = [];

    logger.info('일괄 블로그 게시 시작', {
      postsCount: posts.length,
      maxConcurrent: finalBatchOptions.maxConcurrent,
    });

    try {
      if (finalBatchOptions.maxConcurrent === 1) {
        // 순차 처리
        for (let i = 0; i < posts.length; i++) {
          const post = posts[i];

          try {
            const result = await this.publishPost(post, options);
            results.push(result);

            // 마지막 포스트가 아닌 경우 지연
            if (i < posts.length - 1 && finalBatchOptions.delayBetweenPosts > 0) {
              await this.delay(finalBatchOptions.delayBetweenPosts);
            }
          } catch (error) {
            const failResult: PublishResult = {
              success: false,
              error: (error as Error).message,
            };

            results.push(failResult);

            if (!finalBatchOptions.continueOnError) {
              break;
            }
          }
        }
      } else {
        // 병렬 처리 (제한적)
        const chunks = this.chunkArray(posts, finalBatchOptions.maxConcurrent);

        for (const chunk of chunks) {
          const chunkPromises = chunk.map(post =>
            this.publishPost(post, options).catch(
              error =>
                ({
                  success: false,
                  error: (error as Error).message,
                }) as PublishResult
            )
          );

          const chunkResults = await Promise.all(chunkPromises);
          results.push(...chunkResults);

          // 청크 간 지연
          if (finalBatchOptions.delayBetweenPosts > 0) {
            await this.delay(finalBatchOptions.delayBetweenPosts);
          }
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.length - successCount;

      logger.info('일괄 블로그 게시 완료', {
        total: posts.length,
        success: successCount,
        failed: failCount,
      });

      // 일괄 처리 결과 로깅
      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'publish',
        status: failCount === 0 ? 'success' : failCount === results.length ? 'failure' : 'warning',
        message: `일괄 게시 완료: ${successCount}/${posts.length} 성공`,
        metadata: {
          total_posts: posts.length,
          successful: successCount,
          failed: failCount,
          batch_options: finalBatchOptions,
        },
      });
    } catch (error) {
      logger.error('일괄 게시 중 치명적 오류', { error });

      await handleAutomationError(error as Error, {
        operation: 'blog_batch_publish',
        component: 'automation',
        metadata: { postsCount: posts.length },
      });
    }

    return results;
  }

  /**
   * 게시 예약
   */
  private async schedulePost(
    postData: BlogPostData,
    options: PublishOptions
  ): Promise<PublishResult> {
    try {
      logger.info('블로그 포스트 예약 등록', {
        title: postData.title,
        scheduledFor: postData.publishDate,
      });

      const supabaseController = getSupabaseController();

      // 예약된 포스트를 데이터베이스에 저장
      const contentId = await supabaseController.upsertContent({
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        status: 'scheduled',
        published_at: postData.publishDate?.toISOString(),
        author_id: postData.authorId,
        metadata: {
          seoTitle: postData.seoTitle,
          seoDescription: postData.seoDescription,
          seoKeywords: postData.seoKeywords,
          featured: postData.featured,
          automated: true,
          scheduled: true,
          original_schedule_date: postData.publishDate?.toISOString(),
        },
      });

      // 예약 로그 기록
      await supabaseController.logAutomation({
        type: 'publish',
        status: 'info',
        message: `블로그 포스트 예약: ${postData.title}`,
        metadata: {
          content_id: contentId,
          scheduled_for: postData.publishDate?.toISOString(),
          title: postData.title,
        },
      });

      return {
        success: true,
        publishedId: contentId || undefined,
        scheduledFor: postData.publishDate,
      };
    } catch (error) {
      logger.error('블로그 포스트 예약 실패', { error });
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * 콘텐츠 검증
   */
  private async validateContent(postData: BlogPostData): Promise<ContentValidationResult> {
    const result: ContentValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
    };

    // 필수 필드 검증
    if (!postData.title?.trim()) {
      result.errors.push('제목이 없습니다');
      result.isValid = false;
    }

    if (!postData.content?.trim()) {
      result.errors.push('본문 내용이 없습니다');
      result.isValid = false;
    }

    // 길이 검증
    if (postData.title && postData.title.length < 10) {
      result.warnings.push('제목이 너무 짧습니다 (권장: 10자 이상)');
    }

    if (postData.title && postData.title.length > 100) {
      result.errors.push('제목이 너무 깁니다 (최대: 100자)');
      result.isValid = false;
    }

    if (postData.content && postData.content.length < 300) {
      result.warnings.push('본문이 너무 짧습니다 (권장: 300자 이상)');
    }

    // SEO 검증
    if (!postData.seoTitle && postData.title) {
      result.suggestions.push('SEO 제목을 설정하면 검색 최적화에 도움됩니다');
    }

    if (!postData.seoDescription) {
      result.suggestions.push('SEO 설명을 추가하면 검색 노출에 도움됩니다');
    }

    // 태그 검증
    if (!postData.tags || postData.tags.length === 0) {
      result.warnings.push('태그가 설정되지 않았습니다');
    }

    if (postData.tags && postData.tags.length > 10) {
      result.warnings.push('태그가 너무 많습니다 (권장: 10개 이하)');
    }

    // 카테고리 검증
    if (!postData.category) {
      result.warnings.push('카테고리가 설정되지 않았습니다');
    }

    // HTML 콘텐츠 검증
    if (postData.content) {
      if (postData.content.includes('<script')) {
        result.errors.push('스크립트 태그는 보안상 허용되지 않습니다');
        result.isValid = false;
      }

      if (postData.content.includes('<iframe') && !postData.content.includes('youtube.com')) {
        result.warnings.push('iframe 태그 사용 시 보안에 주의하세요');
      }
    }

    logger.info('콘텐츠 검증 완료', {
      title: postData.title,
      isValid: result.isValid,
      errorsCount: result.errors.length,
      warningsCount: result.warnings.length,
    });

    return result;
  }

  /**
   * 게시 완료 알림 발송
   */
  private async sendPublishNotification(
    postData: BlogPostData,
    result: PublishResult
  ): Promise<void> {
    try {
      // TODO: 게시 완료 알림 시스템 통합
      // 이메일 알림, 슬랙/디스코드 웹훅, 텔레그램 봇 등으로 성공 알림
      logger.info('게시 완료 알림 발송', {
        title: postData.title,
        publishedUrl: result.publishedUrl,
      });

      const supabaseController = getSupabaseController();
      await supabaseController.logAutomation({
        type: 'publish',
        status: 'info',
        message: `게시 완료 알림 발송: ${postData.title}`,
        metadata: {
          title: postData.title,
          published_url: result.publishedUrl,
          notification_type: 'publish_complete',
        },
      });
    } catch (error) {
      logger.error('게시 완료 알림 발송 실패', { error });
    }
  }

  /**
   * 예약된 포스트 실행
   */
  async executeScheduledPosts(): Promise<void> {
    try {
      logger.info('예약된 포스트 실행 시작');

      const supabaseController = getSupabaseController();

      // 현재 시간 이전에 예약된 포스트 조회
      const scheduledPosts = await supabaseController.getContent(50, 'scheduled');
      const now = new Date();

      const duePosts = scheduledPosts.filter(post => {
        if (!post.published_at) {
          return false;
        }
        return new Date(post.published_at) <= now;
      });

      if (duePosts.length === 0) {
        logger.info('실행할 예약된 포스트가 없습니다');
        return;
      }

      logger.info(`${duePosts.length}개의 예약된 포스트 실행 시작`);

      for (const post of duePosts) {
        try {
          // 예약된 포스트를 일반 게시로 변환
          const blogPost: BlogPostData = {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags,
            featured: post.metadata?.featured,
            status: 'published',
          };

          // 관리자 로그인 정보 (환경변수에서 가져오기)
          const loginCredentials: LoginCredentials = {
            email: process.env.ADMIN_EMAIL || '',
            password: process.env.ADMIN_PASSWORD || '',
          };

          const result = await this.publishPost(blogPost, {
            loginCredentials,
            validateContent: false, // 이미 저장된 콘텐츠이므로 스킵
            notifyOnComplete: true,
          });

          if (result.success) {
            // 상태를 published로 업데이트
            await supabaseController.upsertContent({
              ...post,
              status: 'published',
              metadata: {
                ...post.metadata,
                executed_at: new Date().toISOString(),
                automated_execution: true,
              },
            });

            logger.info('예약된 포스트 실행 완료', {
              title: post.title,
              id: post.id,
            });
          }
        } catch (error) {
          logger.error('예약된 포스트 실행 실패', {
            error,
            title: post.title,
            id: post.id,
          });
        }
      }

      logger.info('예약된 포스트 실행 완료');
    } catch (error) {
      logger.error('예약된 포스트 실행 중 오류', { error });
    }
  }

  /**
   * 배열을 청크로 분할
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 싱글톤 인스턴스
let blogPublisher: BlogPublisher | null = null;

/**
 * BlogPublisher 싱글톤 인스턴스 반환
 */
export function getBlogPublisher(): BlogPublisher {
  if (!blogPublisher) {
    blogPublisher = new BlogPublisher();
  }
  return blogPublisher;
}
