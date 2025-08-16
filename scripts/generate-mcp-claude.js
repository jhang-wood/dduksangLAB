#!/usr/bin/env node

const categories = [
  {
    name: 'MCP 추천',
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
  console.log(`⏳ [${category.name}] ${index + 1}/10: "${topic}" 생성 중...`);
  
  try {
    const response = await fetch('http://localhost:3000/api/ai-trends/auto-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        count: 1,
        category: category.name,
        autoPublish: true,
        specificTopic: topic
      })
    });

    if (!response.ok) {
      console.error(`❌ 실패: ${await response.text()}`);
      return false;
    }

    const data = await response.json();
    console.log(`✅ 성공: ${data.stats?.saved || 0}개 저장`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    return true;
  } catch (error) {
    console.error(`❌ 오류: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 MCP 추천 & 클로드코드 Level UP 콘텐츠 생성 시작\n');
  
  for (const category of categories) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📂 ${category.name} 카테고리 생성`);
    console.log('='.repeat(60));
    
    let successCount = 0;
    for (let i = 0; i < category.topics.length; i++) {
      const success = await generateContent(category, category.topics[i], i);
      if (success) successCount++;
      
      const progress = Math.round((i + 1) / category.topics.length * 100);
      console.log(`📊 진행률: ${progress}% (${i + 1}/${category.topics.length})`);
    }
    
    console.log(`\n✨ ${category.name} 완료: ${successCount}/${category.topics.length} 성공`);
    
    if (categories.indexOf(category) < categories.length - 1) {
      console.log('\n⏸️  다음 카테고리 전 10초 대기...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.log('\n🎉 모든 작업 완료! http://localhost:3000/ai-trends 에서 확인하세요.');
}

main().catch(console.error);