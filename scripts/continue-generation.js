#!/usr/bin/env node

const categories = [
  { 
    name: 'AI 부업정보',
    topics: [
      '미드저니로 POD 티셔츠 디자인 판매 전략',
      'AI 챗봇 제작 대행으로 프리랜서 수익 창출'
    ]
  },
  {
    name: '바이브코딩 성공사례',
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
  }
];

async function generateContent(category, topic) {
  console.log(`⏳ [${category.name}] "${topic}" 생성 중...`);
  
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
  console.log('🚀 나머지 콘텐츠 생성 시작\n');
  
  for (const category of categories) {
    console.log(`\n📂 ${category.name} 카테고리 생성`);
    console.log('='.repeat(60));
    
    for (const topic of category.topics) {
      await generateContent(category, topic);
    }
    
    if (categories.indexOf(category) < categories.length - 1) {
      console.log('\n⏸️  다음 카테고리 전 5초 대기...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\n✨ 작업 완료!');
}

main().catch(console.error);