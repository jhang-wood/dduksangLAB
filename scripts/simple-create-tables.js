const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    // 1. user_sites 테이블 확인
    console.log('Checking user_sites table...');
    const { data: userSites, error: userSitesError } = await supabase
      .from('user_sites')
      .select('*')
      .limit(1);
    
    if (userSitesError && userSitesError.code === 'PGRST116') {
      console.log('❌ user_sites table does not exist');
      console.log('\nPlease create it manually in Supabase Dashboard with this SQL:\n');
      console.log(`
CREATE TABLE IF NOT EXISTS user_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    thumbnail_url TEXT,
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
    } else if (userSites) {
      console.log('✅ user_sites table exists and is accessible');
    }

    // 2. showcase_sites 테이블 확인
    console.log('\nChecking showcase_sites table...');
    const { data: showcaseSites, error: showcaseError } = await supabase
      .from('showcase_sites')
      .select('*')
      .limit(1);
    
    if (showcaseError && showcaseError.code === 'PGRST116') {
      console.log('❌ showcase_sites table does not exist');
      console.log('\nPlease create it manually in Supabase Dashboard with this SQL:\n');
      console.log(`
CREATE TABLE IF NOT EXISTS showcase_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    thumbnail_url TEXT,
    views_today INTEGER DEFAULT 0,
    views_yesterday INTEGER DEFAULT 0,
    views_total INTEGER DEFAULT 0,
    rank_today INTEGER,
    rank_yesterday INTEGER,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, url)
);

-- Enable RLS
ALTER TABLE showcase_sites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view showcase sites" ON showcase_sites
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own showcase sites" ON showcase_sites
    FOR ALL USING (auth.uid() = user_id);
      `);
    } else if (showcaseSites) {
      console.log('✅ showcase_sites table exists and is accessible');
    }

    console.log('\n🔗 Supabase Dashboard URL:');
    console.log(`https://app.supabase.com/project/${supabaseUrl.split('.')[0].replace('https://', '')}/editor`);
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

createTables();