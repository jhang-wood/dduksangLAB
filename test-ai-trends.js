// AI 트렌드 API 테스트 스크립트
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3002/api/ai-trends';
// Service Role Key 사용 (관리자 권한)
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwenZvY2ZnZnd2c3htcGNrZG51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2Nzg1MiwiZXhwIjoyMDY4MjQzODUyfQ.c7vRQStMHbBZRjkDDM_iXdLWq4t0HWBvDNbkC7P6Z6c';

async function testCreateAITrend() {
  console.log('🚀 AI 트렌드 생성 테스트 시작...\n');
  
  const testData = {
    title: '2025년 AI 자동화 혁명: 테스트 게시글',
    summary: '이것은 자동화 시스템 테스트를 위한 게시글입니다. AI 트렌드 자동화가 정상 작동하는지 확인합니다.',
    content: `
# AI 자동화 테스트 콘텐츠

## 테스트 목적
- Supabase 테이블 연동 확인
- API 엔드포인트 작동 확인
- 중복 방지 기능 테스트

## 테스트 시간
${new Date().toISOString()}

## 자동화 기능
1. 콘텐츠 자동 생성
2. 해시 기반 중복 방지
3. 자동화 로그 기록
    `,
    category: 'automation',
    tags: ['AI', '자동화', '테스트'],
    source_url: 'https://example.com/test',
    source_name: 'Test Source',
    thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    is_published: true,
    is_featured: false
  };

  try {
    // 1. 첫 번째 요청 - 새 콘텐츠 생성
    console.log('📝 첫 번째 요청: 새 콘텐츠 생성');
    const response1 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify(testData)
    });

    const result1 = await response1.json();
    console.log('응답 상태:', response1.status);
    console.log('응답 데이터:', JSON.stringify(result1, null, 2));
    
    if (response1.ok) {
      console.log('✅ 콘텐츠 생성 성공!\n');
      
      // 2. 두 번째 요청 - 중복 테스트
      console.log('🔄 두 번째 요청: 중복 방지 테스트');
      const response2 = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(testData)
      });
      
      const result2 = await response2.json();
      console.log('응답 상태:', response2.status);
      console.log('응답 데이터:', JSON.stringify(result2, null, 2));
      
      if (response2.status === 409) {
        console.log('✅ 중복 방지 기능 정상 작동!\n');
      } else {
        console.log('❌ 중복 방지 기능 오류\n');
      }
    } else {
      console.log('❌ 콘텐츠 생성 실패\n');
    }
    
    // 3. GET 요청 테스트
    console.log('📖 GET 요청: 콘텐츠 조회 테스트');
    const response3 = await fetch(API_URL + '?limit=5', {
      method: 'GET'
    });
    
    const result3 = await response3.json();
    console.log('조회된 콘텐츠 수:', result3.data?.length || 0);
    console.log('첫 번째 콘텐츠:', result3.data?.[0]?.title);
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error);
  }
}

// 토큰 확인
if (!ADMIN_TOKEN) {
  console.error('⚠️  관리자 토큰이 설정되지 않았습니다.');
  process.exit(1);
}

// 테스트 실행
testCreateAITrend();