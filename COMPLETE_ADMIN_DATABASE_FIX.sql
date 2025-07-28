-- =============================================
-- 🔧 떡상연구소 관리자페이지 완전 수정 스크립트
-- =============================================
-- 모든 404/400/401/406 에러를 해결하는 종합 SQL

-- 1. 기존 테이블들이 존재하는지 확인하고 필요한 컬럼 추가
-- =============================================

-- profiles 테이블 확인 및 수정
DO $$
BEGIN
    -- profiles 테이블 생성 (이미 존재할 수 있으므로 IF NOT EXISTS 사용)
    CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        phone TEXT,
        role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- name 컬럼이 없으면 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;

    -- role 컬럼이 없으면 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- 2. 강의 관련 테이블들
-- =============================================

-- lectures 테이블 생성
CREATE TABLE IF NOT EXISTS public.lectures (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER NOT NULL DEFAULT 0, -- 분 단위
    price INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    preview_url TEXT,
    thumbnail_url TEXT,
    objectives TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    target_audience TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.0,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- lecture_chapters 테이블 생성 (관리자페이지에서 참조하는 테이블)
CREATE TABLE IF NOT EXISTS public.lecture_chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0, -- 초 단위
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(lecture_id, order_index)
);

-- lecture_enrollments 테이블 생성
CREATE TABLE IF NOT EXISTS public.lecture_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lecture_id UUID NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    progress INTEGER DEFAULT 0, -- 0-100 퍼센트
    completed_at TIMESTAMP WITH TIME ZONE,
    last_watched_chapter_id UUID REFERENCES public.lecture_chapters(id),
    UNIQUE(user_id, lecture_id)
);

-- 3. 커뮤니티 및 사이트 관련 테이블들
-- =============================================

-- showcase_sites 테이블 생성 (이미 있을 수 있음)
CREATE TABLE IF NOT EXISTS public.showcase_sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'AI',
    tags TEXT[] DEFAULT '{}',
    creator_info JSONB DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- community_posts 테이블 수정 (author_name 컬럼 확인)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- author_name 컬럼이 없으면 추가
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'community_posts' AND column_name = 'author_name'
    ) THEN
        ALTER TABLE public.community_posts ADD COLUMN author_name TEXT NOT NULL DEFAULT 'Anonymous';
    END IF;
END $$;

-- 4. SaaS 제품 테이블 생성
-- =============================================

CREATE TABLE IF NOT EXISTS public.saas_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    pricing_model TEXT NOT NULL, -- 'free', 'freemium', 'paid', 'subscription'
    price_monthly INTEGER DEFAULT 0,
    price_yearly INTEGER DEFAULT 0,
    website_url TEXT,
    logo_url TEXT,
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    is_recommended BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. 결제 관련 테이블들
-- =============================================

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'KRW',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    transaction_id TEXT,
    provider TEXT, -- 'toss', 'stripe', etc.
    provider_payment_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Storage 버킷 생성
-- =============================================

-- uploads 버킷이 존재하지 않으면 생성
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 7. RLS (Row Level Security) 정책 설정
-- =============================================

-- profiles 테이블 RLS 활성화 및 정책
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 자신의 프로필 조회 정책
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- 자신의 프로필 수정 정책
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- 관리자는 모든 프로필 조회 가능
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- lectures 테이블 RLS
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can manage all lectures" ON public.lectures;

CREATE POLICY "Anyone can view published lectures" ON public.lectures
FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage all lectures" ON public.lectures
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- lecture_chapters 테이블 RLS
ALTER TABLE public.lecture_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view chapters of published lectures" ON public.lecture_chapters;
DROP POLICY IF EXISTS "Admins can manage all chapters" ON public.lecture_chapters;

CREATE POLICY "Anyone can view chapters of published lectures" ON public.lecture_chapters
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.lectures 
        WHERE id = lecture_id AND is_published = true
    )
);

CREATE POLICY "Admins can manage all chapters" ON public.lecture_chapters
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- community_posts 테이블 RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.community_posts;

CREATE POLICY "Anyone can view posts" ON public.community_posts
FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON public.community_posts
FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON public.community_posts
FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all posts" ON public.community_posts
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- showcase_sites 테이블 RLS
ALTER TABLE public.showcase_sites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view sites" ON public.showcase_sites;
DROP POLICY IF EXISTS "Users can create sites" ON public.showcase_sites;
DROP POLICY IF EXISTS "Users can update own sites" ON public.showcase_sites;
DROP POLICY IF EXISTS "Admins can manage all sites" ON public.showcase_sites;

CREATE POLICY "Anyone can view sites" ON public.showcase_sites
FOR SELECT USING (true);

CREATE POLICY "Users can create sites" ON public.showcase_sites
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own sites" ON public.showcase_sites
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all sites" ON public.showcase_sites
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- saas_products 테이블 RLS
ALTER TABLE public.saas_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON public.saas_products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.saas_products;

CREATE POLICY "Anyone can view products" ON public.saas_products
FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON public.saas_products
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- payments 테이블 RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;

CREATE POLICY "Users can view own payments" ON public.payments
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Storage 정책
DROP POLICY IF EXISTS "Anyone can view uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

