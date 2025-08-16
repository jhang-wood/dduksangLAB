const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Manual SQL execution through Supabase...');
console.log('\n📋 Since exec_sql RPC is not available, please execute the following SQL commands manually in your Supabase dashboard:');
console.log('\nGo to: https://supabase.com/dashboard/project/wpzvocfgfwvsxmpckdnu/sql');
console.log('\n========== SQL COMMANDS TO EXECUTE ==========\n');

// 1. likes 컬럼 추가
console.log('-- 1. Add likes column to community_posts');
console.log('ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;\n');

// 2. community_post_likes 테이블 생성
console.log('-- 2. Create community_post_likes table');
console.log(`CREATE TABLE IF NOT EXISTS public.community_post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);\n`);

// 3. RLS 활성화
console.log('-- 3. Enable RLS');
console.log('ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;\n');

// 4. RLS 정책들
console.log('-- 4. Create RLS policies');
console.log(`CREATE POLICY "Anyone can view likes" ON public.community_post_likes
  FOR SELECT USING (true);

CREATE POLICY "Logged in users can like posts" ON public.community_post_likes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can remove own likes" ON public.community_post_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all likes" ON public.community_post_likes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );\n`);

// 5. 인덱스 생성
console.log('-- 5. Create indexes');
console.log(`CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.community_post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON public.community_post_likes(created_at DESC);\n`);

// 6. 트리거 함수
console.log('-- 6. Create trigger function');
console.log(`CREATE OR REPLACE FUNCTION update_post_likes_count()
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
$$ LANGUAGE plpgsql SECURITY DEFINER;\n`);

// 7. 트리거 생성
console.log('-- 7. Create triggers');
console.log(`CREATE TRIGGER trigger_update_likes_count_insert
  AFTER INSERT ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER trigger_update_likes_count_delete
  AFTER DELETE ON public.community_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();\n`);

// 8. 기존 게시글 likes 업데이트
console.log('-- 8. Update existing posts likes count');
console.log(`UPDATE public.community_posts 
SET likes = (
  SELECT COUNT(*) 
  FROM public.community_post_likes 
  WHERE post_id = community_posts.id
);\n`);

console.log('========== END OF SQL COMMANDS ==========\n');
console.log('📝 Instructions:');
console.log('1. Copy all the SQL commands above');
console.log('2. Go to your Supabase dashboard SQL editor');
console.log('3. Paste and execute the commands one by one or all at once');
console.log('4. After execution, run: node scripts/check-db-status.js to verify\n');