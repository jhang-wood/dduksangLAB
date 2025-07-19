-- 커뮤니티 댓글 테이블
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS 활성화
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- 댓글 정책
CREATE POLICY "Anyone can view published comments" ON community_comments
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON community_comments
  FOR DELETE USING (auth.uid() = author_id);

-- 댓글 수 계산을 위한 뷰
CREATE OR REPLACE VIEW post_comment_counts AS
SELECT 
  post_id,
  COUNT(*) as comment_count
FROM community_comments
WHERE is_published = true
GROUP BY post_id;

-- 트리거: updated_at 자동 업데이트
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 게시글 뷰 감소를 위한 함수
CREATE OR REPLACE FUNCTION increment_post_views(post_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE community_posts
  SET views = views + 1
  WHERE id = post_uuid;
END;
$$;