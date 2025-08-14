-- user_sites 테이블 생성
CREATE TABLE IF NOT EXISTS user_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    thumbnail_url TEXT,
    
    -- 조회수 통계
    views_today INTEGER DEFAULT 0,
    views_yesterday INTEGER DEFAULT 0,
    views_week INTEGER DEFAULT 0,
    views_month INTEGER DEFAULT 0,
    views_total INTEGER DEFAULT 0,
    
    -- 순위 정보
    rank_today INTEGER,
    rank_yesterday INTEGER,
    rank_change INTEGER DEFAULT 0,
    
    -- 커뮤니티 반응
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    
    -- 상태
    is_active BOOLEAN DEFAULT true,
    is_hot BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, url)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_sites_user ON user_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sites_rank ON user_sites(rank_today);
CREATE INDEX IF NOT EXISTS idx_user_sites_views ON user_sites(views_today DESC);

-- RLS 활성화
ALTER TABLE user_sites ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "Users can view all active sites" ON user_sites
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own sites" ON user_sites
    FOR ALL USING (auth.uid() = user_id);

-- 태그를 위한 별도 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS user_site_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES user_sites(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_tags_site ON user_site_tags(site_id);
CREATE INDEX IF NOT EXISTS idx_site_tags_tag ON user_site_tags(tag);

-- site_views 테이블 (조회수 추적)
CREATE TABLE IF NOT EXISTS site_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES user_sites(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ip_address INET,
    referrer TEXT,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_views_site ON site_views(site_id);
CREATE INDEX IF NOT EXISTS idx_site_views_date ON site_views(viewed_at);

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_site_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_sites
    SET 
        views_today = views_today + 1,
        views_total = views_total + 1,
        updated_at = NOW()
    WHERE id = NEW.site_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS trigger_increment_site_views ON site_views;
CREATE TRIGGER trigger_increment_site_views
    AFTER INSERT ON site_views
    FOR EACH ROW
    EXECUTE FUNCTION increment_site_views();

-- 일별 초기화 함수 (매일 자정에 실행)
CREATE OR REPLACE FUNCTION reset_daily_views()
RETURNS void AS $$
BEGIN
    UPDATE user_sites
    SET 
        views_yesterday = views_today,
        views_today = 0,
        rank_yesterday = rank_today;
    
    -- 순위 재계산
    WITH ranked_sites AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY views_today DESC) AS new_rank
        FROM user_sites
        WHERE is_active = true
    )
    UPDATE user_sites
    SET rank_today = ranked_sites.new_rank
    FROM ranked_sites
    WHERE user_sites.id = ranked_sites.id;
END;
$$ LANGUAGE plpgsql;