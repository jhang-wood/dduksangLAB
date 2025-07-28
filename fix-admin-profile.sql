-- 관리자 프로필 수정 SQL
INSERT INTO public.profiles (id, email, name, phone, role, created_at)
VALUES (
  '1c9792a8-0ab4-4644-9cf4-2e4bbb9cbea7',
  'admin@dduksang.com',
  '떡상연구소 관리자',
  '010-0000-0000',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  name = '떡상연구소 관리자',
  email = 'admin@dduksang.com';

-- 확인
SELECT * FROM public.profiles WHERE id = '1c9792a8-0ab4-4644-9cf4-2e4bbb9cbea7';