-- ===============================
-- 게임화된 마이페이지를 위한 테이블
-- ===============================

-- 사용자 사이트 등록
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

-- 사이트 조회 기록
CREATE TABLE IF NOT EXISTS site_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES user_sites(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ip_address INET,
    referrer TEXT,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 일일 미션 정의
CREATE TABLE IF NOT EXISTS mission_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    reward_points INTEGER NOT NULL,
    mission_type TEXT CHECK (mission_type IN ('daily', 'weekly', 'special')) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자별 미션 진행상황
CREATE TABLE IF NOT EXISTS user_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES mission_definitions(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, mission_id, DATE(created_at))
);

-- 포인트 거래 내역
CREATE TABLE IF NOT EXISTS point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('earned', 'spent', 'bonus', 'penalty')) NOT NULL,
    source TEXT NOT NULL, -- 'mission', 'site_registration', 'daily_login', etc.
    source_id UUID, -- mission_id, site_id 등 참조
    description TEXT,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 게임 통계
CREATE TABLE IF NOT EXISTS user_game_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    
    -- 레벨 시스템
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    points_today INTEGER DEFAULT 0,
    
    -- 활동 통계
    streak_days INTEGER DEFAULT 0,
    last_active_date DATE,
    best_streak INTEGER DEFAULT 0,
    
    -- 사이트 통계
    total_sites_registered INTEGER DEFAULT 0,
    total_views_received INTEGER DEFAULT 0,
    total_views_given INTEGER DEFAULT 0,
    
    -- 커뮤니티 통계
    total_posts INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_likes_received INTEGER DEFAULT 0,
    total_likes_given INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 일일 랭킹 스냅샷
CREATE TABLE IF NOT EXISTS daily_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ranking_date DATE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    site_id UUID REFERENCES user_sites(id) ON DELETE CASCADE,
    site_name TEXT NOT NULL,
    views_count INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(ranking_date, user_id, site_id)
);

-- 사이트 좋아요
CREATE TABLE IF NOT EXISTS site_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES user_sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(site_id, user_id)
);

-- 사이트 댓글
CREATE TABLE IF NOT EXISTS site_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES user_sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES site_comments(id) ON DELETE CASCADE,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 레벨 정의
CREATE TABLE IF NOT EXISTS level_definitions (
    level INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    min_experience INTEGER NOT NULL,
    max_experience INTEGER NOT NULL,
    color_scheme TEXT NOT NULL,
    perks TEXT[]
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_user_sites_user ON user_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sites_rank ON user_sites(rank_today);
CREATE INDEX IF NOT EXISTS idx_user_sites_views ON user_sites(views_today DESC);
CREATE INDEX IF NOT EXISTS idx_site_views_site ON site_views(site_id);
CREATE INDEX IF NOT EXISTS idx_site_views_date ON site_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_user_missions_user ON user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_date ON user_missions(created_at);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_rankings_date ON daily_rankings(ranking_date);
CREATE INDEX IF NOT EXISTS idx_daily_rankings_rank ON daily_rankings(rank);

-- RLS 정책
ALTER TABLE user_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_comments ENABLE ROW LEVEL SECURITY;

-- 사용자 사이트 정책
CREATE POLICY "Users can view all active sites" ON user_sites
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own sites" ON user_sites
    FOR ALL USING (auth.uid() = user_id);

-- 조회 기록 정책
CREATE POLICY "Users can create views" ON site_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Site owners can view their stats" ON site_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_sites
            WHERE user_sites.id = site_views.site_id
            AND user_sites.user_id = auth.uid()
        )
    );

-- 미션 정책
CREATE POLICY "Users can view own missions" ON user_missions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage missions" ON user_missions
    FOR ALL USING (true);

-- 포인트 정책
CREATE POLICY "Users can view own points" ON point_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- 게임 통계 정책
CREATE POLICY "Users can view own stats" ON user_game_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view others basic stats" ON user_game_stats
    FOR SELECT USING (true);

