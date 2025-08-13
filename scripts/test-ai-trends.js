/**
 * AI 트렌드 블로그 자동화 테스트 스크립트
 * 새로운 게시글을 생성하고 시스템을 테스트합니다.
 */

const { getBlogPublisher } = require('../lib/automation/blog-publisher');

const testPost = {
  title: '실시간 AI 트렌드 자동화 테스트',
  slug: 'realtime-ai-trends-automation-test',
  summary: '블로그 자동화 시스템이 정상적으로 작동하는지 테스트하는 게시글입니다.',
  content: `# 실시간 AI 트렌드 자동화 테스트

이 게시글은 떡상연구소의 AI 트렌드 블로그 자동화 시스템을 테스트하기 위해 자동으로 생성되었습니다.

## 테스트 목적

### 1. 라우팅 검증
- 동적 라우트 \`[slug]/page.tsx\` 정상 작동
- URL 인코딩/디코딩 처리
- 404 오류 방지

### 2. 콘텐츠 렌더링
- 마크다운 스타일 콘텐츠 표시
- 썸네일 이미지 로딩
- 메타데이터 적용

### 3. SEO 최적화
- 구조화된 데이터
- 소셜 미디어 메타태그
- 검색엔진 최적화

## 자동화 시스템 기능

### 블로그 게시 자동화
- 콘텐츠 검증
- 자동 게시
- 성능 모니터링

### 워크플로우 통합
- Supabase 데이터베이스 연동
- Playwright 브라우저 자동화
- 오류 처리 및 로깅

## 결론

이 테스트가 성공적으로 표시된다면 AI 트렌드 블로그 시스템이 완벽하게 작동하고 있다는 것을 의미합니다.`,
  category: 'AI 기술',
  tags: ['테스트', '자동화', '블로그', '시스템'],
  thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  seo_title: '실시간 AI 트렌드 자동화 테스트',
  seo_description: '떡상연구소 AI 트렌드 블로그 자동화 시스템의 정상 작동을 확인하는 테스트 게시글입니다.',
  seo_keywords: ['AI 트렌드', '자동화', '테스트', '블로그'],
  featured: true,
  publishDate: new Date(),
  status: 'published'
};

async function testBlogAutomation() {
  try {
    console.log('🚀 AI 트렌드 블로그 자동화 테스트 시작...');
    
    const blogPublisher = getBlogPublisher();
    
    // 테스트 게시글 발행
    const result = await blogPublisher.publishPost(testPost, {
      loginCredentials: {
        email: process.env.ADMIN_EMAIL || '',
        password: process.env.ADMIN_PASSWORD || '',
      },
      validateContent: true,
      captureScreenshot: true,
      notifyOnComplete: true,
    });

    if (result.success) {
      console.log('✅ 테스트 게시글 발행 성공\!');
      console.log(`📝 게시글 ID: ${result.publishedId}`);
      console.log(`🔗 게시글 URL: ${result.publishedUrl}`);
      
      if (result.performanceMetrics) {
        console.log('⚡ 성능 메트릭:', result.performanceMetrics);
      }
    } else {
      console.error('❌ 테스트 게시글 발행 실패:', result.error);
      if (result.validationErrors?.length > 0) {
        console.error('🔍 검증 오류:', result.validationErrors);
      }
    }

    return result;
  } catch (error) {
    console.error('💥 치명적 오류:', error.message);
    return { success: false, error: error.message };
  }
}

// 스크립트 실행
if (require.main === module) {
  testBlogAutomation()
    .then(result => {
      console.log('🏁 테스트 완료');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💀 예상치 못한 오류:', error);
      process.exit(1);
    });
}

module.exports = { testBlogAutomation, testPost };
EOF < /dev/null
