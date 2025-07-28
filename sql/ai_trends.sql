-- AI 트렌드 테이블 생성
CREATE TABLE IF NOT EXISTS ai_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  source_url TEXT,
  source_name VARCHAR(255),
  seo_title VARCHAR(70),
  seo_description VARCHAR(160),
  seo_keywords TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- AI 트렌드 해시 테이블 (중복 방지)
CREATE TABLE IF NOT EXISTS ai_trends_hash (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_hash VARCHAR(64) UNIQUE NOT NULL,
  trend_id UUID REFERENCES ai_trends(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_ai_trends_published ON ai_trends(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_trends_category ON ai_trends(category);
CREATE INDEX IF NOT EXISTS idx_ai_trends_featured ON ai_trends(is_featured);
CREATE INDEX IF NOT EXISTS idx_ai_trends_slug ON ai_trends(slug);
CREATE INDEX IF NOT EXISTS idx_ai_trends_created_by ON ai_trends(created_by);

-- Row Level Security 활성화
ALTER TABLE ai_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_trends_hash ENABLE ROW LEVEL SECURITY;

-- 정책 설정
-- 모든 사용자가 게시된 트렌드를 읽을 수 있음
CREATE POLICY "Anyone can read published trends" ON ai_trends
  FOR SELECT USING (is_published = true);

-- 관리자만 모든 트렌드를 읽을 수 있음
CREATE POLICY "Admins can read all trends" ON ai_trends
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 관리자만 트렌드를 생성할 수 있음
CREATE POLICY "Admins can insert trends" ON ai_trends
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 관리자만 트렌드를 수정할 수 있음
CREATE POLICY "Admins can update trends" ON ai_trends
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 관리자만 트렌드를 삭제할 수 있음
CREATE POLICY "Admins can delete trends" ON ai_trends
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 해시 테이블 정책
CREATE POLICY "Admins can manage hashes" ON ai_trends_hash
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_ai_trends_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_trends_updated_at
  BEFORE UPDATE ON ai_trends
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_trends_updated_at();

-- 샘플 데이터 삽입
INSERT INTO ai_trends (title, slug, summary, content, category, tags, is_featured, is_published)
VALUES 
  (
    'ChatGPT-4의 최신 업데이트 소식',
    'chatgpt-4-latest-updates',
    'OpenAI가 발표한 ChatGPT-4의 새로운 기능과 개선사항을 자세히 알아보세요.',
    '<h2>ChatGPT-4의 주요 개선사항</h2><p>OpenAI가 최근 발표한 ChatGPT-4 업데이트는 이전 버전보다 훨씬 향상된 성능을 보여줍니다...</p>',
    'AI 기술',
    ARRAY['ChatGPT', 'OpenAI', '언어모델', '업데이트'],
    true,
    true
  ),
  (
    '2024년 주목해야 할 AI 도구 TOP 10',
    'top-10-ai-tools-2024',
    '개발자와 크리에이터를 위한 가장 혁신적인 AI 도구들을 소개합니다.',
    '<h2>생산성을 높이는 AI 도구들</h2><p>2024년에는 다양한 AI 도구들이 출시되면서...</p>',
    'AI 도구',
    ARRAY['AI도구', '생산성', '자동화', '크리에이터'],
    true,
    true
  ),
  (
    'AI와 함께하는 효율적인 업무 프로세스',
    'efficient-work-process-with-ai',
    'AI를 활용하여 업무 효율성을 극대화하는 방법을 알아보세요.',
    '<h2>AI 활용 업무 최적화</h2><p>인공지능을 업무에 적용하면 놀라운 효율성 향상을 경험할 수 있습니다...</p>',
    'AI 활용',
    ARRAY['업무효율', '프로세스', '자동화', '생산성'],
    false,
    true
  );

-- 조회수 업데이트 함수
CREATE OR REPLACE FUNCTION increment_ai_trend_view(trend_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ai_trends 
  SET view_count = view_count + 1
  WHERE id = trend_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;