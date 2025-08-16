#!/usr/bin/env node

/**
 * 고품질 초기 콘텐츠 생성 스크립트
 * 각 카테고리별로 정교하게 10개씩 생성
 */

const categories = [
  { 
    name: 'AI 부업정보',
    slug: 'ai-side-income',
    topics: [
      '네이버 블로그 쇼핑커넥트 월 30만원 수익화 전략',
      '인스타그램 릴스 + 쿠팡파트너스 조합 수익 모델',
      'AI 자동화 유튜브 쇼츠 일 10분 투자로 월 20만원',
      '스마트스토어 무재고 판매 AI 상품 소싱 방법',
      'ChatGPT로 전자책 작성 후 아마존 KDP 출간하기',
      'AI 이미지 생성으로 라인스티커 판매 수익화',
      '프롬프트 엔지니어링 강의 제작 월 50만원 달성',
      'AI 콘텐츠 제작 대행 서비스 시작하기',
      '미드저니로 POD 티셔츠 디자인 판매 전략',
      'AI 챗봇 제작 대행으로 프리랜서 수익 창출'
    ]
  },
  {
    name: '바이브코딩 성공사례',
    slug: 'vibecoding-success',
    topics: [
      'Photoroom - 사진 1장으로 월 $2M ARR 달성한 비결',
      'Carrd.co - 원맨 개발자가 만든 연 $1M 노코드 플랫폼',
      'TinyPNG - 단순 이미지 압축으로 월 $100K 수익',
      'Remove.bg - AI 배경제거로 연 $10M 달성 스토리',
      'Notion - 노트앱에서 유니콘까지 성장 전략 분석',
      'Gumroad - 창작자 경제 플랫폼 부트스트랩 성공기',
      'ConvertKit - 이메일 마케팅 SaaS $29M ARR 여정',
      'Plausible Analytics - 구글 애널리틱스 대안으로 성장',
      'Fathom Analytics - 프라이버시 중심 분석툴 성공 사례',
      'Ghost - 워드프레스 대안 오픈소스 CMS 수익화'
    ]
  },
  {
    name: 'MCP 추천',
    slug: 'mcp-recommendation',
    topics: [
      'filesystem MCP - 파일 시스템 완벽 제어 가이드',
      'github MCP - 코드 리뷰 자동화 워크플로우',
      'slack MCP - 팀 커뮤니케이션 자동화 설정법',
      'postgres MCP - 데이터베이스 관리 자동화',
      'google-drive MCP - 클라우드 파일 관리 통합',
      'notion MCP - 노션 워크스페이스 자동화',
      'stripe MCP - 결제 시스템 통합 가이드',
      'spotify MCP - 음악 제어 자동화 설정',
      'brave-search MCP - 검색 자동화 워크플로우',
      'sequential-thinking MCP - 복잡한 문제 해결 도구'
    ]
  },
  {
    name: '클로드코드 Level UP',
    slug: 'claude-levelup',
    topics: [
      'Claude Squad 설치로 협업 능력 10배 향상시키기',
      'SuperClaude로 무한 컨텍스트 활용하는 방법',
      '서브에이전트 활용한 대규모 프로젝트 관리',
      'git worktree로 멀티 브랜치 동시 작업하기',
      'Claude Hooks로 자동화 워크플로우 구축',
      'MCP 서버 직접 만들어 커스텀 기능 추가하기',
      'Claude Projects로 팀 협업 환경 구축하기',
      'Artifacts 활용한 인터랙티브 개발 환경',
      'Claude API 활용한 자동화 스크립트 작성법',
      'CLAUDE.md로 프로젝트별 AI 어시스턴트 최적화'
    ]
  }
];

async function generateContent(category, topic, index) {
  const delay = 3000; // 3초 간격
  
  console.log(`\n⏳ [${category.name}] ${index + 1}/10: "${topic}" 생성 중...`);
  
  try {
    const response = await fetch('http://localhost:3000/api/ai-trends/auto-post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        count: 1,
        category: category.name,
        autoPublish: true,
        specificTopic: topic // 특정 주제 전달
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ 실패: ${error}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ 성공: ${data.stats?.saved || 0}개 저장`);
    
    // API 부하 방지를 위한 대기
    await new Promise(resolve => setTimeout(resolve, delay));
    return true;
    
  } catch (error) {
    console.error(`❌ 오류: ${error.message}`);
    return false;
  }
}

async function generateCategoryContent(category) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📂 ${category.name} 카테고리 콘텐츠 생성 시작`);
  console.log(`${'='.repeat(60)}`);
  
  let successCount = 0;
  
  for (let i = 0; i < category.topics.length; i++) {
    const success = await generateContent(category, category.topics[i], i);
    if (success) successCount++;
    
    // 진행률 표시
    const progress = Math.round((i + 1) / category.topics.length * 100);
    console.log(`📊 진행률: ${progress}% (${i + 1}/${category.topics.length})`);
  }
  
  console.log(`\n✨ ${category.name} 완료: ${successCount}/${category.topics.length} 성공`);
  return successCount;
}

async function main() {
  console.log('🚀 고품질 AI 트렌드 콘텐츠 생성 시작');
  console.log('각 카테고리별 10개씩, 총 40개 생성 예정\n');
  
  const startTime = Date.now();
  const results = {};
  let totalSuccess = 0;
  
  for (const category of categories) {
    const successCount = await generateCategoryContent(category);
    results[category.name] = successCount;
    totalSuccess += successCount;
    
    // 카테고리 간 충분한 휴식
    if (categories.indexOf(category) < categories.length - 1) {
      console.log('\n⏸️  다음 카테고리 전 10초 대기...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  // 최종 결과 출력
  const elapsedTime = Math.round((Date.now() - startTime) / 1000);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 최종 결과');
  console.log('='.repeat(60));
  
  for (const [category, count] of Object.entries(results)) {
    console.log(`${category}: ${count}/10 성공`);
  }
  
  console.log(`\n✅ 총 ${totalSuccess}/40개 콘텐츠 생성 완료`);
  console.log(`⏱️  소요 시간: ${Math.floor(elapsedTime / 60)}분 ${elapsedTime % 60}초`);
  console.log('\n🎉 작업 완료! http://localhost:3000/ai-trends 에서 확인하세요.');
}

// 스크립트 실행
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 스크립트 실행 실패:', error);
    process.exit(1);
  });
}