-- 랭킹 정책
CREATE POLICY "Everyone can view rankings" ON daily_rankings
    FOR SELECT USING (true);

-- 좋아요 정책
CREATE POLICY "Users can manage own likes" ON site_likes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view likes" ON site_likes
    FOR SELECT USING (true);

-- 댓글 정책
CREATE POLICY "Everyone can view comments" ON site_comments
    FOR SELECT USING (is_deleted = false);

CREATE POLICY "Users can create comments" ON site_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON site_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- 트리거: 조회수 증가 시 통계 업데이트
CREATE OR REPLACE FUNCTION update_site_view_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- 오늘 조회수 증가
    UPDATE user_sites
    SET 
        views_today = views_today + 1,
        views_total = views_total + 1,
        updated_at = NOW()
    WHERE id = NEW.site_id;
    
    -- 사용자 통계 업데이트
    UPDATE user_game_stats
    SET 
        total_views_given = total_views_given + 1
    WHERE user_id = NEW.viewer_id;
    
    UPDATE user_game_stats
    SET 
        total_views_received = total_views_received + 1
    WHERE user_id = (
        SELECT user_id FROM user_sites WHERE id = NEW.site_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_site_view_insert
    AFTER INSERT ON site_views
    FOR EACH ROW EXECUTE FUNCTION update_site_view_stats();

-- 트리거: 미션 완료 시 포인트 지급
CREATE OR REPLACE FUNCTION award_mission_points()
RETURNS TRIGGER AS $$
DECLARE
    mission_reward INTEGER;
    mission_title TEXT;
    user_balance INTEGER;
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false THEN
        -- 미션 보상 정보 가져오기
        SELECT reward_points, title INTO mission_reward, mission_title
        FROM mission_definitions
        WHERE id = NEW.mission_id;
        
        -- 현재 포인트 잔액 가져오기
        SELECT total_points INTO user_balance
        FROM user_game_stats
        WHERE user_id = NEW.user_id;
        
        IF user_balance IS NULL THEN
            user_balance := 0;
        END IF;
        
        -- 포인트 거래 기록
        INSERT INTO point_transactions (
            user_id, amount, transaction_type, source, source_id,
            description, balance_after
        ) VALUES (
            NEW.user_id, mission_reward, 'earned', 'mission', NEW.mission_id,
            '미션 완료: ' || mission_title, user_balance + mission_reward
        );
        
        -- 사용자 통계 업데이트
        UPDATE user_game_stats
        SET 
            total_points = total_points + mission_reward,
            points_today = points_today + mission_reward,
            experience_points = experience_points + mission_reward
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_mission_complete
    AFTER UPDATE ON user_missions
    FOR EACH ROW EXECUTE FUNCTION award_mission_points();

-- 트리거: 자정에 일일 통계 리셋
CREATE OR REPLACE FUNCTION reset_daily_stats()
RETURNS void AS $$
BEGIN
    -- 어제 조회수 업데이트
    UPDATE user_sites
    SET 
        views_yesterday = views_today,
        views_today = 0,
        rank_yesterday = rank_today;
    
    -- 일일 포인트 리셋
    UPDATE user_game_stats
    SET points_today = 0;
    
    -- 연속 출석 업데이트
    UPDATE user_game_stats
    SET 
        streak_days = CASE 
            WHEN last_active_date = CURRENT_DATE - INTERVAL '1 day' THEN streak_days + 1
            ELSE 1
        END,
        best_streak = GREATEST(best_streak, streak_days),
        last_active_date = CURRENT_DATE
    WHERE user_id IN (
        SELECT DISTINCT user_id FROM site_views 
        WHERE DATE(viewed_at) = CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql;

-- 기본 미션 데이터 삽입
INSERT INTO mission_definitions (code, title, description, icon, target_value, reward_points) VALUES
('visit_sites', '다른 사이트 방문', '다른 사람의 사이트 5개 방문하기', 'Eye', 5, 50),
('give_likes', '좋아요 누르기', '좋아요 10개 누르기', 'Heart', 10, 30),
('write_comments', '댓글 작성', '댓글 3개 작성하기', 'MessageSquare', 3, 100),
('daily_login', '연속 출석', '5일 연속 출석', 'Clock', 5, 20),
('reach_views', '조회수 달성', '내 사이트 조회수 100 달성', 'Trophy', 100, 200),
('register_site', '사이트 등록', '새로운 사이트 등록하기', 'Plus', 1, 150),
('profile_complete', '프로필 완성', '프로필 정보 모두 입력하기', 'User', 1, 50)
ON CONFLICT (code) DO NOTHING;

-- 레벨 정의 데이터 삽입
INSERT INTO level_definitions (level, name, min_experience, max_experience, color_scheme, perks) VALUES
(1, '브론즈 I', 0, 100, 'from-orange-700 to-orange-900', '{}'),
(2, '브론즈 II', 101, 250, 'from-orange-600 to-orange-800', '{}'),
(3, '브론즈 III', 251, 500, 'from-orange-500 to-orange-700', '{}'),
(4, '브론즈 IV', 501, 800, 'from-orange-400 to-orange-600', '{}'),
(5, '브론즈 V', 801, 1200, 'from-orange-300 to-orange-500', '{}'),
(6, '실버 I', 1201, 1700, 'from-gray-600 to-gray-800', '{"사이트 2개 등록 가능"}'),
(7, '실버 II', 1701, 2300, 'from-gray-500 to-gray-700', '{"사이트 2개 등록 가능"}'),
(8, '실버 III', 2301, 3000, 'from-gray-400 to-gray-600', '{"사이트 2개 등록 가능"}'),
(9, '실버 IV', 3001, 3800, 'from-gray-300 to-gray-500', '{"사이트 3개 등록 가능"}'),
(10, '실버 V', 3801, 4700, 'from-gray-200 to-gray-400', '{"사이트 3개 등록 가능"}'),
(11, '골드 I', 4701, 5700, 'from-yellow-600 to-yellow-800', '{"사이트 3개 등록 가능", "프로필 배지"}'),
(12, '골드 II', 5701, 6800, 'from-yellow-500 to-yellow-700', '{"사이트 3개 등록 가능", "프로필 배지"}'),
(13, '골드 III', 6801, 8000, 'from-yellow-400 to-yellow-600', '{"사이트 4개 등록 가능", "프로필 배지"}'),
(14, '골드 IV', 8001, 9300, 'from-yellow-300 to-yellow-500', '{"사이트 4개 등록 가능", "프로필 배지"}'),
(15, '골드 V', 9301, 10700, 'from-yellow-200 to-yellow-400', '{"사이트 5개 등록 가능", "프로필 배지", "HOT 배지"}')
ON CONFLICT (level) DO NOTHING;

-- 함수: 사용자 초기 게임 통계 생성
CREATE OR REPLACE FUNCTION create_user_game_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_game_stats (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 새 사용자 생성 시 게임 통계 자동 생성
CREATE TRIGGER on_user_created_game_stats
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_user_game_stats();

-- 함수: 일일 미션 자동 생성 (CRON job으로 실행)
CREATE OR REPLACE FUNCTION generate_daily_missions()
RETURNS void AS $$
DECLARE
    mission RECORD;
    profile RECORD;
BEGIN
    -- 모든 활성 사용자에 대해
    FOR profile IN SELECT id FROM profiles WHERE is_active = true LOOP
        -- 모든 일일 미션에 대해
        FOR mission IN SELECT * FROM mission_definitions WHERE mission_type = 'daily' AND is_active = true LOOP
            -- 오늘 미션이 없으면 생성
            INSERT INTO user_missions (user_id, mission_id, expires_at)
            VALUES (
                profile.id, 
                mission.id, 
                CURRENT_DATE + INTERVAL '1 day' - INTERVAL '1 second'
            )
            ON CONFLICT (user_id, mission_id, DATE(created_at)) DO NOTHING;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;