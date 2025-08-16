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
    // REST API를 통해 직접 SQL 실행
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      console.log(`✅ ${description} completed`);
      return true;
    } else {
      const error = await response.text();
      console.log(`⚠️  ${description} might already exist or failed:`, error);
      return false;
    }
  } catch (error) {
    console.log(`⚠️  ${description} failed:`, error.message);
    return false;
  }
}

async function applyMigrationWithRest() {
  console.log('🚀 Starting likes migration with REST API...');
  
  try {
    // 1. community_posts 테이블에 likes 컬럼 추가
    await executeSQL(
      'Adding likes column to community_posts',
      'ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;'
    );

    // 2. community_post_likes 테이블 생성
    await executeSQL(
      'Creating community_post_likes table',
      `CREATE TABLE IF NOT EXISTS public.community_post_likes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(post_id, user_id)
      );`
    );

    // 3. RLS 활성화
    await executeSQL(
      'Enabling Row Level Security',
      'ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;'
    );

    // 4. RLS 정책들
    const policies = [
      ['Anyone can view likes', 'CREATE POLICY "Anyone can view likes" ON public.community_post_likes FOR SELECT USING (true);'],
      ['Logged in users can like posts', 'CREATE POLICY "Logged in users can like posts" ON public.community_post_likes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);'],
      ['Users can remove own likes', 'CREATE POLICY "Users can remove own likes" ON public.community_post_likes FOR DELETE USING (auth.uid() = user_id);'],
      ['Admins can manage all likes', `CREATE POLICY "Admins can manage all likes" ON public.community_post_likes FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));`]
    ];

    for (const [desc, sql] of policies) {
      await executeSQL(`Creating policy: ${desc}`, sql);
    }

    // 5. 인덱스 생성
    const indexes = [
      ['idx_post_likes_post_id', 'CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.community_post_likes(post_id);'],
      ['idx_post_likes_user_id', 'CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.community_post_likes(user_id);'],
      ['idx_post_likes_created_at', 'CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON public.community_post_likes(created_at DESC);']
    ];

    for (const [desc, sql] of indexes) {
      await executeSQL(`Creating index: ${desc}`, sql);
    }

    // 6. 트리거 함수 생성
    await executeSQL(
      'Creating trigger function',
      `CREATE OR REPLACE FUNCTION update_post_likes_count()
       RETURNS TRIGGER AS $$
       BEGIN
         IF TG_OP = 'INSERT' THEN
           UPDATE public.community_posts 
           SET likes = likes + 1 
           WHERE id = NEW.post_id;
           RETURN NEW;
         ELSIF TG_OP = 'DELETE' THEN
           UPDATE public.community_posts 
           SET likes = likes - 1 
           WHERE id = OLD.post_id;
           RETURN OLD;
         END IF;
         RETURN NULL;
       END;
       $$ LANGUAGE plpgsql SECURITY DEFINER;`
    );

    // 7. 트리거 생성
    await executeSQL(
      'Creating insert trigger',
      'CREATE TRIGGER trigger_update_likes_count_insert AFTER INSERT ON public.community_post_likes FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();'
    );

    await executeSQL(
      'Creating delete trigger',
      'CREATE TRIGGER trigger_update_likes_count_delete AFTER DELETE ON public.community_post_likes FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();'
    );

    // 8. 기존 게시글 likes 업데이트
    await executeSQL(
      'Updating existing posts likes count',
      `UPDATE public.community_posts 
       SET likes = (
         SELECT COUNT(*) 
         FROM public.community_post_likes 
         WHERE post_id = community_posts.id
       );`
    );

    console.log('\n🎉 Migration completed! Checking status...');
    
    // 테이블 상태 확인
    await checkTableStatus();
    
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    
    // 대안 방법 제안
    console.log('\n🔧 Alternative approach:');
    console.log('If the migration failed, please execute the SQL manually:');
    console.log('1. Go to: https://supabase.com/dashboard/project/wpzvocfgfwvsxmpckdnu/sql');
    console.log('2. Copy and paste the SQL from the migration file:');
    console.log('   /supabase/migrations/add_likes_to_community_posts.sql');
  }
}

async function checkTableStatus() {
  console.log('\n📊 Checking table status...');
  
  try {
    // community_posts 테이블 구조 확인
    const { data: posts, error: postsError } = await supabase
      .from('community_posts')
      .select('id, title, likes, created_at')
      .limit(5);
    
    if (postsError) {
      console.error('❌ Error checking community_posts:', postsError.message);
    } else {
      console.log('✅ community_posts table:');
      console.log(`   Records: ${posts.length}`);
      if (posts.length > 0) {
        console.log('   Columns include likes:', 'likes' in posts[0]);
        console.log('   Sample record:');
        console.log(`     ID: ${posts[0].id}`);
        console.log(`     Title: ${posts[0].title}`);
        console.log(`     Likes: ${posts[0].likes || 0}`);
      }
    }
    
    // community_post_likes 테이블 확인
    const { data: likes, error: likesError } = await supabase
      .from('community_post_likes')
      .select('id, post_id, user_id, created_at')
      .limit(5);
    
    if (likesError) {
      console.error('❌ Error checking community_post_likes:', likesError.message);
    } else {
      console.log('✅ community_post_likes table:');
      console.log(`   Records: ${likes.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking table status:', error.message);
  }
}

// 실행
applyMigrationWithRest();