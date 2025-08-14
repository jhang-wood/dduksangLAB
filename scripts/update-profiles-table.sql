-- profiles 테이블 업데이트 (기존 테이블이 있을 경우 컬럼 추가)
-- 이미 존재하는 컬럼은 에러 무시

-- avatar_url 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- bio 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- is_active 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- email_verified 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- role 컬럼이 TEXT인 경우 그대로 유지 (enum 변환은 위험)
-- is_admin 컬럼은 이미 있으므로 유지

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- 기존 RLS 정책 확인 및 업데이트
-- 자신의 전체 프로필 업데이트 가능
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 활성 사용자만 조회 가능 (공개 프로필)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_active = true OR auth.uid() = id);

-- 프로필 이미지 저장을 위한 Storage 버킷 정책 (주석으로 안내)
-- Supabase 대시보드에서 다음을 실행하세요:
-- 1. Storage에서 'avatars' 버킷 생성
-- 2. Public 버킷으로 설정
-- 3. 다음 정책 추가:
--    - SELECT: true (모두 볼 수 있음)
--    - INSERT: auth.uid() = bucket_id (자신의 이미지만 업로드)
--    - UPDATE: auth.uid() = bucket_id
--    - DELETE: auth.uid() = bucket_id