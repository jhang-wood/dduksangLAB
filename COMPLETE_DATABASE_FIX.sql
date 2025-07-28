-- =================================
-- dduksangLAB Supabase 데이터베이스 완전 복구 SQL
-- 이 파일을 Supabase 대시보드 > SQL Editor에서 실행하세요
-- =================================

-- 1. 기존 테이블 및 정책 정리 (필요시)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view active lectures" ON public.lectures;
DROP POLICY IF EXISTS "Admins can manage lectures" ON public.lectures;

DROP POLICY IF EXISTS "Users can view own enrollments" ON public.lecture_enrollments;
DROP POLICY IF EXISTS "Users can enroll themselves" ON public.lecture_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollment" ON public.lecture_enrollments;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;

-- 2. profiles 테이블 생성
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. lectures 테이블 생성
CREATE TABLE IF NOT EXISTS public.lectures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES auth.users(id),
  instructor_name TEXT,
  duration INTEGER, -- in minutes
  price DECIMAL(10, 2),
  thumbnail_url TEXT,
  preview_url TEXT,
  category TEXT,
  level TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. lecture_enrollments 테이블 생성
CREATE TABLE IF NOT EXISTS public.lecture_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lecture_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, lecture_id)
);

-- 5. payments 테이블 생성
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lecture_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 6. RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 7. profiles 테이블 RLS 정책
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. lectures 테이블 RLS 정책
CREATE POLICY "Anyone can view active lectures" ON public.lectures
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage lectures" ON public.lectures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. lecture_enrollments 테이블 RLS 정책
CREATE POLICY "Users can view own enrollments" ON public.lecture_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.lecture_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment" ON public.lecture_enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- 10. payments 테이블 RLS 정책
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. 트리거 함수 생성 (사용자 프로필 자동 생성)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. 트리거 생성
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. updated_at 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. updated_at 트리거 적용
CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER lectures_updated_at
  BEFORE UPDATE ON public.lectures
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 15. 프로필 자동 생성 함수 (클라이언트에서 호출 가능)
CREATE OR REPLACE FUNCTION public.ensure_profile_exists(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    user_id,
    user_email,
    split_part(user_email, '@', 1),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. 함수 실행 권한 부여
GRANT EXECUTE ON FUNCTION public.ensure_profile_exists TO authenticated;

-- 17. AI Agent Master 강의 데이터 삽입
INSERT INTO public.lectures (
  id,
  title,
  description,
  instructor_name,
  duration,
  price,
  category,
  level,
  status
) VALUES (
  'ai-agent-master',
  'AI Agent 마스터과정',
  'AI로 비싼 강의의 핵심만 추출하고, 실행 가능한 자동화 프로그램으로 만드는 압도적인 방법을 알려드립니다.',
  '떡상연구소 대표',
  480,
  990000,
  'AI',
  'all',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- 18. 관리자 프로필 생성 (admin@dduksang.com 계정이 있는 경우)
INSERT INTO public.profiles (id, email, name, role)
SELECT 
  id,
  email,
  '떡상연구소 관리자',
  'admin'
FROM auth.users 
WHERE email = 'admin@dduksang.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin', name = '떡상연구소 관리자';

-- 19. 현재 로그인된 사용자를 관리자로 설정 (필요시 주석 해제)
-- UPDATE public.profiles 
-- SET role = 'admin', name = '떡상연구소 관리자'
-- WHERE id = auth.uid();

-- =================================
-- 완료 메시지
-- =================================
DO $$
BEGIN
  RAISE NOTICE '🎉 dduksangLAB 데이터베이스 스키마 복구 완료!';
  RAISE NOTICE '✅ profiles 테이블 생성됨';
  RAISE NOTICE '✅ lectures 테이블 생성됨';
  RAISE NOTICE '✅ lecture_enrollments 테이블 생성됨';
  RAISE NOTICE '✅ payments 테이블 생성됨';
  RAISE NOTICE '✅ RLS 정책 모두 설정됨';
  RAISE NOTICE '✅ 트리거 함수 생성됨';
  RAISE NOTICE '✅ AI Agent Master 강의 데이터 삽입됨';
  RAISE NOTICE '💡 이제 애플리케이션에서 profiles 테이블에 접근할 수 있습니다!';
END $$;