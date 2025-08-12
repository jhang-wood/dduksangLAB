/**
 * 콘텐츠 관리 및 자동화 서비스
 * AI 생성 콘텐츠와 수동 콘텐츠의 통합 관리
 */

import { logger } from '@/lib/logger';
import { getSupabaseController, ContentItem } from '@/lib/mcp/supabase-controller';
import { getBlogPublisher, BlogPostData, PublishOptions } from './blog-publisher';
import { handleAutomationError } from '@/lib/mcp/error-handler';
import { AIContentGenerator } from '@/lib/ai-content-generator';

export interface ContentStrategy {
  id?: string;
  name: string;
  description: string;
  settings: {
    autoPublish: boolean;
    publishSchedule?: 'immediate' | 'scheduled' | 'manual';
    contentTypes: string[];
    categories: string[];
    tags: string[];
    seoOptimization: boolean;
    qualityThreshold: number; // 0-100
  };
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContentGenerationRequest {
  strategy: string;
  count?: number;
  keywords?: string[];
  categories?: string[];
  publishMode?: 'draft' | 'scheduled' | 'immediate';
  scheduleTime?: Date;
}

export interface ContentAnalytics {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  scheduledContent: number;
  byCategory: Record<string, number>;
  byAuthor: Record<string, number>;
  performanceMetrics: {
    avgPublishTime: number;
    successRate: number;
    errorRate: number;
  };
  contentHealth: {
    duplicateRate: number;
    qualityScore: number;
    seoScore: number;
  };
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarContent?: Array<{
    id: string;
    title: string;
    similarity: number;
  }>;
  recommendations: string[];
}

/**
 * 콘텐츠 관리 서비스
 */
export class ContentManager {
  private aiGenerator: AIContentGenerator;

  constructor() {
    this.aiGenerator = new AIContentGenerator();
  }

