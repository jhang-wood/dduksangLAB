# Supabase 에러 해결 가이드

## 🚨 발생한 에러들

1. **404 에러 - 페이지 없음**
   - `/auth/forgot-password` → ✅ 생성 완료
   - `/ai-trends` → 이미 존재 (Next.js 라우팅 문제일 수 있음)
   - `/register` → 이미 존재

2. **Supabase 404/400 에러**
   - `profiles` 테이블 접근 불가
   - `lecture_enrollments` 테이블 구조 문제
   - `payments` 테이블 구조 문제

## 🔧 해결 방법

### 1단계: Supabase 대시보드에서 마이그레이션 실행

1. Supabase 대시보드 접속
2. SQL Editor 열기
3. 다음 순서대로 SQL 실행:

#### A. profiles 테이블 수정 (005_fix_profiles_policies.sql)
```sql
-- 전체 내용을 복사하여 실행
```

#### B. lecture 관련 테이블 수정 (006_fix_lecture_tables.sql)
```sql
-- 전체 내용을 복사하여 실행
```

### 2단계: 기존 사용자 프로필 확인

```sql
-- 현재 사용자의 프로필이 있는지 확인
SELECT * FROM auth.users WHERE email = 'admin@dduksang.com';

-- 프로필이 없다면 생성
INSERT INTO public.profiles (id, email, name, role)
SELECT 
  id,
  email,
  '떡상연구소 관리자',
  'admin'
FROM auth.users 
WHERE email = 'admin@dduksang.com'
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
```

### 3단계: 권한 확인

```sql
-- RLS 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profiles', 'lecture_enrollments', 'payments');
```

## 🎯 즉시 해결 방법

### 빠른 해결책 (임시)

1. **프로필 자동 생성 활성화**
   - 이미 auth-context.tsx에 구현됨
   - 로그인 시 프로필이 없으면 자동 생성

2. **브라우저에서 확인**
   - F12 → Console
   - `[Auth] Profile not found, creating new profile...` 메시지 확인
   - 프로필 생성 후 자동으로 관리자 권한 부여 가능

### 영구 해결책

1. Supabase 대시보드에서 위의 SQL 마이그레이션 모두 실행
2. 테이블 구조 확인
3. RLS 정책 확인
4. 필요시 추가 권한 부여

## 📝 체크리스트

- [ ] forgot-password 페이지 생성됨
- [ ] profiles 테이블 RLS 정책 업데이트
- [ ] lecture_enrollments 테이블 생성/수정
- [ ] payments 테이블 생성/수정
- [ ] 관리자 프로필 존재 확인
- [ ] 브라우저 콘솔 에러 해결

## 🔍 디버깅 팁

콘솔에서 다음 로그 확인:
- `[Auth] Fetching profile for user:`
- `[Auth] Error fetching profile:` → 404면 프로필 없음
- `[Auth] Profile not found, creating new profile...` → 자동 생성 시도
- `[Auth] Profile created:` → 생성 성공

모든 마이그레이션 실행 후 페이지 새로고침하면 에러가 해결됩니다.