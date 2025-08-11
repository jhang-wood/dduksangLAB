-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'instructor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lecture_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('system', 'lecture', 'payment', 'community');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lectures table
CREATE TABLE IF NOT EXISTS lectures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL, -- in minutes
  price INTEGER NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  level lecture_level NOT NULL,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lecture chapters
CREATE TABLE IF NOT EXISTS lecture_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lecture enrollments
CREATE TABLE IF NOT EXISTS lecture_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
  payment_id UUID,
  status enrollment_status DEFAULT 'active',
  progress_percentage NUMERIC(5,2) DEFAULT 0,
  last_watched_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lecture_id)
);

-- Chapter progress tracking
CREATE TABLE IF NOT EXISTS chapter_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES lecture_enrollments(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES lecture_chapters(id) ON DELETE CASCADE,
  watched_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, chapter_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  lecture_id UUID REFERENCES lectures(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  payapp_order_id TEXT,
  payapp_receipt_url TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community comments
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  likes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post likes tracking
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Comment likes tracking
CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- SaaS products showcase
CREATE TABLE IF NOT EXISTS saas_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  price TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  users_count INTEGER DEFAULT 0,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_name TEXT,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  referrer_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin settings
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lectures_category ON lectures(category);
CREATE INDEX IF NOT EXISTS idx_lectures_published ON lectures(is_published);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON lecture_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_lecture ON lecture_enrollments(lecture_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_name);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lectures_updated_at ON lectures;
CREATE TRIGGER update_lectures_updated_at BEFORE UPDATE ON lectures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lecture_chapters_updated_at ON lecture_chapters;
CREATE TRIGGER update_lecture_chapters_updated_at BEFORE UPDATE ON lecture_chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_enrollments_updated_at ON lecture_enrollments;
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON lecture_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chapter_progress_updated_at ON chapter_progress;
CREATE TRIGGER update_chapter_progress_updated_at BEFORE UPDATE ON chapter_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON community_posts;
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON community_comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON community_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_saas_products_updated_at ON saas_products;
CREATE TRIGGER update_saas_products_updated_at BEFORE UPDATE ON saas_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view count increment functions
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

CREATE OR REPLACE FUNCTION increment_lecture_views(lecture_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE lectures
  SET view_count = view_count + 1
  WHERE id = lecture_uuid;
END;
$$;

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Lectures policies
CREATE POLICY "Published lectures are viewable by everyone" ON lectures
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all lectures" ON lectures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Chapter policies
CREATE POLICY "View chapters of enrolled lectures" ON lecture_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lecture_enrollments
      WHERE lecture_enrollments.lecture_id = lecture_chapters.lecture_id
      AND lecture_enrollments.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" ON lecture_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollments" ON lecture_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Community posts policies
CREATE POLICY "Published posts are viewable by everyone" ON community_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Published comments are viewable by everyone" ON community_comments
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON community_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON community_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Likes policies
CREATE POLICY "Anyone can view likes" ON post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON post_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comment likes" ON comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own comment likes" ON comment_likes
  FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics policies
CREATE POLICY "Admins can view all analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin settings policies
CREATE POLICY "Admins can view settings" ON admin_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update settings" ON admin_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ===============================
-- FASTCAMPUS STYLE UX 확장 테이블들
-- ===============================

-- 찜하기/북마크 시스템
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lecture_id)
);

-- 강의 리뷰 시스템
CREATE TABLE IF NOT EXISTS lecture_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    is_verified BOOLEAN DEFAULT false, -- 실제 수강생 인증
    helpful_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lecture_id)
);

-- 리뷰 도움됨 평가
CREATE TABLE IF NOT EXISTS review_helpfulness (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    review_id UUID REFERENCES lecture_reviews(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, review_id)
);

-- 배지 정의
CREATE TABLE IF NOT EXISTS badge_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')) DEFAULT 'common',
    requirements JSONB, -- 획득 조건
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 배지 획득
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badge_definitions(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    max_progress INTEGER DEFAULT 0,
    UNIQUE(user_id, badge_id)
);

-- 학습 목표
CREATE TABLE IF NOT EXISTS learning_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    unit TEXT NOT NULL, -- 'minutes', 'courses', 'certificates'
    period TEXT CHECK (period IN ('daily', 'weekly', 'monthly')) NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학습 활동 로그
CREATE TABLE IF NOT EXISTS learning_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'lesson_completed', 'course_enrolled', 'badge_earned', etc.
    activity_data JSONB,
    points_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 실시간 활동 피드
CREATE TABLE IF NOT EXISTS activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    user_name TEXT NOT NULL,
    activity_type TEXT NOT NULL, -- 'enrollment', 'completion', 'review', 'achievement'
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    lecture_title TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    message TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 할인 캠페인
CREATE TABLE IF NOT EXISTS discount_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    max_enrollments INTEGER,
    current_enrollments INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 얼리버드 단계 관리
CREATE TABLE IF NOT EXISTS early_bird_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES discount_campaigns(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    discount_percentage INTEGER NOT NULL,
    max_slots INTEGER NOT NULL,
    current_slots INTEGER DEFAULT 0,
    end_date TIMESTAMPTZ NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 강사 질문/답변
CREATE TABLE IF NOT EXISTS instructor_qa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES profiles(id),
    question TEXT NOT NULL,
    answer TEXT,
    is_answered BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    answered_at TIMESTAMPTZ
);