  /**
   * AI 콘텐츠 일괄 생성 및 관리
   */
  async generateAndManageContent(request: ContentGenerationRequest): Promise<{
    success: boolean;
    generated: number;
    published: number;
    scheduled: number;
    errors: Array<{ step: string; error: string }>;
  }> {
    const result = {
      success: true,
      generated: 0,
      published: 0,
      scheduled: 0,
      errors: [] as Array<{ step: string; error: string }>,
    };

    try {
      logger.info('AI 콘텐츠 생성 및 관리 시작', {
        strategy: request.strategy,
        count: request.count || 1,
        publishMode: request.publishMode,
      });

      const supabaseController = getSupabaseController();

      // 1. 전략 정보 조회
      const strategy = await this.getContentStrategy(request.strategy);
      if (!strategy) {
        throw new Error(`콘텐츠 전략을 찾을 수 없습니다: ${request.strategy}`);
      }

      // 2. AI 콘텐츠 생성
      const generateCount = request.count || 1;
      const aiContents = await this.aiGenerator.generateTrendContent(generateCount);

      if (aiContents.length === 0) {
        throw new Error('AI 콘텐츠 생성 실패');
      }

      result.generated = aiContents.length;

      // 3. 콘텐츠 품질 검사 및 필터링
      const qualifiedContents = [];
      for (const content of aiContents) {
        try {
          // 중복 검사
          const duplicateCheck = await this.checkDuplicate(content.title, content.content);
          if (duplicateCheck.isDuplicate) {
            logger.warn('중복 콘텐츠 감지됨', { title: content.title });
            continue;
          }

          // 품질 검사
          const qualityScore = await this.assessContentQuality(content);
          if (qualityScore < strategy.settings.qualityThreshold) {
            logger.warn('품질 기준 미달', {
              title: content.title,
              score: qualityScore,
              threshold: strategy.settings.qualityThreshold,
            });
            continue;
          }

          qualifiedContents.push(content);
        } catch (error) {
          result.errors.push({
            step: 'quality_check',
            error: `품질 검사 실패: ${content.title} - ${(error as Error).message}`,
          });
        }
      }

      // 4. 콘텐츠 처리 (게시/예약/저장)
      const blogPublisher = getBlogPublisher();

      for (const content of qualifiedContents) {
        try {
          const blogPost: BlogPostData = {
            title: content.title,
            content: content.content,
            summary: content.summary,
            category: content.category,
            tags: content.tags,
            seoTitle: content.seoTitle,
            seoDescription: content.seoDescription,
            seoKeywords: content.seoKeywords,
            featured: false,
            status:
              request.publishMode === 'immediate'
                ? 'published'
                : request.publishMode === 'scheduled'
                  ? 'scheduled'
                  : 'draft',
            publishDate: request.scheduleTime,
          };

          if (request.publishMode === 'immediate' && strategy.settings.autoPublish) {
            // 즉시 게시
            const publishOptions: PublishOptions = {
              loginCredentials: {
                email: process.env.ADMIN_EMAIL || '',
                password: process.env.ADMIN_PASSWORD || '',
              },
              validateContent: true,
              notifyOnComplete: true,
            };

            const publishResult = await blogPublisher.publishPost(blogPost, publishOptions);

            if (publishResult.success) {
              result.published++;
            } else {
              result.errors.push({
                step: 'publish',
                error: `게시 실패: ${content.title} - ${publishResult.error}`,
              });
            }
          } else if (request.publishMode === 'scheduled') {
            // 예약 게시
            await supabaseController.upsertContent({
              title: blogPost.title,
              content: blogPost.content,
              category: blogPost.category,
              tags: blogPost.tags,
              status: 'scheduled',
              published_at: request.scheduleTime?.toISOString(),
              metadata: {
                seoTitle: blogPost.seoTitle,
                seoDescription: blogPost.seoDescription,
                seoKeywords: blogPost.seoKeywords,
                automated: true,
                strategy: request.strategy,
                quality_score: await this.assessContentQuality(content),
              },
            });
            result.scheduled++;
          } else {
            // 임시저장
            await supabaseController.upsertContent({
              title: blogPost.title,
              content: blogPost.content,
              category: blogPost.category,
              tags: blogPost.tags,
              status: 'draft',
              metadata: {
                seoTitle: blogPost.seoTitle,
                seoDescription: blogPost.seoDescription,
                seoKeywords: blogPost.seoKeywords,
                automated: true,
                strategy: request.strategy,
                quality_score: await this.assessContentQuality(content),
              },
            });
          }
        } catch (error) {
          result.errors.push({
            step: 'content_processing',
            error: `콘텐츠 처리 실패: ${content.title} - ${(error as Error).message}`,
          });
        }
      }

      // 5. 작업 결과 로깅
      await supabaseController.logAutomation({
        type: 'publish',
        status:
          result.errors.length === 0
            ? 'success'
            : result.errors.length < result.generated
              ? 'warning'
              : 'failure',
        message: `AI 콘텐츠 생성 완료: ${result.generated}개 생성, ${result.published}개 게시, ${result.scheduled}개 예약`,
        metadata: {
          strategy: request.strategy,
          generated: result.generated,
          published: result.published,
          scheduled: result.scheduled,
          errors_count: result.errors.length,
          qualified_content_rate: qualifiedContents.length / aiContents.length,
        },
      });

      if (result.errors.length > 0) {
        result.success = false;
      }

      logger.info('AI 콘텐츠 생성 및 관리 완료', result);
    } catch (error) {
      logger.error('AI 콘텐츠 생성 및 관리 실패', { error });

      await handleAutomationError(error as Error, {
        operation: 'content_generation',
        component: 'automation',
        metadata: { strategy: request.strategy },
      });

      result.success = false;
      result.errors.push({
        step: 'generation_process',
        error: (error as Error).message,
      });
    }

    return result;
  }

  /**
   * 콘텐츠 중복 검사
   */
  async checkDuplicate(title: string, content: string): Promise<DuplicateCheckResult> {
    try {
      const supabaseController = getSupabaseController();

      // 제목 기반 중복 검사
      const existingContent = await supabaseController.getContent(100);

      const similarContent = existingContent
        .map(item => ({
          id: item.id || '',
          title: item.title,
          similarity: this.calculateSimilarity(title, item.title),
        }))
        .filter(item => item.similarity > 0.8) // 80% 이상 유사도
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      const isDuplicate = similarContent.length > 0;

      const result: DuplicateCheckResult = {
        isDuplicate,
        similarContent: isDuplicate ? similarContent : undefined,
        recommendations: [],
      };

      if (isDuplicate) {
        result.recommendations.push('제목을 더 구체적으로 수정하세요');
        result.recommendations.push('다른 관점에서 접근해보세요');
        result.recommendations.push('최신 정보나 트렌드를 포함하세요');
      }

      return result;
    } catch (error) {
      logger.error('중복 검사 실패', { error });
      return {
        isDuplicate: false,
        recommendations: ['중복 검사를 수행할 수 없었습니다'],
      };
    }
  }

  /**
   * 문자열 유사도 계산
   */
  private calculateSimilarity(str1: string, str2: string): number {
    // 간단한 레벤슈타인 거리 기반 유사도 계산
    const len1 = str1.length;
    const len2 = str2.length;

    if (len1 === 0) {
      return len2 === 0 ? 1 : 0;
    }
    if (len2 === 0) {
      return 0;
    }

    const matrix = Array(len1 + 1)
      .fill(null)
      .map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) {
      matrix[i][0] = i;
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  }

