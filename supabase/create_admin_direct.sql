-- dduksangLAB 관리자 계정 직접 생성 스크립트
-- Supabase Dashboard의 SQL Editor에서 실행
-- 주의: 이 스크립트는 service_role 권한이 필요합니다

-- 함수를 사용하여 관리자 계정 생성
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- auth.users에 사용자 생성 (Supabase의 내부 함수 사용)
  -- 주의: 이 부분은 Supabase Dashboard의 Authentication 탭에서 수동으로 생성해야 합니다
  -- Email: admin@dduksang.com
  -- Password: dduksang2025!@#
  
  -- 생성된 사용자의 ID 가져오기
  SELECT id INTO new_user_id
  FROM auth.users
  WHERE email = 'admin@dduksang.com'
  LIMIT 1;
  
  -- 사용자가 존재하는 경우 profiles 테이블에 관리자 정보 추가
  IF new_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, email, name, phone, role, created_at, updated_at)
    VALUES (
      new_user_id,
      'admin@dduksang.com',
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
    
    RAISE NOTICE '관리자 프로필이 성공적으로 생성/업데이트되었습니다.';
  ELSE
    RAISE NOTICE '사용자를 찾을 수 없습니다. 먼저 Authentication 탭에서 사용자를 생성해주세요.';
  END IF;
END;
$$;

-- 함수 실행
SELECT create_admin_user();

-- 함수 삭제 (보안을 위해)
DROP FUNCTION IF EXISTS create_admin_user();

-- 관리자 계정 확인
SELECT 
  p.id,
  p.email,
  p.name,
  p.role,
  p.created_at,
  p.updated_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@dduksang.com';