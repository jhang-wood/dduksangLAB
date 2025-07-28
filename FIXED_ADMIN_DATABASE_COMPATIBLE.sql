-- =============================================
-- 🔧 호환성 수정된 관리자페이지 데이터베이스 스크립트
-- =============================================
-- 기존 테이블 타입과 호환되도록 수정된 버전

-- 1. 먼저 기존 테이블 구조 확인
-- =============================================

-- 기존 테이블들의 ID 컬럼 타입 확인
DO $$
DECLARE
    lectures_id_type TEXT;
    posts_id_type TEXT;
    sites_id_type TEXT;
BEGIN
    -- lectures 테이블 id 컬럼 타입 확인
    SELECT data_type INTO lectures_id_type
    FROM information_schema.columns 
    WHERE table_name = 'lectures' AND column_name = 'id' AND table_schema = 'public';
    
    -- community_posts 테이블 id 컬럼 타입 확인
    SELECT data_type INTO posts_id_type
    FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'id' AND table_schema = 'public';
    
    -- showcase_sites 테이블 id 컬럼 타입 확인
    SELECT data_type INTO sites_id_type
    FROM information_schema.columns 
    WHERE table_name = 'showcase_sites' AND column_name = 'id' AND table_schema = 'public';
    
    RAISE NOTICE 'lectures.id 타입: %', COALESCE(lectures_id_type, 'NULL');
    RAISE NOTICE 'community_posts.id 타입: %', COALESCE(posts_id_type, 'NULL');
    RAISE NOTICE 'showcase_sites.id 타입: %', COALESCE(sites_id_type, 'NULL');
END $$;

-- 2. profiles 테이블 생성 및 수정 (UUID 타입 유지)
-- =============================================

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

-- profiles 테이블에 누락된 컬럼 추가
DO $$
BEGIN
    -- name 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'name' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;

    -- role 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'role' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;

    -- phone 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'phone' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;

    -- avatar_url 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'avatar_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;

    -- bio 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'bio' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN bio TEXT;
    END IF;
END $$;

-- 3. lectures 테이블 처리 (기존 타입에 맞춰 생성)
-- =============================================

