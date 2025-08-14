-- 추천인 시스템 테이블 추가
-- 기존 schema.sql에 추가할 추천인 관련 테이블들

-- 추천인 관계 테이블
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- 추천인
    referee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,  -- 피추천인
    referral_code TEXT NOT NULL, -- 사용된 추천코드
    status TEXT CHECK (status IN ('pending', 'completed', 'paid_out')) DEFAULT 'pending',
    points_awarded INTEGER DEFAULT 0, -- 지급된 포인트
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ, -- 추천 완료 시점 (결제 시)
    UNIQUE(referee_id), -- 한 사용자는 한 번만 추천받을 수 있음
    UNIQUE(referrer_id, referee_id) -- 동일한 추천인-피추천인 관계 중복 방지
);

-- 사용자 포인트 테이블
CREATE TABLE IF NOT EXISTS user_points (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0, -- 총 보유 포인트
    cashable_points INTEGER DEFAULT 0, -- 현금화 가능 포인트
    earned_today INTEGER DEFAULT 0, -- 오늘 획득 포인트
    lifetime_earned INTEGER DEFAULT 0, -- 누적 획득 포인트
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    last_reset_date DATE DEFAULT CURRENT_DATE -- 일일 초기화 추적
);

-- 포인트 거래 내역
CREATE TABLE IF NOT EXISTS point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    transaction_type TEXT CHECK (transaction_type IN ('earned', 'spent', 'withdrawn', 'bonus')) NOT NULL,
    amount INTEGER NOT NULL, -- 양수: 획득, 음수: 사용
    source TEXT NOT NULL, -- 'referral', 'signup_bonus', 'activity', 'purchase', 'withdrawal'
    reference_id UUID, -- 관련 레퍼런스 (referral id, payment id 등)
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 추천코드 매핑 테이블 (사용자별 고유 코드)
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE, -- 추천코드 (예: JOHN2025, USER1234 등)
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0, -- 사용된 횟수
    max_usage INTEGER, -- 최대 사용 가능 횟수 (NULL: 무제한)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- 만료일 (NULL: 무기한)
    UNIQUE(user_id) -- 사용자당 하나의 활성 코드
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON point_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_point_transactions_type ON point_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_point_transactions_source ON point_transactions(source);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON referral_codes(is_active);

-- RLS 활성화
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;

-- RLS 정책

-- 추천인 관계 정책
CREATE POLICY "Users can view own referrals as referrer" ON referrals
    FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can view own referrals as referee" ON referrals
    FOR SELECT USING (auth.uid() = referee_id);

CREATE POLICY "System can insert referrals" ON referrals
    FOR INSERT WITH CHECK (true); -- API에서 검증 후 삽입

-- 포인트 정책
CREATE POLICY "Users can view own points" ON user_points
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own points" ON user_points
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert points" ON user_points
    FOR INSERT WITH CHECK (true); -- 신규 사용자 자동 생성

-- 포인트 거래내역 정책
CREATE POLICY "Users can view own transactions" ON point_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON point_transactions
    FOR INSERT WITH CHECK (true); -- API에서만 삽입

-- 추천코드 정책
CREATE POLICY "Anyone can read active codes for validation" ON referral_codes
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view own codes" ON referral_codes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage codes" ON referral_codes
    FOR ALL USING (true); -- API에서 관리

-- 트리거 함수들

-- 신규 사용자 포인트 계정 자동 생성
CREATE OR REPLACE FUNCTION create_user_points_account()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_points (user_id, total_points, cashable_points)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 신규 사용자 추천코드 자동 생성
CREATE OR REPLACE FUNCTION create_user_referral_code()
RETURNS TRIGGER AS $$
DECLARE
    base_code TEXT;
    final_code TEXT;
    counter INTEGER := 0;
