-- AI 트렌드 카테고리 업데이트 및 게시 주기 관리 시스템 추가

-- 1. 카테고리 메타데이터 테이블 생성
CREATE TABLE IF NOT EXISTS ai_trend_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  posting_interval_days INTEGER NOT NULL DEFAULT 1,
  last_posted_at TIMESTAMP WITH TIME ZONE,
  theme_color VARCHAR(7) DEFAULT '#FFD700',
  icon_name VARCHAR(50) DEFAULT 'sparkles',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 새로운 카테고리 데이터 삽입
INSERT INTO ai_trend_categories (name, slug, description, posting_interval_days, theme_color, icon_name, priority) VALUES
  ('AI 부업정보', 'ai-side-income', '현실적이고 검증된 AI 부업 모델 소개', 3, '#00D9FF', 'dollar-sign', 1),
  ('바이브코딩 성공사례', 'vibecoding-success', '바이브코딩으로 성공한 실제 사례들', 7, '#FF6B6B', 'trophy', 2),
  ('MCP 추천', 'mcp-recommendation', '실전에서 유용한 MCP 서버 소개', 3, '#4ECDC4', 'server', 3),
  ('클로드코드 Level UP', 'claude-levelup', 'Claude Code 활용 능력 향상 팁', 1, '#FFD93D', 'zap', 4);

-- 3. 기존 ai_trends 테이블 업데이트
ALTER TABLE ai_trends 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES ai_trend_categories(id),
  ADD COLUMN IF NOT EXISTS source_urls TEXT[],
  ADD COLUMN IF NOT EXISTS verification_status VARCHAR(20) DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS practical_score INTEGER DEFAULT 0 CHECK (practical_score >= 0 AND practical_score <= 10),
  ADD COLUMN IF NOT EXISTS implementation_difficulty VARCHAR(20) DEFAULT 'medium';

-- 4. 기존 데이터 마이그레이션 (기존 카테고리를 새 카테고리로 매핑)
UPDATE ai_trends 
SET category_id = (
  SELECT id FROM ai_trend_categories 
  WHERE name = CASE 
    WHEN ai_trends.category IN ('AI 기술', 'AI 도구') THEN 'MCP 추천'
    WHEN ai_trends.category = 'AI 활용' THEN 'AI 부업정보'
    WHEN ai_trends.category = 'AI 비즈니스' THEN '바이브코딩 성공사례'
    WHEN ai_trends.category = 'AI 교육' THEN '클로드코드 Level UP'
    ELSE 'MCP 추천'
  END
  LIMIT 1
)
WHERE category_id IS NULL;

-- 5. 카테고리별 게시 이력 테이블
CREATE TABLE IF NOT EXISTS ai_trend_posting_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES ai_trend_categories(id) ON DELETE CASCADE,
  trend_id UUID REFERENCES ai_trends(id) ON DELETE CASCADE,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  posting_type VARCHAR(20) DEFAULT 'auto', -- 'auto' or 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 자동 게시 규칙 테이블
CREATE TABLE IF NOT EXISTS ai_trend_auto_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES ai_trend_categories(id) ON DELETE CASCADE,
  rule_type VARCHAR(50) NOT NULL, -- 'keyword_filter', 'source_url', 'quality_threshold'
  rule_value JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 콘텐츠 소스 관리 테이블
CREATE TABLE IF NOT EXISTS ai_trend_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES ai_trend_categories(id) ON DELETE CASCADE,
  source_name VARCHAR(100) NOT NULL,
  source_url TEXT NOT NULL,
  source_type VARCHAR(50) NOT NULL, -- 'github', 'producthunt', 'reddit', 'blog'
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. 기본 콘텐츠 소스 추가
INSERT INTO ai_trend_sources (category_id, source_name, source_url, source_type) VALUES
  ((SELECT id FROM ai_trend_categories WHERE slug = 'ai-side-income'), '네이버 블로그 수익화', 'https://blog.naver.com', 'blog'),
  ((SELECT id FROM ai_trend_categories WHERE slug = 'ai-side-income'), '쿠팡 파트너스', 'https://partners.coupang.com', 'blog'),
  ((SELECT id FROM ai_trend_categories WHERE slug = 'vibecoding-success'), 'Product Hunt', 'https://www.producthunt.com', 'producthunt'),
  ((SELECT id FROM ai_trend_categories WHERE slug = 'vibecoding-success'), 'Hacker News', 'https://news.ycombinator.com', 'reddit'),
  ((SELECT id FROM ai_trend_categories WHERE slug = 'mcp-recommendation'), 'Awesome MCP', 'https://github.com/punkpeye/awesome-mcp-servers', 'github'),
  ((SELECT id FROM ai_trend_categories WHERE slug = 'claude-levelup'), 'Anthropic GitHub', 'https://github.com/anthropics', 'github'),
  ((SELECT id FROM ai_trend_categories WHERE slug = 'claude-levelup'), 'Claude Squad', 'https://github.com/jhangmez/claude-squad', 'github');

-- 9. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_ai_trends_category_id ON ai_trends(category_id);
CREATE INDEX IF NOT EXISTS idx_ai_trends_verification_status ON ai_trends(verification_status);
CREATE INDEX IF NOT EXISTS idx_posting_history_category ON ai_trend_posting_history(category_id, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON ai_trend_categories(slug);

-- 10. 헬퍼 함수: 카테고리별 게시 가능 여부 확인
CREATE OR REPLACE FUNCTION check_category_posting_eligibility(p_category_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_last_posted TIMESTAMP WITH TIME ZONE;
  v_interval_days INTEGER;
  v_is_active BOOLEAN;
BEGIN
  SELECT last_posted_at, posting_interval_days, is_active
  INTO v_last_posted, v_interval_days, v_is_active
  FROM ai_trend_categories
  WHERE id = p_category_id;

  IF NOT v_is_active THEN
    RETURN FALSE;
  END IF;

  IF v_last_posted IS NULL THEN
    RETURN TRUE;
  END IF;

  RETURN (NOW() - v_last_posted) >= (v_interval_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- 11. 트리거: 카테고리 마지막 게시 시간 업데이트
CREATE OR REPLACE FUNCTION update_category_last_posted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = TRUE AND (OLD.is_published IS NULL OR OLD.is_published = FALSE) THEN
    UPDATE ai_trend_categories
    SET last_posted_at = NOW()
    WHERE id = NEW.category_id;
    
    INSERT INTO ai_trend_posting_history (category_id, trend_id, posted_at)
    VALUES (NEW.category_id, NEW.id, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_posting
AFTER INSERT OR UPDATE ON ai_trends
FOR EACH ROW EXECUTE FUNCTION update_category_last_posted();

-- 12. 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER update_ai_trend_categories_updated_at 
BEFORE UPDATE ON ai_trend_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_trend_auto_rules_updated_at 
BEFORE UPDATE ON ai_trend_auto_rules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();