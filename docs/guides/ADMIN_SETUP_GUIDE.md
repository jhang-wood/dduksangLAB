# 관리자 계정 설정 가이드

## 🔐 보안 주의사항

**중요**: 민감한 정보(비밀번호, 이메일 등)는 절대 코드나 문서에 하드코딩하지 마세요!

## 📋 환경변수 설정

### 1. `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일이 있는지 확인하고, 없다면 생성합니다:

```bash
# .env.example 파일을 복사하여 .env.local 생성
cp .env.example .env.local
```

### 2. 관리자 계정 환경변수 설정

`.env.local` 파일에 다음 환경변수를 설정합니다:

```bash
# 관리자 계정 정보 (개발 환경용)
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_PHONE=010-1234-5678
ADMIN_NAME=관리자명
```

**보안 팁**:

- 강력한 비밀번호 사용 (최소 12자, 대소문자, 숫자, 특수문자 포함)
- 프로덕션 환경에서는 반드시 다른 비밀번호 사용
- `.env.local` 파일은 Git에 커밋되지 않음 (`.gitignore`에 포함됨)

## 🗂️ 마이그레이션 파일 구조

마이그레이션 파일들은 플레이스홀더를 사용하여 민감정보를 보호합니다:

- `004_create_admin_account.sql`: `[ADMIN_EMAIL_ADDRESS]`, `[ADMIN_PASSWORD]` 플레이스홀더 사용
- `create_admin_user.sql`: 동일한 플레이스홀더 패턴 사용

이 파일들은 그대로 Git에 커밋되며, 실제 값은 환경변수에서 가져옵니다.

## 🚀 관리자 계정 생성 방법

### 방법 1: Supabase Dashboard 사용 (권장)

1. **Supabase Dashboard 접속**
   - [Supabase Dashboard](https://app.supabase.com)에 로그인

2. **사용자 생성**
   - Authentication > Users 탭으로 이동
   - "Invite User" 또는 "Create User" 클릭
   - 환경변수의 `ADMIN_EMAIL`과 `ADMIN_PASSWORD` 입력
   - "Auto Confirm Email" 체크

3. **관리자 권한 부여**
   - SQL Editor로 이동
   - 다음 쿼리 실행:

   ```sql
   -- 생성한 사용자의 ID 확인
   SELECT id, email FROM auth.users
   WHERE email = '환경변수의_ADMIN_EMAIL';

   -- 프로필에 관리자 권한 추가
   INSERT INTO public.profiles (id, email, name, phone, role, created_at)
   VALUES (
     '위에서_확인한_USER_ID',
     '환경변수의_ADMIN_EMAIL',
     '환경변수의_ADMIN_NAME',
     '환경변수의_ADMIN_PHONE',
     'admin',
     NOW()
   )
   ON CONFLICT (id) DO UPDATE
   SET role = 'admin';
   ```

### 방법 2: 스크립트 사용 (자동화)

추후 자동화 스크립트 제공 예정

## ✅ 확인 방법

관리자 계정이 올바르게 생성되었는지 확인:

```sql
-- Supabase SQL Editor에서 실행
SELECT
  p.id,
  p.email,
  p.name,
  p.role,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.role = 'admin';
```

## 🔒 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 강력한 비밀번호 사용 (12자 이상, 복잡도 높음)
- [ ] 프로덕션 환경에서는 다른 비밀번호 사용
- [ ] 환경변수가 외부에 노출되지 않도록 주의
- [ ] 정기적으로 비밀번호 변경

## 📝 추가 참고사항

- 로컬 개발 환경에서는 보안 요구사항이 덜 엄격하지만, 좋은 보안 습관을 유지하는 것이 중요합니다
- Git에 커밋하기 전 항상 민감한 정보가 포함되지 않았는지 확인하세요
- 팀과 작업할 때는 `.env.example` 파일만 공유하고, 실제 값은 개별적으로 설정하세요