  /**
   * 콘텐츠 품질 평가
   */
  async assessContentQuality(content: any): Promise<number> {
    let score = 100;

    // 제목 평가 (25점)
    if (!content.title || content.title.length < 10) {
      score -= 10;
    }
    if (content.title && content.title.length > 100) {
      score -= 5;
    }

    // 내용 평가 (35점)
    if (!content.content || content.content.length < 300) {
      score -= 15;
    }
    if (content.content && content.content.length < 500) {
      score -= 10;
    }

    // SEO 평가 (20점)
    if (!content.seoTitle) {
      score -= 5;
    }
    if (!content.seoDescription) {
      score -= 5;
    }
    if (!content.seoKeywords || content.seoKeywords.length === 0) {
      score -= 5;
    }
    if (!content.tags || content.tags.length === 0) {
      score -= 5;
    }

    // 구조 평가 (10점)
    if (content.content && !content.content.includes('<h')) {
      score -= 5; // 헤딩 태그 없음
    }
    if (content.content && !content.content.includes('<p')) {
      score -= 5; // 문단 구조 없음
    }

    // 카테고리 평가 (10점)
    if (!content.category) {
      score -= 10;
    }

    return Math.max(0, score);
  }

  /**
   * 콘텐츠 전략 조회
   */
  async getContentStrategy(name: string): Promise<ContentStrategy | null> {
    try {
      // 실제로는 데이터베이스에서 조회하지만, 현재는 기본 전략 반환
      const defaultStrategy: ContentStrategy = {
        name,
        description: 'AI 콘텐츠 자동 생성 전략',
        settings: {
          autoPublish: false,
          publishSchedule: 'manual',
          contentTypes: ['article', 'guide', 'tutorial'],
          categories: ['AI/ML', 'Technology', 'Trends'],
          tags: ['AI', '자동화', '트렌드'],
          seoOptimization: true,
          qualityThreshold: 70,
        },
        active: true,
      };

      return defaultStrategy;
    } catch (error) {
      logger.error('콘텐츠 전략 조회 실패', { error, name });
      return null;
    }
  }

  /**
   * 콘텐츠 분석 및 통계
   */
  async getContentAnalytics(days: number = 30): Promise<ContentAnalytics> {
    try {
      const supabaseController = getSupabaseController();

      // 기간 내 콘텐츠 조회
      const allContent = await supabaseController.getContent(1000);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentContent = allContent.filter(content => {
        const createdAt = new Date(content.created_at || '');
        return createdAt >= cutoffDate;
      });

      // 기본 통계
      const totalContent = recentContent.length;
      const publishedContent = recentContent.filter(c => c.status === 'published').length;
      const draftContent = recentContent.filter(c => c.status === 'draft').length;
      const scheduledContent = recentContent.filter(c => c.status === 'scheduled').length;

      // 카테고리별 통계
      const byCategory: Record<string, number> = {};
      recentContent.forEach(content => {
        const category = content.category || 'uncategorized';
        byCategory[category] = (byCategory[category] || 0) + 1;
      });

      // 작성자별 통계
      const byAuthor: Record<string, number> = {};
      recentContent.forEach(content => {
        const author = content.author_id || 'unknown';
        byAuthor[author] = (byAuthor[author] || 0) + 1;
      });

      // 성능 메트릭
      const automationLogs = await supabaseController.getAutomationLogs(100, 'publish');
      const publishLogs = automationLogs.filter(
        log => new Date(log.created_at || '') >= cutoffDate
      );

      const successfulPublishes = publishLogs.filter(log => log.status === 'success').length;
      const failedPublishes = publishLogs.filter(log => log.status === 'failure').length;
      const totalPublishes = publishLogs.length;

      const performanceMetrics = {
        avgPublishTime: 0, // TODO: 실제 게시 시간 계산
        successRate: totalPublishes > 0 ? (successfulPublishes / totalPublishes) * 100 : 0,
        errorRate: totalPublishes > 0 ? (failedPublishes / totalPublishes) * 100 : 0,
      };

      // 콘텐츠 건강도
      const duplicateCount = await this.estimateDuplicates(recentContent);
      const avgQualityScore = this.calculateAverageQualityScore(recentContent);
      const avgSeoScore = this.calculateAverageSeoScore(recentContent);

      const contentHealth = {
        duplicateRate: totalContent > 0 ? (duplicateCount / totalContent) * 100 : 0,
        qualityScore: avgQualityScore,
        seoScore: avgSeoScore,
      };

      const analytics: ContentAnalytics = {
        totalContent,
        publishedContent,
        draftContent,
        scheduledContent,
        byCategory,
        byAuthor,
        performanceMetrics,
        contentHealth,
      };

      logger.info('콘텐츠 분석 완료', {
        days,
        totalContent,
        successRate: performanceMetrics.successRate,
      });

      return analytics;
    } catch (error) {
      logger.error('콘텐츠 분석 실패', { error });

      return {
        totalContent: 0,
        publishedContent: 0,
        draftContent: 0,
        scheduledContent: 0,
        byCategory: {},
        byAuthor: {},
        performanceMetrics: {
          avgPublishTime: 0,
          successRate: 0,
          errorRate: 100,
        },
        contentHealth: {
          duplicateRate: 0,
          qualityScore: 0,
          seoScore: 0,
        },
      };
    }
  }

