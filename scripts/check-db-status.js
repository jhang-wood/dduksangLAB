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

async function checkDatabaseStatus() {
  console.log('🔍 Checking database status...');
  
  try {
    // 1. community_posts 테이블 구조 확인
    console.log('\n📝 Checking community_posts table...');
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .limit(1);
    
    if (postsError) {
      console.error('❌ Error accessing community_posts:', postsError.message);
    } else {
      console.log('✅ community_posts table exists');
      if (posts.length > 0) {
        console.log('   Columns:', Object.keys(posts[0]));
      }
    }

    // 2. community_post_likes 테이블 확인
    console.log('\n💝 Checking community_post_likes table...');
    const { data: likes, error: likesError } = await supabase
      .from('community_post_likes')
      .select('*')
      .limit(1);
    
    if (likesError) {
      console.error('❌ Error accessing community_post_likes:', likesError.message);
    } else {
      console.log('✅ community_post_likes table exists');
      if (likes.length > 0) {
        console.log('   Columns:', Object.keys(likes[0]));
      }
    }

    // 3. profiles 테이블 확인
    console.log('\n👤 Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, name, role')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Error accessing profiles:', profilesError.message);
    } else {
      console.log('✅ profiles table exists');
      console.log(`   Records: ${profiles.length}`);
    }

    // 4. RPC 함수 목록 확인
    console.log('\n🔧 Checking available RPC functions...');
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', {
        sql: 'SELECT 1;'
      });
      
      if (rpcError) {
        console.log('❌ exec_sql RPC not available:', rpcError.message);
      } else {
        console.log('✅ exec_sql RPC is available');
      }
    } catch (error) {
      console.log('❌ exec_sql RPC not available:', error.message);
    }

  } catch (error) {
    console.error('❌ Error during database check:', error.message);
  }
}

// 실행
checkDatabaseStatus();