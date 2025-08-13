-- dduksangLAB 관리자 계정 생성 스크립트
-- 이 스크립트는 Supabase Dashboard의 SQL Editor에서 실행해주세요.

-- 주의: 이 스크립트는 Supabase의 서비스 역할 키가 필요합니다.
-- Supabase Dashboard에서 다음 단계를 따라주세요:

-- Step 1: Authentication > Users 탭에서 수동으로 사용자 생성
-- Email: [ADMIN_EMAIL_ADDRESS]
-- Password: [ADMIN_PASSWORD]
-- Auto Confirm Email: 체크

-- Step 2: 생성된 사용자의 ID 확인
-- 아래 쿼리를 SQL Editor에서 실행하여 방금 생성한 사용자의 ID를 확인합니다:
/*
SELECT id, email, created_at 
FROM auth.users 
WHERE email = '[ADMIN_EMAIL_ADDRESS]';
*/

-- Step 3: profiles 테이블에 관리자 정보 추가
-- 위에서 확인한 user ID를 아래 쿼리의 'YOUR-USER-ID-HERE' 부분에 입력하고 실행합니다:
/*
INSERT INTO public.profiles (id, email, name, phone, role, created_at, updated_at)
VALUES (
  'YOUR-USER-ID-HERE', -- 실제 auth.users의 ID로 교체
  '[ADMIN_EMAIL_ADDRESS]',
  '떡상연구소 관리자',
  '010-0000-0000',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  name = '떡상연구소 관리자',
  updated_at = NOW();
*/

-- Step 4: 관리자 권한 확인
-- 아래 쿼리를 실행하여 관리자 계정이 올바르게 생성되었는지 확인합니다:
/*
SELECT 
  p.id,
  p.email,
  p.name,
  p.role,
  p.created_at,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = '[ADMIN_EMAIL_ADDRESS]';
*/

-- 생성된 관리자 계정 정보:
-- Email: [ADMIN_EMAIL_ADDRESS]
-- Password: [ADMIN_PASSWORD]
-- Role: admin
-- Name: 떡상연구소 관리자