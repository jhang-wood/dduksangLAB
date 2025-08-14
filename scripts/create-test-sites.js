const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestSites() {
  console.log('🚀 테스트 사이트 데이터 생성 시작...');

  try {
    // 1. user_sites 테이블 생성 (이미 있으면 무시됨)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_sites (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          url TEXT NOT NULL,
          description TEXT,
          views_today INTEGER DEFAULT 0,
          views_total INTEGER DEFAULT 0,
          rank_today INTEGER DEFAULT 0,
          rank_change INTEGER DEFAULT 0,
          likes INTEGER DEFAULT 0,
          comments INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableQuery });
    if (createError) {
      console.log('테이블은 이미 존재합니다:', createError.message);
    }

    // 2. 첫 번째 사용자 ID 가져오기
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profileError || !profiles?.length) {
      console.error('❌ 프로필을 찾을 수 없습니다:', profileError);
      return;
    }

    const testUserId = profiles[0].id;
    console.log('✅ 테스트 사용자 ID:', testUserId);

    // 3. 기존 테스트 데이터 삭제
    const { error: deleteError } = await supabase
      .from('user_sites')
      .delete()
      .or('name.ilike.%테스트%,name.ilike.%Test%,name.ilike.%경쟁%');

    if (deleteError) {
      console.log('기존 데이터 삭제 시 오류 (정상):', deleteError.message);
    }

    // 4. 메인 테스트 사이트 데이터 삽입
    const mainSites = [
      {
        user_id: testUserId,
        name: '떡상랩 메인 사이트',
        url: 'https://dduksang.com',
        description: '떡상연구소 공식 사이트',
        views_today: 1250,
        views_total: 15000,
        rank_today: 1,
        rank_change: -2,
        likes: 45,
        comments: 12
      },
      {
        user_id: testUserId,
        name: '두 번째 테스트 사이트',
        url: 'https://test2.dduksang.com',
        description: '두 번째 테스트 사이트입니다',
        views_today: 850,
        views_total: 8500,
        rank_today: 3,
        rank_change: 1,
        likes: 23,
        comments: 8
      }
    ];

    const { data: insertedMain, error: mainError } = await supabase
      .from('user_sites')
      .insert(mainSites);

    if (mainError) {
      console.error('❌ 메인 사이트 삽입 오류:', mainError);
      return;
    }

    console.log('✅ 메인 테스트 사이트 생성 완료');

    // 5. 경쟁 사이트 데이터 생성 (순위 비교용)
    const competitorSites = [];
    for (let i = 2; i <= 15; i++) {
      competitorSites.push({
        user_id: testUserId, // 동일한 사용자로 설정 (테스트용)
        name: `경쟁 사이트 ${i}`,
        url: `https://competitor${i}.com`,
        description: `경쟁 사이트 ${i} 설명`,
        views_today: Math.max(100, 1200 - (i * 50)),
        views_total: 10000 + (i * 1000),
        rank_today: i + 1,
        rank_change: Math.floor(Math.random() * 10 - 5),
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20)
      });
    }

    const { data: insertedCompetitors, error: competitorError } = await supabase
      .from('user_sites')
      .insert(competitorSites);

    if (competitorError) {
      console.error('❌ 경쟁 사이트 삽입 오류:', competitorError);
      return;
    }

    console.log('✅ 경쟁 사이트 데이터 생성 완료');

    // 6. 데이터 확인
    const { data: allSites, error: checkError } = await supabase
      .from('user_sites')
      .select('*')
      .eq('user_id', testUserId)
      .order('rank_today');

    if (checkError) {
      console.error('❌ 데이터 확인 오류:', checkError);
      return;
    }

    console.log('🎉 테스트 데이터 생성 완료!');
    console.log(`📊 총 ${allSites?.length || 0}개의 사이트 생성됨`);
    
    if (allSites?.length) {
      console.log('🏆 상위 3개 사이트:');
      allSites.slice(0, 3).forEach((site, index) => {
        console.log(`${index + 1}. ${site.name} (순위: ${site.rank_today}, 조회수: ${site.views_today})`);
      });
    }

  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error);
  }
}

createTestSites();