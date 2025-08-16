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

async function applyLikesMigration() {
  console.log('🚀 Starting likes migration...');
  
  try {
    // 1. community_posts 테이블에 likes 컬럼 추가
    console.log('\n📝 Adding likes column to community_posts...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;`
    }).single();
    
    if (alterError && !alterError.message.includes('already exists')) {
      console.log('⚠️  Likes column might already exist');
    } else {
      console.log('✅ Likes column added');
    }

    // 2. community_post_likes 테이블 생성
    console.log('\n💝 Creating community_post_likes table...');
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.community_post_likes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
          user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(post_id, user_id)
        );
      `
    }).single();
    
    if (createTableError && !createTableError.message.includes('already exists')) {
      console.log('⚠️  Likes table might already exist');
    } else {
      console.log('✅ Community post likes table created');
    }

    // 3. RLS 활성화
    console.log('\n🔐 Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;`
    }).single();
    
    if (rlsError) {
      console.log('⚠️  RLS might already be enabled');
    } else {
      console.log('✅ RLS enabled for likes table');
    }

    // 4. RLS 정책 생성
    console.log('\n📜 Creating RLS policies...');
    const policies = [
      {
        name: 'Anyone can view likes',
        sql: `
          CREATE POLICY "Anyone can view likes" ON public.community_post_likes
          FOR SELECT USING (true);
        `
      },
      {
        name: 'Logged in users can like posts',
        sql: `
          CREATE POLICY "Logged in users can like posts" ON public.community_post_likes
          FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
        `
      },
      {
        name: 'Users can remove own likes',
        sql: `
          CREATE POLICY "Users can remove own likes" ON public.community_post_likes
          FOR DELETE USING (auth.uid() = user_id);
        `
      },
      {
        name: 'Admins can manage all likes',
        sql: `
          CREATE POLICY "Admins can manage all likes" ON public.community_post_likes
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM public.profiles
              WHERE id = auth.uid() AND role = 'admin'
            )
          );
        `
      }
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: policy.sql
      }).single();
      
      if (error && !error.message.includes('already exists')) {
        console.log(`⚠️  Policy "${policy.name}" might already exist`);
      } else {
        console.log(`✅ Policy "${policy.name}" created`);
      }
    }

    // 5. 인덱스 생성
    console.log('\n🚀 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.community_post_likes(post_id);',
      'CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.community_post_likes(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON public.community_post_likes(created_at DESC);'
    ];

    for (const indexSql of indexes) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: indexSql
      }).single();
      
      if (error && !error.message.includes('already exists')) {
        console.log('⚠️  Index might already exist');
      } else {
        console.log('✅ Index created');
      }
    }

    // 6. 트리거 함수 생성
    console.log('\n⚡ Creating trigger function...');
    const { error: funcError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION update_post_likes_count()
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
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }).single();
    
    if (funcError) {
      console.log('⚠️  Trigger function might already exist');
    } else {
      console.log('✅ Trigger function created');
    }

    // 7. 트리거 생성
    console.log('\n🎯 Creating triggers...');
    const triggers = [
      `CREATE TRIGGER IF NOT EXISTS trigger_update_likes_count_insert
       AFTER INSERT ON public.community_post_likes
       FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();`,
      `CREATE TRIGGER IF NOT EXISTS trigger_update_likes_count_delete
       AFTER DELETE ON public.community_post_likes
       FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();`
    ];

    for (const triggerSql of triggers) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: triggerSql
      }).single();
      
      if (error && !error.message.includes('already exists')) {
        console.log('⚠️  Trigger might already exist');
      } else {
        console.log('✅ Trigger created');
      }
    }

    // 8. 기존 게시글의 likes 컬럼 초기화
    console.log('\n🔄 Updating existing posts likes count...');
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE public.community_posts 
        SET likes = (
          SELECT COUNT(*) 
          FROM public.community_post_likes 
          WHERE post_id = community_posts.id
        );
      `
    }).single();
    
    if (updateError) {
      console.log('⚠️  Error updating likes count:', updateError.message);
    } else {
      console.log('✅ Existing posts likes count updated');
    }

    console.log('\n🎉 Likes migration completed successfully!');
    
    // 테이블 상태 확인
    await checkTableStatus();
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
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
        console.log('   Sample record:');
        console.log(`     ID: ${posts[0].id}`);
        console.log(`     Title: ${posts[0].title}`);
        console.log(`     Likes: ${posts[0].likes || 0}`);
        console.log(`     Created: ${posts[0].created_at}`);
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
      if (likes.length > 0) {
        console.log('   Sample record:');
        console.log(`     ID: ${likes[0].id}`);
        console.log(`     Post ID: ${likes[0].post_id}`);
        console.log(`     User ID: ${likes[0].user_id}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking table status:', error.message);
  }
}

// 실행
applyLikesMigration();