/**
 * 초기 콘텐츠 생성 스크립트
 * 각 카테고리별로 10개씩 총 40개의 AI 트렌드 콘텐츠 생성
 */

const categories = [
  { name: 'AI 부업정보', count: 10 },
  { name: '바이브코딩 성공사례', count: 10 },
  { name: 'MCP 추천', count: 10 },
  { name: '클로드코드 Level UP', count: 10 }
];

async function generateInitialContent() {
  console.log('🚀 초기 콘텐츠 생성 시작...');
  console.log('총 40개 콘텐츠 (카테고리별 10개)');
  console.log('=====================================\n');

  const results = {
    total: 0,
    byCategory: {},
    errors: []
  };

  for (const category of categories) {
    console.log(`\n📂 ${category.name} 카테고리 생성 중...`);
    results.byCategory[category.name] = { 
      requested: category.count,
      generated: 0,
      saved: 0 
    };

    try {
      // API 호출로 콘텐츠 생성
      const response = await fetch('http://localhost:3000/api/ai-trends/auto-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET || 'dev-secret'}`
        },
        body: JSON.stringify({
          count: category.count,
          category: category.name,
          autoPublish: true
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ ${category.name} 생성 실패:`, error);
        results.errors.push({ category: category.name, error });
        continue;
      }

      const data = await response.json();
      
      results.byCategory[category.name].generated = data.stats?.generated || 0;
      results.byCategory[category.name].saved = data.stats?.saved || 0;
      results.total += data.stats?.saved || 0;

      console.log(`✅ ${category.name}: ${data.stats?.saved || 0}/${category.count} 생성 완료`);

      // 다음 카테고리 생성 전 잠시 대기 (API 부하 방지)
      if (categories.indexOf(category) < categories.length - 1) {
        console.log('⏳ 다음 카테고리 생성 대기 중... (10초)');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }

    } catch (error) {
      console.error(`❌ ${category.name} 처리 중 오류:`, error.message);
      results.errors.push({ category: category.name, error: error.message });
    }
  }

  // 최종 결과 출력
  console.log('\n=====================================');
  console.log('📊 최종 결과:');
  console.log('=====================================');
  console.log(`✅ 총 생성: ${results.total}/40개`);
  
  for (const [category, stats] of Object.entries(results.byCategory)) {
    console.log(`\n${category}:`);
    console.log(`  - 요청: ${stats.requested}개`);
    console.log(`  - 생성: ${stats.generated}개`);
    console.log(`  - 저장: ${stats.saved}개`);
  }

  if (results.errors.length > 0) {
    console.log('\n❌ 오류 발생:');
    results.errors.forEach(err => {
      console.log(`  - ${err.category}: ${err.error}`);
    });
  }

  console.log('\n🎉 초기 콘텐츠 생성 완료!');
  
  // 생성된 콘텐츠 확인 URL
  console.log('\n📌 생성된 콘텐츠 확인:');
  console.log('http://localhost:3000/ai-trends');
}

// 스크립트 실행
if (require.main === module) {
  generateInitialContent().catch(error => {
    console.error('스크립트 실행 실패:', error);
    process.exit(1);
  });
}