-- lectures 테이블이 없으면 TEXT 타입으로 생성
CREATE TABLE IF NOT EXISTS public.lectures (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration INTEGER NOT NULL DEFAULT 0,
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

-- lectures 테이블에 누락된 컬럼들 추가
DO $$
BEGIN
    -- objectives 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lectures' AND column_name = 'objectives' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lectures ADD COLUMN objectives TEXT[] DEFAULT '{}';
    END IF;

    -- requirements 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lectures' AND column_name = 'requirements' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lectures ADD COLUMN requirements TEXT[] DEFAULT '{}';
    END IF;

    -- target_audience 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lectures' AND column_name = 'target_audience' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lectures ADD COLUMN target_audience TEXT[] DEFAULT '{}';
    END IF;

    -- tags 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lectures' AND column_name = 'tags' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lectures ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;

    -- rating 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lectures' AND column_name = 'rating' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lectures ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.0;
    END IF;

    -- student_count 컬럼 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'lectures' AND column_name = 'student_count' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lectures ADD COLUMN student_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 4. lecture_chapters 테이블 생성 (TEXT 타입으로 호환)
-- =============================================

CREATE TABLE IF NOT EXISTS public.lecture_chapters (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    lecture_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(lecture_id, order_index)
);

-- lecture_chapters의 외래키 제약조건 추가 (텍스트 타입으로)
DO $$
BEGIN
    -- 외래키 제약조건이 없으면 추가
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'lecture_chapters_lecture_id_fkey' 
        AND table_name = 'lecture_chapters'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lecture_chapters 
        ADD CONSTRAINT lecture_chapters_lecture_id_fkey 
        FOREIGN KEY (lecture_id) REFERENCES public.lectures(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. community_posts 테이블 수정
-- =============================================

-- community_posts 테이블이 없으면 생성
CREATE TABLE IF NOT EXISTS public.community_posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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

-- community_posts에 author_name 컬럼 추가
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'community_posts' AND column_name = 'author_name' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.community_posts ADD COLUMN author_name TEXT NOT NULL DEFAULT 'Anonymous';
    END IF;
END $$;

-- 6. showcase_sites 테이블 생성
-- =============================================

CREATE TABLE IF NOT EXISTS public.showcase_sites (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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

-- 7. lecture_enrollments 테이블 생성
-- =============================================

CREATE TABLE IF NOT EXISTS public.lecture_enrollments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lecture_id TEXT NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_watched_chapter_id TEXT,
    UNIQUE(user_id, lecture_id)
);

-- lecture_enrollments 외래키 추가
DO $$
BEGIN
    -- lecture_id 외래키
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'lecture_enrollments_lecture_id_fkey' 
        AND table_name = 'lecture_enrollments'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lecture_enrollments 
        ADD CONSTRAINT lecture_enrollments_lecture_id_fkey 
        FOREIGN KEY (lecture_id) REFERENCES public.lectures(id) ON DELETE CASCADE;
    END IF;

    -- last_watched_chapter_id 외래키
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'lecture_enrollments_chapter_id_fkey' 
        AND table_name = 'lecture_enrollments'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.lecture_enrollments 
        ADD CONSTRAINT lecture_enrollments_chapter_id_fkey 
        FOREIGN KEY (last_watched_chapter_id) REFERENCES public.lecture_chapters(id);
    END IF;
END $$;

-- 8. saas_products 테이블 생성
-- =============================================

CREATE TABLE IF NOT EXISTS public.saas_products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    pricing_model TEXT NOT NULL CHECK (pricing_model IN ('free', 'freemium', 'paid', 'subscription')),
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

-- 9. payments 테이블 생성
-- =============================================

CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lecture_id TEXT,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'KRW',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT,
    transaction_id TEXT,
    provider TEXT,
    provider_payment_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- payments 외래키 추가
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_lecture_id_fkey' 
        AND table_name = 'payments'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.payments 
        ADD CONSTRAINT payments_lecture_id_fkey 
        FOREIGN KEY (lecture_id) REFERENCES public.lectures(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 10. Storage 버킷 생성
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 11. RLS 정책 설정
-- =============================================

-- profiles 테이블 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

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

-- 나머지 테이블들 RLS 설정
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcase_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- community_posts 정책
DROP POLICY IF EXISTS "Anyone can view posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.community_posts;

CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.community_posts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- showcase_sites 정책
DROP POLICY IF EXISTS "Anyone can view sites" ON public.showcase_sites;
DROP POLICY IF EXISTS "Users can create sites" ON public.showcase_sites;
DROP POLICY IF EXISTS "Users can update own sites" ON public.showcase_sites;
DROP POLICY IF EXISTS "Admins can manage all sites" ON public.showcase_sites;

CREATE POLICY "Anyone can view sites" ON public.showcase_sites FOR SELECT USING (true);
CREATE POLICY "Users can create sites" ON public.showcase_sites FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own sites" ON public.showcase_sites FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage all sites" ON public.showcase_sites FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Storage 정책
DROP POLICY IF EXISTS "Anyone can view uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND auth.role() = 'authenticated'
);

-- 12. 인덱스 생성
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

-- 13. 트리거 함수 및 트리거 생성
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.lectures;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.lectures FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.lecture_chapters;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.lecture_chapters FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.community_posts;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.showcase_sites;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.showcase_sites FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.saas_products;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.saas_products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at ON public.payments;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 14. 샘플 데이터 추가
-- =============================================

-- 샘플 강의 데이터
INSERT INTO public.lectures (
    id, title, description, instructor_name, category, level, duration, price,
    is_published, thumbnail_url, objectives, requirements, target_audience
) VALUES (
    gen_random_uuid()::TEXT,
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
) ON CONFLICT (id) DO NOTHING;

-- 샘플 커뮤니티 데이터 (author_id는 실제 사용자 ID로 교체 필요)
INSERT INTO public.community_posts (
    id, title, content, category, author_id, author_name, tags, views, likes
) VALUES (
    gen_random_uuid()::TEXT,
    'AI Agent 마스터과정 수강 후기',
    '정말 유익한 강의였습니다. ChatGPT API를 활용한 실전 프로젝트를 통해 많은 것을 배웠어요!',
    'review',
    auth.uid(),
    '수강생1',
    ARRAY['AI', '후기', 'ChatGPT'],
    156,
    23
) ON CONFLICT (id) DO NOTHING;

-- 샘플 사이트 데이터
INSERT INTO public.showcase_sites (
    id, name, description, url, thumbnail_url, category, tags, views, likes
) VALUES (
    gen_random_uuid()::TEXT,
    'AI 콘텐츠 생성기',
    'ChatGPT를 활용한 자동 콘텐츠 생성 도구입니다. 블로그 포스트, 소셜미디어 컨텐츠를 쉽게 생성하세요.',
    'https://ai-content-generator.example.com',
    'https://via.placeholder.com/400x300/1a1a1a/f4c430?text=AI+Content',
    'AI',
    ARRAY['AI', 'Content', 'ChatGPT', 'Automation'],
    1234,
    89
) ON CONFLICT (id) DO NOTHING;

-- 권한 설정
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON storage.objects TO authenticated;

-- 완료 메시지
SELECT '✅ 호환성 수정된 관리자 데이터베이스 설정 완료!' as status;