-- 무료 체험 기록
CREATE TABLE IF NOT EXISTS free_trial_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
    ip_address INET,
    access_duration INTEGER DEFAULT 0, -- minutes
    converted_to_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, lecture_id) -- 사용자당 한 번만 무료 체험
);

-- 강의 통계 (실시간 업데이트용)
CREATE TABLE IF NOT EXISTS lecture_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE UNIQUE,
    active_users_count INTEGER DEFAULT 0,
    completion_count_today INTEGER DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    average_completion_time INTEGER DEFAULT 0, -- minutes
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 사용자 프로필 확장 (학습 정보)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS learning_streak INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_learning_hours INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0;

-- 북마크 인덱스
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_lecture_id ON bookmarks(lecture_id);

-- 리뷰 관련 인덱스
CREATE INDEX IF NOT EXISTS idx_reviews_lecture ON lecture_reviews(lecture_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON lecture_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful ON lecture_reviews(helpful_count DESC);

-- 활동 피드 인덱스
CREATE INDEX IF NOT EXISTS idx_activity_feed_public ON activity_feed(created_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_learning_activities_user ON learning_activities(user_id, created_at DESC);

-- RLS 정책 추가
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecture_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_helpfulness ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_trial_access ENABLE ROW LEVEL SECURITY;

-- 북마크 정책
CREATE POLICY "Users can manage own bookmarks" ON bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- 리뷰 정책
CREATE POLICY "Users can view all reviews" ON lecture_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON lecture_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON lecture_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- 배지 정책
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

-- 학습 목표 정책
CREATE POLICY "Users can manage own goals" ON learning_goals
    FOR ALL USING (auth.uid() = user_id);

-- 학습 활동 정책
CREATE POLICY "Users can view own activities" ON learning_activities
    FOR SELECT USING (auth.uid() = user_id);

-- 강사 Q&A 정책
CREATE POLICY "Users can view public QA" ON instructor_qa
    FOR SELECT USING (is_public = true OR auth.uid() = student_id);

CREATE POLICY "Students can ask questions" ON instructor_qa
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- 활동 피드 정책
CREATE POLICY "Everyone can view public feed" ON activity_feed
    FOR SELECT USING (is_public = true);

-- 리뷰 평점 업데이트 함수
CREATE OR REPLACE FUNCTION update_lecture_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE lectures
    SET 
        view_count = (
            SELECT COALESCE(AVG(rating), 0)::NUMERIC(3,2)
            FROM lecture_reviews
            WHERE lecture_id = COALESCE(NEW.lecture_id, OLD.lecture_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.lecture_id, OLD.lecture_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 리뷰 추가/수정/삭제 시 평점 업데이트 트리거
CREATE TRIGGER update_lecture_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON lecture_reviews
    FOR EACH ROW EXECUTE PROCEDURE update_lecture_rating();

-- 수강 시작 시 활동 피드 추가
CREATE OR REPLACE FUNCTION add_enrollment_activity()
RETURNS TRIGGER AS $$
DECLARE
    lecture_title_var TEXT;
    user_name_var TEXT;
BEGIN
    -- 강의 제목 가져오기
    SELECT title INTO lecture_title_var
    FROM lectures
    WHERE id = NEW.lecture_id;
    
    -- 사용자 이름 가져오기
    SELECT name INTO user_name_var
    FROM profiles
    WHERE id = NEW.user_id;
    
    -- 익명화된 사용자명으로 피드 추가
    INSERT INTO activity_feed (user_id, user_name, activity_type, lecture_id, lecture_title)
    VALUES (
        NEW.user_id,
        SUBSTRING(user_name_var FROM 1 FOR 1) || '**님',
        'enrollment',
        NEW.lecture_id,
        lecture_title_var
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_enrollment_activity
    AFTER INSERT ON lecture_enrollments
    FOR EACH ROW EXECUTE PROCEDURE add_enrollment_activity();

-- 기본 배지 데이터 삽입
INSERT INTO badge_definitions (name, display_name, description, icon, color, rarity, points) VALUES
('first_steps', '첫 발걸음', '첫 강의를 완료했습니다', '👶', 'from-green-500 to-emerald-500', 'common', 10),
('ai_explorer', 'AI 탐험가', 'AI 관련 강의 3개를 완료했습니다', '🤖', 'from-blue-500 to-cyan-500', 'rare', 50),
('speed_learner', '스피드 러너', '하루에 3시간 이상 학습했습니다', '⚡', 'from-yellow-500 to-orange-500', 'rare', 100),
('streak_master', '연속 학습 마스터', '7일 연속 학습했습니다', '🔥', 'from-red-500 to-pink-500', 'epic', 200),
('perfectionist', '완벽주의자', '모든 퀴즈를 100% 정답으로 통과했습니다', '💎', 'from-purple-500 to-indigo-500', 'legendary', 500)
ON CONFLICT (name) DO NOTHING;

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('site_maintenance', '{"enabled": false, "message": ""}', '사이트 유지보수 모드 설정'),
  ('payment_config', '{"min_amount": 1000, "commission_rate": 0.1}', '결제 관련 설정'),
  ('email_config', '{"from_email": "noreply@dduksang.com", "from_name": "떡상연구소"}', '이메일 발송 설정'),
  ('ux_features', '{"bookmarks_enabled": true, "gamification_enabled": true, "social_proof_enabled": true}', 'UX 기능 활성화 설정')
ON CONFLICT (key) DO NOTHING;

-- 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 신규 사용자 생성 시 프로필 자동 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();