# dduksangLAB 관리자 계정 설정 가이드

## 📋 개요

이 가이드는 dduksangLAB 프로젝트에 관리자 계정을 생성하는 방법을 설명합니다.

**관리자 계정 정보:**
- **Email**: admin@dduksang.com
- **Password**: dduksang2025!@#
- **Role**: admin
- **Name**: 떡상연구소 관리자

## 🚀 설정 방법

### 방법 1: 자동 스크립트 사용 (권장)

터미널에서 다음 명령어를 실행합니다:

```bash
# 프로젝트 루트 디렉토리에서 실행
./scripts/setup-admin.sh
```

또는 Node.js 스크립트를 직접 실행:

```bash
node scripts/create-admin.js
```

### 방법 2: Supabase Dashboard에서 수동 생성

1. **Supabase Dashboard 접속**
   - https://app.supabase.com 에 로그인
   - 해당 프로젝트 선택

2. **사용자 생성**
   - `Authentication` > `Users` 탭으로 이동
   - `Create new user` 버튼 클릭
   - 다음 정보 입력:
     - Email: `admin@dduksang.com`
     - Password: `dduksang2025!@#`
     - Auto Confirm Email: ✅ 체크

3. **사용자 ID 확인**
   - `SQL Editor` 탭으로 이동
   - 다음 쿼리 실행:
   ```sql
   SELECT id, email FROM auth.users WHERE email = 'admin@dduksang.com';
   ```
   - 결과에서 `id` 값을 복사

4. **관리자 권한 부여**
   - 다음 쿼리 실행 (YOUR-USER-ID를 실제 ID로 교체):
   ```sql
   INSERT INTO public.profiles (id, email, name, phone, role, created_at, updated_at)
   VALUES (
     'YOUR-USER-ID',
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
   ```

### 방법 3: SQL 스크립트 사용

Supabase Dashboard의 SQL Editor에서 다음 파일의 내용을 실행:

1. `/supabase/create_admin_direct.sql` - 자동화된 함수 사용
2. `/supabase/migrations/004_create_admin_account.sql` - 수동 단계별 실행

## ✅ 관리자 계정 확인

계정이 올바르게 생성되었는지 확인하려면:

```sql
SELECT 
  p.id,
  p.email,
  p.name,
  p.role,
  p.created_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email = 'admin@dduksang.com';
```

## 🔐 보안 주의사항

1. **비밀번호 변경**: 프로덕션 환경에서는 즉시 비밀번호를 변경하세요
2. **접근 제한**: 관리자 페이지는 인증된 관리자만 접근 가능하도록 설정되어 있습니다
3. **환경 변수**: Service Role Key는 절대 클라이언트 코드에 노출되면 안 됩니다

## 🛠️ 문제 해결

### "사용자가 이미 존재합니다" 오류
- 이미 생성된 사용자입니다. 프로필만 업데이트하면 됩니다.

### "profiles 테이블을 찾을 수 없습니다" 오류
- 마이그레이션이 실행되지 않았습니다. 먼저 `/supabase/migrations/`의 SQL 파일들을 실행하세요.

### 로그인이 안 되는 경우
1. Email confirm이 되었는지 확인
2. 비밀번호가 정확한지 확인
3. profiles 테이블에 role이 'admin'으로 설정되었는지 확인

## 📞 지원

문제가 지속되면 다음을 확인하세요:
- Supabase Dashboard의 로그
- 브라우저 콘솔의 에러 메시지
- 네트워크 탭의 API 응답