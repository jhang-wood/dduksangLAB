-- AI 트렌드 댓글 테이블 생성
CREATE TABLE IF NOT EXISTS ai_trend_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trend_id UUID REFERENCES ai_trends(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255),
  content TEXT NOT NULL,
  parent_id UUID REFERENCES ai_trend_comments(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- AI 트렌드 테이블에 comment_count 필드 추가
ALTER TABLE ai_trends ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- 인덱스 생성
CREATE INDEX idx_ai_trend_comments_trend_id ON ai_trend_comments(trend_id);
CREATE INDEX idx_ai_trend_comments_author_id ON ai_trend_comments(author_id);
CREATE INDEX idx_ai_trend_comments_is_published ON ai_trend_comments(is_published);

-- RLS 활성화
ALTER TABLE ai_trend_comments ENABLE ROW LEVEL SECURITY;

-- 댓글 정책
CREATE POLICY "Anyone can view published ai trend comments" ON ai_trend_comments
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can create ai trend comments" ON ai_trend_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own ai trend comments" ON ai_trend_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own ai trend comments" ON ai_trend_comments
  FOR DELETE USING (auth.uid() = author_id);

-- 관리자는 모든 댓글 관리 가능
CREATE POLICY "Admins can manage all ai trend comments" ON ai_trend_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 댓글 수 자동 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_ai_trend_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ai_trends
    SET comment_count = comment_count + 1
    WHERE id = NEW.trend_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ai_trends
    SET comment_count = comment_count - 1
    WHERE id = OLD.trend_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 댓글 추가/삭제 시 카운트 업데이트 트리거
CREATE TRIGGER update_ai_trend_comment_count_trigger
AFTER INSERT OR DELETE ON ai_trend_comments
  FOR EACH ROW
  WHEN (NEW.is_published = true OR OLD.is_published = true)
  EXECUTE FUNCTION update_ai_trend_comment_count();

-- 트리거: updated_at 자동 업데이트
CREATE TRIGGER update_ai_trend_comments_updated_at BEFORE UPDATE ON ai_trend_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 기존 트렌드의 comment_count 초기화
UPDATE ai_trends
SET comment_count = (
  SELECT COUNT(*)
  FROM ai_trend_comments
  WHERE ai_trend_comments.trend_id = ai_trends.id
  AND ai_trend_comments.is_published = true
);