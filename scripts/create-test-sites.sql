-- 테스트 사이트 데이터 생성
-- user_sites 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS user_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
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

-- 정책 생성
CREATE POLICY "Users can view all active sites" ON user_sites
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own sites" ON user_sites
    FOR ALL USING (auth.uid() = user_id);

-- 테스트 사이트 데이터 삽입 (기존 프로필이 있다고 가정)
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- 첫 번째 사용자의 ID 가져오기
    SELECT id INTO test_user_id FROM profiles LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- 기존 테스트 데이터 삭제
        DELETE FROM user_sites WHERE name LIKE '%테스트%' OR name LIKE '%Test%';
        
        -- 테스트 사이트 데이터 삽입
        INSERT INTO user_sites (user_id, name, url, description, views_today, views_total, rank_today, rank_change, likes, comments) VALUES
        (test_user_id, '떡상랩 테스트 사이트', 'https://dduksang.com', '떡상연구소 메인 사이트', 1250, 15000, 1, -2, 45, 12),
        (test_user_id, '두 번째 테스트 사이트', 'https://test2.example.com', '두 번째 테스트 사이트입니다', 850, 8500, 3, 1, 23, 8);
        
        -- 다른 사용자들의 테스트 데이터 (순위 비교용)
        INSERT INTO user_sites (user_id, name, url, description, views_today, views_total, rank_today, rank_change, likes, comments) 
        SELECT 
            test_user_id,
            '경쟁 사이트 ' || generate_series,
            'https://competitor' || generate_series || '.com',
            '경쟁 사이트 ' || generate_series || ' 설명',
            1000 - (generate_series * 50),
            10000 + (generate_series * 1000),
            1 + generate_series,
            (random() * 10 - 5)::int,
            (random() * 50)::int,
            (random() * 20)::int
        FROM generate_series(2, 15);
        
        RAISE NOTICE '테스트 사이트 데이터가 성공적으로 생성되었습니다.';
    ELSE
        RAISE NOTICE '프로필이 없습니다. 먼저 사용자를 생성해주세요.';
    END IF;
END $$;