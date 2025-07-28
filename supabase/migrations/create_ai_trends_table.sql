-- AI 트렌드 테이블 생성
CREATE TABLE IF NOT EXISTS ai_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- 출처 정보
  source_url TEXT,
  source_name VARCHAR(100),
  
  -- 메타데이터
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  
  -- SEO 최적화
  seo_title VARCHAR(70),
  seo_description VARCHAR(160),
  seo_keywords TEXT[],
  
  -- 시스템 필드
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_ai_trends_slug ON ai_trends(slug);
CREATE INDEX idx_ai_trends_published_at ON ai_trends(published_at DESC);
CREATE INDEX idx_ai_trends_category ON ai_trends(category);
CREATE INDEX idx_ai_trends_is_published ON ai_trends(is_published);
CREATE INDEX idx_ai_trends_is_featured ON ai_trends(is_featured);

-- 중복 방지를 위한 해시 테이블
CREATE TABLE IF NOT EXISTS ai_trends_hash (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_hash VARCHAR(64) UNIQUE NOT NULL,
  trend_id UUID REFERENCES ai_trends(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE ai_trends ENABLE ROW LEVEL SECURITY;

-- 누구나 게시된 트렌드를 볼 수 있음
CREATE POLICY "Anyone can view published trends" ON ai_trends
  FOR SELECT USING (is_published = true);

-- 관리자만 트렌드를 생성/수정/삭제할 수 있음
CREATE POLICY "Admins can manage trends" ON ai_trends
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_ai_trend_views(trend_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ai_trends
  SET view_count = view_count + 1
  WHERE id = trend_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_trends_updated_at BEFORE UPDATE ON ai_trends
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();