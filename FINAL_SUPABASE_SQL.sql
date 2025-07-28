-- =============================================
-- 🎯 최종 Supabase 관리자페이지 수정 SQL
-- =============================================
-- 누락된 테이블들과 author_name 컬럼 추가

-- 1. community_posts 테이블 생성
-- =============================================

CREATE TABLE IF NOT EXISTS public.community_posts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL DEFAULT 'Anonymous',
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS 활성화
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
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

-- 2. showcase_sites 테이블 생성
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
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS 활성화
ALTER TABLE public.showcase_sites ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
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

-- 3. lecture_chapters 테이블 생성
-- =============================================

CREATE TABLE IF NOT EXISTS public.lecture_chapters (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    lecture_id TEXT NOT NULL REFERENCES public.lectures(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(lecture_id, order_index)
);

-- RLS 활성화
ALTER TABLE public.lecture_chapters ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
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

-- 4. saas_products 테이블 생성
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
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS 활성화
ALTER TABLE public.saas_products ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
CREATE POLICY "Anyone can view products" ON public.saas_products 
FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON public.saas_products 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 5. Storage 버킷 생성
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책
DROP POLICY IF EXISTS "Anyone can view uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;

CREATE POLICY "Anyone can view uploads" ON storage.objects 
FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'uploads' AND auth.role() = 'authenticated'
);

-- 6. 인덱스 생성
-- =============================================

CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_featured ON public.community_posts(is_featured);

CREATE INDEX IF NOT EXISTS idx_showcase_sites_category ON public.showcase_sites(category);
CREATE INDEX IF NOT EXISTS idx_showcase_sites_featured ON public.showcase_sites(is_featured);
CREATE INDEX IF NOT EXISTS idx_showcase_sites_creator ON public.showcase_sites(created_by);

CREATE INDEX IF NOT EXISTS idx_lecture_chapters_lecture_id ON public.lecture_chapters(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_chapters_order ON public.lecture_chapters(order_index);

CREATE INDEX IF NOT EXISTS idx_saas_products_category ON public.saas_products(category);
CREATE INDEX IF NOT EXISTS idx_saas_products_recommended ON public.saas_products(is_recommended);
CREATE INDEX IF NOT EXISTS idx_saas_products_rating ON public.saas_products(rating);

-- 7. updated_at 트리거 함수 및 트리거
-- =============================================

-- 트리거 함수 생성 (이미 있으면 재생성)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 updated_at 트리거 추가
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.showcase_sites
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.lecture_chapters
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.saas_products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. 샘플 데이터 추가
-- =============================================

-- community_posts 샘플 데이터 (관리자 ID 사용)
INSERT INTO public.community_posts (
    id, title, content, category, author_id, author_name, tags, views, likes, comments_count, is_featured
) VALUES (
    'sample-post-1',
    'AI Agent 마스터과정 수강 후기',
    '정말 유익한 강의였습니다. ChatGPT API를 활용한 실전 프로젝트를 통해 많은 것을 배웠어요! 특히 자동화 부분이 인상깊었습니다.',
    'review',
    '1c9792a8-0ab4-4644-9cf4-2e4bbb9cbea7', -- 관리자 ID
    '떡상연구소 수강생',
    ARRAY['AI', '후기', 'ChatGPT', '자동화'],
    156,
    23,
    5,
    true
) ON CONFLICT (id) DO NOTHING;

-- showcase_sites 샘플 데이터
INSERT INTO public.showcase_sites (
    id, name, description, url, thumbnail_url, category, tags, views, likes, is_featured, created_by
) VALUES (
    'sample-site-1',
    'AI 콘텐츠 생성기',
    'ChatGPT를 활용한 자동 콘텐츠 생성 도구입니다. 블로그 포스트, 소셜미디어 컨텐츠를 쉽게 생성하세요.',
    'https://ai-content-generator.example.com',
    'https://via.placeholder.com/400x300/1a1a1a/f4c430?text=AI+Content',
    'AI',
    ARRAY['AI', 'Content', 'ChatGPT', 'Automation'],
    1234,
    89,
    true,
    '1c9792a8-0ab4-4644-9cf4-2e4bbb9cbea7'
) ON CONFLICT (id) DO NOTHING;

-- lecture_chapters 샘플 데이터
INSERT INTO public.lecture_chapters (
    id, lecture_id, title, description, video_url, duration, order_index, is_preview
) VALUES (
    'chapter-1',
    'ai-agent-master',
    '강의 소개 및 개요',
    'AI Agent 마스터과정의 전체적인 내용과 학습 목표를 소개합니다.',
    'https://www.youtube.com/watch?v=sample1',
    900,
    1,
    true
), (
    'chapter-2',
    'ai-agent-master',
    'ChatGPT API 기초',
    'ChatGPT API의 기본 사용법과 설정 방법을 학습합니다.',
    'https://www.youtube.com/watch?v=sample2',
    1200,
    2,
    false
), (
    'chapter-3',
    'ai-agent-master',
    '실전 프로젝트 구현',
    '실제 AI Agent를 구현하며 실전 경험을 쌓습니다.',
    'https://www.youtube.com/watch?v=sample3',
    1800,
    3,
    false
) ON CONFLICT (id) DO NOTHING;

-- saas_products 샘플 데이터
INSERT INTO public.saas_products (
    id, name, description, category, pricing_model, price_monthly, price_yearly,
    website_url, features, tags, rating, review_count, is_recommended, created_by
) VALUES (
    'product-1',
    'ChatGPT Plus',
    'OpenAI의 프리미엄 AI 어시스턴트 서비스로 GPT-4 모델과 고급 기능을 제공합니다.',
    'AI Assistant',
    'subscription',
    20000,
    200000,
    'https://chat.openai.com',
    ARRAY['GPT-4 접근', '무제한 사용', '플러그인 지원', '우선 처리'],
    ARRAY['AI', 'ChatGPT', 'OpenAI', 'GPT-4'],
    4.8,
    12500,
    true,
    '1c9792a8-0ab4-4644-9cf4-2e4bbb9cbea7'
), (
    'product-2',
    'Claude Pro',
    'Anthropic의 고급 AI 어시스턴트로 긴 문서 처리와 복잡한 추론에 특화되어 있습니다.',
    'AI Assistant',
    'subscription',
    20000,
    200000,
    'https://claude.ai',
    ARRAY['긴 문서 처리', '복잡한 추론', '코딩 지원', '창작 도구'],
    ARRAY['AI', 'Claude', 'Anthropic', '문서처리'],
    4.7,
    8900,
    true,
    '1c9792a8-0ab4-4644-9cf4-2e4bbb9cbea7'
) ON CONFLICT (id) DO NOTHING;

-- 9. 권한 설정
-- =============================================

-- 테이블 기본 권한
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Storage 권한
GRANT SELECT, INSERT ON storage.objects TO authenticated;

-- 함수 실행 권한
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;

-- =============================================
-- 🎉 설정 완료!
-- =============================================

SELECT '✅ 관리자페이지 데이터베이스 설정 완료!' as status,
       '모든 누락된 테이블이 생성되었습니다.' as message,
       '이제 관리자페이지에서 정상 작동합니다.' as next_step;