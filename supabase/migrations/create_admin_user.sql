-- 관리자 계정 생성을 위한 SQL
-- 이 파일은 로컬 개발 환경에서만 실행하세요

-- 1. Auth 사용자 생성 (Supabase Dashboard에서 실행)
-- Email: [ADMIN_EMAIL_ADDRESS]
-- Password: [ADMIN_PASSWORD]

-- 2. 프로필에 관리자 권한 부여 (auth.users 테이블에서 admin@dduksang.com의 ID를 찾아 아래 쿼리 실행)
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = '[ADMIN_EMAIL_ADDRESS]';

-- 또는 직접 프로필 삽입 (user_id는 실제 auth.users의 ID로 교체)
/*
INSERT INTO public.profiles (id, email, name, phone, role, created_at)
VALUES (
  'YOUR-AUTH-USER-ID-HERE',
  '[ADMIN_EMAIL_ADDRESS]',
  '떡상연구소 관리자',
  '010-0000-0000',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
*/

-- 테스트용 관리자 계정 정보:
-- Email: [ADMIN_EMAIL_ADDRESS]
-- Password: [ADMIN_PASSWORD]
-- 
-- Supabase 대시보드에서:
-- 1. Authentication > Users 에서 위 이메일로 사용자 생성
-- 2. SQL Editor에서 생성된 사용자의 ID 확인: SELECT id, email FROM auth.users WHERE email = '[ADMIN_EMAIL_ADDRESS]';
-- 3. 위 주석 해제 후 ID 교체하여 실행