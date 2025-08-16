const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(description, sql) {
  console.log(`⏳ ${description}...`);
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.log(`⚠️  ${description} failed:`, error.message);
      return false;
    } else {
      console.log(`✅ ${description} completed`);
      return true;
    }
  } catch (error) {
    console.log(`⚠️  ${description} failed:`, error.message);
    return false;
  }
}

// 간단한 접근: 필요한 최소한의 SQL만 실행
async function simpleAlterTable() {
  console.log('🚀 Adding likes column to community_posts...');
  
  try {
    // 1. 직접 SQL 실행으로 컬럼 추가
    const { data, error } = await supabase
      .from('community_posts')
      .select('likes')
      .limit(1);
    
    if (error && error.message.includes('column community_posts.likes does not exist')) {
      console.log('❌ Likes column does not exist. Need to add it manually in Supabase dashboard.');
      console.log('');
      console.log('🔧 Manual steps required:');
      console.log('1. Go to: https://supabase.com/dashboard/project/wpzvocfgfwvsxmpckdnu/sql');
      console.log('2. Execute this SQL:');
      console.log('');
      console.log('ALTER TABLE public.community_posts ADD COLUMN likes INTEGER DEFAULT 0;');
      console.log('');
      console.log('3. Then run this script again to verify.');
      return false;
    } else if (!error) {
      console.log('✅ Likes column already exists!');
      return true;
    } else {
      console.error('❌ Unexpected error:', error.message);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// 현재 상태 확인
async function checkStatus() {
  console.log('📊 Checking current table status...');
  
  try {
    const { data, error } = await supabase
      .from('community_posts')
      .select('id, title, likes')
      .limit(1);
    
    if (error) {
      console.error('❌ Error:', error.message);
      return false;
    } else {
      console.log('✅ community_posts table is accessible');
      console.log('   Likes column exists:', 'likes' in (data[0] || {}));
      return true;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// 실행
simpleAlterTable().then(success => {
  if (success) {
    checkStatus();
  }
});