  /**
   * 중복 콘텐츠 수 추정
   */
  private async estimateDuplicates(content: ContentItem[]): Promise<number> {
    let duplicateCount = 0;

    for (let i = 0; i < content.length; i++) {
      for (let j = i + 1; j < content.length; j++) {
        const similarity = this.calculateSimilarity(content[i].title, content[j].title);

        if (similarity > 0.8) {
          duplicateCount++;
          break; // 중복으로 간주되면 다음 콘텐츠로
        }
      }
    }

    return duplicateCount;
  }

  /**
   * 평균 품질 점수 계산
   */
  private calculateAverageQualityScore(content: ContentItem[]): number {
    if (content.length === 0) {
      return 0;
    }

    const scores = content.map(item => {
      let score = 100;

      // 기본 품질 지표들
      if (!item.title || item.title.length < 10) {
        score -= 20;
      }
      if (!item.content || item.content.length < 300) {
        score -= 30;
      }
      if (!item.category) {
        score -= 20;
      }
      if (!item.tags || item.tags.length === 0) {
        score -= 15;
      }
      if (!item.metadata?.seoTitle) {
        score -= 10;
      }
      if (!item.metadata?.seoDescription) {
        score -= 5;
      }

      return Math.max(0, score);
    });

    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * 평균 SEO 점수 계산
   */
  private calculateAverageSeoScore(content: ContentItem[]): number {
    if (content.length === 0) {
      return 0;
    }

    const seoScores = content.map(item => {
      let score = 100;

      if (!item.metadata?.seoTitle) {
        score -= 25;
      }
      if (!item.metadata?.seoDescription) {
        score -= 25;
      }
      if (!item.metadata?.seoKeywords || item.metadata.seoKeywords.length === 0) {
        score -= 25;
      }
      if (!item.tags || item.tags.length === 0) {
        score -= 25;
      }

      return Math.max(0, score);
    });

    return seoScores.reduce((sum, score) => sum + score, 0) / seoScores.length;
  }

  /**
   * 예약된 콘텐츠 자동 게시
   */
  async processScheduledContent(): Promise<void> {
    try {
      logger.info('예약된 콘텐츠 자동 게시 프로세스 시작');

      const blogPublisher = getBlogPublisher();
      await blogPublisher.executeScheduledPosts();

      logger.info('예약된 콘텐츠 자동 게시 프로세스 완료');
    } catch (error) {
      logger.error('예약된 콘텐츠 처리 실패', { error });

      await handleAutomationError(error as Error, {
        operation: 'scheduled_content_processing',
        component: 'automation',
      });
    }
  }

  /**
   * 콘텐츠 정리 및 최적화
   */
  async cleanupContent(days: number = 90): Promise<void> {
    try {
      logger.info('콘텐츠 정리 시작', { days });

      const supabaseController = getSupabaseController();

      // 오래된 임시저장 콘텐츠 정리
      const allContent = await supabaseController.getContent(1000);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const oldDrafts = allContent.filter(content => {
        const createdAt = new Date(content.created_at || '');
        return content.status === 'draft' && createdAt < cutoffDate;
      });

      // TODO: 실제 삭제 로직 구현 (안전을 위해 현재는 로그만)
      logger.info(`정리 대상 임시저장 콘텐츠: ${oldDrafts.length}개`);

      // 정리 작업 로그 기록
      await supabaseController.logAutomation({
        type: 'health_check',
        status: 'success',
        message: `콘텐츠 정리 완료: ${oldDrafts.length}개 임시저장 콘텐츠 확인됨`,
        metadata: {
          cleanup_days: days,
          old_drafts_count: oldDrafts.length,
        },
      });
    } catch (error) {
      logger.error('콘텐츠 정리 실패', { error });
    }
  }
}

// 싱글톤 인스턴스
let contentManager: ContentManager | null = null;

/**
 * ContentManager 싱글톤 인스턴스 반환
 */
export function getContentManager(): ContentManager {
  if (!contentManager) {
    contentManager = new ContentManager();
  }
  return contentManager;
}
