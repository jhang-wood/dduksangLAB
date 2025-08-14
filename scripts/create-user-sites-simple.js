const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndCreateUserSitesTable() {
  console.log('🔍 user_sites 테이블 확인 중...');

  try {
    // 테이블 존재 여부 확인
    const { data, error } = await supabase
      .from('user_sites')
      .select('id')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "user_sites" does not exist')) {
        console.log('❌ user_sites 테이블이 존재하지 않습니다.');
        console.log('📋 Supabase 대시보드에서 수동으로 테이블을 생성해주세요.');
        
        console.log(`
🔧 수동 생성 방법:
1. Supabase 대시보드 접속
2. SQL Editor로 이동
3. 다음 SQL 실행:

CREATE TABLE user_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    category TEXT NOT NULL DEFAULT 'AI 도구',
    tags TEXT[] DEFAULT '{}',
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

ALTER TABLE user_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sites" ON user_sites
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own sites" ON user_sites
    FOR ALL USING (auth.uid() = user_id);
`);
      } else {
        console.error('❌ 테이블 확인 중 오류:', error);
      }
    } else {
      console.log('✅ user_sites 테이블이 이미 존재합니다!');
      console.log('🎉 사이트 등록 기능을 사용할 수 있습니다.');
    }

  } catch (error) {
    console.error('❌ 예상치 못한 오류:', error);
  }
}

checkAndCreateUserSitesTable();