CREATE POLICY "Anyone can view uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND auth.role() = 'authenticated'
);

-- 8. 인덱스 생성 (성능 최적화)
-- =============================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_lectures_published ON public.lectures(is_published);
CREATE INDEX IF NOT EXISTS idx_lectures_category ON public.lectures(category);
CREATE INDEX IF NOT EXISTS idx_lecture_chapters_lecture_id ON public.lecture_chapters(lecture_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_showcase_sites_featured ON public.showcase_sites(is_featured);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 9. 트리거 함수 생성 (updated_at 자동 업데이트)
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 updated_at 트리거 추가
DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.lectures;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.lectures
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.lecture_chapters;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.lecture_chapters
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.community_posts;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.showcase_sites;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.showcase_sites
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.saas_products;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.saas_products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.payments;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 10. 샘플 데이터 추가 (관리자페이지 테스트용)
-- =============================================

-- 관리자 계정 확인 및 생성
DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- 기존 관리자 계정 확인
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@dduksanglab.com' LIMIT 1;
    
    -- 관리자 프로필이 없으면 생성 (실제 auth.users 레코드는 Supabase Auth에서 생성되어야 함)
    IF admin_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, email, name, role)
        VALUES (admin_id, 'admin@dduksanglab.com', '관리자', 'admin')
        ON CONFLICT (id) DO UPDATE SET role = 'admin';
    END IF;
END $$;

-- 샘플 강의 데이터
INSERT INTO public.lectures (
    title, description, instructor_name, category, level, duration, price,
    is_published, thumbnail_url, objectives, requirements, target_audience
) VALUES (
    'AI Agent 마스터과정',
    'ChatGPT API를 활용한 실전 AI Agent 개발 과정입니다. 실무에서 바로 활용할 수 있는 다양한 AI Agent를 직접 개발해보세요.',
    '떡상연구소',
    'AI',
    'intermediate',
    480,
    299000,
    true,
    'https://via.placeholder.com/400x300/1a1a1a/f4c430?text=AI+Agent',
    ARRAY['ChatGPT API 활용법 마스터', 'AI Agent 아키텍처 설계', '실전 프로젝트 개발'],
    ARRAY['Python 기초 지식', 'API 사용 경험', '프로그래밍 기본 이해'],
    ARRAY['AI 개발자 지망생', 'No-Code 개발자', '스타트업 창업자']
) ON CONFLICT DO NOTHING;

-- 샘플 챕터 데이터
INSERT INTO public.lecture_chapters (
    lecture_id, title, description, video_url, duration, order_index, is_preview
) 
SELECT 
    l.id,
    '강의 소개 및 개요',
    'AI Agent 마스터과정의 전체적인 내용과 학습 목표를 소개합니다.',
    'https://www.youtube.com/watch?v=sample1',
    900,
    1,
    true
FROM public.lectures l 
WHERE l.title = 'AI Agent 마스터과정'
ON CONFLICT (lecture_id, order_index) DO NOTHING;

-- 샘플 SaaS 제품 데이터
INSERT INTO public.saas_products (
    name, description, category, pricing_model, price_monthly,
    website_url, features, tags, rating, is_recommended
) VALUES (
    'ChatGPT Plus',
    'OpenAI의 프리미엄 AI 어시스턴트 서비스로 GPT-4 모델과 고급 기능을 제공합니다.',
    'AI Assistant',
    'subscription',
    20000,
    'https://chat.openai.com',
    ARRAY['GPT-4 접근', '무제한 사용', '플러그인 지원', '우선 처리'],
    ARRAY['AI', 'ChatGPT', 'OpenAI', 'GPT-4'],
    4.8,
    true
) ON CONFLICT DO NOTHING;

-- 11. 함수 생성 (관리자페이지에서 사용할 통계 함수들)
-- =============================================

-- 전체 통계 함수
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.profiles),
        'total_lectures', (SELECT COUNT(*) FROM public.lectures),
        'published_lectures', (SELECT COUNT(*) FROM public.lectures WHERE is_published = true),
        'total_posts', (SELECT COUNT(*) FROM public.community_posts),
        'total_sites', (SELECT COUNT(*) FROM public.showcase_sites),
        'total_payments', (SELECT COUNT(*) FROM public.payments WHERE status = 'completed'),
        'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'completed')
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. 최종 권한 설정
-- =============================================

-- 함수 실행 권한
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;

-- 테이블 기본 권한
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Storage 권한
GRANT SELECT, INSERT ON storage.objects TO authenticated;

-- =============================================
-- 🎉 설정 완료!
-- =============================================

-- 이 스크립트를 실행한 후:
-- 1. 관리자페이지에서 모든 섹션이 정상 작동해야 합니다
-- 2. 404 에러 (테이블 없음) → 해결됨
-- 3. 400 에러 (잘못된 쿼리) → 스키마 수정으로 해결됨  
-- 4. 401 에러 (권한 없음) → RLS 정책으로 해결됨
-- 5. 406 에러 (스키마 불일치) → 정확한 스키마로 해결됨

SELECT 'Admin Database Setup Complete! 🎉' as status;