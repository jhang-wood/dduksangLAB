const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createUserSitesTable() {
  try {
    // SQL 쿼리 실행
    const { error } = await supabase.rpc('exec_sql', {
      query: `
        -- user_sites 테이블 생성
        CREATE TABLE IF NOT EXISTS user_sites (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            description TEXT,
            category TEXT,
            thumbnail_url TEXT,
            tags TEXT[],
            
            -- 조회수 통계
            views_today INTEGER DEFAULT 0,
            views_yesterday INTEGER DEFAULT 0,
            views_week INTEGER DEFAULT 0,
            views_month INTEGER DEFAULT 0,
            views_total INTEGER DEFAULT 0,
            
            -- 순위 정보
            rank_today INTEGER,
            rank_yesterday INTEGER,
            rank_change INTEGER DEFAULT 0,
            
            -- 커뮤니티 반응
            likes INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            
            -- 상태
            is_active BOOLEAN DEFAULT true,
            is_hot BOOLEAN DEFAULT false,
            is_verified BOOLEAN DEFAULT false,
            
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            
            UNIQUE(user_id, url)
        );
      `
    }).catch(async () => {
      // RPC가 없으면 직접 SQL 실행 시도
      console.log('Attempting direct SQL execution...');
      
      // Supabase SQL Editor API 사용 (관리자 권한 필요)
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS user_sites (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                url TEXT NOT NULL,
                description TEXT,
                category TEXT,
                thumbnail_url TEXT,
                tags TEXT[],
                views_today INTEGER DEFAULT 0,
                views_yesterday INTEGER DEFAULT 0,
                views_week INTEGER DEFAULT 0,
                views_month INTEGER DEFAULT 0,
                views_total INTEGER DEFAULT 0,
                rank_today INTEGER,
                rank_yesterday INTEGER,
                rank_change INTEGER DEFAULT 0,
                likes INTEGER DEFAULT 0,
                comments INTEGER DEFAULT 0,
                is_active BOOLEAN DEFAULT true,
                is_hot BOOLEAN DEFAULT false,
                is_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, url)
            );
          `
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create table via API');
      }
    });

    if (error) {
      console.error('Error creating table:', error);
      return;
    }

    console.log('✅ user_sites table created successfully!');
    
    // 테이블 확인
    const { data, error: checkError } = await supabase
      .from('user_sites')
      .select('*')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking table:', checkError);
    } else {
      console.log('✅ Table is accessible and working!');
    }
    
  } catch (error) {
    console.error('Script error:', error);
    
    // 대안: 테이블이 이미 존재하는지 확인
    console.log('\n🔍 Checking if table already exists...');
    const { data, error: checkError } = await supabase
      .from('user_sites')
      .select('*')
      .limit(1);
    
    if (!checkError || checkError.code === 'PGRST116') {
      console.log('ℹ️ Table might already exist or needs to be created manually.');
      console.log('\n📋 Please run the following SQL in your Supabase dashboard:');
      console.log('\nhttps://app.supabase.com/project/YOUR_PROJECT_ID/editor\n');
      console.log('SQL to execute:');
      console.log('---------------');
      console.log(`
CREATE TABLE IF NOT EXISTS user_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    thumbnail_url TEXT,
    tags TEXT[],
    views_today INTEGER DEFAULT 0,
    views_yesterday INTEGER DEFAULT 0,
    views_week INTEGER DEFAULT 0,
    views_month INTEGER DEFAULT 0,
    views_total INTEGER DEFAULT 0,
    rank_today INTEGER,
    rank_yesterday INTEGER,
    rank_change INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_hot BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, url)
);

-- Enable RLS
ALTER TABLE user_sites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all active sites" ON user_sites
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own sites" ON user_sites
    FOR ALL USING (auth.uid() = user_id);
      `);
    } else {
      console.log('❌ Table does not exist and could not be created automatically.');
    }
  }
}

createUserSitesTable();