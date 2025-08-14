-- user_sites 테이블 생성
CREATE TABLE IF NOT EXISTS user_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    category TEXT NOT NULL DEFAULT 'AI 도구',
    tags TEXT[] DEFAULT '{}',
    views_today INTEGER DEFAULT 0,
    views_total INTEGER DEFAULT 0,
    rank_today INTEGER DEFAULT 0,
    rank_change INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE user_sites ENABLE ROW LEVEL SECURITY;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_sites_user_id ON user_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sites_active ON user_sites(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sites_views_today ON user_sites(views_today DESC);
CREATE INDEX IF NOT EXISTS idx_user_sites_category ON user_sites(category);

-- RLS 정책 생성
-- 모든 활성 사이트는 누구나 볼 수 있음
CREATE POLICY "Anyone can view active sites" ON user_sites
    FOR SELECT USING (is_active = true);

-- 사용자는 자신의 사이트만 관리 가능
CREATE POLICY "Users can manage own sites" ON user_sites
    FOR ALL USING (auth.uid() = user_id);

-- updated_at 트리거 추가
CREATE OR REPLACE FUNCTION update_user_sites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_sites_updated_at ON user_sites;
CREATE TRIGGER update_user_sites_updated_at 
    BEFORE UPDATE ON user_sites 
    FOR EACH ROW EXECUTE FUNCTION update_user_sites_updated_at();

-- 댓글 등록 시 토론 참여자에게 알림 보내기
COMMENT ON TABLE user_sites IS '사용자가 등록한 사이트 정보를 저장하는 테이블';
COMMENT ON COLUMN user_sites.rank_today IS '오늘 조회수 기준 순위 (1위부터 시작)';
COMMENT ON COLUMN user_sites.rank_change IS '어제 대비 순위 변동 (양수: 하락, 음수: 상승)';

-- 테이블 생성 완료 로그
DO $$ BEGIN
    RAISE NOTICE 'user_sites 테이블이 성공적으로 생성되었습니다.';
END $$;