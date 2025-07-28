# 관리자 계정 설정 가이드

## Supabase 대시보드에서 관리자 계정 생성하기

### 1단계: Supabase 대시보드 접속
1. [Supabase 대시보드](https://app.supabase.com)에 접속
2. dduksangLAB 프로젝트 선택

### 2단계: 사용자 생성
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **Users** 탭 선택
3. **Add user** → **Create new user** 버튼 클릭
4. 다음 정보 입력:
   - Email: `admin@dduksang.com`
   - Password: `dduksang2025!@#`
   - Auto Confirm User: ✅ 체크

### 3단계: 프로필에 관리자 권한 부여
1. **SQL Editor** 메뉴로 이동
2. 다음 SQL 실행:

```sql
-- 1. 먼저 생성한 사용자의 ID 확인
SELECT id, email FROM auth.users WHERE email = 'admin@dduksang.com';

-- 2. 위에서 확인한 ID를 사용하여 프로필 업데이트 (예: 'abc123-def456-...')
INSERT INTO public.profiles (id, email, name, phone, role, created_at)
VALUES (
  '여기에-위에서-확인한-ID-입력',
  'admin@dduksang.com',
  '떡상연구소 관리자',
  '010-0000-0000',
  'admin',
  NOW()
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin';
```

### 4단계: 확인
1. 사이트에서 로그인 테스트
2. 관리자 권한이 필요한 기능 확인

## 문제 해결

### 로그인이 안 될 경우
1. **Email not confirmed** 에러:
   - Authentication → Users에서 해당 사용자 찾기
   - Actions → Confirm email 클릭

2. **Invalid login credentials** 에러:
   - 비밀번호가 올바른지 확인
   - Users 탭에서 Reset password 실행

3. **프로필이 생성되지 않은 경우**:
   - SQL Editor에서 프로필 확인:
   ```sql
   SELECT * FROM public.profiles WHERE email = 'admin@dduksang.com';
   ```

### 브라우저 확장 프로그램 관련 에러
콘솔에 나타난 에러들은 브라우저 확장 프로그램과 관련된 것입니다:
- `dragfreestorage`: 드래그 관련 확장
- `livestartpage`: 시작 페이지 확장
- `bootstrap-autofill-overlay`: 자동완성 확장

이들은 사이트 기능에 영향을 주지 않지만, 개발 중 혼란을 줄 수 있으니 시크릿 모드나 확장 프로그램을 비활성화한 상태에서 테스트하는 것을 권장합니다.