BEGIN
    -- 사용자명 또는 이메일에서 코드 베이스 생성
    base_code := UPPER(COALESCE(
        SUBSTRING(NEW.name FROM 1 FOR 4),
        SUBSTRING(NEW.email FROM 1 FOR 4)
    ));
    
    -- 고유한 코드 생성 (중복 방지)
    LOOP
        IF counter = 0 THEN
            final_code := base_code || '2025';
        ELSE
            final_code := base_code || counter::TEXT;
        END IF;
        
        -- 중복 체크
        IF NOT EXISTS (SELECT 1 FROM referral_codes WHERE code = final_code) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
        
        -- 무한루프 방지
        IF counter > 9999 THEN
            final_code := 'USER' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8);
            EXIT;
        END IF;
    END LOOP;
    
    INSERT INTO referral_codes (user_id, code)
    VALUES (NEW.id, final_code)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 포인트 업데이트 함수
CREATE OR REPLACE FUNCTION update_user_points(
    p_user_id UUID,
    p_amount INTEGER,
    p_transaction_type TEXT,
    p_source TEXT,
    p_reference_id UUID DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_points INTEGER;
    is_cashable BOOLEAN := false;
BEGIN
    -- 현금화 가능한 포인트인지 확인
    is_cashable := p_source IN ('referral', 'signup_bonus');
    
    -- 포인트 업데이트
    UPDATE user_points
    SET 
        total_points = GREATEST(0, total_points + p_amount),
        cashable_points = CASE 
            WHEN is_cashable THEN GREATEST(0, cashable_points + p_amount)
            ELSE cashable_points
        END,
        earned_today = CASE 
            WHEN p_amount > 0 THEN earned_today + p_amount
            ELSE earned_today
        END,
        lifetime_earned = CASE 
            WHEN p_amount > 0 THEN lifetime_earned + p_amount
            ELSE lifetime_earned
        END,
        last_updated = NOW()
    WHERE user_id = p_user_id;
    
    -- 거래 내역 기록
    INSERT INTO point_transactions (
        user_id, transaction_type, amount, source, 
        reference_id, description
    ) VALUES (
        p_user_id, p_transaction_type, p_amount, p_source, 
        p_reference_id, p_description
    );
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 추천인 관계 완료 처리 함수
CREATE OR REPLACE FUNCTION complete_referral(p_referral_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    referral_record RECORD;
    signup_bonus INTEGER := 500;   -- 가입 보너스
    referral_bonus INTEGER := 2000; -- 추천 보너스 (결제 시)
BEGIN
    -- 추천 관계 조회
    SELECT * INTO referral_record
    FROM referrals
    WHERE id = p_referral_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- 추천인에게 포인트 지급
    PERFORM update_user_points(
        referral_record.referrer_id,
        referral_bonus,
        'earned',
        'referral',
        p_referral_id,
        '친구 추천 보너스'
    );
    
    -- 추천 관계 완료 처리
    UPDATE referrals
    SET 
        status = 'completed',
        points_awarded = referral_bonus,
        completed_at = NOW()
    WHERE id = p_referral_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 일일 포인트 초기화 함수
CREATE OR REPLACE FUNCTION reset_daily_points()
RETURNS void AS $$
BEGIN
    UPDATE user_points
    SET 
        earned_today = 0,
        last_reset_date = CURRENT_DATE
    WHERE last_reset_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (기존 handle_new_user 함수 수정 필요)
DROP TRIGGER IF EXISTS on_profile_created_points ON profiles;
CREATE TRIGGER on_profile_created_points
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_user_points_account();

DROP TRIGGER IF EXISTS on_profile_created_code ON profiles;
CREATE TRIGGER on_profile_created_code
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_user_referral_code();

-- 기본 설정 데이터 (admin_settings 테이블이 있는 경우만)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_settings') THEN
        INSERT INTO admin_settings (key, value, description) VALUES
            ('referral_config', '{"signup_bonus": 500, "referral_bonus": 2000, "max_referrals_per_user": 100}', '추천인 시스템 설정')
        ON CONFLICT (key) DO UPDATE SET 
            value = EXCLUDED.value,
            updated_at = NOW();
    END IF;
END $$;

-- 테스트 데이터 확인용 뷰 (개발용)
CREATE OR REPLACE VIEW referral_stats AS
SELECT 
    r.referrer_id,
    p.name as referrer_name,
    COUNT(*) as total_referrals,
    COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_referrals,
    SUM(r.points_awarded) as total_points_earned
FROM referrals r
JOIN profiles p ON r.referrer_id = p.id
GROUP BY r.referrer_id, p.name
ORDER BY total_referrals DESC;